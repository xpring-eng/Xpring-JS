import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { PayIDUtils } from 'xpring-common-js'
import PayIDError, { PayIDErrorType } from './pay-id-error'

/**
 * A client for PayID.
 *
 * @warning This class is experimental and should not be used in production applications.
 * TODO(keefertaylor): Export this class in index.ts when it's ready for external consumption.
 */
export default class PayIDClient {
  /** An HTTP client. */
  private readonly axiosInstance: AxiosInstance

  public constructor() {
    this.axiosInstance = axios.create({})
  }

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
    console.log('HI')
    if (!paymentPointer) {
      console.log('Thrwoing invalid pointer')
      throw PayIDError.invalidPaymentPointer
    }

    console.log('Continuing')

    const url = `https://${paymentPointer.host}${paymentPointer.path}`
    console.log(`hitting ${url}`)
    // TODO(keefertaylor): Attach network parameter.
    // TODO(keefertaylor): Generalize the below to allow requesting in other types.
    const requestConfig = {
      headers: {
        Accept: 'application/xrp+json',
      },
    }

    return this.axiosInstance
      .get(url, requestConfig)
      .then((result: AxiosResponse) => {
        // TODO(keefertaylor): properly extract xrp address and tag, format as X-Address.
        // TODO(keefertaylor): convert to X-Address on the fly if needed.
        const { address } = result.data
        if (!address) {
          console.log(`throwing${PayIDErrorType.UnexpectedResponse}`)

          throw new PayIDError(
            PayIDErrorType.UnexpectedResponse,
            'Sucessful response was in an unknown format',
          )
        }
        console.log('returning')
        return address
      })
      .catch((error) => {
        console.log('caught error')

        // Handle erroneous responses from the server.
        if (error.response) {
          // 404 means no mapping was found.
          if (error.response.status === 404) {
            return undefined
          }

          // Otherwise re-throw the error as an unexepected response.
          throw new PayIDError(
            PayIDErrorType.UnexpectedResponse,
            `${error.response.status} ${error.response.statusText}: ${error.response.data}`,
          )
        } else {
          // Generically errors from the server which contained no response (timeouts, etc).
          throw new PayIDError(PayIDErrorType.Unknown, error.message)
        }
      })
  }
}
