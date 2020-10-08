import { XrplNetwork } from 'xpring-common-js'
import GrpcNetworkClient from './network-clients/grpc-xrp-network-client'
import GrpcNetworkClientWeb from './network-clients/grpc-xrp-network-client.web'
import { XrpNetworkClient } from './network-clients/xrp-network-client'
import isNode from '../Common/utils'
import CoreXrplClient from './core-xrpl-client'
import TrustLine from './shared/trustline'
import JsonRpcNetworkClient from './network-clients/json-rpc-network-client'
import { AccountLinesResponseJson } from './shared/json-schema'
import { AxiosResponse } from 'axios'

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
    jsonUrl: string,
    network: XrplNetwork,
    forceWeb = false,
  ): IssuedCurrencyClient {
    return isNode() && !forceWeb
      ? new IssuedCurrencyClient(
          new GrpcNetworkClient(grpcUrl),
          new JsonRpcNetworkClient(jsonUrl),
          network,
        )
      : new IssuedCurrencyClient(
          new GrpcNetworkClientWeb(grpcUrl),
          new JsonRpcNetworkClient(jsonUrl),
          network,
        )
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
    private readonly grpcNetworkClient: XrpNetworkClient,
    private readonly jsonNetworkClient: JsonRpcNetworkClient,
    readonly network: XrplNetwork,
  ) {
    this.coreXrplClient = new CoreXrplClient(grpcNetworkClient, network)
  }

  public shutUpCompiler(): void {
    console.log(this.grpcNetworkClient)
    console.log(this.coreXrplClient)
  }

  /**
   * Retrieves information about an account's trust lines, which maintain balances of all non-XRP currencies and assets.
   * @see https://xrpl.org/trust-lines-and-issuing.html
   *
   * @param account The account for which to retrieve associated trust lines.
   * @returns An array of TrustLine objects, representing all trust lines associated with this account.
   */
  public async getTrustLines(account: string): Promise<Array<TrustLine>> {
    // TODO: consider an option for including the 'peer' param in the request, which limits the returned trust lines to only
    // those shared between the two accounts. (This would have to be an argument to the method too.)
    const accountLinesRequest = {
      method: 'account_lines',
      params: [
        {
          account: account,
          ledger_index: 'validated',
        },
      ],
    }
    const axiosResponse: AxiosResponse = await this.jsonNetworkClient.submitRequest(
      accountLinesRequest,
    )
    const accountLinesResponse: AccountLinesResponseJson = axiosResponse.data

    const trustLines: Array<TrustLine> = []
    for (const trustLineJson of accountLinesResponse.result.lines) {
      const trustLine = new TrustLine(trustLineJson)
      trustLines.push(trustLine)
    }
    return trustLines
  }
}
