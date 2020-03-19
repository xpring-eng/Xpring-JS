import { BigInteger } from 'big-integer'
import { Wallet } from 'xpring-common-js'
import XRPClientInterface from '../../../src/XRP/xrp-client-interface'
import Result from '../../Common/Helpers/result'
import TransactionStatus from '../../../src/transaction-status'

/**
 * A fake XRPClient Client which can return faked values.
 */
export default class FakeXRPClient implements XRPClientInterface {
  /**
   * @param getBalanceResult Result returned for calls to `getBalance`.
   * @param getPaymentStatusResult Result returned for calls to `getPaymentStatus`.
   * @param sendResult Result returned for calls to `send`.
   * @param accountExistsResult Result returned for calls to `accountExists`.
   */
  constructor(
    private readonly getBalanceResult: Result<BigInteger>,
    private readonly getPaymentStatusResult: Result<TransactionStatus>,
    private readonly sendResult: Result<string>,
    private readonly accountExistsResult: Result<boolean>,
  ) {}

  getBalance(_address: string): Promise<BigInteger> {
    return FakeXRPClient.returnOrThrow(this.getBalanceResult)
  }

  getPaymentStatus(_transactionHash: string): Promise<TransactionStatus> {
    return FakeXRPClient.returnOrThrow(this.getPaymentStatusResult)
  }

  send(
    _amount: string | number | BigInteger,
    _destination: string,
    _sender: Wallet,
  ): Promise<string> {
    return FakeXRPClient.returnOrThrow(this.sendResult)
  }

  accountExists(_address: string): Promise<boolean> {
    return FakeXRPClient.returnOrThrow(this.accountExistsResult)
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  private static async returnOrThrow<T>(value: Result<T>): Promise<T> {
    if (value instanceof Error) {
      throw value
    }
    return value
  }
}
