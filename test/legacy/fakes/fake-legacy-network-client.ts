import { Wallet } from 'xpring-common-js'
import { LegacyNetworkClient } from '../../../src/legacy/grpc/network-client'
import { AccountInfo } from '../../../src/legacy/grpc/generated/node/account_info_pb'
import { Fee } from '../../../src/legacy/grpc/generated/node/fee_pb'
import { SubmitSignedTransactionResponse } from '../../../src/legacy/grpc/generated/node/submit_signed_transaction_response_pb'
import { LedgerSequence } from '../../../src/legacy/grpc/generated/node/ledger_sequence_pb'
import { TransactionStatus } from '../../../src/legacy/grpc/generated/node/transaction_status_pb'
import { XRPAmount } from '../../../src/legacy/grpc/generated/node/xrp_amount_pb'
import { SignedTransaction } from '../../../src/legacy/grpc/generated/node/signed_transaction_pb'

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
   * @param createSignedTransactionResponse The response or error that will be returned from the createSignedTransaction request. Defaults to the default SignedTransaction.
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
    public readonly createSignedTransactionResponse: Response<
      SignedTransaction
    > = FakeLegacyNetworkClientResponses.defaultCreateSignedTransactionResponse(),
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

  /**
   * Construct a default SignedTransaction.
   */
  public static defaultCreateSignedTransactionResponse(): SignedTransaction {
    const signedTransaction = new SignedTransaction()
    signedTransaction.setTransactionSignatureHex(
      '304402205B7E213927BBC79E48F736B56456BF7574D50BD56B10C025C8C82C13BA017F8802201BFDB979368C581D905DC96CDDC209A3ECE0401F7935C3868877D12907DAC856',
    )

    return signedTransaction
  }
}

/**
 * A fake network client which stubs network interaction.
 */
export class FakeLegacyNetworkClient implements LegacyNetworkClient {
  public constructor(
    private readonly responses: FakeLegacyNetworkClientResponses = FakeLegacyNetworkClientResponses.defaultSuccessfulResponses,
  ) {}

  getAccountInfo(_address: string): Promise<AccountInfo> {
    const accountInfoResponse = this.responses.getAccountInfoResponse
    if (accountInfoResponse instanceof Error) {
      return Promise.reject(accountInfoResponse)
    }

    return Promise.resolve(accountInfoResponse)
  }

  getFee(): Promise<Fee> {
    const feeResponse = this.responses.getFeeResponse
    if (feeResponse instanceof Error) {
      return Promise.reject(feeResponse)
    }

    return Promise.resolve(feeResponse)
  }

  submitSignedTransaction(
    _signedTransaction: SignedTransaction,
  ): Promise<SubmitSignedTransactionResponse> {
    const { submitSignedTransactionResponse } = this.responses
    if (submitSignedTransactionResponse instanceof Error) {
      return Promise.reject(submitSignedTransactionResponse)
    }

    return Promise.resolve(submitSignedTransactionResponse)
  }

  getLatestValidatedLedgerSequence(): Promise<LedgerSequence> {
    const ledgerSequenceResponse = this.responses
      .getLatestValidatedLedgerSequenceResponse
    if (ledgerSequenceResponse instanceof Error) {
      return Promise.reject(ledgerSequenceResponse)
    }

    return Promise.resolve(ledgerSequenceResponse)
  }

  getTransactionStatus(_hash: string): Promise<TransactionStatus> {
    const transactionStatusResponse = this.responses
      .getTransactionStatusResponse
    if (transactionStatusResponse instanceof Error) {
      return Promise.reject(transactionStatusResponse)
    }

    return Promise.resolve(transactionStatusResponse)
  }

  createSignedTransaction(
    _normalizedAmount: string,
    _destination: string,
    _sender: Wallet,
    _ledgerSequenceMargin: number,
  ): Promise<SignedTransaction> {
    const { createSignedTransactionResponse } = this.responses
    if (createSignedTransactionResponse instanceof Error) {
      return Promise.reject(createSignedTransactionResponse)
    }

    return Promise.resolve(createSignedTransactionResponse)
  }
}
