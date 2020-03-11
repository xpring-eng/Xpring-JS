import { Wallet } from 'xpring-common-js'
import { BigInteger } from 'big-integer'
import { XRPClientDecorator } from './xrp-client-decorator'
import LegacyDefaultXRPClient from './legacy/legacy-default-xrp-client'
import TransactionStatus from './transaction-status'
import ReliableSubmissionXRPClient from './reliable-submission-xrp-client'
import DefaultXRPClient from './default-xrp-client'
/**
 * XRPClient is a client which interacts with the Xpring platform.
 */
class XRPClient {
  private readonly decoratedClient: XRPClientDecorator

  /**
   * Create a new XRPClient.
   *
   * The XRPClient will use gRPC to communicate with the given endpoint.
   *
   * @param grpcURL The URL of the gRPC instance to connect to.
   * @param useNewProtocolBuffers If `true`, then the new protocol buffer implementation from rippled will be used. Defaults to false.
   * @param forceWeb If `true`, then we will use the gRPC-Web client even when on Node. Defaults to false. This is mainly for testing and in the future will be removed when we have browser testing.
   */
  public constructor(
    grpcURL: string,
    useNewProtocolBuffers = false,
    forceWeb = false,
  ) {
    const defaultXRPClient = useNewProtocolBuffers
      ? DefaultXRPClient.defaultXRPClientWithEndpoint(grpcURL, forceWeb)
      : LegacyDefaultXRPClient.defaultXRPClientWithEndpoint(grpcURL, forceWeb)

    this.decoratedClient = new ReliableSubmissionXRPClient(defaultXRPClient)
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
   * @deprecated Please use `getPaymentStatus` instead.
   *
   * Note: This method will only work for Payment type transactions which do not have the tf_partial_payment attribute set.
   * @see https://xrpl.org/payment.html#payment-flags
   *
   * @param transactionHash The hash of the transaction.
   * @returns The status of the given transaction.
   */
  public async getTransactionStatus(
    transactionHash: string,
  ): Promise<TransactionStatus> {
    return this.getPaymentStatus(transactionHash)
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
   * @param drops A `BigInteger`, number or numeric string representing the number of drops to send.
   * @param destination A destination address to send the drops to.
   * @param sender The wallet that XRP will be sent from and which will sign the request.
   * @returns A promise which resolves to a string representing the hash of the submitted transaction.
   */
  public async send(
    amount: BigInteger | number | string,
    destination: string,
    sender: Wallet,
  ): Promise<string> {
    return this.decoratedClient.send(amount, destination, sender)
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
}

export default XRPClient
