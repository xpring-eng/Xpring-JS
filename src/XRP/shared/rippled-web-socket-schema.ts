/* Schema for adding type information to Web Socket objects. */

/**
 * The standard format for a request to the Web Socket API exposed by a rippled node.
 * @see https://xrpl.org/request-formatting.html
 */
type WebSocketRequestOptions =
  | SubscribeRequest
  | AccountLinesRequest
  | GatewayBalancesRequest

interface SubscribeRequest {
  id: number | string
  command: string
  streams?: string[]
  accounts?: string[]
}

interface AccountLinesRequest {
  id: number | string
  command: string
  account: string
  ledger_index?: string
  peer?: string
}

interface GatewayBalancesRequest {
  id: number | string
  command: string
  account: string
  strict: boolean
  hotwallet: string | string[]
  ledger_index: number | string
}

type WebSocketResponse =
  | WebSocketStatusResponse
  | WebSocketTransactionResponse
  | WebSocketAccountLinesResponse

interface WebSocketStatusResponse {
  id: number | string
  result: WebSocketTransactionResponse | EmptyObject
  status: string
  type: string
}

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

type WebSocketAccountLinesResponse =
  | WebSocketAccountLinesSuccessfulResponse
  | WebSocketAccountLinesFailureResponse

interface WebSocketAccountLinesSuccessfulResponse {
  id: number | string
  status: string
  type: string
  result: {
    account: string
    ledger_hash: string
    ledger_index: number
    lines: Array<TrustLineResponse>
    validated: boolean
  }
}

interface WebSocketAccountLinesFailureResponse {
  id: number | string
  status: string
  type: string
  error: string
  error_code: number
  error_message: string
  request: AccountLinesRequest
}

type WebSocketGatewayBalancesResponse =
  | WebSocketGatewayBalancesSuccessfulResponse
  | WebSocketGatewayBalancesFailureResponse

interface WebSocketGatewayBalancesSuccessfulResponse {
  id: number | string
  status: string
  type: string
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

interface WebSocketGatewayBalancesFailureResponse {
  id: number | string
  status: string
  type: string
  error: string
  error_code: number
  error_message: string
  request: GatewayBalancesRequest
}

type ChangedNode = CreatedNode | ModifiedNode | DeletedNode

interface CreatedNode {
  LedgerEntryType: string
  LedgerIndex: string
  NewFields: {
    Account: string
    Balance: string
    Sequence: number
  }
}

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

interface CurrencyValuePair {
  currency: string
  value: string
}

type EmptyObject = {
  [K in any]: never
}

export {
  WebSocketRequestOptions,
  WebSocketResponse,
  WebSocketStatusResponse,
  WebSocketTransaction,
  WebSocketTransactionResponse,
  WebSocketAccountLinesResponse,
  WebSocketAccountLinesSuccessfulResponse,
  WebSocketAccountLinesFailureResponse,
  WebSocketGatewayBalancesResponse,
  WebSocketGatewayBalancesSuccessfulResponse,
  WebSocketGatewayBalancesFailureResponse,
  TrustLineResponse,
}
