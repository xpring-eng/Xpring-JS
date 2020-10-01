import CoreXrplClientInterface from '../../../src/XRP/core-xrpl-client-interface'
import { Wallet } from '../../../src/index'
import Result from '../../Common/Helpers/result'
import { XrplNetwork } from 'xpring-common-js'
import RawTransactionStatus from '../../../src/XRP/raw-transaction-status'
import TransactionResult from '../../../src/XRP/model/transaction-result'

class FakeCoreXrplClient implements CoreXrplClientInterface {
  public constructor(
    public awaitFinalTransactionStatusValue: Result<{
      rawTransactionStatus: RawTransactionStatus
      lastLedgerPassed: boolean
    }>,
    public awaitFinalTransactionResultValue: Result<TransactionResult>,
    public network: XrplNetwork = XrplNetwork.Test,
  ) {}

  // eslint-disable-next-line @typescript-eslint/require-await
  public async waitForFinalTransactionOutcome(
    _transactionHash: string,
    _sender: Wallet,
  ): Promise<{
    rawTransactionStatus: RawTransactionStatus
    lastLedgerPassed: boolean
  }> {
    return FakeCoreXrplClient.returnOrThrow(
      this.awaitFinalTransactionStatusValue,
    )
  }

  public async getFinalTransactionResultAsync(
    _transactionHash: string,
    _sender: Wallet,
  ): Promise<TransactionResult> {
    return FakeCoreXrplClient.returnOrThrow(
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

export default FakeCoreXrplClient
