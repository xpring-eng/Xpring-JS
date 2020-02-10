import {
  GetAccountInfoRequest,
  GetAccountInfoResponse,
} from './generated/web/org/xrpl/rpc/v1/get_account_info_pb'
import {
  GetFeeRequest,
  GetFeeResponse,
} from './generated/web/org/xrpl/rpc/v1/get_fee_pb'
import {
  GetTransactionRequest,
  GetTransactionResponse,
} from './generated/web/org/xrpl/rpc/v1/get_transaction_pb'
import {
  SubmitTransactionRequest,
  SubmitTransactionResponse,
} from './generated/web/org/xrpl/rpc/v1/submit_pb'
import { AccountAddress } from './generated/web/org/xrpl/rpc/v1/amount_pb'

/**
 * The network client interface provides a wrapper around network calls to the Xpring Platform.
 */
export interface NetworkClient {
  getAccountInfo(
    request: GetAccountInfoRequest,
  ): Promise<GetAccountInfoResponse>
  getFee(request: GetFeeRequest): Promise<GetFeeResponse>
  getTransaction(
    request: GetTransactionRequest,
  ): Promise<GetTransactionResponse>
  submitTransaction(
    request: SubmitTransactionRequest,
  ): Promise<SubmitTransactionResponse>
  AccountAddress(): AccountAddress
  GetAccountInfoRequest(): GetAccountInfoRequest
  GetTransactionRequest(): GetTransactionRequest
  GetFeeRequest(): GetFeeRequest
  SubmitTransactionRequest(): SubmitTransactionRequest
}
