import { XrplNetwork } from 'xpring-common-js'
import GrpcNetworkClient from './network-clients/grpc-xrp-network-client'
import GrpcNetworkClientWeb from './network-clients/grpc-xrp-network-client.web'
import { XrpNetworkClient } from './network-clients/xrp-network-client'
import isNode from '../Common/utils'
import CoreXrplClient from './core-xrpl-client'

/**
 * IssuedCurrencyClient is a client for working with Issued Currencies on the XRPL.
 * @see https://xrpl.org/issued-currencies-overview.html
 */
export default class IssuedCurrencyClient {
  private coreXrplClient: CoreXrplClient

  /**
   * Create a new IssuedCurrencyClient.
   *
   * The IssuedCurrencyClient will use gRPC to communicate with the given endpoint.
   *
   * @param grpcUrl The URL of the gRPC instance to connect to.
   * @param network The network this IssuedCurrencyClient is connecting to.
   * @param forceWeb If `true`, then we will use the gRPC-Web client even when on Node. Defaults to false. This is mainly for testing and in the future will be removed when we have browser testing.
   */
  public static issuedCurrencyClientWithEndpoint(
    grpcUrl: string,
    network: XrplNetwork,
    forceWeb = false,
  ): IssuedCurrencyClient {
    return isNode() && !forceWeb
      ? new IssuedCurrencyClient(new GrpcNetworkClient(grpcUrl), network)
      : new IssuedCurrencyClient(new GrpcNetworkClientWeb(grpcUrl), network)
  }

  /**
   * Create a new IssuedCurrencyClient with a custom network client implementation.
   *
   * In general, clients should prefer to call `issuedCurrencyClientWithEndpoint`. This constructor is provided to improve testability of this class.
   *
   * @param networkClient A network client which will manage remote RPCs to Rippled.
   * @param network The network this IssuedCurrencyClient is connecting to.
   */
  public constructor(
    private readonly networkClient: XrpNetworkClient,
    readonly network: XrplNetwork,
  ) {
    this.coreXrplClient = new CoreXrplClient(networkClient, network)
  }

  public shutUpCompiler(): void {
    console.log(this.networkClient)
    console.log(this.coreXrplClient)
  }
}
