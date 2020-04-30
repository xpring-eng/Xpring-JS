import { Memo } from '../Generated/org/xrpl/rpc/v1/transaction_pb'

/*
 * Represents a memo on the XRPLedger.
 * @see: https://xrpl.org/transaction-common-fields.html#memos-field
 */
export default class XRPMemo {
  /**
   * Constructs an XRPMemo from a Memo.
   *
   * @param memo a Memo (protobuf object) whose field values will be used
   *              to construct an XRPMemo
   * @return an XRPMemo with its fields set via the analogous protobuf fields.
   * @see https://github.com/ripple/rippled/blob/develop/src/ripple/proto/org/xrpl/rpc/v1/transaction.proto#L80
   */
  public static from(memo: Memo): XRPMemo | undefined {
    const data = memo.getMemoData()?.getValue_asU8()
    const format = memo.getMemoFormat()?.getValue_asU8()
    const type = memo.getMemoType()?.getValue_asU8()
    return new XRPMemo(data, format, type)
  }

  /**
   *
   * @param data Arbitrary hex value, conventionally containing the content of the memo.
   * @param format Hex value representing characters allowed in URLs.  Conventionally containing
   *               information on how the memo is encoded, for example as a MIME type.
   * @param type Hex value representing characters allowed in URLs. Conventionally, a unique
   *               relation (according to RFC 5988) that defines the format of this memo.
   */
  private constructor(
    readonly data?: Uint8Array,
    readonly format?: Uint8Array,
    readonly type?: Uint8Array,
  ) {}
}
