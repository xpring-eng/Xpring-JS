import CommonXrplClientInterface from '../../../src/XRP/common-xrpl-client-interface'
import TransactionStatus from '../../../src/XRP/transaction-status'
import { Wallet } from '../../../src/index'
import Result from '../../Common/Helpers/result'
import { XrplNetwork } from 'xpring-common-js'
import RawTransactionStatus from '../../../src/XRP/raw-transaction-status'

class FakeCommonXrplClient implements CommonXrplClientInterface {
  public constructor(
    public determineFinalResultValue: TransactionStatus,
    public awaitFinalTransactionResultValue: Result<RawTransactionStatus>,
    public network: XrplNetwork = XrplNetwork.Test,
  ) {}

  public determineFinalResult(
    _rawTransactionStatus: RawTransactionStatus,
  ): TransactionStatus {
    return this.determineFinalResultValue
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
