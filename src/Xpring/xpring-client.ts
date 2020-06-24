import { Wallet } from 'xpring-common-js'
import { BigInteger } from 'big-integer'
import XrpPayIdClientInterface from '../PayID/xrp-pay-id-client-interface'
import XrpClientInterface, {
  XRPClientInterface,
} from '../XRP/xrp-client-interface'
import XpringError from './xpring-error'
import SendXrpDetails from '../XRP/model/send-xrp-details'

/**
 * Composes interactions of Xpring services.
 */
export default class XpringClient {
  private readonly payIdClient: XrpPayIdClientInterface

  /**
   * Create a new XpringClient.
   *
   * @param payIdClient A Pay ID Client used to interact with the Pay ID protocol.
   * @param xrpClient An XRP Client used to interact with the XRP Ledger protocol.
   * @throws A XpringError if the networks of the inputs do not match.
   */
  constructor(
    payIdClient: XrpPayIdClientInterface,
    private readonly xrpClient: XRPClientInterface | XrpClientInterface,
  ) {
    this.payIdClient = payIdClient

    // Verify that networks match.
    const payIdNetwork = payIdClient.xrplNetwork
    const xrpNetwork = xrpClient.network
    if (payIdNetwork !== xrpNetwork) {
      throw XpringError.mismatchedNetworks
    }
  }

  /**
   * Send the given amount of XRP from the source wallet to the destination Pay ID.
   *
   * @param amount A `BigInteger`, number or numeric string representing the number of drops to send.
   * @param destinationPayID A destination Pay ID to send the drops to.
   * @param sender The wallet that XRP will be sent from and which will sign the request.
   * @returns A promise which resolves to a string representing the hash of the submitted transaction.
   */
  public async send(
    amount: BigInteger | number | string,
    destinationPayID: string,
    sender: Wallet,
  ): Promise<string> {
    return this.sendWithDetails({
      amount,
      destination: destinationPayID,
      sender,
    })
  }

  /**
   * Send the given amount of XRP from the source wallet to the destination Pay ID, allowing
   * for additional details to be specified for use with supplementary features of the XRP
   * ledger.
   *
   * @param sendMoneyDetails - a wrapper object containing details for constructing a transaction.
   * @returns A promise which resolves to a string representing the hash of the submitted transaction.
   */
  public async sendWithDetails(
    sendMoneyDetails: SendXrpDetails,
  ): Promise<string> {
    const {
      amount,
      destination: destinationPayID,
      sender,
      memos,
    } = sendMoneyDetails
    // Resolve the destination address to an XRP address.
    const destinationAddress = await this.payIdClient.xrpAddressForPayId(
      destinationPayID,
    )

    // Transact XRP to the resolved address.
    const transactionHash = await this.xrpClient.sendWithDetails({
      amount,
      destination: destinationAddress,
      sender,
      memos,
    })

    return transactionHash
  }
}
