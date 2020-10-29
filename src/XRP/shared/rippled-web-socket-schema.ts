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
  command: string
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

type WebSocketResponse =
  | StatusResponse
  | TransactionResponse
  | AccountLinesResponse
  | GatewayBalancesResponse

interface BaseResponse {
  id: number | string
  status: string
  type: string
}

interface WebSocketFailureResponse extends BaseResponse {
  error: string
  error_code: number
  error_message: string
  request: AccountLinesRequest | GatewayBalancesRequest
}

interface StatusResponse extends BaseResponse {
  result: TransactionResponse | EmptyObject
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

interface CurrencyValuePair {
  currency: string
  value: string
}

type EmptyObject = {
  [K in any]: never
}

export {
  WebSocketRequest as WebSocketRequestOptions,
  WebSocketResponse,
  WebSocketFailureResponse,
  StatusResponse as WebSocketStatusResponse,
  TransactionResponse as WebSocketTransactionResponse,
  AccountLinesResponse as WebSocketAccountLinesResponse,
  AccountLinesSuccessfulResponse,
  GatewayBalancesResponse as WebSocketGatewayBalancesResponse,
  GatewayBalancesSuccessfulResponse as WebSocketGatewayBalancesSuccessfulResponse,
  WebSocketTransaction,
  TrustLineResponse,
}
