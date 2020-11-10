import { TrustLineResponse } from './rippled-web-socket-schema'

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
  readonly limitPeer: string

  /**
   * Rate at which the account values incoming balances on this trust line, as a ratio of this value per 1 billion units.
   * (For example, a value of 500 million represents a 0.5:1 ratio.) As a special case, 0 is treated as a 1:1 ratio.
   */
  readonly qualityIn: number

  /**
   * Rate at which the account values outgoing balances on this trust line, as a ratio of this value per 1 billion units.
   * (For example, a value of 500 million represents a 0.5:1 ratio.) As a special case, 0 is treated as a 1:1 ratio.
   */
  readonly qualityOut: number

  /** True if this account has enabled the No Ripple flag for this line, otherwise false.
   * @see https://xrpl.org/rippling.html
   */
  readonly noRipple: boolean

  /** True if the peer account has enabled the No Ripple flag, otherwise false.
   * @see https://xrpl.org/rippling.html
   */
  readonly noRipplePeer: boolean

  /**
   * True if this account has authorized this trust line, otherwise false.
   * @see https://xrpl.org/authorized-trust-lines.html
   */
  readonly authorized: boolean

  /**
   * True if the peer account has authorized this trust line, otherwise false.
   * @see https://xrpl.org/authorized-trust-lines.html
   */
  readonly peerAuthorized: boolean

  /** True if this account has frozen this trust line, otherwise false.
   * @see https://xrpl.org/freezes.html
   */
  readonly freeze: boolean

  /** True if the peer account has frozen this trust line, otherwise false.
   * @see https://xrpl.org/freezes.html
   */
  readonly freezePeer: boolean

  public constructor(trustLineResponse: TrustLineResponse) {
    this.account = trustLineResponse.account
    this.balance = trustLineResponse.balance
    this.currency = trustLineResponse.currency
    this.limit = trustLineResponse.limit
    this.limitPeer = trustLineResponse.limit_peer
    this.qualityIn = trustLineResponse.quality_in
    this.qualityOut = trustLineResponse.quality_out
    this.noRipple = !!trustLineResponse.no_ripple
    this.noRipplePeer = !!trustLineResponse.no_ripple_peer
    this.authorized = !!trustLineResponse.authorized
    this.peerAuthorized = !!trustLineResponse.peer_authorized
    this.freeze = !!trustLineResponse.freeze
    this.freezePeer = !!trustLineResponse.freeze_peer
  }
}
