/* eslint-disable @typescript-eslint/require-await */
// TODO(keefertaylor): Enable lint rules when method is implemented.
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-classes-per-file */

/**
 * Error messages from PayIDClient.
 */
export class PayIDClientErrorMessages {
  public static readonly unimplemented = 'Unimplemented.'
}

/**
 * A client for Xpring's PayID service.
 *
 * Inputs to this class are always in X-Addresses.
 * @see https://xrpaddress.info/
 *
 * @warning This class is experimental and should not be used in production applications.
 * TODO(keefertaylor): Export this class in index.ts when it's ready for external consumption.
 */
export default class PayIDClient {
  /**
   * Initialize a new PayID client.
   *
   * TODO(keefertaylor): Add a remoteURL configuration property when it is used, otherwise the linter is upset about an unused property.
   *
   * @param authorizationToken An optional token to authorize write requests. Defaults to undefined.
   */
  public constructor(
    private readonly authorizationToken: string | undefined = undefined,
  ) {}

  /**
   * Returns whether this client is able to perform updates on a user's ID to address mapping
   */
  public isAuthorizedForUpdates(): boolean {
    return this.authorizationToken !== undefined
  }

  /**
   * Retrieve the XRP Address authorized with a PayID.
   *
   * @note The returned value will always be in an X-Address format.
   *
   * @param payID The payID to resolve for an address.
   * @returns An XRP address representing the given PayID if one exists, otherwise undefined.
   */
  public async xrpAddressForPayID(_payID: string): Promise<string | undefined> {
    // TODO(keefertaylor): Implement reads from backend service.
    return undefined
  }

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
    // TODO(keefertaylor): Implement writes from backend service.
    return false
  }
}
