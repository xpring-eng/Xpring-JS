import {
  WebSocketResponse,
  WebSocketStatusResponse,
} from '../shared/rippled-web-socket-schema'

/**
 * The WebSocketNetworkClientInterface defines the calls available via the rippled WebSocket API.
 */
export interface WebSocketNetworkClientInterface {
  subscribe(
    id: string,
    stream: string,
    callback: (data: WebSocketResponse) => void,
    // TODO make multiple streams/callbacks an option??
  ): Promise<WebSocketStatusResponse>

  // unsubscribe(
  //   id: string,
  //   stream: string,
  //   // TODO make multiple streams/callbacks an option??
  // ): Promise<void>
}
