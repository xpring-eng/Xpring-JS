import WebSocket from 'ws'
// import { WebSocketNetworkClientInterface } from './web-socket-network-client-interface'

/**
 * A network client for interacting with the rippled WebSocket API.
 * @see https://xrpl.org/rippled-api.html
 */
export default class WebSocketNetworkClient {
  private readonly socket: WebSocket
  private callbacks: Map<string, (data: any) => void>
  private waiting: Map<string, any | undefined>

  sleep = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  /**
   * Create a new WebSocketNetworkClient.
   *
   * @param webSocketUrl The URL of the rippled node to query.
   * @see https://xrpl.org/monitor-incoming-payments-with-websocket.html
   */
  public constructor(webSocketUrl: string) {
    this.socket = new WebSocket(webSocketUrl)
    this.callbacks = new Map()
    this.waiting = new Map()
    this.callbacks.set('response', (data: any) => {
      this.waiting[data.id] = data
    })

    this.socket.addEventListener('message', (event) => {
      const parsedData = JSON.parse(event.data)
      const dataType: string = parsedData.type
      const callback = this.callbacks.get(dataType)
      if (callback !== undefined) {
        callback(parsedData)
      } // else {
      //   console.log('Unhandled message from server', parsedData)
      //   // TODO handle this better
      // }
    })

    this.socket.addEventListener('close', (event) => {
      console.log('Disconnected...', event)
      // TODO handle this better
    })

    this.socket.addEventListener('error', (event) => {
      console.log('Error: ', event)
      // TODO throw an error somehow - maybe passed into the constructor?
    })
  }

  private async sendMessage(message): Promise<void> {
    while (this.socket.readyState === 0) {
      await this.sleep(5)
    }
    this.socket.send(JSON.stringify(message))
  }

  private async apiRequest(options): Promise<any> {
    await this.sendMessage(options)
    this.waiting[options.id] = undefined
    while (this.waiting[options.id] === undefined) {
      await this.sleep(5)
    }
    this.waiting.delete(options.id)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.waiting[options.id]
  }

  private addCallback(type: string, callback: (data: any) => void) {
    // TODO figure out if there are more exceptions
    if (type === 'ledger') {
      this.callbacks.set('ledgerClosed', callback)
    } else {
      this.callbacks.set(type, callback)
    }
  }

  public async subscribe(
    id: string,
    stream: string,
    callback: (data: any) => void,
    // TODO make multiple streams/callbacks an option??
  ): Promise<void> {
    this.addCallback(stream, callback)
    const response = await this.apiRequest({
      id,
      command: 'subscribe',
      streams: [stream],
    })
    if (response.status !== 'success') {
      console.error('Error subscribing: ', response)
      // TODO throw descriptive error
    }
  }
}
