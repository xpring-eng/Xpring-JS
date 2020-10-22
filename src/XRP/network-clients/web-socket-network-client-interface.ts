import {
  WebSocketResponse,
  WebSocketStatusResponse,
} from '../shared/rippled-web-socket-schema'

/**
 * The WebSocketNetworkClientInterface defines the calls available via the rippled WebSocket API.
 */
export interface WebSocketNetworkClientInterface {
  subscribeToAccount(
    id: string,
    callback: (data: WebSocketResponse) => void,
    account: string,
  ): Promise<WebSocketStatusResponse>

  // unsubscribe(
  //   id: string,
  //   stream: string,
  //   // TODO make multiple streams/callbacks an option??
  // ): Promise<void>

  close(): void
}
