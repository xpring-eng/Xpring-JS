import { credentials } from 'grpc'
import { IlpNetworkClient } from './ilp-network-client'
import { GetBalanceResponse } from '../generated/node/ilp/get_balance_response_pb'
import { GetBalanceRequest } from '../generated/node/ilp/get_balance_request_pb'
import { SendPaymentRequest } from '../generated/node/ilp/send_payment_request_pb'
import { SendPaymentResponse } from '../generated/node/ilp/send_payment_response_pb'
import isNode from '../utils'
import { BalanceServiceClient } from '../generated/node/ilp/balance_service_grpc_pb'
import { IlpOverHttpServiceClient } from '../generated/node/ilp/ilp_over_http_service_grpc_pb'
import IlpCredentials from './auth/ilp-credentials'

class GrpcIlpNetworkClient implements IlpNetworkClient {
  private readonly balanceClient: BalanceServiceClient

  private readonly paymentClient: IlpOverHttpServiceClient

  public constructor(grpcURL: string) {
    if (isNode()) {
      this.balanceClient = new BalanceServiceClient(
        grpcURL,
        credentials.createSsl(),
      )
      this.paymentClient = new IlpOverHttpServiceClient(
        grpcURL,
        credentials.createSsl(),
      )
    } else {
      throw new Error('Use ILP-gRPC-Web Network Client on the browser!')
    }
  }

  getBalance(
    request: GetBalanceRequest,
    bearerToken?: string,
  ): Promise<GetBalanceResponse> {
    return new Promise((resolve, reject): void => {
      this.balanceClient.getBalance(
        request,
        IlpCredentials.build(bearerToken),
        (error, response) => {
          if (error || !response) {
            reject(error)
            return
          }
          resolve(response)
        },
      )
    })
  }

  send(
    request: SendPaymentRequest,
    bearerToken?: string,
  ): Promise<SendPaymentResponse> {
    return new Promise((resolve, reject): void => {
      this.paymentClient.sendMoney(
        request,
        IlpCredentials.build(bearerToken),
        (error, response) => {
          if (error || !response) {
            reject(error)
            return
          }
          resolve(response)
        },
      )
    })
  }
}

export default GrpcIlpNetworkClient
