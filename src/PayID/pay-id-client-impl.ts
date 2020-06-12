import { PayIdUtils } from 'xpring-common-js'
import PayIdError, {
  PayIDError,
  PayIdErrorType,
  PayIDErrorType,
} from './pay-id-error'
import ComplianceType from './compliance-type'
import {
  Address,
  Beneficiary,
  DefaultApi,
  SignatureWrapperInvoice,
  Value,
  Originator,
  TravelRule,
  SignatureWrapperCompliance,
  Compliance,
} from './Generated/api'

const PAYID_API_VERSION = '1.0'

/* eslint-disable */

interface PayIDComponents {
  host: string
  path: string
}

/**
 * A private implementation of the PayID protocol.
 *
 * Clients should prefer to use a public class instead:
 * - SingleNetworkPayIdClient
 * - MultiNetworkPayIdClient
 * - AllNetworksPayIdClient
 */
export default class PayIdClientImpl {
  /**
   * Initialize a new PayIdClientImpl.
   *
   * Networks in this constructor take the form of an asset and an optional network (<asset>-<network>), for instance:
   * - xrpl-testnet
   * - xrpl-mainnet
   * - eth-rinkeby
   * - ach
   *
   * TODO(keefertaylor): Link a canonical list at payid.org when available.
   *
   * @param network The network that addresses will be resolved on.
   * @param useHttps Whether to cuse HTTPS when making PayID requests. Most users should set this to 'true' to avoid
   *                 Man-in-the-Middle attacks. Exposed as an option for testing purposes. Defaults to true.
   */
  constructor(
    public readonly network: string,
    private readonly useHttps: boolean = true,
  ) {}

  /**
   * Retrieve the address associated with a PayID.
   *
   * @param payId The payID to resolve for an address.
   * @returns An address representing the given PayID.
   */
  async addressForPayId(payId: string): Promise<Array<Address>> {
    const payIdComponents = PayIdClientImpl.parsePayId(payId)
    const basePath = this.useHttps
      ? `https://${payIdComponents.host}`
      : `http://${payIdComponents.host}`

    // Swagger API adds the leading '/' in path automatically because it is part of the endpoint.
    const path = payIdComponents.path.substring(1)

    const api = new DefaultApi(undefined, basePath)

    const options = PayIdClientImpl.makeOptionsWithAcceptTypes(
      `application/${this.network}+json`,
    )

    try {
      const { data } = await api.resolvePayID(path, options)
      // TODO(keefertaylor): make sure the header matches the request.
      if (data?.addresses) {
        return data.addresses
      } else {
        return Promise.reject(
          new PayIDError(
            PayIDErrorType.UnexpectedResponse,
            'Too many addresses returned',
          ),
        )
      }
    } catch (error) {
      if (error.response?.status === 404) {
        const message = `Could not resolve ${payId} on network ${this.network}`
        return Promise.reject(
          new PayIdError(PayIdErrorType.MappingNotFound, message),
        )
      } else {
        const message = PayIdClientImpl.messageFromMaybeHttpError(error)
        return Promise.reject(
          new PayIdError(PayIdErrorType.UnexpectedResponse, message),
        )
      }
    }
  }

  /**
   * Generate a new invoice with compliance requests.
   *
   * @param payId The Pay ID to request an invoice for.
   * @param nonce A randomly selected nonce that is unique to this invoice request.
   */
  async getInvoice(
    payId: string,
    nonce: string,
  ): Promise<SignatureWrapperInvoice> {
    const payIDComponents = PayIdClientImpl.parsePayId(payId)
    const basePath = this.useHttps
      ? `https://${payIDComponents.host}${payIDComponents.path}`
      : `http://${payIDComponents.host}${payIDComponents.path}`

    const options = PayIdClientImpl.makeOptionsWithAcceptTypes(
      `application/${this.network}+json`,
    )

    const api = new DefaultApi(undefined, basePath)

    try {
      const { data } = await api.getPathInvoice(nonce, options)
      return data
    } catch (error) {
      // TODO(keefertaylor): Provide more granular error handling.
      const message = PayIdClientImpl.messageFromMaybeHttpError(error)
      return Promise.reject(
        new PayIDError(PayIDErrorType.UnexpectedResponse, message),
      )
    }
  }

  /**
   * Post an invoice with compliance data.
   *
   * @param payId The Pay ID compliance data is associated with.
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
    payId: string,
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
    const value: Value = {
      amount: valueAmount,
      scale: valueScale + '',
    }

    const originator: Originator = {
      userLegalName: originatorUserLegalName,
      accountId: originatorAccountID,
      userPhysicalAddress: originatorUserPhysicalAddress,
      institutionName: originatorInstitutionName,
      value,
      timestamp,
    }

    const beneficiary: Beneficiary = {
      institutionName: beneficiaryInstitutionName,
      userLegalName: beneficiaryUserLegalName,
      userPhysicalAddress: beneficiaryUserPhysicalAddress,
      accountId: beneficiaryUserAccountID,
    }

    const travelRule: TravelRule = {
      originator,
      beneficiary,
    }

    const compliance: Compliance = {
      type: ComplianceType.TravelRule,
      data: travelRule,
    }

    const signatureWrapper: SignatureWrapperCompliance = {
      messageType: 'Compliance',
      message: compliance,
      publicKeyType,
      publicKeyData,
      publicKey,
      signature,
    }

    const payIdComponents = PayIdClientImpl.parsePayId(payId)
    const basePath = this.useHttps
      ? `https://${payIdComponents.host}${payIdComponents.path}`
      : `http://${payIdComponents.host}${payIdComponents.path}`

    const options = PayIdClientImpl.makeOptionsWithAcceptTypes(
      `application/${this.network}+json`,
    )
    const api = new DefaultApi(undefined, basePath)

    try {
      const { data } = await api.postPathInvoice(
        nonce,
        signatureWrapper,
        options,
      )
      return data
    } catch (error) {
      const message = PayIdClientImpl.messageFromMaybeHttpError(error)
      return Promise.reject(
        new PayIdError(PayIdErrorType.UnexpectedResponse, message),
      )
    }
  }

  /**
   * Request a receipt.
   *
   * TODO(keefertaylor): Provide more comprehensive documentation when available.
   *
   * @param payId The Pay ID that the request is correllated with.
   * @param invoiceHash The invoice hash.
   * @param transactionConfirmation The transaction confirmation.
   * @returns A void promise that resolves when the operation is complete.
   */
  // TODO(keefertaylor): Consider if this method should be static.
  // eslint-disable-next-line class-methods-use-this
  async receipt(
    payId: string,
    invoiceHash: string,
    transactionConfirmation: string,
  ): Promise<void> {
    const payIDComponents = PayIdClientImpl.parsePayId(payId)

    const payload = {
      invoiceHash,
      transactionConfirmation,
    }

    const basePath = this.useHttps
      ? `https://${payIDComponents.host}${payIDComponents.path}`
      : `http://${payIDComponents.host}${payIDComponents.path}`
    const api = new DefaultApi(undefined, basePath)

    try {
      await api.postPathReceipt(payload)
    } catch (error) {
      // TODO(keefertaylor): Provide more specific error handling here.
      const message = PayIdClientImpl.messageFromMaybeHttpError(error)
      return Promise.reject(
        new PayIdError(PayIdErrorType.UnexpectedResponse, message),
      )
    }
  }

  /**
   * Try to create a pretty formatted error message given an error which may be an HTTP error.
   *
   * @param error An error which may be an HTTP error.
   * @returns A sane message for upstream errors.
   */
  private static messageFromMaybeHttpError(error: any): string {
    // Try to nicely form an error if the error is the result of an HTTP request, fall back to
    // just printing the error otherwise.
    return error.response?.status
      ? `${error.response?.status}: ${error.response?.data?.message}`
      : error.message
  }

  /**
   * Make a set of options for the API that include a header with `Accept` set to the given value.
   *
   * @param acceptType The value for the `Accept` header.
   * @returns An options object that can be passed to an api.
   */
  private static makeOptionsWithAcceptTypes(acceptType: string): object {
    const headers = {
      Accept: acceptType,
      'PayID-Version': PAYID_API_VERSION,
    }

    const options = {
      headers,
    }

    return options
  }

  /**
   * Parse a payID to a host and path.
   */
  private static parsePayId(payId: string): PayIDComponents {
    const payIdComponents = PayIdUtils.parsePayID(payId)
    if (!payIdComponents) {
      throw PayIDError.invalidPayID
    }
    return {
      host: payIdComponents.host,
      path: payIdComponents.path,
    }
  }
}
