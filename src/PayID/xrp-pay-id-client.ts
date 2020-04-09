import PayIDClient from './pay-id-client'
import XRPLNetwork from '../Common/xrpl-network'

export default class XRPPayIDClient extends PayIDClient {
  constructor(public readonly xrplNetwork: XRPLNetwork) {
    super(`xrpl-${xrplNetwork}`)
    console.log(this.network)
  }
}
