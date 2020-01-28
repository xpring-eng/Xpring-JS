/* eslint-disable class-methods-use-this */
import { credentials } from 'grpc'
import {
  GetAccountInfoRequest,
  GetAccountInfoResponse,
} from './generated/node/rpc/v1/account_info_pb'
import { GetFeeRequest, GetFeeResponse } from './generated/node/rpc/v1/fee_pb'
import { GetTxRequest, GetTxResponse } from './generated/node/rpc/v1/tx_pb'
import {
  SubmitTransactionRequest,
  SubmitTransactionResponse,
} from './generated/node/rpc/v1/submit_pb'
import { XRPLedgerAPIServiceClient } from './generated/node/rpc/v1/xrp_ledger_grpc_pb'

import { NetworkClient } from './network-client'
import { AccountAddress } from './generated/node/rpc/v1/amount_pb'

/**
 * A GRPC Based network client.
 */
class GRPCNetworkClient implements NetworkClient {
  private readonly grpcClient: XRPLedgerAPIServiceClient

  public constructor(grpcURL: string) {
    if (typeof process !== 'undefined' && process.release.name === 'node') {
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

  public async getTx(request: GetTxRequest): Promise<GetTxResponse> {
    return new Promise((resolve, reject): void => {
      this.grpcClient.getTx(request, (error, response): void => {
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
}

export default GRPCNetworkClient
