/**
 * Represents an issued currency on the XRP Ledger.
 * @see https://xrpl.org/currency-formats.html#issued-currency-amounts
 *
 * @property currency - Arbitrary three-letter code for currency to issue. Cannot be XRP.
 * @property issuer - The unique XRPL account address of the entity issuing the currency.
 * @property value - Quoted decimal representation of the amount of currency.
 */
export default interface IssuedCurrency {
  currency: string
  issuer: string
  value: string
}
