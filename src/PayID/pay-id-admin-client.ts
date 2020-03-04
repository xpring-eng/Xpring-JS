import PayIDError from './pay-id-error'

/* eslint-disable @typescript-eslint/require-await */
// TODO(keefertaylor): Enable lint rules when method is implemented.
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-classes-per-file */

/**
 * An admin for Xpring's PayID service.
 *
 * Admin clients can update address mappings. To resolve PayIDs to addresses, please use `PayIDClient`.
 *
 * Inputs to this class are always in X-Addresses.
 * @see https://xrpaddress.info/
 *
 * @warning This class is experimental and should not be used in production applications.
 * TODO(keefertaylor): Export this class in index.ts when it's ready for external consumption.
 */
export default class PayIDAdminClient {
  private static putEndpoint = '/put'

  /**
   * Initialize a new PayIDAdminClient.
   *
   * TODO(keefertaylor): Add a remoteURL configuration property when it is used, otherwise the linter is upset about an unused property.
   *
   * @param authorizationToken An authorization token.
   * @param remoteURL The remote URL for the PayID Service.
   */
  public constructor(
    private readonly authorizationToken: string,
    private readonly serviceURL: string,
  ) {}

  /**
   * Update a PayID to XRP address mapping.
   *
   * @note The input address to this method must be in X-Address format.
   *
   * @param payID The payID to update.
   * @param xrpAddress The new XRP address to associate with the payID.
   * @returns A boolean indicating success of the operation.
   */
  public async updateXRPAddressMapping(
    _payID: string,
    _xrpAddress: string,
  ): Promise<boolean> {
    // Print iVars in console.logs to make TypeScript think that they are not unused (otherwise they won't compile).
    // TODO(keefertaylor): Clean this up when this method is implemented.
    const serviceEndpoint = this.serviceURL + PayIDAdminClient.putEndpoint
    console.log(`Hitting: ${serviceEndpoint}`)
    console.log(`Using Token: ${this.authorizationToken}`)

    // TODO(keefertaylor): Implement writes from backend service.
    throw PayIDError.unimplemented
  }
}
