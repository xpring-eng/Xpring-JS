/* Schema for adding type information to WebSocket objects. */

import IssuedCurrency from './issued-currency'

/**
 * The options for the `readyState` of a websocket.
 */
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
  unsubscribe = 'unsubscribe',
  accountLines = 'account_lines',
  gatewayBalances = 'gateway_balances',
  accountOffers = 'account_offers',
  ripplePathFind = 'ripple_path_find',
}

enum ResponseStatus {
  success = 'success',
  error = 'error',
}

/**
 * The standard format for a request to the WebSocket API exposed by a rippled node.
 * @see https://xrpl.org/request-formatting.html
 */
type WebSocketRequest =
  | SubscribeRequest
  | AccountLinesRequest
  | GatewayBalancesRequest
  | AccountOffersRequest
  | RipplePathFindRequest

interface BaseRequest {
  id: number | string
  command: RippledMethod
}

/**
 * The standard format for a `subscribe` request to the Web Socket API.
 * @see https://xrpl.org/subscribe.html
 */
interface SubscribeRequest extends BaseRequest {
  streams?: string[]
  accounts?: string[]
}

/**
 * The standard format for an `account_lines` request to the Web Socket API.
 * @see https://xrpl.org/account_lines.html
 */
interface AccountLinesRequest extends BaseRequest {
  account: string
  ledger_index?: string
  peer?: string
}

/**
 * The standard format for a `gateway_balances` request to the Web Socket API.
 * @see https://xrpl.org/gateway_balances.html
 */
interface GatewayBalancesRequest extends BaseRequest {
  account: string
  strict?: boolean
  hotwallet?: string | string[]
  ledger_index?: number | string
}

/**
 * The standard format for an `account_offers` request to the Web Socket API.
 * @see https://xrpl.org/account_offers.html
 */
interface AccountOffersRequest extends BaseRequest {
  account: string
}

/**
 * The standard format for a `ripple_path_find` request to the Web Socket API.
 * @see https://xrpl.org/ripple_path_find.html
 */
interface RipplePathFindRequest extends BaseRequest {
  source_account: string
  destination_account: string
  destination_amount: string | IssuedCurrency
  send_max?: string | IssuedCurrency
  source_currencies?: SourceCurrency[]
}

/**
 * The common elements in a response from the WebSocket API exposed by a rippled node.
 * @see https://xrpl.org/response-formatting.html
 */
interface BaseResponse {
  id: number | string
  status: ResponseStatus
  type: string
}

type WebSocketResponse =
  | StatusResponse
  | TransactionResponse
  | AccountLinesResponse
  | GatewayBalancesResponse
  | AccountOffersResponse
  | RipplePathFindResponse

type StatusResponse = StatusSuccessfulResponse | WebSocketFailureResponse

/**
 * The standard format for a direct response from the WebSocket API to a request.
 * @see https://xrpl.org/response-formatting.html
 */
interface StatusSuccessfulResponse extends BaseResponse {
  result: TransactionResponse | EmptyObject
}

/**
 * The standard format for an error response from the WebSocket API exposed by a rippled node.
 * @see https://xrpl.org/response-formatting.html
 */
interface WebSocketFailureResponse extends BaseResponse {
  error: string
  error_code: number
  error_message: string
  request: WebSocketRequest
}

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

/**
 * The standard format(s) for a response from the WebSocket API for an `account_lines` request.
 * @see https://xrpl.org/account_lines.html
 */
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

/**
 * The standard format(s) for a response from the WebSocket API for a `gateway_balances` request.
 * @see https://xrpl.org/gateway_balances.html
 */
type GatewayBalancesResponse =
  | GatewayBalancesSuccessfulResponse
  | WebSocketFailureResponse

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

/**
 * The standard format(s) for a response from the WebSocket API for an `account_offers` request.
 * @see https://xrpl.org/account_offers.html
 */
type AccountOffersResponse =
  | AccountOffersSuccessfulResponse
  | WebSocketFailureResponse

interface AccountOffersSuccessfulResponse extends BaseResponse {
  result: {
    account: string
    offers: AccountOffer[]
    ledger_current_index?: number
    ledger_index?: number
    ledger_hash?: string
  }
}

/**
 * The standard format(s) for a response from the WebSocket API for a `ripple_path_find` request.
 * @see https://xrpl.org/ripple_path_find.html
 */
type RipplePathFindResponse =
  | RipplePathFindSuccessfulResponse
  | WebSocketFailureResponse

interface RipplePathFindSuccessfulResponse extends BaseResponse {
  result: {
    alternatives: PossiblePath[]
    destination_account: string
    destination_amount?: string | IssuedCurrency
    destination_currencies: string[]
    source_account: string
  }
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

interface AccountOffer {
  flags: number
  quality: string
  seq: number
  taker_gets: string | IssuedCurrency
  taker_pays: string | IssuedCurrency
  expiration?: number
}

/**
 * The standard format for a response from the WebSocket API about a trustline.
 * @see https://xrpl.org/account_lines.html
 */
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

interface PossiblePath {
  paths_computed: PathElement[][]
  source_amount: string | IssuedCurrency
}

interface PathElement {
  account?: string
  currency?: string
  issuer?: string
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
    TakerGetsCurrency: string | IssuedCurrency
    TakerGetsIssuer: string
    TakerPaysCurrency: string | IssuedCurrency
    TakerPaysIssuer: string
  }
  LedgerEntryType: string
  LedgerIndex: string
}

interface CurrencyValuePair {
  currency: string
  value: string
}

interface SourceCurrency {
  currency: string
  issuer?: string
}

/**
 * Helper type to signify {} (an empty type).
 */
type EmptyObject = Record<never, never>

export {
  WebSocketReadyState,
  RippledMethod,
  WebSocketRequest,
  SubscribeRequest,
  AccountLinesRequest,
  GatewayBalancesRequest,
  AccountOffersRequest,
  RipplePathFindRequest,
  WebSocketResponse,
  ResponseStatus,
  WebSocketFailureResponse,
  StatusResponse,
  TransactionResponse,
  AccountLinesResponse,
  AccountLinesSuccessfulResponse,
  GatewayBalancesResponse,
  GatewayBalancesSuccessfulResponse,
  AccountOffersResponse,
  AccountOffersSuccessfulResponse,
  RipplePathFindResponse,
  RipplePathFindSuccessfulResponse,
  WebSocketTransaction,
  TrustLineResponse,
  PathElement,
  SourceCurrency,
}
