import PayIDClient from './pay-id-client'
import XRPLNetwork from '../Common/xrpl-network'

/**
 * Provides functionality for XRP in the PayID protocol.
 */
export default class XRPPayIDClient extends PayIDClient {
  /**
   * @param xrplNetwork The XRP Ledger network that this client attaches to.
   */
  constructor(public readonly xrplNetwork: XRPLNetwork) {
    super(`xrpl-${xrplNetwork}`)
  }

  /**
   * Retrieve the XRP address associated with a PayID.
   *
   * Note: Addresses are always in the X-Address format.
   * @see https://xrpaddress.info/
   *
   * @param payID The payID to resolve for an address.
   * @returns An address representing the given PayID.
   */
  async xrpAddressForPayID(payID: string): Promise<string> {
    const result = await super.addressForPayID(payID)
    return result.address
  }
}
