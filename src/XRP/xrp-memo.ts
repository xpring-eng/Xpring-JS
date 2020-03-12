import { Memo } from '../generated/web/org/xrpl/rpc/v1/transaction_pb'

/*
 * Represents a memo on the XRPLedger.
 * @see: https://xrpl.org/transaction-common-fields.html#memos-field
 */
export default class XRPMemo {
  public static from(memo: Memo): XRPMemo | undefined {
    const data = memo.getMemoData()?.getValue()
    const format = memo.getMemoFormat()?.getValue()
    const type = memo.getMemoType()?.getValue()
    return new XRPMemo(data, format, type)
  }

  private constructor(
    readonly data?: Uint8Array | string,
    readonly format?: Uint8Array | string,
    readonly type?: Uint8Array | string,
  ) {}
}
