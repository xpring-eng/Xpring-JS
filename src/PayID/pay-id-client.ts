/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/require-await */
// import axios, { AxiosInstance } from 'axios'
import { PayIDUtils } from 'xpring-common-js'
import DefaultApi from './api/DefaultApi'
import ApiClient from './ApiClient'
import PayIDError, { PayIDErrorType } from './pay-id-error'

/**
 * A client for PayID.
 *
 * @warning This class is experimental and should not be used in production applications.
 * TODO(keefertaylor): Export this class in index.ts when it's ready for external consumption.
 */
export default class PayIDClient {
  /** An HTTP client. */
  // private readonly axiosInstance: AxiosInstance

  // public constructor() {
  //   // this.axiosInstance = axios.create({})
  // }

  /**
   * Retrieve the XRP Address authorized with a PayID.
   *
   * @note The returned value will always be in an X-Address format.
   *
   * @param payID The payID to resolve for an address.
   * @returns An XRP address representing the given PayID if one exists, otherwise undefined.
   */
  public async xrpAddressForPayID(payID: string): Promise<string | undefined> {
    const paymentPointer = PayIDUtils.parsePaymentPointer(payID)
    if (!paymentPointer) {
      throw PayIDError.invalidPaymentPointer
    }

    const client = new ApiClient()
    client.basePath = `https://${paymentPointer.host}`
    const apiInstance = new DefaultApi(client)

    // Swagger generates the '/' in the URL by default and the payment pointer's 'path' is prefixed by a '/'. Strip off the leading '/'.
    const userAndHost = paymentPointer.path.substring(1)

    return new Promise((resolve, reject) => {
      apiInstance.getUserAndHost(userAndHost, (error, data, _response) => {
        if (error) {
          if (error.status === 404) {
            // Not Found
            resolve(undefined)
          } else {
            const message = `${error.status}: ${error.response.text}`
            reject(new PayIDError(PayIDErrorType.UnexpectedResponse, message))
          }
        } else if (data?.address) {
          resolve(data.address)
        } else {
          reject(new PayIDError(PayIDErrorType.UnexpectedResponse))
        }
      })
    })

    // const url = `https://${paymentPointer.host}${paymentPointer.path}`
    // // TODO(keefertaylor): Attach network parameter.
    // // TODO(keefertaylor): Generalize the below to allow requesting in other types.
    // const requestConfig = {
    //   headers: {
    //     Accept: 'application/xrp+json',
    //   },
    // }

    // let response
    // try {
    //   response = await this.axiosInstance.get<{ address: string }>(
    //     url,
    //     requestConfig,
    //   )
    // } catch (error) {
    //   // Handle erroneous responses from the server.
    //   if (error.response) {
    //     // 404 means no mapping was found.
    //     if (error.response.status === 404) {
    //       return undefined
    //     }

    //     // Otherwise re-throw the error as an unexepected response.
    //     throw new PayIDError(
    //       PayIDErrorType.UnexpectedResponse,
    //       `${error.response.status} ${error.response.statusText}: ${error.response.data}`,
    //     )
    //   } else {
    //     // Generically errors from the server which contained no response (timeouts, etc).
    //     throw new PayIDError(PayIDErrorType.Unknown, error.message)
    //   }
    // }

    // const address = response.data?.address
    // if (!address) {
    //   throw new PayIDError(
    //     PayIDErrorType.UnexpectedResponse,
    //     'Sucessful response was in an unknown format',
    //   )
    // }
    // return address
  }
}
