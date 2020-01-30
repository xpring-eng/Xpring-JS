import { credentials } from 'grpc'
import { Utils } from 'xpring-common-js'
import {
  GetAccountInfoRequest,
  GetAccountInfoResponse,
} from '../generated/node/rpc/v1/account_info_pb'
import { GetFeeRequest, GetFeeResponse } from '../generated/node/rpc/v1/fee_pb'
import { GetTxRequest, GetTxResponse } from '../generated/node/rpc/v1/tx_pb'
import {
  SubmitTransactionRequest,
  SubmitTransactionResponse,
} from '../generated/node/rpc/v1/submit_pb'
import { XRPLedgerAPIServiceClient } from '../generated/node/rpc/v1/xrp_ledger_grpc_pb'
import { NetworkClientDecorator } from '../utils/network-client-decorator'
import { AccountAddress } from '../generated/node/rpc/v1/amount_pb'
import isNode from '../utils'

/**
 * A GRPC Based network client.
 */
class GRPCNetworkClientNode implements NetworkClientDecorator {
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
    address: string,
  ): Promise<GetAccountInfoResponse> {
    return new Promise((resolve, reject): void => {
      const request = new GetAccountInfoRequest()
      const account = new AccountAddress()
      account.setAddress(address)
      request.setAccount(account)
      this.grpcClient.getAccountInfo(request, (error, response): void => {
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
      this.grpcClient.getFee(request, (error, response): void => {
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
      this.grpcClient.getTx(request, (error, response): void => {
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
      this.grpcClient.submitTransaction(request, (error, response): void => {
        if (error !== null || response === null) {
          reject(error)
          return
        }
        resolve(response)
      })
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

export default GRPCNetworkClientNode
