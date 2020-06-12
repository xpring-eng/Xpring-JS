import { Wallet } from 'xpring-common-js'
import { BigInteger } from 'big-integer'
import XrpPayIdClientInterface, {
  XRPPayIDClientInterface,
} from '../PayID/xrp-pay-id-client-interface'
import { XRPClientInterface } from '../XRP/xrp-client-interface'
import XpringError, { XpringErrorType } from './xpring-error'
import XrplNetwork, { XRPLNetwork } from '../Common/xrpl-network'
import { XRPPayIDClient } from '../PayID/xrp-pay-id-client'
import SendXrpDetails from '../XRP/model/send-xrp-details'

/**
 * Composes interactions of Xpring services.
 */
export default class XpringClient {
  private readonly payIdClient: XRPPayIDClientInterface

  private static isNewPayIdClient(
    payIdClient: XRPPayIDClientInterface | XrpPayIdClientInterface,
  ): payIdClient is XrpPayIdClientInterface {
    return (
      (payIdClient as XrpPayIdClientInterface).xrpAddressForPayId !== undefined
    )
  }

  /**
   * Create a new XpringClient.
   *
   * @param payIdClient A Pay ID Client used to interact with the Pay ID protocol.
   * @param xrpClient An XRP Client used to interact with the XRP Ledger protocol.
   * @throws A XpringError if the networks of the inputs do not match.
   */
  // TODO(keefertaylor): Support new xrp client.
  constructor(
    payIdClient: XRPPayIDClientInterface | XrpPayIdClientInterface,
    private readonly xrpClient: XRPClientInterface,
  ) {
    let normalizedPayIdClient: XRPPayIDClientInterface
    if (XpringClient.isNewPayIdClient(payIdClient)) {
      switch (payIdClient.xrplNetwork) {
        case XrplNetwork.Dev: {
          normalizedPayIdClient = new XRPPayIDClient(XRPLNetwork.Dev)
          break
        }
        case XrplNetwork.Main: {
          normalizedPayIdClient = new XRPPayIDClient(XRPLNetwork.Main)
          break
        }
        case XrplNetwork.Test: {
          normalizedPayIdClient = new XRPPayIDClient(XRPLNetwork.Test)
          break
        }
        default: {
          throw new XpringError(XpringErrorType.Unknown, 'Unknown network')
        }
      }
    } else {
      normalizedPayIdClient = payIdClient
    }
    this.payIdClient = normalizedPayIdClient

    // Verify that networks match.
    const payIDNetwork = normalizedPayIdClient.xrplNetwork
    const xrpNetwork = xrpClient.network
    if (payIDNetwork !== xrpNetwork) {
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
    const destinationAddress = await this.payIdClient.xrpAddressForPayID(
      destinationPayID,
    )

    // Transact XRP to the resolved address.
    return this.xrpClient.sendWithDetails({
      amount,
      destination: destinationAddress,
      sender,
      memos,
    })
  }
}
