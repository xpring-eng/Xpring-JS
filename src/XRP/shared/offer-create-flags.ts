/**
 * Flags used in OfferCreate transactions.
 *
 * @see https://xrpl.org/offercreate.html#offercreate-flags
 */
class OfferCreateFlags {
  static TF_PASSIVE = 0x00010000
  static TF_IMMEDIATE_OR_CANCEL = 0x00020000
  static TF_FILL_OR_KILL = 0x00040000
  static TF_SELL = 0x00080000
}

export default OfferCreateFlags
