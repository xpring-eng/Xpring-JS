import { TransactionStatus as RawTransactionStatus } from 'xpring-common-js'
import { BigInteger } from 'big-integer'
import { XpringClientDecorator } from '../../src/xpring-client-decorator'
import TransactionStatus from '../../src/transaction-status'
import { Wallet } from '../../src/index'

class FakeXpringClient implements XpringClientDecorator {
  public constructor(
    public getBalanceValue: BigInteger,
    public getTransactionStatusValue: TransactionStatus,
    public sendValue: string,
    public getLastValidatedLedgerSequenceValue: number,
    public getRawTransactionStatusValue: RawTransactionStatus,
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
}

export default FakeXpringClient
