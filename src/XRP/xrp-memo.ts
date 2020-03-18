import { Memo } from '../generated/web/org/xrpl/rpc/v1/transaction_pb'

/*
 * Represents a memo on the XRPLedger.
 * @see: https://xrpl.org/transaction-common-fields.html#memos-field
 */
export default class XRPMemo {
  public static from(memo: Memo): XRPMemo | undefined {
    const data = memo.getMemoData()?.getValue_asU8()
    const format = memo.getMemoFormat()?.getValue_asU8()
    const type = memo.getMemoType()?.getValue_asU8()
    return new XRPMemo(data, format, type)
  }

  private constructor(
    readonly data?: Uint8Array,
    readonly format?: Uint8Array,
    readonly type?: Uint8Array,
  ) {}
}
