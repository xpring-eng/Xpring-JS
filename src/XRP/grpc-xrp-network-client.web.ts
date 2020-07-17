import {
  GetAccountTransactionHistoryRequest,
  GetAccountTransactionHistoryResponse,
} from './Generated/web/org/xrpl/rpc/v1/get_account_transaction_history_pb'
import { XRPLedgerAPIServiceClient } from './Generated/web/org/xrpl/rpc/v1/xrp_ledger_grpc_web_pb'

import { AccountAddress } from './Generated/web/org/xrpl/rpc/v1/account_pb'
import {
  SubmitTransactionRequest,
  SubmitTransactionResponse,
} from './Generated/web/org/xrpl/rpc/v1/submit_pb'
import {
  GetTransactionRequest,
  GetTransactionResponse,
} from './Generated/web/org/xrpl/rpc/v1/get_transaction_pb'
import {
  GetFeeRequest,
  GetFeeResponse,
} from './Generated/web/org/xrpl/rpc/v1/get_fee_pb'
import {
  GetAccountInfoRequest,
  GetAccountInfoResponse,
} from './Generated/web/org/xrpl/rpc/v1/get_account_info_pb'
import { XrpNetworkClient } from './xrp-network-client'
import isNode from '../Common/utils'

/**
 * A GRPC Based network client.
 */
export default class XrpGrpcNetworkClient implements XrpNetworkClient {
  private readonly grpcClient: XRPLedgerAPIServiceClient

  public constructor(grpcURL: string) {
    if (isNode()) {
      try {
        // This polyfill hack enables XMLHttpRequest on the global node.js state
        global.XMLHttpRequest = require('xhr2') // eslint-disable-line
      } catch {
        // Swallow the error here for browsers
      }
    }
    this.grpcClient = new XRPLedgerAPIServiceClient(grpcURL)
  }

  public async getAccountInfo(
    request: GetAccountInfoRequest,
  ): Promise<GetAccountInfoResponse> {
    return new Promise((resolve, reject): void => {
      this.grpcClient.getAccountInfo(request, {}, (error, response): void => {
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
      this.grpcClient.getFee(request, {}, (error, response): void => {
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
    console.log('Querying TX')

    return new Promise((resolve, reject): void => {
      this.grpcClient.getTransaction(request, {}, (error, response): void => {
        console.log(`Res: ${response?.toString()}`)
        console.log(`Err: ${error?.message}`)

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
    console.log('Submitting TX')

    return new Promise((resolve, reject): void => {
      this.grpcClient.submitTransaction(
        request,
        {},
        (error, response): void => {
          console.log(`Res: ${response?.toString()}`)
          console.log(`Err: ${error?.message}`)

          if (error != null || response == null) {
            reject(error)
            return
          }
          resolve(response)
        },
      )
    })
  }

  public async getTransactionHistory(
    request: GetAccountTransactionHistoryRequest,
  ): Promise<GetAccountTransactionHistoryResponse> {
    return new Promise((resolve, reject): void => {
      this.grpcClient.getAccountTransactionHistory(
        request,
        {},
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
