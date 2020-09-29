import { XrpError, XrpErrorType } from '..'
import { Memo } from '../Generated/web/org/xrpl/rpc/v1/transaction_pb'
import { stringToUint8Array } from '../../Common/utils'

/**
 * Provides a means of passing a string to a memo that allows for user
 * specification as to whether or not the string is already a hex string.
 */
export interface MemoField {
  value?: string
  isHex?: boolean
}

/*
 * Represents a memo on the XRPLedger.
 * @see: https://xrpl.org/transaction-common-fields.html#memos-field
 */
export default class XrpMemo {
  /**
   * Constructs an XrpMemo from a Memo.
   *
   * @param memo a Memo (protobuf object) whose field values will be used
   *              to construct an XrpMemo
   * @return an XrpMemo with its fields set via the analogous protobuf fields.
   * @see https://github.com/ripple/rippled/blob/develop/src/ripple/proto/org/xrpl/rpc/v1/transaction.proto#L80
   */
  public static from(memo: Memo): XrpMemo {
    const data = memo.getMemoData()?.getValue_asU8()
    const format = memo.getMemoFormat()?.getValue_asU8()
    const type = memo.getMemoType()?.getValue_asU8()
    if (data == undefined && format == undefined && type == undefined) {
      throw new XrpError(
        XrpErrorType.MalformedProtobuf,
        'Memo protobuf missing all fields (requires at least one field).',
      )
    }
    return new XrpMemo(data, format, type)
  }

  /**
   * Converts strings that may or may not be hex (as indicated by the MemoField argument) into the
   * Uint8Array fields needed for an XrpMemo instance.
   *
   * @param data - a MemoField with an optional string which may or may not be converted to a hex string.
   * @param format - a MemoField with an optional string which may or may not be converted to a hex string.
   * @param type - a MemoField with an optional string which may or may not be converted to a hex string.
   * @returns an XrpMemo with each potentially hex-encoded field set to the Uint8Array version of said field.
   */
  public static fromMemoFields(
    data?: MemoField,
    format?: MemoField,
    type?: MemoField,
  ): XrpMemo {
    const memoData = data
      ? stringToUint8Array(data.value, data.isHex)
      : stringToUint8Array('', false)
    const memoFormat = format
      ? stringToUint8Array(format.value, format.isHex)
      : stringToUint8Array('', false)
    const memoType = type
      ? stringToUint8Array(type.value, type.isHex)
      : stringToUint8Array('', false)
    return {
      data: memoData,
      format: memoFormat,
      type: memoType,
    }
  }

  /**
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
