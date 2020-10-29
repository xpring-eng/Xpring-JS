/* Schema for adding type information to Web Socket objects. */

enum WebSocketReadyState {
  Connecting,
  Open,
  Closing,
  Closed,
}

/**
 * The options for rippled methods (the `command` parameter in WebSocketRequestOptions)
 *
 * This is currently only the supported operations, but more will be added as they are supported.
 * @see https://xrpl.org/public-rippled-methods.html
 */
enum RippledMethod {
  subscribe = 'subscribe',
}

/**
 * The standard format for a request to the Web Socket API exposed by a rippled node.
 * @see https://xrpl.org/request-formatting.html
 */
interface WebSocketRequestOptions {
  command: RippledMethod
  id: string
  streams?: string[]
  accounts?: string[]
}

type WebSocketResponse =
  | WebSocketStatusResponse
  | WebSocketTransactionResponse
  | WebSocketStatusErrorResponse

/**
 * The standard format for a response from the WebSocket API exposed by a rippled node.
 * @see https://xrpl.org/response-formatting.html
 */
interface WebSocketStatusResponse {
  id: string
  result: WebSocketTransactionResponse | EmptyObject
  status: string
  type: string
}

/**
 * The standard format for an error response from the WebSocket API exposed by a rippled node.
 * @see https://xrpl.org/response-formatting.html
 */
interface WebSocketStatusErrorResponse {
  id: string
  status: string
  type: string
  error: string
  error_code: number
  error_message: string
  request: WebSocketRequestOptions
}

/**
 * The standard format for a response from the WebSocket API for a transaction on the ledger.
 * @see https://xrpl.org/subscribe.html#transaction-streams
 */
interface WebSocketTransactionResponse {
  engine_result: string
  engine_result_code: number
  engine_result_message: string
  ledger_hash: string
  ledger_index: number
  meta: {
    AffectedNodes: ChangedNode[]
    TransactionIndex: number
    TransactionResult: string
    delivered_amount?: string
  }
  status: string
  transaction: WebSocketTransaction
  type: string
  validated: boolean
}

type ChangedNode = CreatedNode | ModifiedNode | DeletedNode

/**
 * The standard format for a response from the WebSocket API about a new created node on the ledger.
 * @see https://xrpl.org/subscribe.html#transaction-streams
 */
interface CreatedNode {
  LedgerEntryType: string
  LedgerIndex: string
  NewFields: {
    Account: string
    Balance: string
    Sequence: number
  }
}

/**
 * The standard format for a response from the WebSocket API about a modified node on the ledger.
 * @see https://xrpl.org/subscribe.html#transaction-streams
 */
interface ModifiedNode {
  FinalFields: {
    Account: string
    Balance: string
    Flags: number
    OwnerCount: number
    Sequence: number
  }
  LedgerEntryType: string
  LedgerIndex: string
  PreviousFields: {
    Balance: string
    OwnerCount?: number
    Sequence?: number
  }
  PreviousTxnID: string
  PreviousTxnLgrSeq: number
}

/**
 * The standard format for a response from the WebSocket API about a deleted node on the ledger.
 * @see https://xrpl.org/subscribe.html#transaction-streams
 */
interface DeletedNode {
  FinalFields: {
    ExchangeRate: string
    Flags: number
    RootIndex: string
    TakerGetsCurrency: string
    TakerGetsIssuer: string
    TakerPaysCurrency: string
    TakerPaysIssuer: string
  }
  LedgerEntryType: string
  LedgerIndex: string
}

/**
 * The standard format for a response from the WebSocket API about a transaction.
 * @see https://xrpl.org/subscribe.html#transaction-streams
 */
interface WebSocketTransaction {
  Account: string
  Amount: string
  Destination: string
  Fee: string
  Flags: number
  LastLedgerSequence: number
  Sequence: number
  SigningPubKey: string
  TransactionType: string
  TxnSignature: string
  date: number
  hash: string
}

/**
 * Helper type to signify {} (an empty type).
 */
type EmptyObject = Record<never, never>

export {
  WebSocketReadyState,
  RippledMethod,
  WebSocketRequestOptions,
  WebSocketResponse,
  WebSocketStatusResponse,
  WebSocketStatusErrorResponse,
  WebSocketTransaction,
  WebSocketTransactionResponse,
}
