// import {
//   // AccountInfo,
//   // Fee,
//   // GetAccountInfoRequest,
//   // GetFeeRequest,
//   // SubmitSignedTransactionRequest,
//   // SubmitSignedTransactionResponse,
//   // GetLatestValidatedLedgerSequenceRequest,
//   // LedgerSequence,
//   // GetTransactionStatusRequest,
//   // TransactionStatus
// } from "xpring-common-js";
import {
  GetAccountInfoRequest,
  GetAccountInfoResponse
} from "../generated/account_info_pb";

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
  ): Promise<GetAccountInfoResponse>;
  // getFee(getFeeRequest: GetFeeRequest): Promise<Fee>;
  // submitSignedTransaction(
  //   submitSignedTransactionRequest: SubmitSignedTransactionRequest
  // ): Promise<SubmitSignedTransactionResponse>;
  // getLatestValidatedLedgerSequence(
  //   getLatestValidatedLedgerSequenceRequest: GetLatestValidatedLedgerSequenceRequest
  // ): Promise<LedgerSequence>;
  // getTransactionStatus(
  //   getTransactionStatusRequest: GetTransactionStatusRequest
  // ): Promise<TransactionStatus>;
}
