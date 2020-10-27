import WebSocket = require('ws')
import { XrpError, XrpErrorType } from '../shared'
import {
  WebSocketRequestOptions,
  WebSocketResponse,
  WebSocketStatusResponse,
  WebSocketTransactionResponse,
} from '../shared/rippled-web-socket-schema'

const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

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
  private messageCallbacks: Map<string, (data: WebSocketResponse) => void>
  private waiting: Map<string, WebSocketResponse | undefined>

  /**
   * Create a new WebSocketNetworkClient.
   *
   * @param webSocketUrl The URL of the rippled node to query.
   * @see https://xrpl.org/monitor-incoming-payments-with-websocket.html
   */
  public constructor(
    webSocketUrl: string,
    private handleErrorMessage: (message: string) => void,
  ) {
    this.socket = new WebSocket(webSocketUrl)
    this.accountCallbacks = new Map()
    this.waiting = new Map()

    this.messageCallbacks = new Map()
    this.messageCallbacks.set('response', (data: WebSocketResponse) => {
      const dataStatusResponse = data as WebSocketStatusResponse
      this.waiting.set(dataStatusResponse.id, data)
    })
    this.messageCallbacks.set('transaction', this.handleTransaction)

    this.socket.addEventListener('message', (event) => {
      const parsedData = JSON.parse(event.data) as WebSocketResponse
      const dataType = parsedData.type
      const callback = this.messageCallbacks.get(dataType)
      if (callback) {
        callback(parsedData)
      } else {
        this.handleErrorMessage(
          'Received unhandlable message: ' + (event.data as string),
        )
      }
    })

    this.socket.addEventListener('close', (event) => {
      this.handleErrorMessage(
        'Web socket disconnected, ' + (event.reason as string),
      )
    })

    this.socket.addEventListener('error', (event) => {
      this.handleErrorMessage('Error: ' + (event as string))
    })
  }

  /**
   * Properly handles incoming transactions from the web socket.
   *
   * @param data The web socket response received from the web socket.
   */
  private handleTransaction = (data: WebSocketResponse) => {
    const dataTransaction = data as WebSocketTransactionResponse
    const destinationAccount = dataTransaction.transaction.Destination
    const callback = this.accountCallbacks.get(destinationAccount)
    if (callback) {
      callback(dataTransaction)
    } else {
      throw new XrpError(
        XrpErrorType.Unknown,
        'Received a transaction for an account that has not been subscribed to: ' +
          destinationAccount,
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
      await sleep(5)
    }
    if (this.socket.readyState !== 1) {
      throw new XrpError(XrpErrorType.Unknown, 'Socket is closed/closing')
    }
    this.socket.send(JSON.stringify(request))

    this.waiting.set(request.id, undefined)
    while (this.waiting.get(request.id) === undefined) {
      await sleep(5)
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
   * Submits an account_lines request to the rippled JSON RPC.
   *
   * @param account The XRPL account to query for trust lines.
   */
  public async getAccountLines(
    account: string,
    peerAccount?: string,
  ): Promise<WebSocketStatusResponse> {
    const accountLinesRequest = {
      id: 'account_lines_' + account,
      command: 'account_lines',
      account: account,
      ledger_index: 'validated',
      peer: peerAccount,
    }
    const accountLinesResponse: WebSocketStatusResponse = await this.sendApiRequest(
      accountLinesRequest,
    )
    return accountLinesResponse
  }

  /**
   * Closes the socket.
   */
  public close(): void {
    this.socket.close()
  }
}
