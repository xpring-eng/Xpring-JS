/* Schema for adding type information to JSON objects. */

/**
 * The standard format for a request to the JSON RPC exposed by a rippled node.
 * @see https://xrpl.org/request-formatting.html
 */
interface JsonRpcRequestOptions {
  method: string
  params: unknown
}

interface AccountLinesResponse {
  result: {
    error?: string
    account?: string
    lines?: Array<TrustLineJson>
    status: string
  }
}

interface GatewayBalancesResponse {
  result: {
    account: string
    assets?: unknown
    balances?: unknown
    ledger_hash: string
    ledger_index: number
    obligations?: unknown
    status: string
    validated: boolean
  }
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

export {
  JsonRpcRequestOptions,
  AccountLinesResponse,
  GatewayBalancesResponse,
  TrustLineJson,
}
