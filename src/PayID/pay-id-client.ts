import { PayIDUtils } from 'xpring-common-js'
import PaymentInformation from './generated/model/PaymentInformation'
import ApiClient from './generated/ApiClient'
import PayIDError, { PayIDErrorType } from './pay-id-error'
import PayIDClientInterface from './pay-id-client-interface'
import XRPLNetwork from '../Common/xrpl-network'
import SignatureWrapperInvoice from './generated/model/SignatureWrapperInvoice'
import Value from './generated/model/Value'
import Originator from './generated/model/Originator'
import Beneficiary from './generated/model/Beneficiary'
import SignatureWrapperCompliance from './generated/model/SignatureWrapperCompliance'
import Compliance from './generated/model/Compliance'
import TravelRule from './generated/model/TravelRule'
import DefaultApi from './generated/api/DefaultApi'
import ComplianceType from './compliance-type'

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
    const paymentPointer = PayIDUtils.parsePaymentPointer(payID)
    if (!paymentPointer) {
      throw PayIDError.invalidPaymentPointer
    }

    // Swagger generates the '/' in the URL by default and the payment pointer's 'path' is prefixed by a '/'. Strip off the leading '/'.
    const path = paymentPointer.path.substring(1)

    const client = new ApiClient()
    client.basePath = `https://${paymentPointer.host}`

    // Accept only the given network in response.
    const accepts = [`application/xrpl-${this.network}+json`]

    return new Promise((resolve, reject) => {
      // NOTE: Swagger produces a higher level client that does not require this level of configuration,
      // however access to Accept headers is not available unless we access the underlying class.
      const postBody = null
      const pathParams = {
        path,
      }
      const queryParams = {}
      const headerParams = {}
      const formParams = {}
      const authNames = []
      const contentTypes = []
      const returnType = PaymentInformation
      client.callApi(
        '/{path}',
        'GET',
        pathParams,
        queryParams,
        headerParams,
        formParams,
        postBody,
        authNames,
        contentTypes,
        accepts,
        returnType,
        (error, data, _response) => {
          if (error) {
            if (error.status === 404) {
              const message = `Could not resolve ${payID} on network ${this.network}`
              reject(new PayIDError(PayIDErrorType.MappingNotFound, message))
            } else {
              const message = `${error.status}: ${error.response.text}`
              reject(new PayIDError(PayIDErrorType.UnexpectedResponse, message))
            }
            // TODO(keefertaylor): make sure the header matches the request.
          } else if (data?.addressDetails?.address) {
            resolve(data.addressDetails.address)
          } else {
            reject(new PayIDError(PayIDErrorType.UnexpectedResponse))
          }
        },
      )
    })
  }

  async getInvoice(
    payID: string,
    nonce: string,
  ): Promise<SignatureWrapperInvoice> {
    // TODO(keefertaylor): Dedupe payment pointer logic
    const paymentPointer = PayIDUtils.parsePaymentPointer(payID)
    if (!paymentPointer) {
      throw PayIDError.invalidPaymentPointer
    }

    // Swagger generates the '/' in the URL by default and the payment pointer's 'path' is prefixed by a '/'. Strip off the leading '/'.
    const path = paymentPointer.path.substring(1)

    const client = new ApiClient()
    client.basePath = `https://${paymentPointer.host}`

    // Accept only the given network in response.
    const accepts = [`application/xrpl-${this.network}+json`]

    return new Promise((resolve, reject) => {
      // NOTE: Swagger produces a higher level client that does not require this level of configuration,
      // however access to Accept headers is not available unless we access the underlying class.
      // TODO(keefertaylor): Dedupe this with the above information.
      const postBody = null
      const pathParams = {
        path,
      }
      const queryParams = {
        nonce,
      }
      const headerParams = {}
      const formParams = {}
      const authNames = []
      const contentTypes = []
      const returnType = SignatureWrapperInvoice
      client.callApi(
        '/{path}/invoice',
        'GET',
        pathParams,
        queryParams,
        headerParams,
        formParams,
        postBody,
        authNames,
        contentTypes,
        accepts,
        returnType,
        (error, data, _response) => {
          // TODO(keefertaylor): Provide more granular error handling.
          if (error) {
            const message = `${error.status}: ${error.response.text}`
            reject(new PayIDError(PayIDErrorType.UnexpectedResponse, message))
            // TODO(keefertaylor): make sure the header matches the request.
          } else if (data) {
            resolve(data)
          } else {
            reject(new PayIDError(PayIDErrorType.UnexpectedResponse))
          }
        },
      )
    })
  }

  /**
   * Post an invoice with compliance data.
   *
   * TODO(keefertaylor): Document these parameters.
   *
   * @param payID
   * @param publicKeyType
   * @param publicKeyData
   * @param publicKey
   * @param signature
   * @param ComplianceType
   * @param originatorUserLegalName
   * @param originatorAccountID
   * @param originatorUserPhysicalAddress
   * @param originatorInstitutionName
   * @param valueAmount
   * @param valueScale
   * @param timestamp
   * @param beneficiaryInstitutionName
   * @param beneficiaryUserLegalName
   * @param beneficiaryUserPhysicalAddress
   * @param beneficiaryUserAccountID
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

    // TODO(keefertaylor): Dedupe payment pointer logic
    const paymentPointer = PayIDUtils.parsePaymentPointer(payID)
    if (!paymentPointer) {
      throw PayIDError.invalidPaymentPointer
    }

    // Swagger generates the '/' in the URL by default and the payment pointer's 'path' is prefixed by a '/'. Strip off the leading '/'.
    const path = paymentPointer.path.substring(1)

    const client = new ApiClient()
    client.basePath = `https://${paymentPointer.host}`

    const apiInstance = new DefaultApi(client)

    return new Promise((resolve, reject) => {
      apiInstance.postPathInvoice(
        path,
        { body: signatureWrapper },
        (error, data, _response) => {
          // TODO(keefertaylor): Provide more granular error handling.
          if (error) {
            const message = `${error.status}: ${error.response.text}`
            reject(new PayIDError(PayIDErrorType.UnexpectedResponse, message))
          } else if (data) {
            resolve(data)
          } else {
            reject(new PayIDError(PayIDErrorType.UnexpectedResponse))
          }
        },
      )
    })
  }
}
