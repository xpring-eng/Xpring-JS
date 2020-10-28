/* Schema for adding type information to Web Socket objects. */

/**
 * The standard format for a request to the JSON RPC exposed by a rippled node.
 * @see https://xrpl.org/request-formatting.html
 */
type WebSocketRequestOptions = SubscribeRequest | AccountLinesRequest

interface SubscribeRequest {
  id: string
  command: string
  streams?: string[]
  accounts?: string[]
}

interface AccountLinesRequest {
  id: string
  command: string
  account: string
  ledger_index: string
  peer?: string
}

type WebSocketResponse =
  | WebSocketStatusResponse
  | WebSocketTransactionResponse
  | WebSocketAccountLinesResponse

interface WebSocketStatusResponse {
  id: string
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

interface WebSocketAccountLinesResponse {
  id: number | string
  status: string
  type: string
  result: {
    account: string
    ledger_hash: string
    ledger_index: number
    lines: Array<TrustLineJson>
    validated: boolean
  }
  error?: string
  error_code?: number
  error_message?: string
  request?: AccountLinesRequest
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

interface TrustLineJson {
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
}
