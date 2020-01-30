import { Wallet } from 'xpring-common-js'
import { AccountInfo } from '../../generated/web/legacy/account_info_pb'
import { Fee } from '../../generated/web/legacy/fee_pb'
import { SubmitSignedTransactionResponse } from '../../generated/web/legacy/submit_signed_transaction_response_pb'
import { LedgerSequence } from '../../generated/web/legacy/ledger_sequence_pb'
import { TransactionStatus } from '../../generated/web/legacy/transaction_status_pb'
import { SignedTransaction } from '../../generated/web/legacy/signed_transaction_pb'

/**
 * The network client interface provides a wrapper around network calls to the Xpring Platform.
 */
export interface LegacyNetworkClient {
  getAccountInfo(address: string): Promise<AccountInfo>
  getFee(): Promise<Fee>
  submitSignedTransaction(
    signedTransaction: SignedTransaction,
  ): Promise<SubmitSignedTransactionResponse>
  getLatestValidatedLedgerSequence(): Promise<LedgerSequence>
  getTransactionStatus(transactionHash: string): Promise<TransactionStatus>
  createSignedTransaction(
    normalizedAmount: string,
    destination: string,
    sender: Wallet,
    ledgerSequenceMargin: number,
  ): Promise<SignedTransaction>
}
