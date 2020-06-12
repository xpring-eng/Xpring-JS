import PayIdError, {
  PayIDError,
  PayIDErrorType,
  PayIdErrorType,
} from './pay-id-error'
import { SignatureWrapperInvoice, CryptoAddressDetails } from './Generated/api'
import PayIdClientImpl from './pay-id-client-impl'

/**
 * A client for PayID.
 *
 * @deprecated Please use SingleNetworkPayIdClient instead.
 *
 * @warning This class is experimental and should not be used in production applications.
 */
export class PayIDClient {
  private readonly wrappedPayIdClient: PayIdClientImpl

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
  constructor(network: string, useHttps = true) {
    this.wrappedPayIdClient = new PayIdClientImpl(network, useHttps)
  }

  /**
   * Retrieve the address associated with a PayID.
   *
   * @param payID The payID to resolve for an address.
   * @returns An address representing the given PayID.
   */
  async addressForPayID(payID: string): Promise<CryptoAddressDetails> {
    const addresses = await this.wrappedPayIdClient.addressForPayId(payID)
    // With a specific network, exactly one address should be returned by a PayID lookup.
    if (addresses.length === 1) {
      return addresses[0].addressDetails
    } else {
      return Promise.reject(
        new PayIDError(
          PayIDErrorType.UnexpectedResponse,
          'Received more addresses than expected',
        ),
      )
    }
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
 *
 * @deprecated Please use SingleNetworkPayIdClient instead.
 */
export default class PayIdClient {
  private readonly wrappedPayIdClient: PayIdClientImpl

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
   * @param network The network that addresses will be resolved on.
   * @param useHttps Whether to cuse HTTPS when making PayID requests. Most users should set this to 'true' to avoid
   *                 Man-in-the-Middle attacks. Exposed as an option for testing purposes. Defaults to true.
   */
  constructor(network: string, useHttps = true) {
    this.wrappedPayIdClient = new PayIdClientImpl(network, useHttps)
  }

  /**
   * Retrieve the address associated with a PayID.
   *
   * @param payId The payID to resolve for an address.
   * @returns An address representing the given PayID.
   */
  async addressForPayId(payId: string): Promise<CryptoAddressDetails> {
    const addresses = await this.wrappedPayIdClient.addressForPayId(payId)
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
   * Generate a new invoice with compliance requests.
   *
   * @param payId The Pay ID to request an invoice for.
   * @param nonce A randomly selected nonce that is unique to this invoice request.
   */
  async getInvoice(
    payId: string,
    nonce: string,
  ): Promise<SignatureWrapperInvoice> {
    return this.wrappedPayIdClient.getInvoice(payId, nonce)
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
    return this.wrappedPayIdClient.postInvoice(
      payId,
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
   * @param payId The Pay ID that the request is correllated with.
   * @param invoiceHash The invoice hash.
   * @param transactionConfirmation The transaction confirmation.
   * @returns A void promise that resolves when the operation is complete.
   */
  async receipt(
    payId: string,
    invoiceHash: string,
    transactionConfirmation: string,
  ): Promise<void> {
    return this.wrappedPayIdClient.receipt(
      payId,
      invoiceHash,
      transactionConfirmation,
    )
  }
}
