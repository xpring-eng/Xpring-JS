import { AccountLinesResponse } from '../shared/rippled-json-rpc-schema'

/**
 * The JsonNetworkClientInterface defines the calls available via the rippled JSON-RPC.
 */
export interface JsonNetworkClientInterface {
  getAccountLines(account: string): Promise<AccountLinesResponse>
}
