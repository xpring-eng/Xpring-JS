import { Wallet, XrplNetwork } from 'xpring-common-js'
import { BigInteger } from 'big-integer'
import XrpClientDecorator from './xrp-client-decorator'
import TransactionStatus from './transaction-status'
import XrpTransaction from './model/xrp-transaction'

import SendXrpDetails from './model/send-xrp-details'
import TransactionResult from './model/transaction-result'
import CoreXrplClient from './core-xrpl-client'
import DefaultXrpClient from './default-xrp-client'
import CoreXrplClientInterface from './core-xrpl-client-interface'

/**
 * An XrpClient which blocks on `send` calls until the transaction has reached a deterministic state.
 */
export default class ReliableSubmissionXrpClient implements XrpClientDecorator {
  /**
   * A constructor for direct client injection, primarily for testing.
   *
   * @param decoratedClient The XrpClient being decorated by this ReliableSubmissionClient.
   * @param coreXrplClient The instance of CoreXrplClient available to this ReliableSubmissionClient.
   * @param network The network this XrpClient is connecting to.
   */
  public constructor(
    readonly decoratedClient: XrpClientDecorator,
    readonly coreXrplClient: CoreXrplClientInterface,
    readonly network: XrplNetwork,
  ) {}

  /**
   * Create a new ReliableSubmissionXrpClient.
   *
   * The ReliableSubmissionXrpClient will use gRPC to communicate with the given endpoint.
   *
   * @param grpcUrl The URL of the gRPC instance to connect to.
   * @param network The network this XrpClient is connecting to.
   * @param forceWeb If `true`, then we will use the gRPC-Web client even when on Node. Defaults to false. This is mainly for testing and in the future will be removed when we have browser testing.
   */
  public static reliableSubmissionXrpClientWithEndpoint(
    grpcUrl: string,
    network: XrplNetwork,
    forceWeb = false,
  ): ReliableSubmissionXrpClient {
    const decoratedClient = DefaultXrpClient.defaultXrpClientWithEndpoint(
      grpcUrl,
      network,
      forceWeb,
    )
    const coreXrplClient = CoreXrplClient.coreXrplClientWithEndpoint(
      grpcUrl,
      network,
      forceWeb,
    )
    return new ReliableSubmissionXrpClient(
      decoratedClient,
      coreXrplClient,
      network,
    )
  }

  public async getBalance(address: string): Promise<BigInteger> {
    return this.decoratedClient.getBalance(address)
  }

  public async getPaymentStatus(
    transactionHash: string,
  ): Promise<TransactionStatus> {
    return this.decoratedClient.getPaymentStatus(transactionHash)
  }

  public async send(
    amount: string | number | BigInteger,
    destination: string,
    sender: Wallet,
  ): Promise<string> {
    return this.sendWithDetails({
      amount,
      destination,
      sender,
    })
  }

  public async sendWithDetails(
    sendXrpDetails: SendXrpDetails,
  ): Promise<string> {
    const { sender } = sendXrpDetails

    const transactionHash = await this.decoratedClient.sendWithDetails(
      sendXrpDetails,
    )
    await this.coreXrplClient.awaitFinalTransactionStatus(
      transactionHash,
      sender,
    )

    return transactionHash
  }

  public async accountExists(address: string): Promise<boolean> {
    return this.decoratedClient.accountExists(address)
  }

  public async paymentHistory(address: string): Promise<Array<XrpTransaction>> {
    return this.decoratedClient.paymentHistory(address)
  }

  public async getPayment(
    transactionHash: string,
  ): Promise<XrpTransaction | undefined> {
    return this.decoratedClient.getPayment(transactionHash)
  }

  public async enableDepositAuth(wallet: Wallet): Promise<TransactionResult> {
    const result = await this.decoratedClient.enableDepositAuth(wallet)
    return await this.coreXrplClient.awaitFinalTransactionResult(
      result.hash,
      wallet,
    )
  }
}
