import { credentials } from 'grpc'
import {
  GetAccountInfoRequest,
  GetAccountInfoResponse,
} from './generated/node/org/xrpl/rpc/v1/get_account_info_pb'
import {
  GetFeeRequest,
  GetFeeResponse,
} from './generated/node/org/xrpl/rpc/v1/get_fee_pb'
import {
  SubmitTransactionRequest,
  SubmitTransactionResponse,
} from './generated/node/org/xrpl/rpc/v1/submit_pb'
import { XRPLedgerAPIServiceClient } from './generated/node/org/xrpl/rpc/v1/xrp_ledger_grpc_pb'
import { NetworkClient } from './network-client'
import { AccountAddress } from './generated/node/org/xrpl/rpc/v1/account_pb'
import isNode from './utils'
import {
  GetAccountTransactionHistoryRequest,
  GetAccountTransactionHistoryResponse,
} from './generated/node/org/xrpl/rpc/v1/get_account_transaction_history_pb'
import {
  GetTransactionRequest,
  GetTransactionResponse,
} from './generated/node/org/xrpl/rpc/v1/get_transaction_pb'

/**
 * A GRPC Based network client.
 */
class GRPCNetworkClient implements NetworkClient {
  private readonly grpcClient: XRPLedgerAPIServiceClient

  public constructor(grpcURL: string) {
    if (isNode()) {
      this.grpcClient = new XRPLedgerAPIServiceClient(
        grpcURL,
        credentials.createInsecure(),
      )
    } else {
      throw new Error('Use gRPC-Web Network Client on the browser!')
    }
  }

  public async getAccountInfo(
    request: GetAccountInfoRequest,
  ): Promise<GetAccountInfoResponse> {
    return new Promise((resolve, reject): void => {
      this.grpcClient.getAccountInfo(request, (error, response): void => {
        if (error != null || response == null) {
          reject(error)
          return
        }
        resolve(response)
      })
    })
  }

  public async getFee(request: GetFeeRequest): Promise<GetFeeResponse> {
    return new Promise((resolve, reject): void => {
      this.grpcClient.getFee(request, (error, response): void => {
        if (error != null || response == null) {
          reject(error)
          return
        }
        resolve(response)
      })
    })
  }

  public async getTransaction(
    request: GetTransactionRequest,
  ): Promise<GetTransactionResponse> {
    return new Promise((resolve, reject): void => {
      this.grpcClient.getTransaction(request, (error, response): void => {
        if (error != null || response == null) {
          reject(error)
          return
        }
        resolve(response)
      })
    })
  }

  public async submitTransaction(
    request: SubmitTransactionRequest,
  ): Promise<SubmitTransactionResponse> {
    return new Promise((resolve, reject): void => {
      this.grpcClient.submitTransaction(request, (error, response): void => {
        if (error != null || response == null) {
          reject(error)
          return
        }
        resolve(response)
      })
    })
  }

  public async getTransactionHistory(
    request: GetAccountTransactionHistoryRequest,
  ): Promise<GetAccountTransactionHistoryResponse> {
    return new Promise((resolve, reject): void => {
      this.grpcClient.getAccountTransactionHistory(
        request,
        (error, response): void => {
          if (error != null || response == null) {
            reject(error)
            return
          }
          resolve(response)
        },
      )
    })
  }

  /* eslint-disable class-methods-use-this */
  public AccountAddress(): AccountAddress {
    return new AccountAddress()
  }

  public GetAccountInfoRequest(): GetAccountInfoRequest {
    return new GetAccountInfoRequest()
  }

  public GetTransactionRequest(): GetTransactionRequest {
    return new GetTransactionRequest()
  }

  public GetFeeRequest(): GetFeeRequest {
    return new GetFeeRequest()
  }

  public SubmitTransactionRequest(): SubmitTransactionRequest {
    return new SubmitTransactionRequest()
  }

  public GetAccountTransactionHistoryRequest(): GetAccountTransactionHistoryRequest {
    return new GetAccountTransactionHistoryRequest()
  }
  /* eslint-enable class-methods-use-this */
}

export default GRPCNetworkClient
