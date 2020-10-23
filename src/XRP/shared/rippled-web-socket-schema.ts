/* Schema for adding type information to Web Socket objects. */

/**
 * The standard format for a request to the JSON RPC exposed by a rippled node.
 * @see https://xrpl.org/request-formatting.html
 */
interface WebSocketRequestOptions {
  command: unknown
  id: string
  streams?: unknown[]
  accounts?: unknown[]
}

type WebSocketResponse =
  | WebSocketStatusResponse
  | WebSocketLedgerResponse
  | WebSocketTransactionResponse

interface WebSocketStatusResponse {
  id?: string
  result: WebSocketLedgerResponse | WebSocketTransactionResponse | undefined
  status: string
  type: string
}

interface WebSocketTransactionResponse {
  engine_result: string
  engine_result_code: number
  engine_result_message: string
  ledger_hash: string
  ledger_index: number
  meta: any // TODO make this better
  status: string
  transaction: WebSocketTransaction
  type: string
  validated: boolean
}

interface WebSocketLedgerResponse {
  fee_base: number
  fee_ref: number
  ledger_hash: string
  ledger_index: number
  ledger_time: number
  reserve_base: number
  reserve_inc: number
  txn_count: number
  type: string
  validated_ledgers: string
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

export {
  WebSocketRequestOptions,
  WebSocketResponse,
  WebSocketStatusResponse,
  WebSocketTransaction,
  WebSocketTransactionResponse,
}
