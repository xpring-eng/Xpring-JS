/* eslint-disable class-methods-use-this */
import { Transaction } from '../../src/generated/web/org/xrpl/rpc/v1/transaction_pb'
import { NetworkClient } from '../../src/network-client'
import {
  GetAccountInfoRequest,
  GetAccountInfoResponse,
} from '../../src/generated/web/org/xrpl/rpc/v1/get_account_info_pb'
import {
  GetFeeRequest,
  GetFeeResponse,
  Fee,
} from '../../src/generated/web/org/xrpl/rpc/v1/get_fee_pb'
import {
  GetTransactionRequest,
  GetTransactionResponse,
} from '../../src/generated/web/org/xrpl/rpc/v1/get_transaction_pb'
import {
  SubmitTransactionRequest,
  SubmitTransactionResponse,
} from '../../src/generated/web/org/xrpl/rpc/v1/submit_pb'
import { AccountRoot } from '../../src/generated/web/org/xrpl/rpc/v1/ledger_objects_pb'
import {
  XRPDropsAmount,
  CurrencyAmount,
} from '../../src/generated/web/org/xrpl/rpc/v1/amount_pb'
import { AccountAddress } from '../../src/generated/web/org/xrpl/rpc/v1/account_pb'
import {
  Meta,
  TransactionResult,
} from '../../src/generated/web/org/xrpl/rpc/v1/meta_pb'
import { Balance } from '../../src/generated/node/org/xrpl/rpc/v1/common_pb'
import {
  GetAccountTransactionHistoryRequest,
  GetAccountTransactionHistoryResponse,
} from '../../src/generated/web/org/xrpl/rpc/v1/get_account_transaction_history_pb'
import Result from '../Common/Helpers/result'
import { testGetAccountTransactionHistoryResponse } from './fake-xrp-protobufs'

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
    FakeNetworkClientResponses.defaultError,
  )

  /**
   * Construct a new set of responses.
   *
   * @param getAccountInfoResponse The response or error that will be returned from the getAccountInfo request. Default is the default account info response.
   * @param getFeeResponse The response or error that will be returned from the getFee request. Defaults to the default fee response.
   * @param submitTransactionResponse The response or error that will be returned from the submitTransaction request. Defaults to the default submit transaction response.
   * @param getTransactionStatusResponse The response or error that will be returned from the getTransactionStatus request. Defaults to the default transaction status response.
   * @param getTransactionHistoryResponse The response or error that will be returned from the getTransactionHistory request. Default to the default transaction history response.
   */
  public constructor(
    public readonly getAccountInfoResponse: Result<
      GetAccountInfoResponse
    > = FakeNetworkClientResponses.defaultAccountInfoResponse(),
    public readonly getFeeResponse: Result<
      GetFeeResponse
    > = FakeNetworkClientResponses.defaultFeeResponse(),
    public readonly submitransactionResponse: Result<
      SubmitTransactionResponse
    > = FakeNetworkClientResponses.defaultSubmitTransactionResponse(),
    public readonly getTransactionStatusResponse: Result<
      GetTransactionResponse
    > = FakeNetworkClientResponses.defaultGetTransactionResponse(),
    public readonly getTransactionHistoryResponse: Result<
      GetAccountTransactionHistoryResponse
    > = FakeNetworkClientResponses.defaultGetTransactionHistoryResponse(),
  ) {}

  /**
   * Construct a default AccountInfoResponse.
   */
  public static defaultAccountInfoResponse(): GetAccountInfoResponse {
    const xrpAmount = new XRPDropsAmount()
    xrpAmount.setDrops('10')

    const currencyAmount = new CurrencyAmount()
    currencyAmount.setXrpAmount(xrpAmount)

    const balance = new Balance()
    balance.setValue(currencyAmount)

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
    const minimumFee = new XRPDropsAmount()
    minimumFee.setDrops('1')

    const fee = new Fee()
    fee.setMinimumFee(minimumFee)

    const getFeeResponse = new GetFeeResponse()
    getFeeResponse.setFee(fee)
    getFeeResponse.setLedgerCurrentIndex(1)

    return getFeeResponse
  }

  /**
   * Construct a default SubmitTransactionResponse.
   */
  public static defaultSubmitTransactionResponse(): SubmitTransactionResponse {
    const submitTransactionResponse = new SubmitTransactionResponse()
    submitTransactionResponse.setHash('123456')

    return submitTransactionResponse
  }

  /**
   * Construct a default getTransactionResponse.
   */
  public static defaultGetTransactionResponse(): GetTransactionResponse {
    const transactionResult = new TransactionResult()
    transactionResult.setResult('tesSUCCESS')

    const meta = new Meta()
    meta.setTransactionResult(transactionResult)

    const transaction = new Transaction()

    const response = new GetTransactionResponse()
    response.setValidated(true)
    response.setMeta(meta)
    response.setTransaction(transaction)

    return response
  }

  /**
   * Construct a default getTransactionHistoryResponse.
   */
  public static defaultGetTransactionHistoryResponse(): GetAccountTransactionHistoryResponse {
    // constructed in test/fakes/fake-xrp-protobufs.ts
    return testGetAccountTransactionHistoryResponse
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

  getTransaction(
    _getTransactionStatusRequest: GetTransactionRequest,
  ): Promise<GetTransactionResponse> {
    const transactionStatusResponse = this.responses
      .getTransactionStatusResponse
    if (transactionStatusResponse instanceof Error) {
      return Promise.reject(transactionStatusResponse)
    }

    return Promise.resolve(transactionStatusResponse)
  }

  getTransactionHistory(
    _GetAccountTransactionHistoryRequestetAccountTransactionHistoryRequest: GetAccountTransactionHistoryRequest,
  ): Promise<GetAccountTransactionHistoryResponse> {
    const transactionHistoryResponse = this.responses
      .getTransactionHistoryResponse
    if (transactionHistoryResponse instanceof Error) {
      return Promise.reject(transactionHistoryResponse)
    }

    return Promise.resolve(transactionHistoryResponse)
  }

  public AccountAddress(): AccountAddress {
    return new AccountAddress()
  }

  public GetAccountInfoRequest(): GetAccountInfoRequest {
    return new GetAccountInfoRequest()
  }

  public GetTransactionRequest(): GetTransactionRequest {
    return new GetTransactionRequest()
  }

  public GetFeeRequest(): GetFeeRequest {
    return new GetFeeRequest()
  }

  public SubmitTransactionRequest(): SubmitTransactionRequest {
    return new SubmitTransactionRequest()
  }

  public GetAccountTransactionHistoryRequest(): GetAccountTransactionHistoryRequest {
    return new GetAccountTransactionHistoryRequest()
  }
}
