import { Utils } from 'xpring-common-js'
import { AccountDelete } from '../Generated/web/org/xrpl/rpc/v1/transaction_pb'
import XrplNetwork from '../../Common/xrpl-network'

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
  ): XrpAccountDelete | undefined {
    const destination = accountDelete.getDestination()?.getValue()?.getAddress()
    if (!destination) {
      return undefined
    }
    const destinationTag = accountDelete.getDestinationTag()?.getValue()

    const destinationXAddress = Utils.encodeXAddress(
      destination,
      destinationTag,
      xrplNetwork == XrplNetwork.Test,
    )
    if (!destinationXAddress) {
      return undefined
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
