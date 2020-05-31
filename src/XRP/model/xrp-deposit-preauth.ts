import { DepositPreauth } from '../Generated/web/org/xrpl/rpc/v1/transaction_pb'


/*
 * Represents a DepositPreauth transaction on the XRP Ledger.
 *
 * @see:
 */
export default class XRPDepositPreauth {
  /**
   * Constructs an XRPDepositPreauth from a DepositPreauth protocol buffer.
   *
   * @param depositPreauth a DepositPreauth (protobuf object) whose field values will be used to construct an XRPDepositPreauth
   * @return an XRPDepositPreauth with its fields set via the analogous protobuf fields.
   * @see
   */
  public static from(depositPreauth: DepositPreauth): XRPDepositPreauth | undefined {
)
    return new XRPDepositPreauth(
,
    )
  }

  private constructor(

  ) {}
}
