import { PayIDUtils } from 'xpring-common-js'
import PaymentInformation from './Generated/model/PaymentInformation'
import ApiClient from './Generated/ApiClient'
import PayIDError, { PayIDErrorType } from './pay-id-error'
import PayIDClientInterface from './pay-id-client-interface'
import XRPLNetwork from '../Common/xrpl-network'
import SignatureWrapperInvoice from './Generated/model/SignatureWrapperInvoice'
import Value from './Generated/model/Value'
import Originator from './Generated/model/Originator'
import Beneficiary from './Generated/model/Beneficiary'
import SignatureWrapperCompliance from './Generated/model/SignatureWrapperCompliance'
import Compliance from './Generated/model/Compliance'
import TravelRule from './Generated/model/TravelRule'
import DefaultApi from './Generated/api/DefaultApi'
import ComplianceType from './compliance-type'

interface PayIDComponents {
  host: string
  path: string
}

// TODO(keefertaylor): Do not use any. Either generate .d.ts files by using a typescript code generator or manually create interfaces.
/** The result of a call to a Swagger RPC which fetched a response of type T. */
interface SwaggerCallResult<T> {
  /** An error associated with the response. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any

  /** The complete HTTP response. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  response: any

  /** The data returned by the call. */
  data: T
}

/**
 * A client for PayID.
 *
 * @warning This class is experimental and should not be used in production applications.
 */
export default class PayIDClient implements PayIDClientInterface {
  /**
   * @param network The network that addresses will be resolved on.
   */
  constructor(public readonly network: XRPLNetwork) {}

  /**
   * Retrieve the XRP Address associated with a PayID.
   *
   * @note The returned value will always be in an X-Address format.
   *
   * @param payID The payID to resolve for an address.
   * @returns An XRP address representing the given PayID.
   */
  async xrpAddressForPayID(payID: string): Promise<string> {
    const payIDComponents = PayIDClient.parsePayID(payID)
    const basePath = `https://${payIDComponents.host}`
    const { path } = payIDComponents

    // Accept only the given network in response.
    const accepts = [`application/xrpl-${this.network}+json`]

    const { error, data } = await this.makeRPC<PaymentInformation>(
      basePath,
      path,
      accepts,
      PaymentInformation,
    )

    if (error) {
      if (error.status === 404) {
        const message = `Could not resolve ${payID} on network ${this.network}`
        throw new PayIDError(PayIDErrorType.MappingNotFound, message)
      } else {
        const message = `${error.status}: ${error.response?.text}`
        throw new PayIDError(PayIDErrorType.UnexpectedResponse, message)
      }
      // TODO(keefertaylor): make sure the header matches the request.
    } else if (data?.addressDetails?.address) {
      return data.addressDetails.address
    } else {
      throw new PayIDError(PayIDErrorType.UnexpectedResponse)
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async makeRPC<T>(
    basePath: string,
    path: string,
    accepts: Array<string>,
    // The next line is T.type.
    // TODO(keefertaylor): Figure out a way to express this in typescript.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    returnType: any,
  ): Promise<SwaggerCallResult<T>> {
    return new Promise((resolve, _reject) => {
      const client = new ApiClient()
      client.basePath = basePath

      // NOTE: Swagger produces a higher level client that does not require this level of configuration,
      // however access to Accept headers is not available unless we access the underlying class.
      //
      // NOTE: At some point additional fields may need to be generalized (ex. httpMethod). These fields
      // are hidden for convenience and configurability and may be exposed when needed.
      const postBody = null
      const httpMethod = 'GET'
      const queryParams = {}
      const headerParams = {}
      const formParams = {}
      const authNames = []
      const contentTypes = []

      client.callApi(
        path,
        httpMethod,
        {},
        queryParams,
        headerParams,
        formParams,
        postBody,
        authNames,
        contentTypes,
        accepts,
        returnType,
        (error, data, response) => {
          // Transform results of the callback to a wrapper object.
          resolve({
            error,
            data,
            response,
          })
        },
      )
    })
  }

  /**
   * Generate a new invoice with compliance requests.
   *
   * @param payID The Pay ID to request an invoice for.
   * @param nonce A randomly selected nonce that is unique to this invoice request.
   */
  async getInvoice(
    payID: string,
    nonce: string,
  ): Promise<SignatureWrapperInvoice> {
    const payIDComponents = PayIDClient.parsePayID(payID)
    const basePath = `https://${payIDComponents.host}`
    const path = `${payIDComponents.path}/invoice?nonce=${nonce}`

    // Accept only the given network in response.
    const accepts = [`application/xrpl-${this.network}+json`]

    const { error, data } = await this.makeRPC<SignatureWrapperInvoice>(
      basePath,
      path,
      accepts,
      SignatureWrapperInvoice,
    )

    // TODO(keefertaylor): Provide more granular error handling.
    if (error) {
      const message = `${error.status}: ${error.response?.text}`
      throw new PayIDError(PayIDErrorType.UnexpectedResponse, message)
      // TODO(keefertaylor): make sure the header matches the request.
    } else if (data) {
      return data
    } else {
      throw new PayIDError(PayIDErrorType.UnexpectedResponse)
    }
  }

  /**
   * Post an invoice with compliance data.
   *
   * @param payID The Pay ID compliance data is associated with.
   * @param publicKeyType The type of public key.
   * @param publicKeyData An array of public keys which lead back to the root trust certificate.
   * @param publicKey The public key.
   * @param signature The signature of the operation.
   * @param complianceType The type of compliance submitted.
   * @param originatorUserLegalName The legal name of the originator.
   * @param originatorAccountID The account ID of the originator.
   * @param originatorUserPhysicalAddress The physical address of the originator.
   * @param originatorInstitutionName The institution name of the originator.
   * @param valueAmount The value being transferred.
   * @param valueScale The scale of the value.
   * @param timestamp The time that the operation occurred.
   * @param beneficiaryInstitutionName The beneficiary insitution name.
   * @param beneficiaryUserLegalName The legal name of the receiver at the beneficiary institution. Optional, defaults to undefined.
   * @param beneficiaryUserPhysicalAddress The phsyical address of the receiver at the beneficiary institution. Optional, defaults to undefined.
   * @param beneficiaryUserAccountID The account ID of the receiver at the beneficiary institution. Optional, defaults to undefined.
   */
  // eslint-disable-next-line class-methods-use-this
  async postInvoice(
    payID: string,
    publicKeyType: string,
    publicKeyData: Array<string>,
    publicKey: string,
    signature: string,
    complianceType: ComplianceType,
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
    const value = new Value(valueAmount, `${valueScale}`)

    const originator = new Originator(
      originatorUserLegalName,
      originatorAccountID,
      originatorUserPhysicalAddress,
      originatorInstitutionName,
      value,
      timestamp,
    )

    const beneficiary = new Beneficiary(beneficiaryInstitutionName)
    beneficiary.userLegalName = beneficiaryUserLegalName || undefined
    beneficiary.userPhysicalAddress =
      beneficiaryUserPhysicalAddress || undefined
    beneficiary.accountId = beneficiaryUserAccountID || undefined

    const travelRule = new TravelRule(originator, beneficiary)

    const compliance = new Compliance(complianceType, travelRule)

    const signatureWrapper = new SignatureWrapperCompliance(
      complianceType,
      compliance,
      publicKeyType,
      publicKeyData,
      publicKey,
      signature,
    )

    const payIDComponents = PayIDClient.parsePayID(payID)

    const client = new ApiClient()
    client.basePath = `https://${payIDComponents.host}${payIDComponents.path}`

    const apiInstance = new DefaultApi(client)

    const { error, data } = await new Promise<
      SwaggerCallResult<SignatureWrapperInvoice>
    >((resolve, _reject) => {
      apiInstance.postPathInvoice(
        { body: signatureWrapper },
        (swaggerError, swaggerData, response) => {
          // Transform results of the callback to a wrapper object.
          resolve({
            error: swaggerError,
            data: swaggerData,
            response,
          })
        },
      )
    })

    // TODO(keefertaylor): Provide more granular error handling.
    if (error) {
      const message = `${error.status}: ${error.response?.text}`
      throw new PayIDError(PayIDErrorType.UnexpectedResponse, message)
    } else if (data) {
      return data
    } else {
      throw new PayIDError(PayIDErrorType.UnexpectedResponse)
    }
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
    const payIDComponents = PayIDClient.parsePayID(payID)

    const payload = {
      invoiceHash,
      transactionConfirmation,
    }

    const client = new ApiClient()
    client.basePath = `https://${payIDComponents.host}${payIDComponents.path}`

    const apiInstance = new DefaultApi(client)
    const opts = {
      body: payload,
    }

    return new Promise((resolve, reject) => {
      try {
        apiInstance.postPathReceipt(opts, (error, _data, _response) => {
          // TODO(keefertaylor): Provide more specific error handling here.
          if (error) {
            const message = `${error.status}: ${error.response?.text}`
            reject(new PayIDError(PayIDErrorType.UnexpectedResponse, message))
          } else {
            resolve()
          }
        })
      } catch (exception) {
        // Something really wrong happened, we don't have enough information to tell. This could be a transient network error, the payment pointer doesn't exist, or any other number of errors.
        reject(new PayIDError(PayIDErrorType.Unknown, exception.message))
      }
    })
  }

  /**
   * Parse a payID to a host and path.
   */
  private static parsePayID(payID: string): PayIDComponents {
    const paymentPointer = PayIDUtils.parsePaymentPointer(payID)
    if (!paymentPointer) {
      throw PayIDError.invalidPaymentPointer
    }
    return {
      host: paymentPointer.host,
      path: paymentPointer.path,
    }
  }
}
