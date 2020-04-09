import XRPLNetwork from '../Common/xrpl-network'

/**
 * An interface for a PayID client.
 */
export default interface PayIDClient {
  /**
   * @param network The network that addresses will be resolved on.
   */
  network: XRPLNetwork

  /**
   * Retrieve the XRP Address associated with a PayID.
   *
   * @note The returned value will always be in an X-Address format.
   *
   * @param payID The payID to resolve for an address.
   * @returns An XRP address representing the given PayID.
   */
  xrpAddressForPayID(payID: string): Promise<string>
}
