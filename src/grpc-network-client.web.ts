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
import { XRPLedgerAPIServiceClient } from './generated/web/rpc/v1/xrp_ledger_grpc_web_pb'

import { NetworkClient } from './network-client'
import { AccountAddress } from './generated/web/rpc/v1/amount_pb'
import isNode from './utils'

/**
 * A GRPC Based network client.
 */
class GRPCNetworkClient implements NetworkClient {
  private readonly grpcClient: XRPLedgerAPIServiceClient

  public constructor(grpcURL: string) {
    if (isNode()) {
      try {
        // This polyfill hack enables XMLHttpRequest on the global node.js state
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore eslint-disable-line
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

  public async getTx(request: GetTxRequest): Promise<GetTxResponse> {
    return new Promise((resolve, reject): void => {
      this.grpcClient.getTx(request, {}, (error, response): void => {
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
      this.grpcClient.submitTransaction(
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

  public GetTxRequest(): GetTxRequest {
    return new GetTxRequest()
  }

  public GetFeeRequest(): GetFeeRequest {
    return new GetFeeRequest()
  }
  /* eslint-enable class-methods-use-this */
}

export default GRPCNetworkClient
