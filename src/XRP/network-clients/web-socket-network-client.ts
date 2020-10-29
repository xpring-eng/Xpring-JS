import WebSocket = require('ws')
import { XrpError, XrpErrorType } from '../shared'
import {
  AccountLinesResponse,
  GatewayBalancesResponse,
  WebSocketRequest,
  StatusResponse,
  TransactionResponse,
  WebSocketReadyState,
  RippledMethod,
  WebSocketResponse,
  WebSocketFailureResponse,
} from '../shared/rippled-web-socket-schema'

function sleep(ms: number): Promise<void> {
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
    (data: TransactionResponse) => void
  > = new Map()
  private messageCallbacks: Map<
    string,
    (data: WebSocketResponse) => void
  > = new Map()
  private waiting: Map<
    number | string,
    WebSocketResponse | undefined
  > = new Map()

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
    this.messageCallbacks.set('response', (data: WebSocketResponse) => {
      const dataStatusResponse = data as StatusResponse
      this.waiting.set(dataStatusResponse.id, data)
    })
    this.messageCallbacks.set('transaction', (data: WebSocketResponse) =>
      this.handleTransaction(data as TransactionResponse),
    )

    this.socket.addEventListener('message', (event) => {
      const parsedData = JSON.parse(event.data) as WebSocketResponse
      const messageType = parsedData.type
      const callback = this.messageCallbacks.get(messageType)
      if (callback) {
        callback(parsedData)
      } else {
        this.handleErrorMessage(
          'Received unhandlable message: ${event.data as string}',
        )
      }
    })

    this.socket.addEventListener('close', (event: CloseEvent) => {
      this.handleErrorMessage('Web socket disconnected, ' + event.reason)
    })

    this.socket.addEventListener('error', (event: ErrorEvent) => {
      this.handleErrorMessage('Error: ' + event.message)
    })
  }

  /**
   * Properly handles incoming transactions from the web socket.
   *
   * @param data The web socket response received from the web socket.
   */
  private handleTransaction(data: TransactionResponse) {
    const destinationAccount = data.transaction.Destination
    const destinationCallback = this.accountCallbacks.get(destinationAccount)

    const senderAccount = data.transaction.Account
    const senderCallback = this.accountCallbacks.get(senderAccount)

    if (destinationCallback) {
      destinationCallback(data)
    }
    if (senderCallback) {
      senderCallback(data)
    }

    if (!destinationCallback && !senderCallback) {
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
    request: WebSocketRequest,
  ): Promise<WebSocketResponse> {
    while (this.socket.readyState === WebSocketReadyState.Connecting) {
      await sleep(5)
    }
    if (this.socket.readyState !== WebSocketReadyState.Open) {
      throw new XrpError(XrpErrorType.Unknown, 'Socket is closed/closing')
    }
    this.socket.send(JSON.stringify(request))

    this.waiting.set(request.id, undefined)
    let response = this.waiting.get(request.id)
    while (response === undefined) {
      await sleep(5)
      response = this.waiting.get(request.id)
    }
    this.waiting.delete(request.id)

    return response
  }

  /**
   * Subscribes for notification about every validated transaction that affects the given account.
   * @see https://xrpl.org/monitor-incoming-payments-with-websocket.html
   *
   * @param account The account from which to subscribe to incoming transactions, encoded as a classic address.
   * @param subscriptionId The ID used for the subscription.
   * @param callback The function called whenever a new transaction is received.
   * @returns The response from the websocket confirming the subscription.
   */
  public async subscribeToAccount(
    account: string,
    subscriptionId: string,
    callback: (data: TransactionResponse) => void,
  ): Promise<StatusResponse> {
    const options = {
      id: subscriptionId,
      command: RippledMethod.subscribe,
      accounts: [account],
    }
    const response = await this.sendApiRequest(options)
    if (response.status !== 'success') {
      const errorResponse = response as WebSocketFailureResponse
      throw new XrpError(
        XrpErrorType.Unknown,
        `Subscription request for ${account} failed, ${errorResponse.error_message}`,
      )
    }
    this.accountCallbacks.set(account, callback)
    return response as StatusResponse
  }

  /**
   * Submits an account_lines request to the rippled Web Socket API.
   *
   * @param account The XRPL account to query for trust lines.
   */
  public async getAccountLines(
    account: string,
    peerAccount?: string,
  ): Promise<AccountLinesResponse> {
    const accountLinesRequest = {
      id: 'account_lines_' + account,
      command: 'account_lines',
      account,
      ledger_index: 'validated',
      peer: peerAccount,
    }
    const accountLinesResponse = await this.sendApiRequest(accountLinesRequest)
    return accountLinesResponse as AccountLinesResponse
  }

  /**
   * Submits a gateway_balances request to the rippled JSON RPC.
   * @see https://xrpl.org/gateway_balances.html
   *
   * @param account The XRPL account for which to retrieve balances.
   * @param addressesToExclude (Optional) An array of operational address to exclude from the balances issued.
   * @see https://xrpl.org/issuing-and-operational-addresses.html
   */
  public async getGatewayBalances(
    account: string,
    addressesToExclude?: Array<string>,
  ): Promise<GatewayBalancesResponse> {
    const gatewayBalancesRequest = {
      id: 'gateway_balances_' + account,
      command: 'gateway_balances',
      account,
      strict: 'true',
      hotwallet: addressesToExclude,
      ledger_index: 'validated',
    }
    const gatewayBalancesResponse = await this.sendApiRequest(
      gatewayBalancesRequest,
    )
    return gatewayBalancesResponse as GatewayBalancesResponse
  }

  /**
   * Closes the socket.
   */
  public close(): void {
    this.socket.close()
  }
}
