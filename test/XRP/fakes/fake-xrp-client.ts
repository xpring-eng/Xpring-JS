import { BigInteger } from 'big-integer'
import XrpClientDecorator from '../../../src/XRP/xrp-client-decorator'
import TransactionStatus from '../../../src/XRP/shared/transaction-status'
import { Wallet } from '../../../src/index'
import XrpTransaction from '../../../src/XRP/protobuf-wrappers/xrp-transaction'
import Result from '../../Common/Helpers/result'
import { XrplNetwork } from 'xpring-common-js'
import SendXrpDetails from '../../../src/XRP/shared/send-xrp-details'
import TransactionResult from '../../../src/XRP/shared/transaction-result'

class FakeXrpClient implements XrpClientDecorator {
  public constructor(
    public getBalanceValue: Result<BigInteger>,
    public getPaymentStatusValue: Result<TransactionStatus>,
    public transactionResult: Result<TransactionResult>,
    public accountExistsValue: Result<boolean>,
    public paymentHistoryValue: Result<Array<XrpTransaction>>,
    public getPaymentValue: Result<XrpTransaction>,
    public enableDepositAuthValue: Result<TransactionResult>,
    public authorizeSendingAccountValue: Result<TransactionResult>,
    public unauthorizeSendingAccountValue: Result<TransactionResult>,
    // TODO: remove `transactionHash` from constructor once `XpringClient` is deprecated and tests are removed.
    public transactionHash: Result<string> = 'deadbeef',
    public readonly network: XrplNetwork = XrplNetwork.Test,
  ) {}

  async getBalance(_address: string): Promise<BigInteger> {
    return FakeXrpClient.returnOrThrow(this.getBalanceValue)
  }

  async getPaymentStatus(_transactionHash: string): Promise<TransactionStatus> {
    return FakeXrpClient.returnOrThrow(this.getPaymentStatusValue)
  }

  // TODO: remove `send` and `sendWithDetails` once `XpringClient` has been deprecated and tests removed.
  async send(
    _amount: BigInteger | number | string,
    _destination: string,
    _sender: Wallet,
  ): Promise<string> {
    return FakeXrpClient.returnOrThrow(this.transactionHash)
  }

  async sendWithDetails(_sendXrpDetails: SendXrpDetails): Promise<string> {
    return FakeXrpClient.returnOrThrow(this.transactionHash)
  }

  async sendXrp(
    _amount: BigInteger | number | string,
    _destination: string,
    _sender: Wallet,
  ): Promise<TransactionResult> {
    return FakeXrpClient.returnOrThrow(this.transactionResult)
  }

  async sendXrpWithDetails(
    _sendXrpDetails: SendXrpDetails,
  ): Promise<TransactionResult> {
    return FakeXrpClient.returnOrThrow(this.transactionResult)
  }

  async accountExists(_address: string): Promise<boolean> {
    return FakeXrpClient.returnOrThrow(this.accountExistsValue)
  }

  async paymentHistory(_address: string): Promise<Array<XrpTransaction>> {
    return FakeXrpClient.returnOrThrow(this.paymentHistoryValue)
  }

  async getPayment(_transactionHash: string): Promise<XrpTransaction> {
    return FakeXrpClient.returnOrThrow(this.getPaymentValue)
  }

  async enableDepositAuth(_wallet: Wallet): Promise<TransactionResult> {
    return FakeXrpClient.returnOrThrow(this.enableDepositAuthValue)
  }

  async authorizeSendingAccount(
    _xAddressToAuthorize: string,
    _wallet: Wallet,
  ): Promise<TransactionResult> {
    return FakeXrpClient.returnOrThrow(this.authorizeSendingAccountValue)
  }

  async unauthorizeSendingAccount(
    _xAddressToUnauthorize: string,
    _wallet: Wallet,
  ): Promise<TransactionResult> {
    return FakeXrpClient.returnOrThrow(this.unauthorizeSendingAccountValue)
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  private static async returnOrThrow<T>(value: Result<T>): Promise<T> {
    if (value instanceof Error) {
      throw value
    }
    return value
  }
}

export default FakeXrpClient
