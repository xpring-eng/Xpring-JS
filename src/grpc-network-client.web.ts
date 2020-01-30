import { Utils } from 'xpring-common-js'
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

import { AccountAddress } from './generated/web/rpc/v1/amount_pb'
import isNode from './utils'
import { NetworkClient } from './network-client'

/**
 * A GRPC Based network client.
 */
class GRPCNetworkClientWeb implements NetworkClient {
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
    address: string,
  ): Promise<GetAccountInfoResponse> {
    return new Promise((resolve, reject): void => {
      const request = new GetAccountInfoRequest()
      const account = new AccountAddress()
      account.setAddress(address)
      request.setAccount(account)
      this.grpcClient.getAccountInfo(request, {}, (error, response): void => {
        if (error !== null || response === null) {
          reject(error)
          return
        }
        resolve(response)
      })
    })
  }

  public async getFee(): Promise<GetFeeResponse> {
    return new Promise((resolve, reject): void => {
      const request = new GetFeeRequest()
      this.grpcClient.getFee(request, {}, (error, response): void => {
        if (error !== null || response === null) {
          reject(error)
          return
        }
        resolve(response)
      })
    })
  }

  public async getTx(hash: string): Promise<GetTxResponse> {
    return new Promise((resolve, reject): void => {
      const request = new GetTxRequest()
      request.setHash(Utils.toBytes(hash))
      this.grpcClient.getTx(request, {}, (error, response): void => {
        if (error !== null || response === null) {
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
          if (error !== null || response === null) {
            reject(error)
            return
          }
          resolve(response)
        },
      )
    })
  }
}

export default GRPCNetworkClientWeb
