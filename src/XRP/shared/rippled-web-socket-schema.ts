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

type WebSocketResponse = WebSocketStatusResponse | WebSocketLedgerResponse

interface WebSocketStatusResponse {
  id?: string
  result: WebSocketLedgerResponse | undefined
  status: string
  type: string
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

export { WebSocketRequestOptions, WebSocketResponse, WebSocketStatusResponse }
