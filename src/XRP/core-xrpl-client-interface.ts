import { Wallet, XrplNetwork } from 'xpring-common-js'
import TransactionResult from './shared/transaction-result'
import RawTransactionStatus from './shared/raw-transaction-status'

/**
 * An interface that CoreXrplClients adhere to.
 */
export default interface CoreXrplClientInterface {
  /** The XRPL Network of the node that this client is communicating with. */
  network: XrplNetwork

  /**
   * The core logic of reliable submission.  Polls the ledger until the result of the transaction
   * can be considered final, meaning it has either been included in a validated ledger, or the
   * transaction's lastLedgerSequence has been surpassed by the latest ledger sequence (meaning it
   * will never be included in a validated ledger.)
   *
   * @param transactionHash The hash of the transaction being awaited.
   * @param sender The address used to obtain the latest ledger sequence.
   */
  waitForFinalTransactionOutcome(
    transactionHash: string,
    sender: Wallet,
  ): Promise<{
    rawTransactionStatus: RawTransactionStatus
    lastLedgerPassed: boolean
  }>

  /**
   * Waits for a transaction to complete and returns a TransactionResult.
   *
   * @param transactionHash The transaction to wait for.
   * @param wallet The wallet sending the transaction.
   *
   * @returns A Promise resolving to a TransactionResult containing the results of the transaction associated with
   * the given transaction hash.
   */
  getFinalTransactionResultAsync(
    transactionHash: string,
    wallet: Wallet,
  ): Promise<TransactionResult>
}
