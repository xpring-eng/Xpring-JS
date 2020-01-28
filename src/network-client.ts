import {
  GetAccountInfoRequest as GetAccountInfoRequestWeb,
  GetAccountInfoResponse as GetAccountInfoResponseWeb,
} from './generated/web/rpc/v1/account_info_pb'
import {
  GetAccountInfoRequest as GetAccountInfoRequestNode,
  GetAccountInfoResponse as GetAccountInfoResponseNode,
} from './generated/node/rpc/v1/account_info_pb'
import {
  GetFeeRequest as GetFeeRequestWeb,
  GetFeeResponse as GetFeeResponseWeb,
} from './generated/web/rpc/v1/fee_pb'
import {
  GetFeeRequest as GetFeeRequestNode,
  GetFeeResponse as GetFeeResponseNode,
} from './generated/node/rpc/v1/fee_pb'
import {
  GetTxRequest as GetTxRequestWeb,
  GetTxResponse as GetTxResponseWeb,
} from './generated/web/rpc/v1/tx_pb'
import {
  GetTxRequest as GetTxRequestNode,
  GetTxResponse as GetTxResponseNode,
} from './generated/node/rpc/v1/tx_pb'
import {
  SubmitTransactionRequest as SubmitTransactionRequestWeb,
  SubmitTransactionResponse as SubmitTransactionResponseWeb,
} from './generated/web/rpc/v1/submit_pb'
import {
  SubmitTransactionRequest as SubmitTransactionRequestNode,
  SubmitTransactionResponse as SubmitTransactionResponseNode,
} from './generated/node/rpc/v1/submit_pb'

/**
 * The network client interface provides a wrapper around network calls to the Xpring Platform.
 */
export interface NetworkClient {
  getAccountInfo(
    request: GetAccountInfoRequestWeb,
  ): Promise<GetAccountInfoResponseWeb>
  getAccountInfo(
    request: GetAccountInfoRequestNode,
  ): Promise<GetAccountInfoResponseNode>
  getFee(request: GetFeeRequestWeb): Promise<GetFeeResponseWeb>
  getFee(request: GetFeeRequestNode): Promise<GetFeeResponseNode>
  getTx(request: GetTxRequestWeb): Promise<GetTxResponseWeb>
  getTx(request: GetTxRequestNode): Promise<GetTxResponseNode>
  submitTransaction(
    request: SubmitTransactionRequestWeb,
  ): Promise<SubmitTransactionResponseWeb>
  submitTransaction(
    request: SubmitTransactionRequestNode,
  ): Promise<SubmitTransactionResponseNode>
  // TODO(keefertaylor): Add last ledger validated sequence.
}
