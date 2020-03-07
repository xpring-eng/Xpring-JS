import { BigInteger } from 'big-integer'
import Transaction from '../../src/transaction'
import { XRPClientDecorator } from '../../src/xrp-client-decorator'
import TransactionStatus from '../../src/transaction-status'
import { Wallet } from '../../src/index'
import RawTransactionStatus from '../../src/raw-transaction-status'

class FakeXRPClient implements XRPClientDecorator {
  public constructor(
    public getBalanceValue: BigInteger,
    public getTransactionStatusValue: TransactionStatus,
    public sendValue: string,
    public getLastValidatedLedgerSequenceValue: number,
    public getRawTransactionStatusValue: RawTransactionStatus,
    public accountExistsValue: boolean,
    public transactionHistoryValue: Array<Transaction>,
  ) {}

  public async getBalance(_address: string): Promise<BigInteger> {
    return Promise.resolve(this.getBalanceValue)
  }

  public async getTransactionStatus(
    _transactionHash: string,
  ): Promise<TransactionStatus> {
    return Promise.resolve(this.getTransactionStatusValue)
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

  public async getTransactionHistory(
    _address: string,
  ): Promise<Array<Transaction>> {
    return Promise.resolve(this.transactionHistoryValue)
  }
}

export default FakeXRPClient
