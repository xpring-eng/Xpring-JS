import { Wallet } from 'xpring-common-js'
import { XpringClientDecorator } from './xpring-client-decorator'
import TransactionStatus from './transaction-status'
import { TransactionStatus as RawTransactionStatus } from './generated/legacy/transaction_status_pb'

/* global BigInt */

// TODO(keefertaylor): Re-enable this rule when this class is fully implemented.
/* eslint-disable @typescript-eslint/require-await */

/**
 * Error messages from XpringClient.
 */
export class XpringClientErrorMessages {
  public static readonly unimplemented = 'Unimplemented.'
}

/**
 * DefaultXpringClient is a client which interacts with the Xpring platform.
 */
class DefaultXpringClient implements XpringClientDecorator {
  /**
   * Create a new DefaultXpringClient.
   */
  public constructor() {} // eslint-disable-line @typescript-eslint/no-empty-function

  /**
   * Retrieve the balance for the given address.
   *
   * @param address The X-Address to retrieve a balance for.
   * @returns A `BigInt` representing the number of drops of XRP in the account.
   */
  public async getBalance(address: string): Promise<BigInt> {
    throw new Error(XpringClientErrorMessages.unimplemented)
  }

  /**
   * Retrieve the transaction status for a given transaction hash.
   *
   * @param transactionHash The hash of the transaction.
   * @returns The status of the given transaction.
   */
  public async getTransactionStatus(
    transactionHash: string,
  ): Promise<TransactionStatus> {
    throw new Error(XpringClientErrorMessages.unimplemented)
  }

  /**
   * Send the given amount of XRP from the source wallet to the destination address.
   *
   * @param drops A `BigInt`, number or numeric string representing the number of drops to send.
   * @param destination A destination address to send the drops to.
   * @param sender The wallet that XRP will be sent from and which will sign the request.
   * @returns A promise which resolves to a string representing the hash of the submitted transaction.
   */
  public async send(
    amount: BigInt | number | string,
    destination: string,
    sender: Wallet,
  ): Promise<string> {
    throw new Error(XpringClientErrorMessages.unimplemented)
  }

  public async getLastValidatedLedgerSequence(): Promise<number> {
    throw new Error(XpringClientErrorMessages.unimplemented)
  }

  // TODO(keefertaylor): Create bridge on raw transaction status.
  public async getRawTransactionStatus(
    transactionHash: string,
  ): Promise<RawTransactionStatus> {
    throw new Error(XpringClientErrorMessages.unimplemented)
  }
}

export default DefaultXpringClient
