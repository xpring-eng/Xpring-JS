import { XrplNetwork } from 'xpring-common-js'
// import GrpcNetworkClient from './network-clients/grpc-xrp-network-client'
// import GrpcNetworkClientWeb from './network-clients/grpc-xrp-network-client.web'
// import { XrpNetworkClient } from './network-clients/xrp-network-client'
// import isNode from '../Common/utils'
//import CoreXrplClient from './core-xrpl-client'
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

/**
 * IssuedCurrencyClient is a client for handling Issued Currencies on the XRPL.
 * @see https://xrpl.org/issued-currencies.html
 */
export default class IssuedCurrencyClient {
  // private coreXrplClient: CoreXrplClient

  // /**
  //  * Create a new IssuedCurrencyClient.
  //  *
  //  * The IssuedCurrencyClient will use gRPC to communicate with the given endpoint.
  //  *
  //  * @param grpcUrl The URL of the gRPC instance to connect to.
  //  * @param network The network this XrpClient is connecting to.
  //  * @param forceWeb If `true`, then we will use the gRPC-Web client even when on Node. Defaults to false. This is mainly for testing and in the future will be removed when we have browser testing.
  //  */
  // public static issuedCurrencyClientWithEndpoint(
  //   grpcUrl: string,
  //   network: XrplNetwork,
  //   forceWeb = false,
  // ): IssuedCurrencyClient {
  //   return isNode() && !forceWeb
  //     ? new IssuedCurrencyClient(new GrpcNetworkClient(grpcUrl), network)
  //     : new IssuedCurrencyClient(new GrpcNetworkClientWeb(grpcUrl), network)
  // }

  /**
   * Create a new IssuedCurrencyClient with a custom network client implementation.
   *
   * In general, clients should prefer to call `issuedCurrencyClientWithEndpoint`. This constructor is provided to improve testability of this class.
   *
   * @param networkClient A network client which will manage remote RPCs to Rippled.
   * @param network The network this XrpClient is connecting to.
   */
  public constructor(readonly network: XrplNetwork) {
    //this.coreXrplClient = new CoreXrplClient(networkClient, network)
  }

  // const accountLinesRequest = {
  //   method: 'account_lines',
  //   params: [
  //     {
  //       account: 'rhhh49pFH96roGyuC4E5P4CHaNjS1k8gzM',
  //     },
  //   ],
  // }

  public async getAccountTrustLines(
    _address: string,
  ): Promise<AxiosResponse<unknown>> {
    //const baseURL = 'test.xrp.xpring.io:51235'
    const baseURL = 'https://s1.ripple.com:51235'
    const instance: AxiosInstance = axios.create({
      baseURL,
    })

    const serverInfoRequest = {
      method: 'server_info',
      params: [
        {
          api_version: 1,
        },
      ],
    }
    const requestOptions: AxiosRequestConfig = {
      url: '/',
      method: 'post',
      data: serverInfoRequest,
      headers: { 'Content-Type': 'application/json' },
    }
    // instance
    //   .request(requestOptions)
    //   .then((response) => {
    //     // process the response if server returns HTTP 200-299
    //     console.log(response)
    //   })
    //   .catch((error) => {
    //     // error handling (you cannot access the response body)
    //     console.log(error)
    //   })
    return await instance.request(requestOptions)
  }
}
