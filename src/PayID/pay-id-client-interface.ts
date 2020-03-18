/**
 * An interface for a PayID client.
 *
 * @warning This class is experimental and should not be used in production applications.
 */
export default interface PayIDClient {
  /**
   * Retrieve the XRP Address authorized with a PayID.
   *
   * @note The returned value will always be in an X-Address format.
   *
   * @param payID The payID to resolve for an address.
   * @returns An XRP address representing the given PayID if one exists, otherwise undefined.
   */
  //
  xrpAddressForPayID(payID: string): Promise<string | undefined>
}
