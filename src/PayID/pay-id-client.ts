/* eslint-disable max-classes-per-file */
import { PayIdUtils } from 'xpring-common-js'
import PayIdError, { PayIdErrorType } from './pay-id-error'
import { Address, DefaultApi, CryptoAddressDetails } from './Generated/api'
import * as PayIDSign from 'payid-sign'
import * as dns from 'dns'

const PAYID_API_VERSION = '1.0'

/* eslint-disable */

interface PayIDComponents {
  host: string
  path: string
}

/**
 * A client for PayID.
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
   * @param useHttps Whether to cuse HTTPS when making PayID requests. Most users should set this to 'true' to avoid
   *                 Man-in-the-Middle attacks. Exposed as an option for testing purposes. Defaults to true.
   */
  constructor(private readonly useHttps: boolean = true) {}

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
   * Retrieve all addresses associated with a PayId.
   *
   * @param payId The PayID to resolve.
   */
  async allAddressesForPayId(payId: string): Promise<Array<Address>> {
    return this.addressesForPayIdAndNetwork(payId, 'payid')
  }

  /**
   * Look up a DNS txt record and return as a promise
   *
   * @param domain the domain name to look up for example arthur._payid.mydomain.com
   */
  private async lookupDnsTxt(
    domain:string
  ): Promise<string> {
    return new Promise((resolve, reject) => {
        dns.resolveTxt(domain, (err: any | null, addresses: string[][]) => {
            if(err) reject(err)
            try {
                resolve(addresses[0].join(''))
            } catch (error) {
                reject('no txt record')
            }
        })
    })
  }

  /**
   * Return an array of {@link Address}es that match the inputs.
   *
   * @param payId The PayID to resolve.
   * @param network The network to resolve on.
   */
  public async addressesForPayIdAndNetwork(
    payId: string,
    network: string,
  ): Promise<Array<Address>> {
    const payIdComponents = PayIdClient.parsePayId(payId)
    const basePath = this.useHttps
      ? `https://${payIdComponents.host}`
      : `http://${payIdComponents.host}`

    // Swagger API adds the leading '/' in path automatically because it is part of the endpoint.
    const path = payIdComponents.path.substring(1)

    // First check if there is a DNS entry for this PayID, and use it preferentially if there is
    const identifier = path.replace(/\+.+$/,'')
    const domain = network + "." + identifier + "._payid." + payIdComponents.host
    try {
        const payload = await this.lookupDnsTxt(domain);
        // execution to here is a DNS hit so process the DNS txt payload
        if (PayIDSign.verify_signed_payid( identifier + '$' + payIdComponents.host, payload )) {
            // if the DNS payload is not verified we will fall through to regular protocol,
            // however if it is verified we will now return based on the DNS payload
            var ret = JSON.parse(payload)
            delete ret['signature'] 
            delete ret['publicKey']
            return [ret]
        } 
    } catch (error) {
        // this is a DNS miss, so continue executing along the normal path
    }

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
          new PayIdError(
            PayIdErrorType.UnexpectedResponse,
            'Too many addresses returned',
          ),
        )
      }
    } catch (error) {
      if (error.response?.status === 404) {
        const message = `Could not resolve ${payId} on network ${network}`
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
      throw PayIdError.invalidPayId
    }
    return {
      host: payIdComponents.host,
      path: payIdComponents.path,
    }
  }
}
