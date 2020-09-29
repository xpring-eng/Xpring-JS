import { XrpError, XrpErrorType } from '..'
import { OfferCreate } from '../Generated/web/org/xrpl/rpc/v1/transaction_pb'
import XrpCurrencyAmount from './xrp-currency-amount'

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
export default class XrpOfferCreate {
  /**
   * Constructs an XrpOfferCreate from an OfferCreate protocol buffer.
   *
   * @param offerCreate an OfferCreate (protobuf object) whose field values will be used to construct an XrpOfferCreate
   * @return an XrpOfferCreate with its fields set via the analogous protobuf fields.
   * @see https://github.com/ripple/rippled/blob/3d86b49dae8173344b39deb75e53170a9b6c5284/src/ripple/proto/org/xrpl/rpc/v1/transaction.proto#L212
   */
  public static from(offerCreate: OfferCreate): XrpOfferCreate {
    // takerGets and takerPays are required fields
    const takerGetsCurrencyAmount = offerCreate.getTakerGets()?.getValue()
    if (!takerGetsCurrencyAmount) {
      throw new XrpError(
        XrpErrorType.MalformedProtobuf,
        'OfferCreate protobuf is missing `takerGets` field.',
      )
    }
    const takerGets = XrpCurrencyAmount.from(takerGetsCurrencyAmount)

    const takerPaysCurrencyAmount = offerCreate.getTakerPays()?.getValue()
    if (!takerPaysCurrencyAmount) {
      throw new XrpError(
        XrpErrorType.MalformedProtobuf,
        'OfferCreate protobuf is missing `takerPays` field.',
      )
    }
    const takerPays = XrpCurrencyAmount.from(takerPaysCurrencyAmount)
    const expiration = offerCreate.getExpiration()?.getValue()
    const offerSequence = offerCreate.getOfferSequence()?.getValue()

    return new XrpOfferCreate(takerGets, takerPays, expiration, offerSequence)
  }

  /**
   * @param takerGets The amount and type of currency being provided by the offer creator.
   * @param takerPays The amount and type of currency being requested by the offer creator.
   * @param expiration (Optional) Time after which the offer is no longer active, in seconds since the Ripple Epoch.
   * @param offerSequence (Optional) An offer to delete first, specified in the same way as OfferCancel.
   */
  private constructor(
    readonly takerGets: XrpCurrencyAmount,
    readonly takerPays: XrpCurrencyAmount,
    readonly expiration?: number,
    readonly offerSequence?: number,
  ) {}
}
