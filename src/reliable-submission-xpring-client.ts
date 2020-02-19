import { Wallet } from 'xpring-common-js'
import { BigInteger } from 'big-integer'
import { XpringClientDecorator } from './xpring-client-decorator'
import RawTransactionStatus from './raw-transaction-status'
import TransactionStatus from './transaction-status'

async function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

/**
 * A XpringClient which blocks on `send` calls until the transaction has reached a deterministic state.
 */
class ReliableSubmissionXpringClient implements XpringClientDecorator {
  public constructor(private readonly decoratedClient: XpringClientDecorator) {}

  public async getBalance(address: string): Promise<BigInteger> {
    return this.decoratedClient.getBalance(address)
  }

  public async getTransactionStatus(
    transactionHash: string,
  ): Promise<TransactionStatus> {
    return this.decoratedClient.getTransactionStatus(transactionHash)
  }

  public async send(
    amount: string | number | BigInteger,
    destination: string,
    sender: Wallet,
  ): Promise<string> {
    const ledgerCloseTimeMs = 4 * 1000

    // Submit a transaction hash and wait for a ledger to close.
    const transactionHash = await this.decoratedClient.send(
      amount,
      destination,
      sender,
    )
    await sleep(ledgerCloseTimeMs)

    // Get transaction status.
    let rawTransactionStatus = await this.getRawTransactionStatus(
      transactionHash,
    )
    const { lastLedgerSequence } = rawTransactionStatus
    if (lastLedgerSequence === 0) {
      return Promise.reject(
        new Error(
          'The transaction did not have a lastLedgerSequence field so transaction status cannot be reliably determined.',
        ),
      )
    }

    // Retrieve the latest ledger index.
    let latestLedgerSequence = await this.getLastValidatedLedgerSequence()

    // Poll until the transaction is validated, or until the lastLedgerSequence has been passed.
    /*
     * In general, performing an await as part of each operation is an indication that the program is not taking full advantage of the parallelization benefits of async/await.
     * Usually, the code should be refactored to create all the promises at once, then get access to the results using Promise.all(). Otherwise, each successive operation will not start until the previous one has completed.
     * But here specifically, it is reasonable to await in a loop, because we need to wait for the ledger, and there is no good way to refactor this.
     * https://eslint.org/docs/rules/no-await-in-loop
     */
    /* eslint-disable no-await-in-loop */
    while (
      latestLedgerSequence <= lastLedgerSequence &&
      !rawTransactionStatus.isValidated
    ) {
      await sleep(ledgerCloseTimeMs)

      // Update latestLedgerSequence and rawTransactionStatus
      latestLedgerSequence = await this.getLastValidatedLedgerSequence()
      rawTransactionStatus = await this.getRawTransactionStatus(transactionHash)
    }
    /* eslint-enable no-await-in-loop */

    return transactionHash
  }

  public async getLastValidatedLedgerSequence(): Promise<number> {
    return this.decoratedClient.getLastValidatedLedgerSequence()
  }

  public async getRawTransactionStatus(
    transactionHash: string,
  ): Promise<RawTransactionStatus> {
    return this.decoratedClient.getRawTransactionStatus(transactionHash)
  }

  public async accountExists(address: string): Promise<boolean> {
    return this.decoratedClient.accountExists(address)
  }
}

export default ReliableSubmissionXpringClient
