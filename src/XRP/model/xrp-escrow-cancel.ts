import { Utils } from 'xpring-common-js'
import { EscrowCancel } from '../Generated/web/org/xrpl/rpc/v1/transaction_pb'
import XrplNetwork from '../../Common/xrpl-network'

/*
 * Represents an EscrowCancel transaction on the XRP Ledger.
 *
 * An EscrowCancel transaction returns escrowed XRP to the sender.
 *
 * @see: https://xrpl.org/escrowcancel.html
 */
export default class XrpEscrowCancel {
  /**
   * Constructs an XrpEscrowCancel from an EscrowCancel protocol buffer.
   *
   * @param escrowCancel an EscrowCancel (protobuf object) whose field values will be used to construct an XrpEscrowCancel
   * @return an XrpEscrowCancel with its fields set via the analogous protobuf fields.
   * @see https://github.com/ripple/rippled/blob/3d86b49dae8173344b39deb75e53170a9b6c5284/src/ripple/proto/org/xrpl/rpc/v1/transaction.proto#L170
   */
  public static from(
    escrowCancel: EscrowCancel,
    xrplNetwork: XrplNetwork,
  ): XrpEscrowCancel | undefined {
    const owner = escrowCancel.getOwner()?.getValue()?.getAddress()
    if (!owner) {
      return undefined
    }
    const ownerXAddress = Utils.encodeXAddress(
      owner,
      undefined,
      xrplNetwork == XrplNetwork.Test || xrplNetwork == XrplNetwork.Dev,
    )
    const offerSequence = escrowCancel.getOfferSequence()?.getValue()

    // ownerXAddress and offerSequence are both required fields.
    if (!ownerXAddress || !offerSequence) {
      return undefined
    }
    return new XrpEscrowCancel(ownerXAddress, offerSequence)
  }

  /**
   * @param ownerXAddress Address of the source account that funded the escrow payment, encoded as an X-address (see https://xrpaddress.info/).
   * @param offerSequence Transaction sequence of EscrowCreate transaction that created the escrow to cancel.
   */
  private constructor(
    readonly ownerXAddress: string,
    readonly offerSequence: number,
  ) {}
}
