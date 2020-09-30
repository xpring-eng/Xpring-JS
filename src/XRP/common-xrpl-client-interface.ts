import { Wallet, XrplNetwork } from 'xpring-common-js'
import TransactionStatus from './transaction-status'

import RawTransactionStatus from './raw-transaction-status'

/**
 * An interface describing CommonXrplClient.
 */
export default interface CommonXrplClientInterface {
  /** The XRPL Network of the node that this client is communicating with. */
  network: XrplNetwork

  determineFinalResult(
    rawTransactionStatus: RawTransactionStatus,
  ): TransactionStatus

  awaitFinalTransactionResult(
    transactionHash: string,
    sender: Wallet,
  ): Promise<RawTransactionStatus>
}
