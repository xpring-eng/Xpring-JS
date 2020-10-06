import { BigInteger } from 'big-integer'
import { Wallet } from 'xpring-common-js'
import XrpMemo from '../protobuf-wrappers/xrp-memo'

/**
 * Describes the fine grained details for sending money over the XRP ledger. The
 * destination field may be a PayID, XAddress, or other type of address. Handling
 * of the given destination type is the responsibility of the client.
 */
export default interface SendXrpDetails {
  amount: BigInteger | number | string
  destination: string
  sender: Wallet

  memoList?: Array<XrpMemo>
}
