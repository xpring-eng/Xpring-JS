import { XrpError, XrpErrorType } from '..'
import { OfferCancel } from '../Generated/web/org/xrpl/rpc/v1/transaction_pb'

/*
 * Represents an OfferCancel transaction on the XRP Ledger.
 *
 * An OfferCancel transaction removes an Offer object from the XRP Ledger.
 *
 * @see: https://xrpl.org/offercancel.html
 */
export default class XrpOfferCancel {
  /**
   * Constructs an XrpOfferCancel from an OfferCancel protocol buffer.
   *
   * @param offerCancel an OfferCancel (protobuf object) whose field values will be used to construct an XrpOfferCancel
   * @return an XrpOfferCancel with its fields set via the analogous protobuf fields.
   * @see https://github.com/ripple/rippled/blob/3d86b49dae8173344b39deb75e53170a9b6c5284/src/ripple/proto/org/xrpl/rpc/v1/transaction.proto#L206
   */
  public static from(offerCancel: OfferCancel): XrpOfferCancel {
    const offerSequence = offerCancel.getOfferSequence()?.getValue()
    if (!offerSequence) {
      throw new XrpError(
        XrpErrorType.MalformedProtobuf,
        'OfferCancel protobuf is missing `offerSequence` field.',
      )
    }
    return new XrpOfferCancel(offerSequence)
  }

  /**
   * @param offerSequence The sequence number of a previous OfferCreate transaction. If specified,
   *                      cancel any offer object in the ledger that was created by that transaction.
   *                      It is not considered an error if the offer specified does not exist.
   */
  private constructor(readonly offerSequence: number) {}
}
