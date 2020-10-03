import { Wallet, XrplNetwork } from 'xpring-common-js'
import { BigInteger } from 'big-integer'
import TransactionStatus from './shared/transaction-status'
import XrpTransaction from './protobuf-wrappers/xrp-transaction'

import SendXrpDetails from './shared/send-xrp-details'
import TransactionResult from './shared/transaction-result'

/** A decorator interface for XrpClients. */
export default interface XrpClientDecorator {
  /**
   * The XRPL network this XrpClient is connecting to.
   */
  network: XrplNetwork

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
   * @param amount A `BigInteger`, number or numeric string representing the number of drops to send.
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
   * Send the given amount of XRP from the source wallet to the destination PayID, allowing
   * for additional details to be specified for use with supplementary features of the XRP
   * ledger.
   *
   * @param sendXrpDetails - a wrapper object containing details for constructing a transaction.
   * @returns A promise which resolves to a string representing the hash of the submitted transaction.
   */
  sendWithDetails(sendXrpDetails: SendXrpDetails): Promise<string>

  /**
   * Check if an address exists on the XRP Ledger.
   *
   * @param address The address to check the existence of.
   * @returns A boolean if the account is on the blockchain.
   */
  accountExists(address: string): Promise<boolean>

  /**
   * Return the history of payments for the given account.
   *
   * Note: This method only works for payment type transactions, see: https://xrpl.org/payment.html
   * Note: This method only returns the history that is contained on the remote node, which may not contain a full history of the network.
   *
   * @param address The address (account) for which to retrieve payment history.
   * @throws An error if there was a problem communicating with the XRP Ledger.
   * @returns An array of transactions associated with the account.
   */
  paymentHistory(address: string): Promise<Array<XrpTransaction>>

  /**
   * Retrieve the payment transaction corresponding to the given transaction hash.
   *
   * Note: This method can return transactions that are not included in a fully validated ledger.
   *       See the `validated` field to make this distinction.
   *
   * @param transactionHash The hash of the transaction to retrieve.
   * @throws An error if the transaction hash was invalid.
   * @returns An {@link XrpTransaction} object representing an XRP Ledger transaction.
   */
  getPayment(transactionHash: string): Promise<XrpTransaction>

  /**
   * Enable Deposit Authorization for this XRPL account.
   * @see https://xrpl.org/depositauth.html
   *
   * @param wallet The wallet associated with the XRPL account enabling Deposit Authorization and that will sign the request.
   * @returns A promise which resolves to a TransactionResult object that contains the hash of the submitted AccountSet transaction
   *          and the final status of the transaction.
   */
  enableDepositAuth(wallet: Wallet): Promise<TransactionResult>
}
