/* eslint-disable max-classes-per-file */
import { PayIdUtils } from 'xpring-common-js'
import PayIdError, {
  PayIDError,
  PayIdErrorType,
  PayIDErrorType,
} from './pay-id-error'
import ComplianceType from './compliance-type'
import {
  Beneficiary,
  DefaultApi,
  SignatureWrapperInvoice,
  CryptoAddressDetails,
  Value,
  Originator,
  TravelRule,
  SignatureWrapperCompliance,
  Compliance,
  Address,
} from './Generated/api'

const PAYID_API_VERSION = '1.0'

/* eslint-disable */

interface PayIDComponents {
  host: string
  path: string
}

/**
 * A client for PayID.
 *
 * @deprecated Please use PayIdClient instead.
 *
 * @warning This class is experimental and should not be used in production applications.
 */
export class PayIDClient {
  private readonly wrappedPayIdClient: PayIdClient

  /**
   * Initialize a new PayID client.
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
   * @param useHttps Whether to use HTTPS when making PayID requests. Most users should set this to 'true' to avoid
   *                 Man-in-the-Middle attacks. Exposed as an option for testing purposes. Defaults to true.
   */
  constructor(network: string, useHttps: boolean = true) {
    this.wrappedPayIdClient = new PayIdClient(network, useHttps)
  }

  /**
   * Retrieve the address associated with a PayID.
   *
   * @param payID The payID to resolve for an address.
   * @returns An address representing the given PayID.
   */
  async addressForPayID(payID: string): Promise<CryptoAddressDetails> {
    return this.wrappedPayIdClient.addressForPayId(payID)
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
 * A client for PayID.
 *
 * @warning This class is experimental and should not be used in production applications.
 */
export default class PayIdClient {
  /**
   * Initialize a new PayIdClient.
   *
   * Networks in this constructor take the form of an asset and an optional network (<asset>-<network>), for instance:
   * - xrpl-testnet
   * - xrpl-mainnet
   * - eth-rinkeby
   * - ach
   *
   * TODO(keefertaylor): Link a canonical list at payid.org when available.
   *
   * @deprecated @param network The network that addresses will be resolved on.
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
   * @deprecated Please use `cryptoAddressForPayId` instead.
   *
   * @param payId The payID to resolve for an address.
   * @returns An address representing the given PayID.
   */
  async addressForPayId(payId: string): Promise<CryptoAddressDetails> {
    const addresses = await this.addressesForPayIdAndNetwork(
      payId,
      this.network,
    )

    // With a specific network, exactly one address should be returned by a PayID lookup.
    if (addresses.length === 1) {
      return addresses[0].addressDetails
    } else {
      return Promise.reject(
        new PayIdError(
          PayIdErrorType.UnexpectedResponse,
          'Received more addresses than expected',
        ),
      )
    }
  }

  /**
   * Retrieve the crypto address associated with a PayID.
   *
   * @param payId The PayID to resolve.
   * @param network The network to resolve on.
   */
  async cryptoAddressForPayId(
    payId: string,
    network: string,
  ): Promise<CryptoAddressDetails> {
    const addresses = await this.addressesForPayIdAndNetwork(payId, network)

    // With a specific network, exactly one address should be returned by a PayID lookup.
    if (addresses.length === 1) {
      return addresses[0].addressDetails
    } else {
      return Promise.reject(
        new PayIdError(
          PayIdErrorType.UnexpectedResponse,
          'Received more addresses than expected',
        ),
      )
    }
  }

  /**
   * Retrieve the all addresses associated with a PayId.
   *
   * @param payId The PayID to resolve.
   */
  async allAddressesForPayId(payId: string): Promise<Array<Address>> {
    return this.addressesForPayIdAndNetwork(payId, 'payid')
  }

  /**
   * Return an array of {@link Address}es that match the inputs.
   *
   * @param payId The PayID to resolve.
   * @param network The network to resolve on.
   */
  private async addressesForPayIdAndNetwork(
    payId: string,
    network: string,
  ): Promise<Array<Address>> {
    const payIdComponents = PayIdClient.parsePayId(payId)
    const basePath = this.useHttps
      ? `https://${payIdComponents.host}`
      : `http://${payIdComponents.host}`

    // Swagger API adds the leading '/' in path automatically because it is part of the endpoint.
    const path = payIdComponents.path.substring(1)

    const api = new DefaultApi(undefined, basePath)

    const options = PayIdClient.makeOptionsWithAcceptTypes(
      `application/${network}+json`,
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
        const message = PayIdClient.messageFromMaybeHttpError(error)
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
    const payIDComponents = PayIdClient.parsePayId(payId)
    const basePath = this.useHttps
      ? `https://${payIDComponents.host}${payIDComponents.path}`
      : `http://${payIDComponents.host}${payIDComponents.path}`

    const options = PayIdClient.makeOptionsWithAcceptTypes(
      `application/${this.network}+json`,
    )

    const api = new DefaultApi(undefined, basePath)

    try {
      const { data } = await api.getPathInvoice(nonce, options)
      return data
    } catch (error) {
      // TODO(keefertaylor): Provide more granular error handling.
      const message = PayIdClient.messageFromMaybeHttpError(error)
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

    const payIdComponents = PayIdClient.parsePayId(payId)
    const basePath = this.useHttps
      ? `https://${payIdComponents.host}${payIdComponents.path}`
      : `http://${payIdComponents.host}${payIdComponents.path}`

    const options = PayIdClient.makeOptionsWithAcceptTypes(
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
      const message = PayIdClient.messageFromMaybeHttpError(error)
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
    const payIDComponents = PayIdClient.parsePayId(payId)

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
      const message = PayIdClient.messageFromMaybeHttpError(error)
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
