import { AccountInfo } from "../terram/generated/account_info_pb";
import { Fee } from "../terram/generated/fee_pb";
import { GetAccountInfoRequest } from "../terram/generated/get_account_info_request_pb";
import { GetFeeRequest } from "../terram/generated/get_fee_request_pb";
import { SubmitSignedTransactionRequest } from "../terram/generated/submit_signed_transaction_request_pb";
import { SubmitSignedTransactionResponse } from "../terram/generated/submit_signed_transaction_response_pb";

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
