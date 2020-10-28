import {
  AccountLinesResponse,
  GatewayBalancesResponse,
} from '../shared/rippled-json-rpc-schema'

/**
 * The JsonNetworkClientInterface defines the calls available via the rippled JSON-RPC.
 */
export interface JsonNetworkClientInterface {
  /**
   * Submits an account_lines request to the rippled JSON RPC.
   * @see https://xrpl.org/account_lines.html
   *
   * @param account The address of the account to query for trust lines.
   * @param peerAccount (Optional) The address of a second account. If provided, show only trust lines connecting the two accounts.
   */
  getAccountLines(
    account: string,
    peerAccount?: string,
  ): Promise<AccountLinesResponse>

  /**
   * Submits a gateway_balances request to the rippled JSON RPC.
   * @see https://xrpl.org/gateway_balances.html
   *
   * @param account The XRPL account for which to retrieve balances.
   * @param addressesToExclude (Optional) An array of operational address to exclude from the balances issued.
   * @see https://xrpl.org/issuing-and-operational-addresses.html
   */
  getGatewayBalances(
    account: string,
    addressesToExclude?: Array<string>,
  ): Promise<GatewayBalancesResponse>
}
