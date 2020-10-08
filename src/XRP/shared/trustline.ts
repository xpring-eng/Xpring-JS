import { TrustLineJson } from './json-schema'

/**
 * Represents a trust line on the XRP Ledger.
 * @see https://xrpl.org/trust-lines-and-issuing.html
 */
export default class TrustLine {
  /** The unique Address of the counterparty to this trust line. */
  readonly account: string

  /**
   * Representation of the numeric balance currently held against this line.
   * A positive balance means that the perspective account holds value;
   * a negative balance means that the perspective account owes value.
   */
  readonly balance: string

  /**
   * A Currency Code identifying what currency this trust line can hold.
   * @see https://xrpl.org/currency-formats.html#currency-codes
   */
  readonly currency: string

  /** The maximum amount of the given currency that this account is willing to owe the peer account. */
  readonly limit: string

  /** The maximum amount of currency that the counterparty account is willing to owe the perspective account. */
  readonly limit_peer: string

  /**
   * Rate at which the account values incoming balances on this trust line, as a ratio of this value per 1 billion units.
   * (For example, a value of 500 million represents a 0.5:1 ratio.) As a special case, 0 is treated as a 1:1 ratio.
   */
  readonly quality_in: number

  /**
   * Rate at which the account values outgoing balances on this trust line, as a ratio of this value per 1 billion units.
   * (For example, a value of 500 million represents a 0.5:1 ratio.) As a special case, 0 is treated as a 1:1 ratio.
   */
  readonly quality_out: number

  /** True if this account has enabled the No Ripple flag for this line, otherwise false.
   * @see https://xrpl.org/rippling.html
   */
  readonly no_ripple: boolean

  /** True if the peer account has enabled the No Ripple flag, otherwise false.
   * @see https://xrpl.org/rippling.html
   */
  readonly no_ripple_peer: boolean

  /**
   * True if this account has authorized this trust line, otherwise false.
   * @see https://xrpl.org/authorized-trust-lines.html
   */
  readonly authorized: boolean

  /**
   * True if the peer account has authorized this trust line, otherwise false.
   * @see https://xrpl.org/authorized-trust-lines.html
   */
  readonly peer_authorized: boolean

  /** True if this account has frozen this trust line, otherwise false.
   * @see https://xrpl.org/freezes.html
   */
  readonly freeze: boolean

  /** True if the peer account has frozen this trust line, otherwise false.
   * @see https://xrpl.org/freezes.html
   */
  readonly freeze_peer: boolean

  public constructor(trustLineJson: TrustLineJson) {
    this.account = trustLineJson.account
    this.balance = trustLineJson.balance
    this.currency = trustLineJson.currency
    this.limit = trustLineJson.limit
    this.limit_peer = trustLineJson.limit_peer
    this.quality_in = trustLineJson.quality_in
    this.quality_out = trustLineJson.quality_out
    this.no_ripple = trustLineJson.no_ripple ? trustLineJson.no_ripple : false
    this.no_ripple_peer = trustLineJson.no_ripple_peer
      ? trustLineJson.no_ripple_peer
      : false
    this.authorized = trustLineJson.authorized
      ? trustLineJson.authorized
      : false
    this.peer_authorized = trustLineJson.peer_authorized
      ? trustLineJson.peer_authorized
      : false
    this.freeze = trustLineJson.freeze ? trustLineJson.freeze : false
    this.freeze_peer = trustLineJson.freeze_peer
      ? trustLineJson.freeze_peer
      : false
  }
}
