// Web Imports
import { AccountInfo } from '../Generated/web/legacy/account_info_pb'
import { Fee } from '../Generated/web/legacy/fee_pb'
import { GetAccountInfoRequest } from '../Generated/web/legacy/get_account_info_request_pb'
import { GetFeeRequest } from '../Generated/web/legacy/get_fee_request_pb'
import { SubmitSignedTransactionRequest } from '../Generated/web/legacy/submit_signed_transaction_request_pb'
import { SubmitSignedTransactionResponse } from '../Generated/web/legacy/submit_signed_transaction_response_pb'
import { GetLatestValidatedLedgerSequenceRequest } from '../Generated/web/legacy/get_latest_validated_ledger_sequence_request_pb'
import { LedgerSequence } from '../Generated/web/legacy/ledger_sequence_pb'
import { GetTransactionStatusRequest } from '../Generated/web/legacy/get_transaction_status_request_pb'
import { TransactionStatus } from '../Generated/web/legacy/transaction_status_pb'
import { XRPAmount } from '../Generated/web/legacy/xrp_amount_pb'
import { Payment } from '../Generated/web/legacy/payment_pb'
import { Transaction } from '../Generated/web/legacy/transaction_pb'

/**
 * The network client interface provides a wrapper around network calls to the Xpring Platform.
 */
export interface LegacyXRPNetworkClient {
  getAccountInfo(
    getAccountInfoRequest: GetAccountInfoRequest,
  ): Promise<AccountInfo>
  getFee(getFeeRequest: GetFeeRequest): Promise<Fee>
  submitSignedTransaction(
    submitSignedTransactionRequest: SubmitSignedTransactionRequest,
  ): Promise<SubmitSignedTransactionResponse>
  getLatestValidatedLedgerSequence(
    getLatestValidatedLedgerSequenceRequest: GetLatestValidatedLedgerSequenceRequest,
  ): Promise<LedgerSequence>
  getTransactionStatus(
    getTransactionStatusRequest: GetTransactionStatusRequest,
  ): Promise<TransactionStatus>
  XRPAmount(): XRPAmount
  Payment(): Payment
  Transaction(): Transaction
  SubmitSignedTransactionRequest(): SubmitSignedTransactionRequest
  GetLatestValidatedLedgerSequenceRequest(): GetLatestValidatedLedgerSequenceRequest
  GetTransactionStatusRequest(): GetTransactionStatusRequest
  GetAccountInfoRequest(): GetAccountInfoRequest
  GetFeeRequest(): GetFeeRequest
}
