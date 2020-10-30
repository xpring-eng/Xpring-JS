import {
  WebSocketTransactionResponse,
  WebSocketStatusResponse,
} from '../shared/rippled-web-socket-schema'

/**
 * The WebSocketNetworkClientInterface defines the calls available via the rippled WebSocket API.
 */
export interface WebSocketNetworkClientInterface {
  /**
   * Subscribes to incoming transactions to a given account.
   * @see https://xrpl.org/monitor-incoming-payments-with-websocket.html
   *
   * @param account The account from which to subscribe to incoming transactions, encoded as an X-Address.
   * @param subscriptionId The ID used for the subscription.
   * @param callback The function called whenever a new transaction is received.
   * @returns The response from the websocket confirming the subscription.
   */
  subscribeToAccount(
    account: string,
    subscriptionId: string,
    callback: (data: WebSocketTransactionResponse) => void,
  ): Promise<WebSocketStatusResponse>

  close(): void
}
