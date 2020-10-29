/* Schema for adding type information to Web Socket objects. */

/**
 * The standard format for a request to the Web Socket API exposed by a rippled node.
 * @see https://xrpl.org/request-formatting.html
 */
type WebSocketRequest =
  | SubscribeRequest
  | AccountLinesRequest
  | GatewayBalancesRequest

interface BaseRequest {
  id: number | string
  command: RippledMethod
}

interface SubscribeRequest extends BaseRequest {
  streams?: string[]
  accounts?: string[]
}

interface AccountLinesRequest extends BaseRequest {
  account: string
  ledger_index?: string
  peer?: string
}

interface GatewayBalancesRequest extends BaseRequest {
  account: string
  strict: boolean
  hotwallet: string | string[]
  ledger_index: number | string
}

/**
 * The options for rippled methods (the `command` parameter in WebSocketRequestOptions)
 *
 * This is currently only the supported operations, but more will be added as they are supported.
 * @see https://xrpl.org/public-rippled-methods.html
 */
enum RippledMethod {
  subscribe = 'subscribe',
  accountLines = 'account_lines',
  gatewayBalances = 'gateway_balances',
}

enum WebSocketReadyState {
  Connecting,
  Open,
  Closing,
  Closed,
}

interface BaseResponse {
  id: number | string
  status: string
  type: string
}

type WebSocketResponse =
  | StatusResponse
  | TransactionResponse
  | AccountLinesResponse
  | GatewayBalancesResponse

type StatusResponse = StatusSuccessfulResponse | WebSocketFailureResponse

/**
 * The standard format for a response from the WebSocket API exposed by a rippled node.
 * @see https://xrpl.org/response-formatting.html
 */
interface StatusSuccessfulResponse extends BaseResponse {
  result: TransactionResponse | EmptyObject
}

interface WebSocketFailureResponse extends BaseResponse {
  error: string
  error_code: number
  error_message: string
  request: WebSocketRequest
}

type AccountLinesResponse =
  | AccountLinesSuccessfulResponse
  | WebSocketFailureResponse

interface AccountLinesSuccessfulResponse extends BaseResponse {
  result: {
    account: string
    ledger_hash: string
    ledger_index: number
    lines: Array<TrustLineResponse>
    validated: boolean
  }
}

type GatewayBalancesResponse =
  | GatewayBalancesSuccessfulResponse
  | WebSocketFailureResponse

/**
 * The standard format for a response from the WebSocket API for a transaction on the ledger.
 * @see https://xrpl.org/subscribe.html#transaction-streams
 */
interface TransactionResponse {
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

interface GatewayBalancesSuccessfulResponse extends BaseResponse {
  result: {
    account?: string
    assets?: { [account: string]: CurrencyValuePair[] }
    balances?: { [account: string]: CurrencyValuePair[] }
    ledger_hash?: string
    ledger_index?: number
    obligations?: { [currencyCode: string]: string }
    validated?: boolean
  }
}

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

interface TrustLineResponse {
  account: string
  balance: string
  currency: string
  limit: string
  limit_peer: string
  quality_in: number
  quality_out: number
  no_ripple?: boolean
  no_ripple_peer?: boolean
  authorized?: boolean
  peer_authorized?: boolean
  freeze?: boolean
  freeze_peer?: boolean
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

interface CurrencyValuePair {
  currency: string
  value: string
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
  WebSocketRequest,
  WebSocketResponse,
  WebSocketFailureResponse,
  StatusResponse,
  TransactionResponse,
  AccountLinesResponse,
  AccountLinesSuccessfulResponse,
  GatewayBalancesResponse,
  GatewayBalancesSuccessfulResponse,
  WebSocketReadyState,
  RippledMethod,
  WebSocketTransaction,
  TrustLineResponse,
}
