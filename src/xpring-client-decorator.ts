import { Wallet } from 'xpring-common-js'
import { BigInteger } from 'big-integer'
import TransactionStatus from './transaction-status'
import RawTransactionStatus from './raw-transaction-status'
import XRPTransaction from './xrp-transaction'

/** A decorator interface for XpringClients. */
export interface XpringClientDecorator {
  /**
   * Retrieve the balance for the given address.
   *
   * @param address The X-Address to retrieve a balance for.
   * @returns A `BigInteger` representing the number of drops of XRP in the account.
   */

  getBalance(address: string): Promise<BigInteger>

  /**
   * Retrieve the transaction status for a given transaction hash.
   *
   * @param transactionHash The hash of the transaction.
   * @returns The status of the given transaction.
   */
  getTransactionStatus(transactionHash: string): Promise<TransactionStatus>

  /**
   * Send the given amount of XRP from the source wallet to the destination address.
   *
   * @param drops A `BigInteger`, number or numeric string representing the number of drops to send.
   * @param destination A destination address to send the drops to.
   * @param sender The wallet that XRP will be sent from and which will sign the request.
   * @returns A promise which resolves to a string representing the hash of the submitted transaction.
   */
  send(
    amount: BigInteger | number | string,
    destination: string,
    sender: Wallet,
  ): Promise<string>

  /**
   * Retrieve the latest validated ledger sequence on the XRP Ledger.
   *
   * @returns The index of the latest validated ledger.
   */
  getLastValidatedLedgerSequence(): Promise<number>

  /**
   * Retrieve the raw transaction status for the given transaction hash.
   *
   * @param transactionHash: The hash of the transaction.
   * @Return The status of the given transaction.
   */
  getRawTransactionStatus(
    transactionHash: string,
  ): Promise<RawTransactionStatus>

  /**
   * Check if an address exists on the XRP Ledger.
   *
   * @param address The address to check the existence of.
   * @returns A boolean if the account is on the blockchain.
   */
  accountExists(address: string): Promise<boolean>

  /**
   * Retrieve a list of transactions that occurred in the account.
   *
   * @note This method will only return transactions which the remote node has in it's history.
   *
   * @param address The address to return transactions for.
   * @returns An array of transactions.
   */
  getTransactionHistory(address: string): Promise<Array<XRPTransaction>>
}
