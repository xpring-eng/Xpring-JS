import { BigInteger } from 'big-integer'
import { XRPClientDecorator } from '../../../src/XRP/xrp-client-decorator'
import TransactionStatus from '../../../src/XRP/transaction-status'
import { Wallet, XRPLNetwork } from '../../../src/index'
import RawTransactionStatus from '../../../src/XRP/raw-transaction-status'
import XRPTransaction from '../../../src/XRP/model/xrp-transaction'
import Result from '../../Common/Helpers/result'

class FakeXRPClient implements XRPClientDecorator {
  public constructor(
    public getBalanceValue: Result<BigInteger>,
    public getPaymentStatusValue: Result<TransactionStatus>,
    public sendValue: Result<string>,
    public getLastValidatedLedgerSequenceValue: Result<number>,
    public getRawTransactionStatusValue: Result<RawTransactionStatus>,
    public accountExistsValue: Result<boolean>,
    public paymentHistoryValue: Result<Array<XRPTransaction>>,
    public readonly network: XRPLNetwork = XRPLNetwork.Test,
  ) {}

  async getBalance(_address: string): Promise<BigInteger> {
    return FakeXRPClient.returnOrThrow(this.getBalanceValue)
  }

  async getPaymentStatus(_transactionHash: string): Promise<TransactionStatus> {
    return FakeXRPClient.returnOrThrow(this.getPaymentStatusValue)
  }

  async send(
    _amount: BigInteger | number | string,
    _destination: string,
    _sender: Wallet,
  ): Promise<string> {
    return FakeXRPClient.returnOrThrow(this.sendValue)
  }

  async getLastValidatedLedgerSequence(): Promise<number> {
    return FakeXRPClient.returnOrThrow(this.getLastValidatedLedgerSequenceValue)
  }

  async getRawTransactionStatus(
    _transactionHash: string,
  ): Promise<RawTransactionStatus> {
    return FakeXRPClient.returnOrThrow(this.getRawTransactionStatusValue)
  }

  async accountExists(_address: string): Promise<boolean> {
    return FakeXRPClient.returnOrThrow(this.accountExistsValue)
  }

  async paymentHistory(_address: string): Promise<Array<XRPTransaction>> {
    return FakeXRPClient.returnOrThrow(this.paymentHistoryValue)
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  private static async returnOrThrow<T>(value: Result<T>): Promise<T> {
    if (value instanceof Error) {
      throw value
    }
    return value
  }
}

export default FakeXRPClient
