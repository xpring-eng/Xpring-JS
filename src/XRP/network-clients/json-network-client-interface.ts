import { AccountLinesResponse } from '../shared/rippled-json-rpc-schema'

/**
 * The JsonNetworkClientInterface defines the calls available via the rippled JSON-RPC.
 */
export interface JsonNetworkClientInterface {
  getAccountLines(account: string): Promise<AccountLinesResponse>

  /**
   * Submits a gateway_balances request to the rippled JSON RPC.
   * @see https://xrpl.org/gateway_balances.html
   *
   * @param account The XRPL account for which to retrieve balances.
   * @param hotwallet (Optional) An operational address to exclude from the balances issued, or an array of such addresses.
   * @see https://xrpl.org/issuing-and-operational-addresses.html
   */
  getGatewayBalances(
    account: string,
    hotwallet?: string | Array<string>,
  ): Promise<GatewayBalancesResponse>
}
