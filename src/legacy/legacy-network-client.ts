import { AccountInfo } from '../generated/legacy/account_info_pb'
import { Fee } from '../generated/legacy/fee_pb'
import { GetAccountInfoRequest } from '../generated/legacy/get_account_info_request_pb'
import { GetFeeRequest } from '../generated/legacy/get_fee_request_pb'
import { SubmitSignedTransactionRequest } from '../generated/legacy/submit_signed_transaction_request_pb'
import { SubmitSignedTransactionResponse } from '../generated/legacy/submit_signed_transaction_response_pb'
import { GetLatestValidatedLedgerSequenceRequest } from '../generated/legacy/get_latest_validated_ledger_sequence_request_pb'
import { LedgerSequence } from '../generated/legacy/ledger_sequence_pb'
import { GetTransactionStatusRequest } from '../generated/legacy/get_transaction_status_request_pb'
import { TransactionStatus } from '../generated/legacy/transaction_status_pb'

/**
 * The network client interface provides a wrapper around network calls to the Xpring Platform.
 */
export interface LegacyNetworkClient {
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
}
