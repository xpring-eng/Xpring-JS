import { AccountInfo } from "../xpring-common-js/generated/account_info_pb";
import { Fee } from "../xpring-common-js/generated/fee_pb";
import { GetAccountInfoRequest } from "../xpring-common-js/generated/get_account_info_request_pb";
import { GetFeeRequest } from "../xpring-common-js/generated/get_fee_request_pb";
import { SubmitSignedTransactionRequest } from "../xpring-common-js/generated/submit_signed_transaction_request_pb";
import { SubmitSignedTransactionResponse } from "../xpring-common-js/generated/submit_signed_transaction_response_pb";

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
