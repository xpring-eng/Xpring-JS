import { CheckCreate } from '../Generated/web/org/xrpl/rpc/v1/transaction_pb'
import { XRPCurrencyAmount } from '.'

/*
 * Represents a CheckCreate transaction on the XRP Ledger.
 * A CheckCreate transaction creates a Check object in the ledger, which is a deferred payment that can be cashed
 * by its intended destination.  The sender of this transaction is the sender of the Check.
 *
 * @see: https://xrpl.org/checkcreate.html
 */
export default class XRPCheckCreate {
  /**
   * Constructs an XRPCheckCreate from a CheckCreate protocol buffer.
   *
   * @param checkCreate a CheckCreate (protobuf object) whose field values will be used to construct an XRPCheckCreate
   * @return an XRPCheckCreate with its fields set via the analogous protobuf fields.
   * @see https://github.com/ripple/rippled/blob/3d86b49dae8173344b39deb75e53170a9b6c5284/src/ripple/proto/org/xrpl/rpc/v1/transaction.proto#L145
   */
  public static from(checkCreate: CheckCreate): XRPCheckCreate | undefined {
    const destination = checkCreate.getDestination()?.getValue()?.getAddress()
    if (!destination) {
      return undefined
    }

    const sendMaxCurrencyAmount = checkCreate.getSendMax()?.getValue()
    if (!sendMaxCurrencyAmount) {
      return undefined
    }
    const sendMax = XRPCurrencyAmount.from(sendMaxCurrencyAmount)

    const destinationTag = checkCreate.getDestinationTag()?.getValue()
    const expiration = checkCreate.getExpiration()?.getValue()
    const invoiceId = checkCreate.getInvoiceId()?.getValue_asB64()
    return new XRPCheckCreate(
      destination,
      sendMax,
      destinationTag,
      expiration,
      invoiceId,
    )
  }

  /**
   * @param destination The unique address of the account that can cash the Check.
   * @param sendMax Maximum amount of source currency the Check is allowed to debit the sender, including transfer fees on non-XRP currencies.
   *                The Check can only credit the destination with the same currency (from the same issuer, for non-XRP currencies).
   *                For non-XRP amounts, the nested field names MUST be lower-case.
   * @param destinationTag (Optional) Arbitrary tag that identifies the reason for the Check, or a hosted recipient to pay.
   * @param expiration (Optional) Time after which the Check is no longer valid, in seconds since the Ripple Epoch.
   * @param invoiceId (Optional) Arbitrary 256-bit hash representing a specific reason or identifier for this Check.
   */
  private constructor(
    readonly destination?: string,
    readonly sendMax?: XRPCurrencyAmount,
    readonly destinationTag?: number,
    readonly expiration?: number,
    readonly invoiceId?: string,
  ) {}
}
