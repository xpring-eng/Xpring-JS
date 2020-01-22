/** Abstraction around raw Transaction Status for compatibility. */
export default interface RawTransactionStatus {
  getValidated(): boolean
  getTransactionStatusCode(): string
  getLastLedgerSequence(): number
}
