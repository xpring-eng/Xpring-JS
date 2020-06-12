import { Wallet } from 'xpring-common-js'
import { BigInteger } from 'big-integer'
import { XrpClientDecorator } from './xrp-client-decorator'
import TransactionStatus from './transaction-status'
import ReliableSubmissionXRPClient from './reliable-submission-xrp-client'
import DefaultXRPClient from './default-xrp-client'
import XRPClientInterface from './xrp-client-interface'
import { XRPTransaction } from './model/xrp-transaction'
import { XRPLNetwork } from '../Common/xrpl-network'
import SendXrpDetails from './model/send-xrp-details'

/**
 * XRPClient is a client which interacts with the Xpring platform.
 *
 * @deprecated Please use XrpClient instead.
 */
export class XRPClient implements XRPClientInterface {
  /** The XRPL Network of the node that this client is communicating with. */
  public readonly network: XRPLNetwork

  private readonly decoratedClient: XRPClientDecorator

  /**
   * Create a new XRPClient.
   *
   * The XRPClient will use gRPC to communicate with the given endpoint.
   *
   * @param grpcURL The URL of the gRPC instance to connect to.
   * @param network The network this XRPClient is connecting to.
   * @param forceWeb If `true`, then we will use the gRPC-Web client even when on Node. Defaults to false. This is mainly for testing and in the future will be removed when we have browser testing.
   */
  public constructor(grpcURL: string, network: XRPLNetwork, forceWeb = false) {
    this.network = network

    const defaultXRPClient = DefaultXRPClient.defaultXRPClientWithEndpoint(
      grpcURL,
      network,
      forceWeb,
    )
    this.decoratedClient = new ReliableSubmissionXRPClient(
      defaultXRPClient,
      network,
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
    return this.sendWithDetails({
      amount,
      destination,
      sender,
    })
  }

  /**
   * Send the given amount of XRP from the source wallet to the destination Pay ID, allowing
   * for additional details to be specified for use with supplementary features of the XRP
   * ledger.
   *
   * @param sendMoneyDetails - a wrapper object containing details for constructing a transaction.
   * @returns A promise which resolves to a string representing the hash of the submitted transaction.
   */
  public async sendWithDetails(
    sendMoneyDetails: SendXrpDetails,
  ): Promise<string> {
    return this.decoratedClient.sendWithDetails(sendMoneyDetails)
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
  public async paymentHistory(address: string): Promise<Array<XRPTransaction>> {
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
   * @returns An {@link XRPTransaction} object representing an XRP Ledger transaction.
   */
  public async getPayment(
    transactionHash: string,
  ): Promise<XRPTransaction | undefined> {
    return this.decoratedClient.getPayment(transactionHash)
  }
}

/**
 * XRPClient is a client which interacts with the Xpring platform.
 */
class XrpClient implements XrpClientInterface {
  /** The XRPL Network of the node that this client is communicating with. */
  public readonly network: XRPLNetwork

  private readonly decoratedClient: XrpClientDecorator

  /**
   * Create a new XRPClient.
   *
   * The XRPClient will use gRPC to communicate with the given endpoint.
   *
   * @param grpcURL The URL of the gRPC instance to connect to.
   * @param network The network this XRPClient is connecting to.
   * @param forceWeb If `true`, then we will use the gRPC-Web client even when on Node. Defaults to false. This is mainly for testing and in the future will be removed when we have browser testing.
   */
  public constructor(grpcURL: string, network: XRPLNetwork, forceWeb = false) {
    this.network = network

    const defaultXRPClient = DefaultXRPClient.defaultXRPClientWithEndpoint(
      grpcURL,
      network,
      forceWeb,
    )
    this.decoratedClient = new ReliableSubmissionXRPClient(
      defaultXRPClient,
      network,
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
    return this.sendWithDetails({
      amount,
      destination,
      sender,
    })
  }

  /**
   * Send the given amount of XRP from the source wallet to the destination Pay ID, allowing
   * for additional details to be specified for use with supplementary features of the XRP
   * ledger.
   *
   * @param sendMoneyDetails - a wrapper object containing details for constructing a transaction.
   * @returns A promise which resolves to a string representing the hash of the submitted transaction.
   */
  public async sendWithDetails(
    sendMoneyDetails: SendXrpDetails,
  ): Promise<string> {
    return this.decoratedClient.sendWithDetails(sendMoneyDetails)
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
   * @returns An {@link XRPTransaction} object representing an XRP Ledger transaction.
   */
  public async getPayment(
    transactionHash: string,
  ): Promise<XrpTransaction | undefined> {
    return this.decoratedClient.getPayment(transactionHash)
  }
}
