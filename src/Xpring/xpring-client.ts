import { Wallet } from 'xpring-common-js'
import { BigInteger } from 'big-integer'
import { PayIDClient } from '..'
import XRPClient from '../xrp-client'
import { XRPLNetwork } from '../PayID/pay-id-client'

/**
 * Composes interactions of all Xpring services.
 */
export default class XpringClient {
  /**
   * Create a new XpringClient.
   *
   * @param network The network that interactions will take place on.
   * @param payIDClient A Pay ID Client used to interact with the Pay ID protocol.
   * @param xrpClient An XRP Client used to interact with the XRP Ledger protocol.
   */
  // TODO(keefertaylor): Make these parameters interfaces rather than concrete class implementations.
  constructor(
    private readonly network: XRPLNetwork,
    private readonly payIDClient: PayIDClient,
    private readonly xrpClient: XRPClient,
  ) {}

  /**
   * Send the given amount of XRP from the source wallet to the destination Pay ID.
   *
   * @param drops A `BigInteger`, number or numeric string representing the number of drops to send.
   * @param destinationPayID A destination Pay ID to send the drops to.
   * @param sender The wallet that XRP will be sent from and which will sign the request.
   * @returns A promise which resolves to a string representing the hash of the submitted transaction.
   */
  public async send(
    amount: BigInteger | number | string,
    destinationPayID: string,
    sender: Wallet,
  ): Promise<string> {
    // Resolve the destination address to an XRP address.
    const destination = await this.payIDClient.xrpAddressForPayID(
      destinationPayID,
      this.network,
    )
    return this.xrpClient.send(amount, destination, sender)
  }
}
