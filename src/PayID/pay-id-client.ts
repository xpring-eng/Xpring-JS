import { PayIDUtils } from 'xpring-common-js'
import DefaultApi from './generated/api/DefaultApi'
import ApiClient from './generated/ApiClient'
import PayIDError, { PayIDErrorType } from './pay-id-error'

/**
 * A client for PayID.
 *
 * @warning This class is experimental and should not be used in production applications.
 * TODO(keefertaylor): Export this class in index.ts when it's ready for external consumption.
 */
export default class PayIDClient {
  /**
   * Retrieve the XRP Address authorized with a PayID.
   *
   * @note The returned value will always be in an X-Address format.
   *
   * @param payID The payID to resolve for an address.
   * @returns An XRP address representing the given PayID if one exists, otherwise undefined.
   */
  // TODO(keefertaylor): It's likely that at some point we'll need to store instance state in this class. Make this a non-static
  //                     method until a complete API spec proves it can be static.
  // eslint-disable-next-line class-methods-use-this
  public async xrpAddressForPayID(payID: string): Promise<string | undefined> {
    const paymentPointer = PayIDUtils.parsePaymentPointer(payID)
    if (!paymentPointer) {
      throw PayIDError.invalidPaymentPointer
    }

    // Swagger generates the '/' in the URL by default and the payment pointer's 'path' is prefixed by a '/'. Strip off the leading '/'.
    const path = paymentPointer.path.substring(1)

    const client = new ApiClient()
    client.basePath = `https://${paymentPointer.host}`
    const apiInstance = new DefaultApi(client)

    console.log(`Going to hit ${client.basePath}/${path}`)

    return new Promise((resolve, reject) => {
      // Ignore unused var in generated code.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      apiInstance.resolvePayID(path, (error, data, _response) => {
        console.log(`Err: ${error}`)
        console.log(`Dat: ${data}`)

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
  }
}
