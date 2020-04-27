import { Utils } from 'xpring-common-js'
import PayIDClient from './pay-id-client'
import XRPLNetwork from '../Common/xrpl-network'
import { PayIDError } from '..'
import { PayIDErrorType } from './pay-id-error'

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

    const { address } = result
    if (Utils.isValidXAddress(result.address)) {
      return address
    }
    const isTest = !(this.network === XRPLNetwork.Main)
    const encodedXAddress = Utils.encodeXAddress(address, result.tag, isTest)
    if (!encodedXAddress) {
      throw new PayIDError(
        PayIDErrorType.UnexpectedResponse,
        'The returned address was in an unexpected format',
      )
    }
    return encodedXAddress
  }
}
