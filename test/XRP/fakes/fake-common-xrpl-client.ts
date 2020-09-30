import CommonXrplClientInterface from '../../../src/XRP/common-xrpl-client-interface'
import { Wallet } from '../../../src/index'
import Result from '../../Common/Helpers/result'
import { XrplNetwork } from 'xpring-common-js'
import RawTransactionStatus from '../../../src/XRP/raw-transaction-status'
import TransactionResult from '../../../src/XRP/model/final-transaction-result'

class FakeCommonXrplClient implements CommonXrplClientInterface {
  public constructor(
    public awaitFinalTransactionStatusValue: Result<RawTransactionStatus>,
    public awaitFinalTransactionResultValue: Result<TransactionResult>,
    public network: XrplNetwork = XrplNetwork.Test,
  ) {}

  public async awaitFinalTransactionStatus(
    _transactionHash: string,
    _sender: Wallet,
  ): Promise<RawTransactionStatus> {
    return FakeCommonXrplClient.returnOrThrow(
      this.awaitFinalTransactionStatusValue,
    )
  }

  public async awaitFinalTransactionResult(
    _transactionHash: string,
    _sender: Wallet,
  ): Promise<TransactionResult> {
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
