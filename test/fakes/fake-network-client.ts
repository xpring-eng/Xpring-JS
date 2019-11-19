import { NetworkClient } from "../../src/network-client";
import {
  AccountInfo,
  Fee,
  GetAccountInfoRequest,
  GetFeeRequest,
  SubmitSignedTransactionResponse,
  SubmitSignedTransactionRequest,
  XRPAmount,
  GetLatestValidatedLedgerSequenceRequest,
  LedgerSequence
} from "xpring-common-js";

/**
 * A response for a request to retrieve type T. Either an instance of T, or an error.
 */
type Response<T> = T | Error;

/**
 * A list of responses the fake network client will give.
 */
export class FakeNetworkClientResponses {
  /**
   * A default error.
   */
  public static defaultError = new Error("fake network client failure");

  /**
   * A default set of responses that will always succeed.
   */
  public static defaultSuccessfulResponses = new FakeNetworkClientResponses();

  /**
   * A default set of responses that will always fail.
   */
  public static defaultErrorResponses = new FakeNetworkClientResponses(
    FakeNetworkClientResponses.defaultError,
    FakeNetworkClientResponses.defaultError,
    FakeNetworkClientResponses.defaultError,
    FakeNetworkClientResponses.defaultError
  );

  /**
   * Construct a new set of responses.
   *
   * @param getAccountInfoResponse The response or error that will be returned from the getAccountInfo request. Default is the default account info response.
   * @param getFeeResponse The response or error that will be returned from the getFee request. Defaults to the default fee response.
   * @param submitSignedTransactionResponse The response or error that will be returned from the submitSignedTransaction request. Defaults to the default submit signed transaction response.
   * @param getLatestValidatedLedgerSequenceResponse The response or error that will be returned from the getLatestValidatedLedgerRequest. Defaults to the default ledger sequence response.
   */
  public constructor(
    public readonly getAccountInfoResponse: Response<
      AccountInfo
    > = FakeNetworkClientResponses.defaultAccountInfoResponse(),
    public readonly getFeeResponse: Response<
      Fee
    > = FakeNetworkClientResponses.defaultFeeResponse(),
    public readonly submitSignedTransactionResponse: Response<
      SubmitSignedTransactionResponse
    > = FakeNetworkClientResponses.defaultSubmitSignedTransactionResponse(),
    public readonly getLatestValidatedLedgerSequenceResponse: Response<LedgerSequence> = FakeNetworkClientResponses.defaultLedgerSequenceResponse()
  ) {}

  /**
   * Construct a default AccountInfoResponse.
   */
  public static defaultAccountInfoResponse(): AccountInfo {
    const balance = new XRPAmount();
    balance.setDrops("4000");

    const accountInfo = new AccountInfo();
    accountInfo.setBalance(balance);

    return accountInfo;
  }

  /**
   * Construct a default FeeResponse.
   */
  public static defaultFeeResponse(): Fee {
    const amount = new XRPAmount();
    amount.setDrops("10");

    const fee = new Fee();
    fee.setAmount(amount);

    return fee;
  }

  /**
   * Construct a default SubmitSignedTransactionResponse.
   */
  public static defaultSubmitSignedTransactionResponse(): SubmitSignedTransactionResponse {
    const submitSignedTransactionResponse = new SubmitSignedTransactionResponse();
    submitSignedTransactionResponse.setEngineResult("tesSUCCESS");
    submitSignedTransactionResponse.setEngineResultCode(0);
    submitSignedTransactionResponse.setEngineResultMessage(
      "The transaction was applied. Only final in a validated ledger."
    );
    submitSignedTransactionResponse.setTransactionBlob("DEADBEEF");

    return submitSignedTransactionResponse;
  }

  /**
   * Construct a default LedgerSequence response.
   */
  public static defaultLedgerSequenceResponse(): LedgerSequence {
    const ledgerSequence = new LedgerSequence();
    ledgerSequence.setIndex(12);

    return ledgerSequence;
  }
}

/**
 * A fake network client which stubs network interaction.
 */
export class FakeNetworkClient implements NetworkClient {
  public constructor(
    private readonly responses: FakeNetworkClientResponses = FakeNetworkClientResponses.defaultSuccessfulResponses
  ) {}

  getAccountInfo(
    _accountInfoRequest: GetAccountInfoRequest
  ): Promise<AccountInfo> {
    const accountInfoResponse = this.responses.getAccountInfoResponse;
    if (accountInfoResponse instanceof Error) {
      return Promise.reject(accountInfoResponse);
    }

    return Promise.resolve(accountInfoResponse);
  }

  getFee(_feeRequest: GetFeeRequest): Promise<Fee> {
    const feeResponse = this.responses.getFeeResponse;
    if (feeResponse instanceof Error) {
      return Promise.reject(feeResponse);
    }

    return Promise.resolve(feeResponse);
  }

  submitSignedTransaction(
    _submitSignedTransactionRequest: SubmitSignedTransactionRequest
  ): Promise<SubmitSignedTransactionResponse> {
    const submitSignedTransactionResponse = this.responses
      .submitSignedTransactionResponse;
    if (submitSignedTransactionResponse instanceof Error) {
      return Promise.reject(submitSignedTransactionResponse);
    }

    return Promise.resolve(submitSignedTransactionResponse);
  }

  getLatestValidatedLedgerSequence(
    _getLatestValidatedLedgerSequenceRequest: GetLatestValidatedLedgerSequenceRequest
  ): Promise<LedgerSequence> {
    const ledgerSequenceResponse = this.responses.getLatestValidatedLedgerSequenceResponse;
    if (ledgerSequenceResponse instanceof Error) {
      return Promise.reject(ledgerSequenceResponse);
    }

    return Promise.resolve(ledgerSequenceResponse);  }
}
