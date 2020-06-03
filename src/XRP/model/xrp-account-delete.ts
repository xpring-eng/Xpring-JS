import { AccountDelete } from '../Generated/web/org/xrpl/rpc/v1/transaction_pb'

/*
 * Represents an AccountDelete transaction on the XRP Ledger.
 * An AccountDelete transaction deletes an account and any objects it owns in the XRP Ledger,
 * if possible, sending the account's remaining XRP to a specified destination account.
 *
 * @see: https://xrpl.org/accountdelete.html
 */
export default class XRPAccountDelete {
  /**
   * Constructs an XRPAccountDelete from an AccountDelete protocol buffer.
   *
   * @param accountDelete an AccountDelete (protobuf object) whose field values will be used
   *                to construct an XRPAccountDelete
   * @return an XRPAccountDelete with its fields set via the analogous protobuf fields.
   * @see https://github.com/ripple/rippled/blob/3d86b49dae8173344b39deb75e53170a9b6c5284/src/ripple/proto/org/xrpl/rpc/v1/transaction.proto#L118
   */
  public static from(
    accountDelete: AccountDelete,
  ): XRPAccountDelete | undefined {
    // TODO(amiecorso): decide whether the existence of `destination` needs to be policed here
    //                  via returning undefined or throwing an error
    // TODO(amiecorso): should this object have an X-address version of this information?
    const destination = accountDelete.getDestination()?.getValue()?.getAddress()
    const destinationTag = accountDelete.getDestinationTag()?.getValue()

    return new XRPAccountDelete(destination, destinationTag)
  }

  /**
   *
   * @param destination The address of an account to receive any leftover XRP after deleting the sending account.
   *                    Must be a funded account in the ledger, and must not be the sending account.
   * @param destinationTag (Optional) Arbitrary destination tag that identifies a hosted recipient ors
   *                       other information for the recipient of the deleted account's leftover XRP.
   */
  private constructor(
    readonly destination?: string,
    readonly destinationTag?: number,
  ) {}
}
