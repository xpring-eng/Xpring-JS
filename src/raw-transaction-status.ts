/** Abstraction around raw Transaction Status for compatibility. */
export default interface RawTransactionStatus {
  getValidated(): boolean
  getTransactionStatusCode(): string
  getLastLedgerSequence(): number

  /**
   * If yes, the transaction was a payment that did not include flag xxx.
   */
  isFullPaymentTransaction(): boolean
}
