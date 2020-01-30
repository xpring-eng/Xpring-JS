import {
  GetAccountInfoRequest,
  GetAccountInfoResponse,
} from './generated/web/rpc/v1/account_info_pb'
import { GetFeeRequest, GetFeeResponse } from './generated/web/rpc/v1/fee_pb'
import { GetTxRequest, GetTxResponse } from './generated/web/rpc/v1/tx_pb'
import {
  SubmitTransactionRequest,
  SubmitTransactionResponse,
} from './generated/web/rpc/v1/submit_pb'
import { AccountAddress } from './generated/web/rpc/v1/amount_pb'

/**
 * The network client interface provides a wrapper around network calls to the Xpring Platform.
 */
export interface NetworkClient {
  getAccountInfo(
    request: GetAccountInfoRequest,
  ): Promise<GetAccountInfoResponse>
  getFee(request: GetFeeRequest): Promise<GetFeeResponse>
  getTx(request: GetTxRequest): Promise<GetTxResponse>
  submitTransaction(
    request: SubmitTransactionRequest,
  ): Promise<SubmitTransactionResponse>
  AccountAddress(): AccountAddress
  GetAccountInfoRequest(): GetAccountInfoRequest
  GetTxRequest(): GetTxRequest
  GetFeeRequest(): GetFeeRequest
  SubmitTransactionRequest(): SubmitTransactionRequest
  // TODO(keefertaylor): Add last ledger validated sequence.
}
