import { credentials } from 'grpc'
import { GetBalanceResponse } from './Generated/node/get_balance_response_pb'
import { GetBalanceRequest } from './Generated/node/get_balance_request_pb'
import { SendPaymentRequest } from './Generated/node/send_payment_request_pb'
import { SendPaymentResponse } from './Generated/node/send_payment_response_pb'
import { BalanceServiceClient } from './Generated/node/balance_service_grpc_pb'
import { IlpOverHttpServiceClient } from './Generated/node/ilp_over_http_service_grpc_pb'
import isNode from '../Common/utils'
import { IlpNetworkClient } from './ilp-network-client'
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

  /* eslint-disable class-methods-use-this */
  public SendPaymentRequest(): SendPaymentRequest {
    return new SendPaymentRequest()
  }

  public GetBalanceRequest(): GetBalanceRequest {
    return new GetBalanceRequest()
  }
  /* eslint-enable class-methods-use-this */
}

export default GrpcIlpNetworkClient
