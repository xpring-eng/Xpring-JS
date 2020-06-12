/* eslint-disable max-classes-per-file */

import { Utils } from 'xpring-common-js'
import { PayIDClient } from './pay-id-client'
import XrplNetwork, { XRPLNetwork } from '../Common/xrpl-network'
import PayIdError, { PayIdErrorType } from './pay-id-error'
import XrpPayIdClientInterface, {
  XRPPayIDClientInterface,
} from './xrp-pay-id-client-interface'
import { SingleNetworkPayIdClient } from '..'
import { SignatureWrapperInvoice } from './Generated/api'

/**
 * Provides functionality for XRP in the PayID protocol.
 */
export default class XrpPayIdClient implements XrpPayIdClientInterface {
  /** A wrapped PayIdClient which will handle requests. */
  private readonly wrappedPayIdClient: SingleNetworkPayIdClient

  /**
   * @param xrplNetwork The XRP Ledger network that this client attaches to.
   * @param useHttps Whether to use HTTPS when making PayID requests. Most users should set this to 'true' to avoid
   *                 Man-in-the-Middle attacks. Exposed as an option for testing purposes. Defaults to true.
   */
  constructor(public readonly xrplNetwork: XrplNetwork, useHttps = true) {
    this.xrplNetwork = xrplNetwork
    this.wrappedPayIdClient = new SingleNetworkPayIdClient(
      `xrpl-${xrplNetwork}`,
      useHttps,
    )
  }

  /**
   * Retrieve the XRP address associated with a PayID.
   *
   * Note: Addresses are always in the X-Address format.
   * @see https://xrpaddress.info/
   *
   * @param payId The payID to resolve for an address.
   * @returns An XRP address representing the given PayID.
   */
  async xrpAddressForPayId(payId: string): Promise<string> {
    const result = await this.wrappedPayIdClient.addressForPayId(payId)

    const { address } = result
    if (Utils.isValidXAddress(address)) {
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

    const encodedXAddress = Utils.encodeXAddress(address, tag, isTest)
    if (!encodedXAddress) {
      throw new PayIdError(
        PayIdErrorType.UnexpectedResponse,
        'The returned address was in an unexpected format',
      )
    }
    return encodedXAddress
  }

  /**
   * Generate a new invoice with compliance requests.
   *
   * @param payID The PayID to request an invoice for.
   * @param nonce A randomly selected nonce that is unique to this invoice request.
   */
  async getInvoice(
    payID: string,
    nonce: string,
  ): Promise<SignatureWrapperInvoice> {
    return this.wrappedPayIdClient.getInvoice(payID, nonce)
  }

  /**
   * Post an invoice with compliance data.
   *
   * @param payID The Pay ID compliance data is associated with.
   * @param publicKeyType The type of public key.
   * @param publicKeyData An array of public keys which lead back to the root trust certificate.
   * @param publicKey The public key.
   * @param signature The signature of the operation.
   * @param originatorUserLegalName The legal name of the originator.
   * @param originatorAccountID The account ID of the originator.
   * @param originatorUserPhysicalAddress The physical address of the originator.
   * @param originatorInstitutionName The institution name of the originator.
   * @param valueAmount The value being transferred.
   * @param valueScale The scale of the value.
   * @param timestamp The time that the operation occurred.
   * @param beneficiaryInstitutionName The beneficiary insitution name.
   * @param beneficiaryUserLegalName The legal name of the receiver at the beneficiary institution. Optional, defaults to undefined.
   * @param beneficiaryUserPhysicalAddress The physical address of the receiver at the beneficiary institution. Optional, defaults to undefined.
   * @param beneficiaryUserAccountID The account ID of the receiver at the beneficiary institution. Optional, defaults to undefined.
   */
  // eslint-disable-next-line class-methods-use-this
  async postInvoice(
    payID: string,
    nonce: string,
    publicKeyType: string,
    publicKeyData: Array<string>,
    publicKey: string,
    signature: string,
    originatorUserLegalName: string,
    originatorAccountID: string,
    originatorUserPhysicalAddress: string,
    originatorInstitutionName: string,
    valueAmount: string,
    valueScale: number,
    timestamp: string,
    beneficiaryInstitutionName: string,
    beneficiaryUserLegalName: string | undefined = undefined,
    beneficiaryUserPhysicalAddress: string | undefined = undefined,
    beneficiaryUserAccountID: string | undefined = undefined,
  ): Promise<SignatureWrapperInvoice> {
    return this.wrappedPayIdClient.postInvoice(
      payID,
      nonce,
      publicKeyType,
      publicKeyData,
      publicKey,
      signature,
      originatorUserLegalName,
      originatorAccountID,
      originatorUserPhysicalAddress,
      originatorInstitutionName,
      valueAmount,
      valueScale,
      timestamp,
      beneficiaryInstitutionName,
      beneficiaryUserLegalName,
      beneficiaryUserPhysicalAddress,
      beneficiaryUserAccountID,
    )
  }

  /**
   * Request a receipt.
   *
   * TODO(keefertaylor): Provide more comprehensive documentation when available.
   *
   * @param payID The Pay ID that the request is correllated with.
   * @param invoiceHash The invoice hash.
   * @param transactionConfirmation The transaction confirmation.
   * @returns A void promise that resolves when the operation is complete.
   */
  // TODO(keefertaylor): Consider if this method should be static.
  // eslint-disable-next-line class-methods-use-this
  async receipt(
    payID: string,
    invoiceHash: string,
    transactionConfirmation: string,
  ): Promise<void> {
    return this.wrappedPayIdClient.receipt(
      payID,
      invoiceHash,
      transactionConfirmation,
    )
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
   * @param payID The payID to resolve for an address.
   * @returns An XRP address representing the given PayID.
   */
  async xrpAddressForPayID(payID: string): Promise<string> {
    return this.wrappedXrpPayIdClient.xrpAddressForPayId(payID)
  }
}
