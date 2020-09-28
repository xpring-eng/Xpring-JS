import { Wallet, XrplNetwork } from 'xpring-common-js'
import { BigInteger } from 'big-integer'
import XrpClientDecorator from './xrp-client-decorator'
import RawTransactionStatus from './raw-transaction-status'
import TransactionStatus from './transaction-status'
import XrpTransaction from './model/xrp-transaction'
import SendXrpDetails from './model/send-xrp-details'
import TransactionResult from './model/transaction-result'
import CommonXrplClient from './common-xrpl-client'

/**
 * An XrpClient which blocks on `send` calls until the transaction has reached a deterministic state.
 */
export default class ReliableSubmissionXrpClient implements XrpClientDecorator {
  public constructor(
    private readonly decoratedClient: XrpClientDecorator,
    private readonly commonXrplClient: CommonXrplClient,
    readonly network: XrplNetwork,
  ) {}

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

  public async getLatestValidatedLedgerSequence(
    address: string,
  ): Promise<number> {
    return this.decoratedClient.getLatestValidatedLedgerSequence(address)
  }

  public async getRawTransactionStatus(
    transactionHash: string,
  ): Promise<RawTransactionStatus> {
    return this.decoratedClient.getRawTransactionStatus(transactionHash)
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
