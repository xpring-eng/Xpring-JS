import WebSocket = require('ws')
import {
  WebSocketRequestOptions,
  WebSocketResponse,
  WebSocketStatusResponse,
  WebSocketTransactionResponse,
} from '../shared/rippled-web-socket-schema'

/**
 * A network client for interacting with the rippled WebSocket API.
 * @see https://xrpl.org/rippled-api.html
 */
export default class WebSocketNetworkClient {
  private readonly socket: WebSocket
  private accountCallbacks: Map<
    string,
    (data: WebSocketTransactionResponse) => void
  >
  private callbacks: Map<string, (data: WebSocketResponse) => void>
  private waiting: Map<string, WebSocketResponse | undefined>

  sleep = (ms: number): Promise<void> => {
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
    this.accountCallbacks = new Map()
    this.callbacks = new Map()
    this.waiting = new Map()
    this.callbacks.set('response', (data: WebSocketResponse) => {
      const dataStatusResponse = data as WebSocketStatusResponse
      if (dataStatusResponse.id === undefined) {
        console.log("Response somehow doesn't have an id")
        return
      }
      this.waiting[dataStatusResponse.id] = data
    })
    this.callbacks.set('transaction', (data: WebSocketResponse) => {
      const dataTransaction = data as WebSocketTransactionResponse
      const account = dataTransaction.transaction.Destination
      const callback = this.accountCallbacks.get(account)
      if (callback) {
        callback(dataTransaction)
      } else {
        console.log('WTFFFFFFF', account, callback)
        console.log(data)
      }
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
      console.log('Disconnected...', event.reason)
      // TODO handle this better
    })

    this.socket.addEventListener('error', (event) => {
      console.log('Error: ', event)
      // TODO throw an error somehow - maybe passed into the constructor?
    })
  }

  private async apiRequest(
    options: WebSocketRequestOptions,
  ): Promise<WebSocketStatusResponse> {
    while (this.socket.readyState === 0) {
      await this.sleep(5)
    }
    this.socket.send(JSON.stringify(options))

    this.waiting[options.id] = undefined
    while (this.waiting[options.id] === undefined) {
      await this.sleep(5)
    }
    const response = this.waiting[options.id]
    this.waiting.delete(options.id)

    return response as WebSocketStatusResponse
  }

  private addCallback(
    account: string,
    callback: (data: WebSocketTransactionResponse) => void,
  ): void {
    // TODO figure out if there are more exceptions
    this.accountCallbacks.set(account, callback)
  }

  public async subscribeToAccount(
    id: string,
    callback: (data: WebSocketTransactionResponse) => void,
    account: string,
    // TODO make multiple streams/callbacks an option??
  ): Promise<WebSocketStatusResponse> {
    this.addCallback(account, callback)
    const options = {
      id,
      command: 'subscribe',
      accounts: [account],
    }
    const response = await this.apiRequest(options)
    if (response.status !== 'success') {
      console.error('Error subscribing: ', response)
      // TODO throw descriptive error
    }
    return response
  }

  public close(): void {
    this.socket.close()
  }
}
