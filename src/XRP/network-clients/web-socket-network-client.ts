import WebSocket = require('ws')
import { XrpError, XrpErrorType } from '../shared'
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
        throw new XrpError(
          XrpErrorType.Unknown,
          'Response type does not contain an id',
        )
      }
      this.waiting.set(dataStatusResponse.id, data)
    })
    this.callbacks.set('transaction', this.handleTransaction)

    this.socket.addEventListener('message', (event) => {
      const parsedData = JSON.parse(event.data) as WebSocketResponse
      const dataType = parsedData.type
      const callback = this.callbacks.get(dataType)
      if (callback) {
        callback(parsedData)
      } // else {
      //   // TODO handle this better - maybe same as the error event listener
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

  /**
   * Properly handles incoming transactions from the web socket.
   *
   * @param data The web socket response received from the web socket.
   */
  private handleTransaction = (data: WebSocketResponse) => {
    const dataTransaction = data as WebSocketTransactionResponse
    const account = dataTransaction.transaction.Destination
    const callback = this.accountCallbacks.get(account)
    if (callback) {
      callback(dataTransaction)
    } else {
      console.log('bad transaction')
      throw new XrpError(
        XrpErrorType.Unknown,
        'Received a transaction for an account that has not been subscribed to: ' +
          account,
      )
    }
  }

  /**
   * Sends an API request over the web socket connection.
   *
   * @param request The object to send over the web socket.
   * @returns The API response from the web socket.
   */
  private async sendApiRequest(
    request: WebSocketRequestOptions,
  ): Promise<WebSocketStatusResponse> {
    while (this.socket.readyState === 0) {
      await this.sleep(5)
    }
    if (this.socket.readyState !== 1) {
      throw new XrpError(XrpErrorType.Unknown, 'Socket is closed')
    }
    this.socket.send(JSON.stringify(request))

    this.waiting.set(request.id, undefined)
    while (this.waiting.get(request.id) === undefined) {
      await this.sleep(5)
    }
    const response = this.waiting.get(request.id)
    this.waiting.delete(request.id)

    return response as WebSocketStatusResponse
  }

  /**
   * Subscribes to incoming transactions to a given account.
   * @see https://xrpl.org/monitor-incoming-payments-with-websocket.html
   *
   * @param id The ID used for the subscription.
   * @param callback The function called whenever a new transaction is received.
   * @param account The account from which to subscribe to incoming transactions, encoded as a classic address.
   * @returns The response from the websocket confirming the subscription.
   */
  public async subscribeToAccount(
    id: string,
    callback: (data: WebSocketTransactionResponse) => void,
    account: string,
  ): Promise<WebSocketStatusResponse> {
    this.accountCallbacks.set(account, callback)
    const options = {
      id,
      command: 'subscribe',
      accounts: [account],
    }
    const response = await this.sendApiRequest(options)
    if (response.status !== 'success') {
      throw new XrpError(
        XrpErrorType.Unknown,
        'Subscription request for ' + account + ' failed',
      )
    }
    return response
  }

  /**
   * Closes the socket.
   */
  public close(): void {
    this.socket.close()
  }
}
