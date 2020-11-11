import {
  TransactionResponse,
  StatusResponse,
  AccountLinesResponse,
  GatewayBalancesResponse,
} from '../shared/rippled-web-socket-schema'

/**
 * The WebSocketNetworkClientInterface defines the calls available via the rippled WebSocket API.
 */
export interface WebSocketNetworkClientInterface {
  /**
   * Subscribes for notification about every validated transaction that affects the given account.
   * @see https://xrpl.org/monitor-incoming-payments-with-websocket.html
   *
   * @param account The account from which to subscribe to incoming transactions, encoded as a classic address.
   * @param callback The function called whenever a new transaction is received.
   * @returns The response from the websocket confirming the subscription.
   */
  subscribeToAccount(
    account: string,
    callback: (data: TransactionResponse) => void,
  ): Promise<StatusResponse>

  /**
   * Submits an account_lines request to the rippled WebSocket API.
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
   * Submits a gateway_balances request to the rippled WebSocket API.
   * @see https://xrpl.org/gateway_balances.html
   *
   * @param account The XRPL account for which to retrieve issued currency balances.
   * @param addressesToExclude (Optional) An array of operational address to exclude from the balances issued.
   * @see https://xrpl.org/issuing-and-operational-addresses.html
   */
  getGatewayBalances(
    account: string,
    addressesToExclude?: Array<string>,
  ): Promise<GatewayBalancesResponse>

  close(): void
}
