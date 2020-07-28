import XrplNetwork from 'xpring-common-js'

export default interface XrpPayIdClientInterface {
  /**
   * @param network The network that addresses will be resolved on.
   */
  xrplNetwork: XrplNetwork

  /**
   * Retrieve the XRP Address associated with a PayID.
   *
   * @note The returned value will always be in an X-Address format.
   *
   * @param payId The PayID to resolve for an address.
   * @returns An XRP address representing the given PayID.
   */
  xrpAddressForPayId(payId: string): Promise<string>
}
