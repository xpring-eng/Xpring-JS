import { AccountInfo } from "../generated/account_info_pb";
import { Fee } from "../generated/fee_pb";
import { GetAccountInfoRequest } from "../generated/get_account_info_request_pb";
import { GetFeeRequest } from "../generated/get_fee_request_pb";
import { SubmitSignedTransactionRequest } from "../generated/submit_signed_transaction_request_pb";
import { SubmitSignedTransactionResponse } from "../generated/submit_signed_transaction_response_pb";

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
  getAccountInfo(getAccountInfoRequest: GetAccountInfoRequest): Promise<AccountInfo>;
  getFee(getFeeRequest: GetFeeRequest): Promise<Fee>;
  submitSignedTransaction(submitSignedTransactionRequest: SubmitSignedTransactionRequest): Promise<SubmitSignedTransactionResponse>;
}
