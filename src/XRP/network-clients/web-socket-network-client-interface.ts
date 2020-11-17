import {
  TransactionResponse,
  StatusResponse,
  AccountLinesResponse,
  GatewayBalancesResponse,
  IssuedCurrency,
  RipplePathFindResponse,
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
   * @returns The response from the websocket confirming the subscription.
   */
  subscribeToAccount(
    account: string,
    callback: (data: TransactionResponse) => void,
  ): Promise<StatusResponse>

  /**
   * Unsubscribes from notifications about every validated transaction that affects the given account.
   * @see https://xrpl.org/unsubscribe.html
   *
   * @param account The account from which to unsubscribe from incoming transactions, encoded as a classic address.
   * @returns The response from the websocket confirming the unsubscription.
   */
  unsubscribeFromAccount(account: string): Promise<StatusResponse>

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

  /**
   * Submits a ripple_path_find request to the rippled WebSocket API.
   * @see https://xrpl.org/ripple_path_find.html
   *
   * @param sourceAccount TODO: (mvadari) fill this out
   */
  findRipplePath(
    sourceAccount: string,
    destinationAccount: string,
    destinationAmount: string | IssuedCurrency,
    sendMax?: string | IssuedCurrency,
  ): Promise<RipplePathFindResponse>

  close(): void
}
