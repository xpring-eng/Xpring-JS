import { PayIDUtils } from 'xpring-common-js'
import Mapping from './generated/model/Mapping'
import ApiClient from './generated/ApiClient'
import PayIDError, { PayIDErrorType } from './pay-id-error'
import PayIDClientInterface from './pay-id-client-interface'

/**
 * Possible networks to resolve
 */
export enum XRPLNetwork {
  Dev = 'devnet',
  Test = 'testnet',
  Main = 'mainnet',
}

/**
 * A client for PayID.
 *
 * @warning This class is experimental and should not be used in production applications.
 */
export default class PayIDClient implements PayIDClientInterface {
  /**
   * Retrieve the XRP Address associated with a PayID.
   *
   * @note The returned value will always be in an X-Address format.
   *
   * @param payID The payID to resolve for an address.
   * @param network The network to resolve the address on. Defaults to Test.
   * @returns An XRP address representing the given PayID if one exists, otherwise undefined.
   */
  // TODO(keefertaylor): It's likely that at some point we'll need to store instance state in this class. Make this a non-static
  //                     method until a complete API spec proves it can be static.
  // eslint-disable-next-line class-methods-use-this
  public async xrpAddressForPayID(
    payID: string,
    network: XRPLNetwork = XRPLNetwork.Test,
  ): Promise<string | undefined> {
    const paymentPointer = PayIDUtils.parsePaymentPointer(payID)
    if (!paymentPointer) {
      throw PayIDError.invalidPaymentPointer
    }

    // Swagger generates the '/' in the URL by default and the payment pointer's 'path' is prefixed by a '/'. Strip off the leading '/'.
    const path = paymentPointer.path.substring(1)

    const client = new ApiClient()
    client.basePath = `https://${paymentPointer.host}`

    // Accept only the given network in response.
    const accepts = [`application/xrpl-${network}+json`]

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
      const returnType = Mapping
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
              // Not Found
              resolve(undefined)
            } else {
              const message = `${error.status}: ${error.response.text}`
              reject(new PayIDError(PayIDErrorType.UnexpectedResponse, message))
            }
            // TODO(keefertaylor): make sure the header matches the request.
          } else if (data?.address) {
            resolve(data.address)
          } else {
            reject(new PayIDError(PayIDErrorType.UnexpectedResponse))
          }
        },
      )
    })
  }
}
