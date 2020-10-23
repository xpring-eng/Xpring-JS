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
   * @param id The ID used for the subscription.
   * @param callback The function called whenever a new transaction is received.
   * @param account The account from which to subscribe to incoming transactions, encoded as an X-Address.
   * @returns The response from the websocket confirming the subscription.
   */
  subscribeToAccount(
    id: string,
    callback: (data: WebSocketTransactionResponse) => void,
    account: string,
  ): Promise<WebSocketStatusResponse>

  // unsubscribe(
  //   id: string,
  //   stream: string,
  //   // TODO make multiple streams/callbacks an option??
  // ): Promise<void>

  close(): void
}
