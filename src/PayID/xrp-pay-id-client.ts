/* eslint-disable max-classes-per-file */

import { Utils } from 'xpring-common-js'
import PayIdClient, { PayIDClient } from './pay-id-client'
import XrplNetwork, { XRPLNetwork } from '../Common/xrpl-network'
import PayIdError, { PayIdErrorType } from './pay-id-error'
import XrpPayIdClientInterface, {
  XRPPayIDClientInterface,
} from './xrp-pay-id-client-interface'

/**
 * Provides functionality for XRP in the PayID protocol.
 */
export default class XrpPayIdClient extends PayIdClient
  implements XrpPayIdClientInterface {
  /**
   * @param xrplNetwork The XRP Ledger network that this client attaches to.
   * @param useHttps Whether to use HTTPS when making PayID requests. Most users should set this to 'true' to avoid
   *                 Man-in-the-Middle attacks. Exposed as an option for testing purposes. Defaults to true.
   */
  constructor(public readonly xrplNetwork: XrplNetwork, useHttps = true) {
    super(`xrpl-${xrplNetwork}`, useHttps)
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
    const result = await super.addressForPayId(payId)

    const { address } = result
    if (Utils.isValidXAddress(address)) {
      return address
    }
    const isTest = this.network !== XrplNetwork.Main

    const tag = result.tag ? Number(result.tag) : undefined

    // Ensure if there was a tag attached that it could be parsed to a number.
    if (result.tag && tag === undefined) {
      throw new PayIdError(
        PayIdErrorType.UnexpectedResponse,
        'The returned tag was in an unexpected format',
      )
    }

    const encodedXAddress = Utils.encodeXAddress(address, tag, isTest)
    if (!encodedXAddress) {
      throw new PayIdError(
        PayIdErrorType.UnexpectedResponse,
        'The returned address was in an unexpected format',
      )
    }
    return encodedXAddress
  }
}

/**
 * Provides functionality for XRP in the PayID protocol.
 *
 * @deprecated Use XrpPayIdClient instead.
 */
export class XRPPayIDClient extends PayIDClient
  implements XRPPayIDClientInterface {
  private readonly wrappedXrpPayIdClient: XrpPayIdClient

  /**
   * @param xrplNetwork The XRP Ledger network that this client attaches to.
   */
  constructor(public readonly xrplNetwork: XRPLNetwork) {
    super(`xrpl-${xrplNetwork}`)

    switch (xrplNetwork) {
      case XRPLNetwork.Main: {
        this.wrappedXrpPayIdClient = new XrpPayIdClient(XrplNetwork.Main)
        break
      }

      case XRPLNetwork.Test: {
        this.wrappedXrpPayIdClient = new XrpPayIdClient(XrplNetwork.Dev)
        break
      }

      case XRPLNetwork.Dev: {
        this.wrappedXrpPayIdClient = new XrpPayIdClient(XrplNetwork.Dev)
        break
      }

      default:
        throw new PayIdError(PayIdErrorType.Unknown, 'Unknown XrplNetwork')
    }
  }

  /**
   * Retrieve the XRP address associated with a PayID.
   *
   * Note: Addresses are always in the X-Address format.
   * @see https://xrpaddress.info/
   *
   * @param payID The PayID to resolve for an address.
   * @returns An XRP address representing the given PayID.
   */
  async xrpAddressForPayID(payID: string): Promise<string> {
    return this.wrappedXrpPayIdClient.xrpAddressForPayId(payID)
  }
}
