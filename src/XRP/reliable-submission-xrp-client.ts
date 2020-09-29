import { Wallet, XrplNetwork } from 'xpring-common-js'
import { BigInteger } from 'big-integer'
import XrpClientDecorator from './xrp-client-decorator'
import TransactionStatus from './transaction-status'
import XrpTransaction from './model/xrp-transaction'

import SendXrpDetails from './model/send-xrp-details'
import TransactionResult from './model/transaction-result'
import CommonXrplClient from './common-xrpl-client'
import DefaultXrpClient from './default-xrp-client'

/**
 * An XrpClient which blocks on `send` calls until the transaction has reached a deterministic state.
 */
export default class ReliableSubmissionXrpClient implements XrpClientDecorator {
  private decoratedClient: XrpClientDecorator
  private commonXrplClient: CommonXrplClient

  public constructor(
    grpcUrl: string,
    readonly network: XrplNetwork,
    forceWeb = false,
  ) {
    this.decoratedClient = DefaultXrpClient.defaultXrpClientWithEndpoint(
      grpcUrl,
      network,
      forceWeb,
    )
    this.commonXrplClient = CommonXrplClient.commonXrplClientWithEndpoint(
      grpcUrl,
      network,
      forceWeb,
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
    await this.commonXrplClient.awaitFinalTransactionResult(
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
    const transactionHash = result.hash

    const rawTransactionStatus = await this.commonXrplClient.awaitFinalTransactionResult(
      transactionHash,
      wallet,
    )
    const finalStatus = this.commonXrplClient.determineFinalResult(
      rawTransactionStatus,
    )
    return new TransactionResult(
      transactionHash,
      finalStatus,
      rawTransactionStatus.isValidated,
    )
  }
}
