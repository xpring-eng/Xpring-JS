/**
 * The WebSocketNetworkClientInterface defines the calls available via the rippled WebSocket API.
 */
export interface WebSocketNetworkClientInterface {
  subscribe(
    id: string,
    stream: string,
    callback: (data: any) => void,
    // TODO make multiple streams/callbacks an option??
  ): Promise<void>

  // unsubscribe(
  //   id: string,
  //   stream: string,
  //   // TODO make multiple streams/callbacks an option??
  // ): Promise<void>
}
