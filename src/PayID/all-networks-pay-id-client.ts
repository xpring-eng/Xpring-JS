import PayIdClientImpl from './pay-id-client-impl'
import { Address } from './Generated/api'

/**
 * A client for PayID protocol which resolves all addresses for a given PayID.
 */
export default class AllNetworksPayIdClient {
  private readonly wrappedPayIdClient: PayIdClientImpl

  /**
   * Initialize a new AllNetworksPayIdClient.

   * @param useHttps Whether to cuse HTTPS when making PayID requests. Most users should set this to 'true' to avoid
   *                 Man-in-the-Middle attacks. Exposed as an option for testing purposes. Defaults to true.
   */
  public constructor(useHttps = true) {
    this.wrappedPayIdClient = new PayIdClientImpl('payid', useHttps)
  }

  /**
   * Retrieve all addresses associated with a PayID.
   *
   * @param payId The PayID to resolve for an address.
   * @returns An array of addresses.
   */
  async allAddressesForPayId(payId: string): Promise<Array<Address>> {
    return this.wrappedPayIdClient.addressForPayId(payId)
  }
}
