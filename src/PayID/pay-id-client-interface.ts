/**
 * An interface for a PayID client.
 */
export default interface PayIDClient {
  /**
   * Retrieve the XRP Address associated with a PayID.
   *
   * @note The returned value will always be in an X-Address format.
   *
   * @param payID The payID to resolve for an address.
   * @returns An XRP address representing the given PayID if one exists, otherwise undefined.
   */
  xrpAddressForPayID(payID: string): Promise<string | undefined>
}
