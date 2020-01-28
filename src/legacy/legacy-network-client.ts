// Web Imports
import { AccountInfo as AccountInfoWeb } from '../generated/web/legacy/account_info_pb'
import { Fee as FeeWeb } from '../generated/web/legacy/fee_pb'
import { GetAccountInfoRequest as GetAccountInfoRequestWeb } from '../generated/web/legacy/get_account_info_request_pb'
import { GetFeeRequest as GetFeeRequestWeb } from '../generated/web/legacy/get_fee_request_pb'
import { SubmitSignedTransactionRequest as SubmitSignedTransactionRequestWeb } from '../generated/web/legacy/submit_signed_transaction_request_pb'
import { SubmitSignedTransactionResponse as SubmitSignedTransactionResponseWeb } from '../generated/web/legacy/submit_signed_transaction_response_pb'
import { GetLatestValidatedLedgerSequenceRequest as GetLatestValidatedLedgerSequenceRequestWeb } from '../generated/web/legacy/get_latest_validated_ledger_sequence_request_pb'
import { LedgerSequence as LedgerSequenceWeb } from '../generated/web/legacy/ledger_sequence_pb'
import { GetTransactionStatusRequest as GetTransactionStatusRequestWeb } from '../generated/web/legacy/get_transaction_status_request_pb'
import { TransactionStatus as TransactionStatusWeb } from '../generated/web/legacy/transaction_status_pb'

// Node Imports
import { AccountInfo as AccountInfoNode } from '../generated/node/legacy/account_info_pb'
import { Fee as FeeNode } from '../generated/node/legacy/fee_pb'
import { GetAccountInfoRequest as GetAccountInfoRequestNode } from '../generated/node/legacy/get_account_info_request_pb'
import { GetFeeRequest as GetFeeRequestNode } from '../generated/node/legacy/get_fee_request_pb'
import { SubmitSignedTransactionRequest as SubmitSignedTransactionRequestNode } from '../generated/node/legacy/submit_signed_transaction_request_pb'
import { SubmitSignedTransactionResponse as SubmitSignedTransactionResponseNode } from '../generated/node/legacy/submit_signed_transaction_response_pb'
import { GetLatestValidatedLedgerSequenceRequest as GetLatestValidatedLedgerSequenceRequestNode } from '../generated/node/legacy/get_latest_validated_ledger_sequence_request_pb'
import { LedgerSequence as LedgerSequenceNode } from '../generated/node/legacy/ledger_sequence_pb'
import { GetTransactionStatusRequest as GetTransactionStatusRequestNode } from '../generated/node/legacy/get_transaction_status_request_pb'
import { TransactionStatus as TransactionStatusNode } from '../generated/node/legacy/transaction_status_pb'

/**
 * The network client interface provides a wrapper around network calls to the Xpring Platform.
 */
export interface LegacyNetworkClient {
  getAccountInfo(
    getAccountInfoRequest: GetAccountInfoRequestWeb,
  ): Promise<AccountInfoWeb>
  getAccountInfo(
    getAccountInfoRequest: GetAccountInfoRequestNode,
  ): Promise<AccountInfoNode>
  getFee(getFeeRequest: GetFeeRequestWeb): Promise<FeeWeb>
  getFee(getFeeRequest: GetFeeRequestNode): Promise<FeeNode>
  submitSignedTransaction(
    submitSignedTransactionRequest: SubmitSignedTransactionRequestWeb,
  ): Promise<SubmitSignedTransactionResponseWeb>
  submitSignedTransaction(
    submitSignedTransactionRequest: SubmitSignedTransactionRequestNode,
  ): Promise<SubmitSignedTransactionResponseNode>
  getLatestValidatedLedgerSequence(
    getLatestValidatedLedgerSequenceRequest: GetLatestValidatedLedgerSequenceRequestWeb,
  ): Promise<LedgerSequenceWeb>
  getLatestValidatedLedgerSequence(
    getLatestValidatedLedgerSequenceRequest: GetLatestValidatedLedgerSequenceRequestNode,
  ): Promise<LedgerSequenceNode>
  getTransactionStatus(
    getTransactionStatusRequest: GetTransactionStatusRequestWeb,
  ): Promise<TransactionStatusWeb>
  getTransactionStatus(
    getTransactionStatusRequest: GetTransactionStatusRequestNode,
  ): Promise<TransactionStatusNode>
}
