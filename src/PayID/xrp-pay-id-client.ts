/* eslint-disable max-classes-per-file */

import { XrplNetwork } from 'xpring-common-js'
import XrpUtils from '../XRP/shared/xrp-utils'
import PayIdClient from './pay-id-client'
import PayIdError, { PayIdErrorType } from './pay-id-error'
import XrpPayIdClientInterface from './xrp-pay-id-client-interface'

/**
 * Provides functionality for XRP in the PayID protocol.
 */
export default class XrpPayIdClient
  extends PayIdClient
  implements XrpPayIdClientInterface {
  /**
   * @param xrplNetwork The XRP Ledger network that this client attaches to.
   * @param useHttps Whether to use HTTPS when making PayID requests. Most users should set this to 'true' to avoid
   *                 Man-in-the-Middle attacks. Exposed as an option for testing purposes. Defaults to true.
   */
  constructor(public readonly xrplNetwork: XrplNetwork, useHttps = true) {
    super(useHttps)
  }

  /**
   * Retrieve the XRP address associated with a PayID.
   *
   * Note: Addresses are always in the X-Address format.
   * @see https://xrpaddress.info/
   *
   * @param payId The PayID to resolve for an address.
   * @returns An XRP address representing the given PayID.
   */
  async xrpAddressForPayId(payId: string): Promise<string> {
    const result = await super.cryptoAddressForPayId(
      payId,
      `xrpl-${this.xrplNetwork}`,
    )

    const { address } = result
    if (XrpUtils.isValidXAddress(address)) {
      return address
    }
    const isTest = this.xrplNetwork !== XrplNetwork.Main

    const tag = result.tag ? Number(result.tag) : undefined

    // Ensure if there was a tag attached that it could be parsed to a number.
    if (result.tag && tag === undefined) {
      throw new PayIdError(
        PayIdErrorType.UnexpectedResponse,
        'The returned tag was in an unexpected format',
      )
    }

    const encodedXAddress = XrpUtils.encodeXAddress(address, tag, isTest)
    if (!encodedXAddress) {
      throw new PayIdError(
        PayIdErrorType.UnexpectedResponse,
        'The returned address was in an unexpected format',
      )
    }
    return encodedXAddress
  }
}
