import { PayIDUtils } from 'xpring-common-js'
import PaymentInformation from './generated/model/PaymentInformation'
import ApiClient from './generated/ApiClient'
import PayIDError, { PayIDErrorType } from './pay-id-error'
import PayIDClientInterface from './pay-id-client-interface'
import XRPLNetwork from '../Common/xrpl-network'
import SignatureWrapper from './generated/model/SignatureWrapper'
import DefaultApi from './generated/api/DefaultApi'

interface PayIDComponents {
  host: string
  path: string
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

    const client = new ApiClient()
    client.basePath = `https://${payIDComponents.host}`

    // Accept only the given network in response.
    const accepts = [`application/xrpl-${this.network}+json`]

    return new Promise((resolve, reject) => {
      // NOTE: Swagger produces a higher level client that does not require this level of configuration,
      // however access to Accept headers is not available unless we access the underlying class.
      const postBody = null
      const pathParams = {
        path: payIDComponents.path,
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

  /**
   * Generate a new invoice with compliance requests.
   *
   * @param payID The Pay ID to request an invoice for.
   * @param nonce A randomly selected nonce that is unique to this invoice request.
   */
  async getInvoice(payID: string, nonce: string): Promise<SignatureWrapper> {
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
      const returnType = SignatureWrapper
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
    client.basePath = `https://${payIDComponents.host}`

    const apiInstance = new DefaultApi(client)
    const opts = {
      body: payload,
    }

    return new Promise((resolve, reject) => {
      apiInstance.postPathReceipt(
        payIDComponents.path,
        opts,
        (error, _data, _response) => {
          // TODO(keefertaylor): Provide more specific error handling here.
          if (error) {
            const message = `${error.status}: ${error.response.text}`
            reject(new PayIDError(PayIDErrorType.UnexpectedResponse, message))
          } else {
            resolve()
          }
        },
      )
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

    // Swagger generates the '/' in the URL by default and the payment pointer's 'path' is prefixed by a '/'. Strip off the leading '/'.
    const path = paymentPointer.path.substring(1)

    return {
      host: paymentPointer.host,
      path,
    }
  }
}
