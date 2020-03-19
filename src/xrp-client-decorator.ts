import { Wallet } from 'xpring-common-js'
import { BigInteger } from 'big-integer'
import TransactionStatus from './transaction-status'
import RawTransactionStatus from './raw-transaction-status'
import XRPTransaction from './XRP/xrp-transaction'

/** A decorator interface for XRPClients. */
export interface XRPClientDecorator {
  /**
   * Retrieve the balance for the given address.
   *
   * @param address The X-Address to retrieve a balance for.
   * @returns A `BigInteger` representing the number of drops of XRP in the account.
   */

  getBalance(address: string): Promise<BigInteger>

  /**
   * Retrieve the transaction status for a Payment given transaction hash.
   *
   * Note: This method will only work for Payment type transactions which do not have the tf_partial_payment attribute set.
   * @see https://xrpl.org/payment.html#payment-flags
   *
   * @param transactionHash The hash of the transaction.
   * @returns The status of the given transaction.
   */
  getPaymentStatus(transactionHash: string): Promise<TransactionStatus>

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
   * Return the history of payments for the given account.
   * Note: This method only works for payment type transactions, see: https://xrpl.org/payment.html
   * Note: This method only returns the history that is contained on the remote node, which may not contain a full history of the network.
   *
   * @param address: The address (account) for which to retrive payment history.
   * @throws: An error if there was a problem communicating with the XRP Ledger.
   * @return: An array of transactions associated with the account.
   */
  paymentHistory(address: string): Promise<Array<XRPTransaction>>
}
