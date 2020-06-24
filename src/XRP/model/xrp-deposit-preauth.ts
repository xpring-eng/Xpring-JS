import { Utils } from 'xpring-common-js'
import { DepositPreauth } from '../Generated/web/org/xrpl/rpc/v1/transaction_pb'
import XrplNetwork from '../../Common/xrpl-network'
/*
 * Represents a DepositPreauth transaction on the XRP Ledger.

 * A DepositPreauth transaction gives another account pre-approval to deliver payments to the sender of this transaction.
 * This is only useful if the sender of this transaction is using (or plans to use) Deposit Authorization.
 *
 * @see: https://xrpl.org/depositpreauth.html
 */
export default class XrpDepositPreauth {
  /**
   * Constructs an XrpDepositPreauth from a DepositPreauth protocol buffer.
   *
   * @param depositPreauth a DepositPreauth (protobuf object) whose field values will be used to construct an XrpDepositPreauth
   * @return an XrpDepositPreauth with its fields set via the analogous protobuf fields.
   * @see https://github.com/ripple/rippled/blob/3d86b49dae8173344b39deb75e53170a9b6c5284/src/ripple/proto/org/xrpl/rpc/v1/transaction.proto#L159
   */
  public static from(
    depositPreauth: DepositPreauth,
    xrplNetwork: XrplNetwork,
  ): XrpDepositPreauth | undefined {
    const authorize = depositPreauth.getAuthorize()?.getValue()?.getAddress()
    const unauthorize = depositPreauth
      .getUnauthorize()
      ?.getValue()
      ?.getAddress()

    let authorizeXAddress
    let unauthorizeXAddress
    if (authorize) {
      authorizeXAddress = Utils.encodeXAddress(
        authorize,
        undefined,
        xrplNetwork == XrplNetwork.Test || xrplNetwork == XrplNetwork.Dev,
      )
    } else if (unauthorize) {
      unauthorizeXAddress = Utils.encodeXAddress(
        unauthorize,
        undefined,
        xrplNetwork == XrplNetwork.Test || xrplNetwork == XrplNetwork.Dev,
      )
    }
    return new XrpDepositPreauth(authorizeXAddress, unauthorizeXAddress)
  }

  /**
   * Note: authorize and unauthorize are mutually exclusive fields: one but not both should be set.
   *       Addresses are encoded as X-addresses.  See https://xrpaddress.info/.
   * @param authorizeXAddress (Optional) The XRP Ledger address of the sender to preauthorize, encoded as an X-address.
   * @param unauthorizeXAddress (Optional) The XRP Ledger address of a sender whose preauthorization should be revoked,
   *                            encoded as an X-address.
   */
  private constructor(
    readonly authorizeXAddress?: string,
    readonly unauthorizeXAddress?: string,
  ) {}
}
