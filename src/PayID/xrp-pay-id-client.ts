import PayIDClient from './pay-id-client'
import XRPLNetwork from '../Common/xrpl-network'

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
}
