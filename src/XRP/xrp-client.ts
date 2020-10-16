import { Wallet, XrplNetwork } from 'xpring-common-js'
import { BigInteger } from 'big-integer'
import XrpClientDecorator from './xrp-client-decorator'
import TransactionStatus from './shared/transaction-status'
import ReliableSubmissionXrpClient from './reliable-submission-xrp-client'
import XrpClientInterface from './xrp-client-interface'
import XrpTransaction from './protobuf-wrappers/xrp-transaction'

import SendXrpDetails from './shared/send-xrp-details'
import TransactionResult from './shared/transaction-result'

/**
 * XrpClient is a client which interacts with the XRP Ledger.
 */
export default class XrpClient implements XrpClientInterface {
  /** The XRPL Network of the node that this client is communicating with. */
  public readonly network: XrplNetwork

  private readonly decoratedClient: XrpClientDecorator

  /**
   * Create a new XrpClient.
   *
   * The XrpClient will use gRPC to communicate with the given endpoint.
   *
   * @param grpcUrl The URL of the gRPC instance to connect to.
   * @param network The network this XrpClient is connecting to.
   * @param forceWeb If `true`, then we will use the gRPC-Web client even when on Node. Defaults to false. This is mainly for testing and in the future will be removed when we have browser testing.
   */
  public constructor(grpcUrl: string, network: XrplNetwork, forceWeb = false) {
    this.network = network

    this.decoratedClient = ReliableSubmissionXrpClient.reliableSubmissionXrpClientWithEndpoint(
      grpcUrl,
      network,
      forceWeb,
    )
  }

  /**
   * Retrieve the balance for the given address.
   *
   * @param address The X-Address to retrieve a balance for.
   * @returns A `BigInteger` representing the number of drops of XRP in the account.
   */
  public async getBalance(address: string): Promise<BigInteger> {
    return this.decoratedClient.getBalance(address)
  }

  /**
   * Retrieve the transaction status for a Payment given transaction hash.
   *
   * Note: This method will only work for Payment type transactions which do not have the tf_partial_payment attribute set.
   * @see https://xrpl.org/payment.html#payment-flags
   *
   * @param transactionHash The hash of the transaction.
   * @returns The status of the given transaction.
   */
  public async getPaymentStatus(
    transactionHash: string,
  ): Promise<TransactionStatus> {
    return this.decoratedClient.getPaymentStatus(transactionHash)
  }

  /**
   * @deprecated Use method `sendXrp` instead.
   *
   * Send the given amount of XRP from the source wallet to the destination address.
   *
   * @param amount A `BigInteger`, number or numeric string representing the number of drops to send.
   * @param destination A destination address to send the drops to.
   * @param sender The wallet that XRP will be sent from and which will sign the request.
   * @returns A promise which resolves to a string representing the hash of the submitted transaction.
   */
  public async send(
    amount: BigInteger | number | string,
    destination: string,
    sender: Wallet,
  ): Promise<string> {
    const transactionResult = await this.sendXrpWithDetails({
      amount,
      destination,
      sender,
    })
    return transactionResult.hash
  }

  /**
   * @deprecated Use method `sendXrpWithDetails` instead.
   *
   * Send the given amount of XRP from the source wallet to the destination PayID, allowing
   * for additional details to be specified for use with supplementary features of the XRP
   * ledger.
   *
   * @param sendXrpDetails - a wrapper object containing details for constructing a transaction.
   * @returns A promise which resolves to a string representing the hash of the submitted transaction.
   */
  public async sendWithDetails(
    sendXrpDetails: SendXrpDetails,
  ): Promise<string> {
    const transactionResult = await this.decoratedClient.sendXrpWithDetails(
      sendXrpDetails,
    )
    return transactionResult.hash
  }

  /**
   * Send the given amount of XRP from the source wallet to the destination address.
   *
   * @param amount A `BigInteger`, number or numeric string representing the number of drops to send.
   * @param destination A destination address to send the drops to.
   * @param sender The wallet that XRP will be sent from and which will sign the request.
   * @returns A promise which resolves to a TransactionResult representing the final outcome of the submitted transaction.
   */
  public async sendXrp(
    amount: BigInteger | number | string,
    destination: string,
    sender: Wallet,
  ): Promise<TransactionResult> {
    return this.sendXrpWithDetails({
      amount,
      destination,
      sender,
    })
  }

  /**
   * Send the given amount of XRP from the source wallet to the destination PayID, allowing
   * for additional details to be specified for use with supplementary features of the XRP
   * ledger.
   *
   * @param sendXrpDetails - a wrapper object containing details for constructing a transaction.
   * @returns A promise which resolves to a TransactionResult representing the final outcome of the submitted transaction.
   */
  public async sendXrpWithDetails(
    sendXrpDetails: SendXrpDetails,
  ): Promise<TransactionResult> {
    return this.decoratedClient.sendXrpWithDetails(sendXrpDetails)
  }

  /**
   * Check if an address exists on the XRP Ledger.
   *
   * @param address The address to check the existence of.
   * @returns A boolean if the account is on the ledger.
   */
  public async accountExists(address: string): Promise<boolean> {
    return this.decoratedClient.accountExists(address)
  }

  /**
   * Return the history of payments for the given account.
   *
   * Note: This method only works for payment type transactions, see: https://xrpl.org/payment.html
   * Note: This method only returns the history that is contained on the remote node, which may not contain a full history of the network.
   *
   * @param address: The address (account) for which to retrieve payment history.
   * @throws: An error if there was a problem communicating with the XRP Ledger.
   * @return: An array of transactions associated with the account.
   */
  public async paymentHistory(address: string): Promise<Array<XrpTransaction>> {
    return this.decoratedClient.paymentHistory(address)
  }

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
  public async getPayment(transactionHash: string): Promise<XrpTransaction> {
    return this.decoratedClient.getPayment(transactionHash)
  }

  /**
   * Enable Deposit Authorization for this XRPL account.
   * @see https://xrpl.org/depositauth.html
   *
   * @param wallet The wallet associated with the XRPL account enabling Deposit Authorization and that will sign the request.
   * @returns A promise which resolves to a TransactionResult object that contains the hash of the submitted AccountSet transaction,
   *          the final status of the transaction, and whether the transaction was included in a validated ledger.
   */
  enableDepositAuth(wallet: Wallet): Promise<TransactionResult> {
    return this.decoratedClient.enableDepositAuth(wallet)
  }

  /**
   * Authorizes an XRPL account to send to this XRPL account.
   *
   * @see https://xrpl.org/depositpreauth.html
   *
   * @param xAddressToAuthorize The X-Address of the account to authorize as a sender.
   * @param wallet The wallet associated with the XRPL account authorizing a sender, and that will sign the request.
   */
  authorizeSendingAccount(
    xAddressToAuthorize: string,
    wallet: Wallet,
  ): Promise<TransactionResult> {
    return this.decoratedClient.authorizeSendingAccount(
      xAddressToAuthorize,
      wallet,
    )
  }

  /**
   * Unauthorizes an XRPL account to send to this XRPL account.
   *
   * @see https://xrpl.org/depositpreauth.html
   *
   * @param xAddressToUnauthorize The X-Address of the account to unauthorize as a sender.
   * @param wallet The wallet associated with the XRPL account unauthorizing a sender, and that will sign the request.
   */
  unauthorizeSendingAccount(
    xAddressToUnauthorize: string,
    wallet: Wallet,
  ): Promise<TransactionResult> {
    return this.decoratedClient.unauthorizeSendingAccount(
      xAddressToUnauthorize,
      wallet,
    )
  }
}
