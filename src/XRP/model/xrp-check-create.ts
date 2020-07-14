import { XrpUtils } from 'xpring-common-js'
import { CheckCreate } from '../Generated/web/org/xrpl/rpc/v1/transaction_pb'
import XrpCurrencyAmount from './xrp-currency-amount'
import XrplNetwork from '../../Common/xrpl-network'

/*
 * Represents a CheckCreate transaction on the XRP Ledger.
 *
 * A CheckCreate transaction creates a Check object in the ledger, which is a deferred payment that can be cashed
 * by its intended destination.  The sender of this transaction is the sender of the Check.
 *
 * @see: https://xrpl.org/checkcreate.html
 */
export default class XrpCheckCreate {
  /**
   * Constructs an XrpCheckCreate from a CheckCreate protocol buffer.
   *
   * @param checkCreate a CheckCreate (protobuf object) whose field values will be used to construct an XrpCheckCreate
   * @return an XrpCheckCreate with its fields set via the analogous protobuf fields.
   * @see https://github.com/ripple/rippled/blob/3d86b49dae8173344b39deb75e53170a9b6c5284/src/ripple/proto/org/xrpl/rpc/v1/transaction.proto#L145
   */
  public static from(
    checkCreate: CheckCreate,
    xrplNetwork: XrplNetwork,
  ): XrpCheckCreate | undefined {
    const destination = checkCreate.getDestination()?.getValue()?.getAddress()
    if (!destination) {
      return undefined
    }
    const destinationTag = checkCreate.getDestinationTag()?.getValue()

    const destinationXAddress = XrpUtils.encodeXAddress(
      destination,
      destinationTag,
      xrplNetwork == XrplNetwork.Test || xrplNetwork == XrplNetwork.Dev,
    )
    if (!destinationXAddress) {
      return undefined
    }

    const sendMaxCurrencyAmount = checkCreate.getSendMax()?.getValue()
    if (!sendMaxCurrencyAmount) {
      return undefined
    }
    const sendMax = XrpCurrencyAmount.from(sendMaxCurrencyAmount)
    if (!sendMax) {
      return undefined
    }
    const expiration = checkCreate.getExpiration()?.getValue()
    const invoiceId = checkCreate.getInvoiceId()?.getValue_asB64()
    return new XrpCheckCreate(
      destinationXAddress,
      sendMax,
      expiration,
      invoiceId,
    )
  }

  /**
   * @param destinationXAddress The unique address and (optional) destination tag of the account that can cash the Check,
   *                            encoded as an X-address (see https://xrpaddress.info/).
   * @param sendMax Maximum amount of source currency the Check is allowed to debit the sender, including transfer fees on non-XRP currencies.
   *                The Check can only credit the destination with the same currency (from the same issuer, for non-XRP currencies).
   *                For non-XRP amounts, the nested field names MUST be lower-case.
   * @param expiration (Optional) Time after which the Check is no longer valid, in seconds since the Ripple Epoch.
   * @param invoiceId (Optional) Arbitrary 256-bit hash representing a specific reason or identifier for this Check.
   */
  private constructor(
    readonly destinationXAddress: string,
    readonly sendMax: XrpCurrencyAmount,
    readonly expiration?: number,
    readonly invoiceId?: string,
  ) {}
}
