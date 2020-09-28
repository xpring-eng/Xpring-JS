import TransactionStatus from '../../../src/XRP/transaction-status'
import { Wallet } from '../../../src/index'
import RawTransactionStatus from '../../../src/XRP/raw-transaction-status'
import Result from '../../Common/Helpers/result'
import { Transaction, XrplNetwork } from 'xpring-common-js'
import TransactionResult from '../../../src/XRP/model/transaction-result'

class FakeCommonXrplClient {
  public constructor(
    public getOpenLedgerSequenceValue: Result<number>,
    public getLatestValidatedLedgerSequenceValue: Result<number>,
    public getRawTransactionStatusValue: Result<RawTransactionStatus>,
    public prepareBaseTransactionValue: Result<Transaction>,
    public signAndSubmitTransactionValue: Result<string>,
    public getTransactionResultValue: Result<TransactionResult>,
    public getTransactionStatusValue: Result<TransactionStatus>,
    public determineFinalResultValue: Result<TransactionStatus>,
    public awaitFinalTransactionResultValue: Result<RawTransactionStatus>,
    public readonly network: XrplNetwork = XrplNetwork.Test,
  ) {}

  public async getOpenLedgerSequence(): Promise<number> {
    return FakeCommonXrplClient.returnOrThrow(this.getOpenLedgerSequenceValue)
  }

  public async getLatestValidatedLedgerSequence(
    _address: string,
  ): Promise<number> {
    return FakeCommonXrplClient.returnOrThrow(
      this.getLatestValidatedLedgerSequenceValue,
    )
  }

  public async getRawTransactionStatus(
    _transactionHash: string,
  ): Promise<RawTransactionStatus> {
    return FakeCommonXrplClient.returnOrThrow(this.getRawTransactionStatusValue)
  }

  public async prepareBaseTransaction(_wallet: Wallet): Promise<Transaction> {
    return FakeCommonXrplClient.returnOrThrow(this.prepareBaseTransactionValue)
  }

  public async signAndSubmitTransaction(
    _transaction: Transaction,
    _wallet: Wallet,
  ): Promise<string> {
    return FakeCommonXrplClient.returnOrThrow(
      this.signAndSubmitTransactionValue,
    )
  }

  public async getTransactionResult(
    _transactionHash: string,
  ): Promise<TransactionResult> {
    return FakeCommonXrplClient.returnOrThrow(this.getTransactionResultValue)
  }

  public async getTransactionStatus(
    _transactionHash: string,
  ): Promise<TransactionStatus> {
    return FakeCommonXrplClient.returnOrThrow(this.getTransactionStatusValue)
  }

  public async determineFinalResult(
    _rawTransactionStatus: RawTransactionStatus,
  ): Promise<TransactionStatus> {
    return await FakeCommonXrplClient.returnOrThrow(
      this.determineFinalResultValue,
    )
  }

  public async awaitFinalTransactionResult(
    _transactionHash: string,
    _sender: Wallet,
  ): Promise<RawTransactionStatus> {
    return FakeCommonXrplClient.returnOrThrow(
      this.awaitFinalTransactionResultValue,
    )
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  private static async returnOrThrow<T>(value: Result<T>): Promise<T> {
    if (value instanceof Error) {
      throw value
    }
    return value
  }
}

export default FakeCommonXrplClient
