/* Schema for adding type information to JSON objects. */

interface RequestJson {
  method: string
  params: unknown
}

interface AccountLinesResponseJson {
  result: {
    account: string
    lines: TrustLineJson[]
    status: string
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

export { RequestJson, AccountLinesResponseJson, TrustLineJson }
