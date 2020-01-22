import {
  AccountInfo,
  Fee,
  GetAccountInfoRequest,
  GetFeeRequest,
  SubmitSignedTransactionRequest,
  SubmitSignedTransactionResponse,
  GetLatestValidatedLedgerSequenceRequest,
  LedgerSequence,
  GetTransactionStatusRequest,
  TransactionStatus,
} from 'xpring-common-js'

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
