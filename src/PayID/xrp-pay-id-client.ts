import { Utils } from 'xpring-common-js'
import PayIDClient from './pay-id-client'
import XRPLNetwork from '../Common/xrpl-network'
import PayIDError, { PayIDErrorType } from './pay-id-error'
import XRPPayIDClientInterface from './xrp-pay-id-client-interface'

/**
 * Provides functionality for XRP in the PayID protocol.
 */
export default class XRPPayIDClient extends PayIDClient
  implements XRPPayIDClientInterface {
  /**
   * @param xrplNetwork The XRP Ledger network that this client attaches to.
   * @param useHttps Whether to use HTTPS when making PayID requests. Most users should set this to 'true' to avoid
   *                 Man-in-the-Middle attacks. Exposed as an option for testing purposes. Defaults to true.
   */
  constructor(public readonly xrplNetwork: XRPLNetwork, useHttps = true) {
    super(`xrpl-${xrplNetwork}`, useHttps)
  }

  /**
   * Retrieve the XRP address associated with a PayID.
   *
   * Note: Addresses are always in the X-Address format.
   * @see https://xrpaddress.info/
   *
   * @param payID The payID to resolve for an address.
   * @returns An XRP address representing the given PayID.
   */
  async xrpAddressForPayID(payID: string): Promise<string> {
    const result = await super.addressForPayID(payID)

    const { address } = result
    if (Utils.isValidXAddress(address)) {
      return address
    }
    const isTest = this.network !== XRPLNetwork.Main

    const tag = result.tag ? Number(result.tag) : undefined

    // Ensure if there was a tag attached that it could be parsed to a number.
    if (result.tag && tag === undefined) {
      throw new PayIDError(
        PayIDErrorType.UnexpectedResponse,
        'The returned tag was in an unexpected format',
      )
    }

    const encodedXAddress = Utils.encodeXAddress(address, tag, isTest)
    if (!encodedXAddress) {
      throw new PayIDError(
        PayIDErrorType.UnexpectedResponse,
        'The returned address was in an unexpected format',
      )
    }
    return encodedXAddress
  }
}
