import { XrpError, XrpErrorType } from '..'
import { XrplNetwork } from 'xpring-common-js'
import XrpUtils from '../xrp-utils'
import { AccountDelete } from '../Generated/web/org/xrpl/rpc/v1/transaction_pb'

/*
 * Represents an AccountDelete transaction on the XRP Ledger.
 *
 * An AccountDelete transaction deletes an account and any objects it owns in the XRP Ledger,
 * if possible, sending the account's remaining XRP to a specified destination account.
 *
 * @see: https://xrpl.org/accountdelete.html
 */
export default class XrpAccountDelete {
  /**
   * Constructs an XrpAccountDelete from an AccountDelete protocol buffer.
   *
   * @param accountDelete an AccountDelete (protobuf object) whose field values will be used
   *                to construct an XrpAccountDelete
   * @return an XrpAccountDelete with its fields set via the analogous protobuf fields.
   * @see https://github.com/ripple/rippled/blob/3d86b49dae8173344b39deb75e53170a9b6c5284/src/ripple/proto/org/xrpl/rpc/v1/transaction.proto#L118
   */
  public static from(
    accountDelete: AccountDelete,
    xrplNetwork: XrplNetwork,
  ): XrpAccountDelete {
    const destination = accountDelete.getDestination()?.getValue()?.getAddress()
    if (!destination) {
      throw new XrpError(
        XrpErrorType.MalformedProtobuf,
        'AccountDelete protobuf is missing `destination` field.',
      )
    }
    const destinationTag = accountDelete.getDestinationTag()?.getValue()

    const destinationXAddress = XrpUtils.encodeXAddress(
      destination,
      destinationTag,
      xrplNetwork == XrplNetwork.Test,
    )
    if (!destinationXAddress) {
      throw new XrpError(
        XrpErrorType.MalformedProtobuf,
        'Cannot construct XAddress from AccountDelete protobuf `destination` and `destinationTag` fields.',
      )
    }
    return new XrpAccountDelete(destinationXAddress)
  }

  /**
   * @param destinationXAddress The address and destination tag of an account to receive any leftover XRP after deleting the
   *                            sending account, encoded as an X-address (see https://xrpaddress.info/).
   *                            Must be a funded account in the ledger, and must not be the sending account.
   */
  private constructor(readonly destinationXAddress: string) {}
}
