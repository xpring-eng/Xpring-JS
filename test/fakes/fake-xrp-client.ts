import { BigInteger } from 'big-integer'
import { XRPClientDecorator } from '../../src/xrp-client-decorator'
import TransactionStatus from '../../src/transaction-status'
import { Wallet } from '../../src/index'
import RawTransactionStatus from '../../src/raw-transaction-status'
import XRPTransaction from '../../src/XRP/xrp-transaction'

class FakeXRPClient implements XRPClientDecorator {
  public constructor(
    public getBalanceValue: BigInteger,
    public getPaymentStatusValue: TransactionStatus,
    public sendValue: string,
    public getLastValidatedLedgerSequenceValue: number,
    public getRawTransactionStatusValue: RawTransactionStatus,
    public accountExistsValue: boolean,
    public paymentHistoryValue: Array<XRPTransaction>,
  ) {}

  public async getBalance(_address: string): Promise<BigInteger> {
    return Promise.resolve(this.getBalanceValue)
  }

  public async getPaymentStatus(
    _transactionHash: string,
  ): Promise<TransactionStatus> {
    return Promise.resolve(this.getPaymentStatusValue)
  }

  public async send(
    _amount: BigInteger | number | string,
    _destination: string,
    _sender: Wallet,
  ): Promise<string> {
    return Promise.resolve(this.sendValue)
  }

  public async getLastValidatedLedgerSequence(): Promise<number> {
    return Promise.resolve(this.getLastValidatedLedgerSequenceValue)
  }

  public async getRawTransactionStatus(
    _transactionHash: string,
  ): Promise<RawTransactionStatus> {
    return Promise.resolve(this.getRawTransactionStatusValue)
  }

  public async accountExists(_address: string): Promise<boolean> {
    return Promise.resolve(this.accountExistsValue)
  }

  public async paymentHistory(
    _address: string,
  ): Promise<Array<XRPTransaction>> {
    return Promise.resolve(this.paymentHistoryValue)
  }
}

export default FakeXRPClient
