import {
  AccountInfo,
  Fee,
  GetAccountInfoRequest,
  GetFeeRequest,
  SubmitSignedTransactionRequest,
  SubmitSignedTransactionResponse
} from "xpring-common-js";

/**
 * An error that can occur when making a request.
 */
export interface NetworkServiceError {
  message: string;
  code: number;
  metadata: object;
}

/**
 * The network client interface provides a wrapper around network calls to the Xpring Platform.
 */
export interface NetworkClient {
  getAccountInfo(
    getAccountInfoRequest: GetAccountInfoRequest
  ): Promise<AccountInfo>;
  getFee(getFeeRequest: GetFeeRequest): Promise<Fee>;
  submitSignedTransaction(
    submitSignedTransactionRequest: SubmitSignedTransactionRequest
  ): Promise<SubmitSignedTransactionResponse>;
}
