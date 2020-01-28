import { LegacyNetworkClient } from '../../../src/legacy/legacy-network-client'
import { AccountInfo } from '../../../src/generated/node/legacy/account_info_pb'
import { Fee } from '../../../src/generated/node/legacy/fee_pb'
import { SubmitSignedTransactionResponse } from '../../../src/generated/node/legacy/submit_signed_transaction_response_pb'
import { LedgerSequence } from '../../../src/generated/node/legacy/ledger_sequence_pb'
import { TransactionStatus } from '../../../src/generated/node/legacy/transaction_status_pb'
import { XRPAmount } from '../../../src/generated/node/legacy/xrp_amount_pb'
import { GetAccountInfoRequest } from '../../../src/generated/node/legacy/get_account_info_request_pb'
import { GetFeeRequest } from '../../../src/generated/node/legacy/get_fee_request_pb'
import { SubmitSignedTransactionRequest } from '../../../src/generated/node/legacy/submit_signed_transaction_request_pb'
import { GetLatestValidatedLedgerSequenceRequest } from '../../../src/generated/node/legacy/get_latest_validated_ledger_sequence_request_pb'
import { GetTransactionStatusRequest } from '../../../src/generated/node/legacy/get_transaction_status_request_pb'

/**
 * A response for a request to retrieve type T. Either an instance of T, or an error.
 */
type Response<T> = T | Error

/**
 * A list of responses the fake network client will give.
 */
export class FakeLegacyNetworkClientResponses {
  /**
   * A default error.
   */
  public static defaultError = new Error('fake network client failure')

  /**
   * A default set of responses that will always succeed.
   */
  public static defaultSuccessfulResponses = new FakeLegacyNetworkClientResponses()

  /**
   * A default set of responses that will always fail.
   */
  public static defaultErrorResponses = new FakeLegacyNetworkClientResponses(
    FakeLegacyNetworkClientResponses.defaultError,
    FakeLegacyNetworkClientResponses.defaultError,
    FakeLegacyNetworkClientResponses.defaultError,
    FakeLegacyNetworkClientResponses.defaultError,
    FakeLegacyNetworkClientResponses.defaultError,
  )

  /**
   * Construct a new set of responses.
   *
   * @param getAccountInfoResponse The response or error that will be returned from the getAccountInfo request. Default is the default account info response.
   * @param getFeeResponse The response or error that will be returned from the getFee request. Defaults to the default fee response.
   * @param submitSignedTransactionResponse The response or error that will be returned from the submitSignedTransaction request. Defaults to the default submit signed transaction response.
   * @param getLatestValidatedLedgerSequenceResponse The response or error that will be returned from the getLatestValidatedLedger request. Defaults to the default ledger sequence response.
   * @param getTransactionStatusResponse The response or error that will be returned from the getTransactionStatus request. Defaults to the default transaction status response.
   */
  public constructor(
    public readonly getAccountInfoResponse: Response<
      AccountInfo
    > = FakeLegacyNetworkClientResponses.defaultAccountInfoResponse(),
    public readonly getFeeResponse: Response<
      Fee
    > = FakeLegacyNetworkClientResponses.defaultFeeResponse(),
    public readonly submitSignedTransactionResponse: Response<
      SubmitSignedTransactionResponse
    > = FakeLegacyNetworkClientResponses.defaultSubmitSignedTransactionResponse(),
    public readonly getLatestValidatedLedgerSequenceResponse: Response<
      LedgerSequence
    > = FakeLegacyNetworkClientResponses.defaultLedgerSequenceResponse(),
    public readonly getTransactionStatusResponse: Response<
      TransactionStatus
    > = FakeLegacyNetworkClientResponses.defaultTransactionStatusResponse(),
  ) {}

  /**
   * Construct a default AccountInfoResponse.
   */
  public static defaultAccountInfoResponse(): AccountInfo {
    const balance = new XRPAmount()
    balance.setDrops('4000')

    const accountInfo = new AccountInfo()
    accountInfo.setBalance(balance)

    return accountInfo
  }

  /**
   * Construct a default FeeResponse.
   */
  public static defaultFeeResponse(): Fee {
    const amount = new XRPAmount()
    amount.setDrops('10')

    const fee = new Fee()
    fee.setAmount(amount)

    return fee
  }

  /**
   * Construct a default SubmitSignedTransactionResponse.
   */
  public static defaultSubmitSignedTransactionResponse(): SubmitSignedTransactionResponse {
    const submitSignedTransactionResponse = new SubmitSignedTransactionResponse()
    submitSignedTransactionResponse.setEngineResult('tesSUCCESS')
    submitSignedTransactionResponse.setEngineResultCode(0)
    submitSignedTransactionResponse.setEngineResultMessage(
      'The transaction was applied. Only final in a validated ledger.',
    )
    submitSignedTransactionResponse.setTransactionBlob('DEADBEEF')

    return submitSignedTransactionResponse
  }

  /**
   * Construct a default LedgerSequence response.
   */
  public static defaultLedgerSequenceResponse(): LedgerSequence {
    const ledgerSequence = new LedgerSequence()
    ledgerSequence.setIndex(12)

    return ledgerSequence
  }

  /**
   * Construct a default Transaction status response.
   */
  public static defaultTransactionStatusResponse(): TransactionStatus {
    const transactionStatus = new TransactionStatus()
    transactionStatus.setValidated(true)
    transactionStatus.setTransactionStatusCode('tesSUCCESS')

    return transactionStatus
  }
}

/**
 * A fake network client which stubs network interaction.
 */
export class FakeLegacyNetworkClient implements LegacyNetworkClient {
  public constructor(
    private readonly responses: FakeLegacyNetworkClientResponses = FakeLegacyNetworkClientResponses.defaultSuccessfulResponses,
  ) {}

  getAccountInfo(
    _accountInfoRequest: GetAccountInfoRequest,
  ): Promise<AccountInfo> {
    const accountInfoResponse = this.responses.getAccountInfoResponse
    if (accountInfoResponse instanceof Error) {
      return Promise.reject(accountInfoResponse)
    }

    return Promise.resolve(accountInfoResponse)
  }

  getFee(_feeRequest: GetFeeRequest): Promise<Fee> {
    const feeResponse = this.responses.getFeeResponse
    if (feeResponse instanceof Error) {
      return Promise.reject(feeResponse)
    }

    return Promise.resolve(feeResponse)
  }

  submitSignedTransaction(
    _submitSignedTransactionRequest: SubmitSignedTransactionRequest,
  ): Promise<SubmitSignedTransactionResponse> {
    const { submitSignedTransactionResponse } = this.responses
    if (submitSignedTransactionResponse instanceof Error) {
      return Promise.reject(submitSignedTransactionResponse)
    }

    return Promise.resolve(submitSignedTransactionResponse)
  }

  getLatestValidatedLedgerSequence(
    _getLatestValidatedLedgerSequenceRequest: GetLatestValidatedLedgerSequenceRequest,
  ): Promise<LedgerSequence> {
    const ledgerSequenceResponse = this.responses
      .getLatestValidatedLedgerSequenceResponse
    if (ledgerSequenceResponse instanceof Error) {
      return Promise.reject(ledgerSequenceResponse)
    }

    return Promise.resolve(ledgerSequenceResponse)
  }

  getTransactionStatus(
    _getTransactionStatusRequest: GetTransactionStatusRequest,
  ): Promise<TransactionStatus> {
    const transactionStatusResponse = this.responses
      .getTransactionStatusResponse
    if (transactionStatusResponse instanceof Error) {
      return Promise.reject(transactionStatusResponse)
    }

    return Promise.resolve(transactionStatusResponse)
  }
}
