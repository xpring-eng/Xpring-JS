/**
 * Represents an issued currency on the XRP Ledger.
 * @see https://xrpl.org/currency-formats.html#issued-currency-amounts
 */
export default interface IssuedCurrency {
  issuer: string
  currency: string
  value: string
}
