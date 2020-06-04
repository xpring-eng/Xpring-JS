import { OfferCreate } from '../Generated/web/org/xrpl/rpc/v1/transaction_pb'
import { XRPCurrencyAmount } from '.'

/*
 * Represents an OfferCreate transaction on the XRP Ledger.
 *
 * An OfferCreate transaction is effectively a limit order.
 * It defines an intent to exchange currencies, and creates
 * an Offer object if not completely fulfilled when placed.
 * Offers can be partially fulfilled.
 *
 * @see: https://xrpl.org/offercreate.html
 */
export default class XRPOfferCreate {
  /**
   * Constructs an XRPOfferCreate from an OfferCreate protocol buffer.
   *
   * @param offerCreate an OfferCreate (protobuf object) whose field values will be used to construct an XRPOfferCreate
   * @return an XRPOfferCreate with its fields set via the analogous protobuf fields.
   * @see https://github.com/ripple/rippled/blob/3d86b49dae8173344b39deb75e53170a9b6c5284/src/ripple/proto/org/xrpl/rpc/v1/transaction.proto#L212
   */
  public static from(offerCreate: OfferCreate): XRPOfferCreate | undefined {
    const expiration = offerCreate.getExpiration()?.getValue()
    const offerSequence = offerCreate.getOfferSequence()?.getValue()

    // takerGets and takerPays are required fields
    const takerGetsCurrencyAmount = offerCreate.getTakerGets()?.getValue()
    if (!takerGetsCurrencyAmount) {
      return undefined
    }
    const takerGets = XRPCurrencyAmount.from(takerGetsCurrencyAmount)
    if (!takerGets) {
      return undefined
    }

    const takerPaysCurrencyAmount = offerCreate.getTakerPays()?.getValue()
    if (!takerPaysCurrencyAmount) {
      return undefined
    }
    const takerPays = XRPCurrencyAmount.from(takerPaysCurrencyAmount)
    if (!takerPays) {
      return undefined
    }

    return new XRPOfferCreate(expiration, offerSequence, takerGets, takerPays)
  }

  /**
   * @param expiration (Optional) Time after which the offer is no longer active, in seconds since the Ripple Epoch.
   * @param offerSequence (Optional) An offer to delete first, specified in the same way as OfferCancel.
   * @param takerGets The amount and type of currency being provided by the offer creator.
   * @param takerPays The amount and type of currency being requested by the offer creator.
   */
  private constructor(
    readonly expiration?: number,
    readonly offerSequence?: number,
    readonly takerGets?: XRPCurrencyAmount,
    readonly takerPays?: XRPCurrencyAmount,
  ) {}
}
