import { Wallet } from 'xpring-common-js'
import { BigInteger } from 'big-integer'
import PayIDClientInterface from '../PayID/pay-id-client-interface'
import XRPClientInterface from '../XRP/xrp-client-interface'

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
  constructor(
    private readonly payIDClient: PayIDClientInterface,
    private readonly xrpClient: XRPClientInterface,
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
    const destinationAddress = await this.payIDClient.xrpAddressForPayID(
      destinationPayID,
    )

    // Transact XRP to the resolved address.
    return this.xrpClient.send(amount, destinationAddress, sender)
  }
}
