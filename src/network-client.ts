import { AccountInfo } from "../generated/account_info_pb";
import { Currency } from "../generated/currency_pb";
import { Fee } from "../generated/fee_pb";
import { FiatAmount } from "../generated/fiat_amount_pb";
import { GetLatestValidatedLedgerSequenceRequest } from "../generated/get_latest_validated_ledger_sequence_request_pb";
import { GetAccountInfoRequest } from "../generated/get_account_info_request_pb";
import { GetFeeRequest } from "../generated/get_fee_request_pb";
import { GetTransactionStatusRequest } from "../generated/get_transaction_status_request_pb";
import { LedgerSequence } from "../generated/ledger_sequence_pb";
import { Payment } from "../generated/payment_pb";
import { SubmitSignedTransactionRequest } from "../generated/submit_signed_transaction_request_pb";
import { SubmitSignedTransactionResponse } from "../generated/submit_signed_transaction_response_pb";
import { XRPAmount } from "../generated/xrp_amount_pb";
import { SignedTransaction } from "../generated/signed_transaction_pb";
import { TransactionStatus } from "../generated/transaction_status_pb";
import { Transaction } from "../generated/transaction_pb";
import { XRPLedgerAPIClient } from "../generated/xrp_ledger_grpc_web_pb";

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
  getLatestValidatedLedgerSequence(
    getLatestValidatedLedgerSequenceRequest: GetLatestValidatedLedgerSequenceRequest
  ): Promise<LedgerSequence>;
  getTransactionStatus(
    getTransactionStatusRequest: GetTransactionStatusRequest
  ): Promise<TransactionStatus>;
}
