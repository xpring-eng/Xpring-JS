import { AccountAddress } from '../Generated/web/org/xrpl/rpc/v1/account_pb'
import {
  SubmitTransactionRequest,
  SubmitTransactionResponse,
} from '../Generated/web/org/xrpl/rpc/v1/submit_pb'
import {
  GetAccountTransactionHistoryRequest,
  GetAccountTransactionHistoryResponse,
} from '../Generated/web/org/xrpl/rpc/v1/get_account_transaction_history_pb'
import {
  GetFeeRequest,
  GetFeeResponse,
} from '../Generated/web/org/xrpl/rpc/v1/get_fee_pb'
import {
  GetAccountInfoRequest,
  GetAccountInfoResponse,
} from '../Generated/web/org/xrpl/rpc/v1/get_account_info_pb'
import {
  GetTransactionRequest,
  GetTransactionResponse,
} from '../Generated/web/org/xrpl/rpc/v1/get_transaction_pb'

/**
 * The GrpcNetworkClientInterface provides a wrapper around gRPC network calls to a rippled node.
 */
export interface GrpcNetworkClientInterface {
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
  getTransactionHistory(
    request: GetAccountTransactionHistoryRequest,
  ): Promise<GetAccountTransactionHistoryResponse>

  AccountAddress(): AccountAddress
  GetAccountInfoRequest(): GetAccountInfoRequest
  GetTransactionRequest(): GetTransactionRequest
  GetFeeRequest(): GetFeeRequest
  SubmitTransactionRequest(): SubmitTransactionRequest
  GetAccountTransactionHistoryRequest(): GetAccountTransactionHistoryRequest
}
