import { Wallet } from 'xpring-common-js'
import { BigInteger } from 'big-integer'
import XrpPayIdClientInterface from '../PayID/xrp-pay-id-client-interface'
import XrpClientInterface from '../XRP/xrp-client-interface'
import XpringError from './xpring-error'
import SendXrpDetails from '../XRP/shared/send-xrp-details'

/**
 * Composes interactions of Xpring services.
 */
export default class XpringClient {
  private readonly payIdClient: XrpPayIdClientInterface

  /**
   * Create a new XpringClient.
   *
   * @param payIdClient A PayID Client used to interact with the PayID protocol.
   * @param xrpClient An XRP Client used to interact with the XRP Ledger protocol.
   * @throws A XpringError if the networks of the inputs do not match.
   */
  constructor(
    payIdClient: XrpPayIdClientInterface,
    private readonly xrpClient: XrpClientInterface,
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
   * Send the given amount of XRP from the source wallet to the destination PayID.
   *
   * @param amount A `BigInteger`, number or numeric string representing the number of drops to send.
   * @param destinationPayID A destination PayID to send the drops to.
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
   * Send the given amount of XRP from the source wallet to the destination PayID, allowing
   * for additional details to be specified for use with supplementary features of the XRP
   * ledger.
   *
   * @param sendXrpDetails - a wrapper object containing details for constructing a transaction.
   * @returns A promise which resolves to a string representing the hash of the submitted transaction.
   */
  public async sendWithDetails(
    sendXrpDetails: SendXrpDetails,
  ): Promise<string> {
    const {
      amount,
      destination: destinationPayID,
      sender,
      memoList,
    } = sendXrpDetails
    // Resolve the destination address to an XRP address.
    const destinationAddress = await this.payIdClient.xrpAddressForPayId(
      destinationPayID,
    )

    // Transact XRP to the resolved address.
    const transactionResult = await this.xrpClient.sendXrpWithDetails({
      amount,
      destination: destinationAddress,
      sender,
      memoList,
    })

    return transactionResult.hash
  }
}
