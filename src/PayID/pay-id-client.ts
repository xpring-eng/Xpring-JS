import axios, { AxiosInstance } from 'axios'
import { PayIDUtils } from 'xpring-common-js'
import PayIDError from './pay-id-error'

/* eslint-disable @typescript-eslint/require-await */
// TODO(keefertaylor): Enable lint rules when method is implemented.
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-classes-per-file */

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
  public async xrpAddressForPayID(_payID: string): Promise<string | undefined> {
    const paymentPointer = PayIDUtils.parsePaymentPointer(paymentPointer)
    if (!paymentPointer) {
      throw PayIDError.invalidPaymentPointer
    }

    // TODO(keefertaylor): make this a function on PaymentPointer?
    const url = `https://${paymentPointer.host}/${paymentPointer.path}`
    // TODO(keefertaylor): consider types
    // TODO(keefertaylor): Generalize the below to allow requesting in other types.
    const requestConfig = {
      headers: {
        Accept: 'application/xrp+json',
      },
    }
    const result = await this.axiosInstance.get(url, requestConfig)

    // TODO(keefertaylor): Handle errors.

    // TODO(keefertaylor): properly extract xrp address and tag, format as X-Address.
    return JSON.stringify(result.data)
  }
}
