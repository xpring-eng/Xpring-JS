import { AccountInfo } from 'xpring-common-js'
import { NetworkClient } from '../../src/network-client'
import {
  GetAccountInfoRequest,
  GetAccountInfoResponse,
} from '../../generated/rpc/v1/account_info_pb'
import { GetFeeRequest, GetFeeResponse } from '../../generated/rpc/v1/fee_pb'
import { GetTxRequest, GetTxResponse } from '../../generated/rpc/v1/tx_pb'
import {
  SubmitTransactionRequest,
  SubmitTransactionResponse,
} from '../../generated/rpc/v1/submit_pb'
import { AccountRoot } from '../../generated/rpc/v1/ledger_objects_pb'
import { XRPDropsAmount } from '../../generated/rpc/v1/amount_pb'
import { Meta, TransactionResult } from '../../generated/rpc/v1/meta_pb'

/**
 * A response for a request to retrieve type T. Either an instance of T, or an error.
 */
type Response<T> = T | Error

/**
 * A list of responses the fake network client will give.
 */
export class FakeNetworkClientResponses {
  /**
   * A default error.
   */
  public static defaultError = new Error('fake network client failure')

  /**
   * A default set of responses that will always succeed.
   */
  public static defaultSuccessfulResponses = new FakeNetworkClientResponses()

  /**
   * A default set of responses that will always fail.
   */
  public static defaultErrorResponses = new FakeNetworkClientResponses(
    FakeNetworkClientResponses.defaultError,
    FakeNetworkClientResponses.defaultError,
    FakeNetworkClientResponses.defaultError,
    FakeNetworkClientResponses.defaultError,
  )

  /**
   * Construct a new set of responses.
   *
   * @param getAccountInfoResponse The response or error that will be returned from the getAccountInfo request. Default is the default account info response.
   * @param getFeeResponse The response or error that will be returned from the getFee request. Defaults to the default fee response.
   * @param submitTransactionResponse The response or error that will be returned from the submitTransaction request. Defaults to the default submit transaction response.
   * @param getTxResponse The response or error that will be returned from the getTransactionStatus request. Defaults to the default transaction status response.
   */
  public constructor(
    public readonly getAccountInfoResponse: Response<
      GetAccountInfoResponse
    > = FakeNetworkClientResponses.defaultAccountInfoResponse(),
    public readonly getFeeResponse: Response<
      GetFeeResponse
    > = FakeNetworkClientResponses.defaultFeeResponse(),
    public readonly submitransactionResponse: Response<
      SubmitTransactionResponse
    > = FakeNetworkClientResponses.defaultSubmitTransactionResponse(),
    public readonly getTransactionStatusResponse: Response<
      GetTxResponse
    > = FakeNetworkClientResponses.defaultGetTxResponse(),
  ) {}

  /**
   * Construct a default AccountInfoResponse.
   */
  public static defaultAccountInfoResponse(): GetAccountInfoResponse {
    const balance = new XRPDropsAmount()
    balance.setDrops(10)

    const accountRoot = new AccountRoot()
    accountRoot.setBalance(balance)

    const accountInfo = new GetAccountInfoResponse()
    accountInfo.setAccountData(accountRoot)

    return accountInfo
  }

  /**
   * Construct a default FeeResponse.
   */
  public static defaultFeeResponse(): GetFeeResponse {
    return new GetFeeResponse()
  }

  /**
   * Construct a default SubmitTransactionResponse.
   */
  public static defaultSubmitTransactionResponse(): SubmitTransactionResponse {
    return new SubmitTransactionResponse()
  }

  /**
   * Construct a default getTx response.
   */
  public static defaultGetTxResponse(): GetTxResponse {
    const transactionResult = new TransactionResult()
    transactionResult.setResult('tesSUCCESS')

    const meta = new Meta()
    meta.setTransactionResult(transactionResult)

    const response = new GetTxResponse()
    response.setValidated(true)
    response.setMeta(meta)

    return response
  }
}

/**
 * A fake network client which stubs network interaction.
 */
export class FakeNetworkClient implements NetworkClient {
  public constructor(
    private readonly responses: FakeNetworkClientResponses = FakeNetworkClientResponses.defaultSuccessfulResponses,
  ) {}

  getAccountInfo(
    _accountInfoRequest: GetAccountInfoRequest,
  ): Promise<GetAccountInfoResponse> {
    const accountInfoResponse = this.responses.getAccountInfoResponse
    if (accountInfoResponse instanceof Error) {
      return Promise.reject(accountInfoResponse)
    }

    return Promise.resolve(accountInfoResponse)
  }

  getFee(_feeRequest: GetFeeRequest): Promise<GetFeeResponse> {
    const feeResponse = this.responses.getFeeResponse
    if (feeResponse instanceof Error) {
      return Promise.reject(feeResponse)
    }

    return Promise.resolve(feeResponse)
  }

  submitTransaction(
    _submitSignedTransactionRequest: SubmitTransactionRequest,
  ): Promise<SubmitTransactionResponse> {
    const submitTransactionResponse = this.responses.submitransactionResponse
    if (submitTransactionResponse instanceof Error) {
      return Promise.reject(submitTransactionResponse)
    }

    return Promise.resolve(submitTransactionResponse)
  }

  getTx(_getTransactionStatusRequest: GetTxRequest): Promise<GetTxResponse> {
    const transactionStatusResponse = this.responses
      .getTransactionStatusResponse
    if (transactionStatusResponse instanceof Error) {
      return Promise.reject(transactionStatusResponse)
    }

    return Promise.resolve(transactionStatusResponse)
  }
}
