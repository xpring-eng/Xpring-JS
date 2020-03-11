import { credentials, Metadata } from 'grpc'
import { IlpNetworkClient } from './ilp-network-client'
import { GetBalanceResponse } from '../generated/node/ilp/get_balance_response_pb'
import { GetBalanceRequest } from '../generated/node/ilp/get_balance_request_pb'
import { SendPaymentRequest } from '../generated/node/ilp/send_payment_request_pb'
import { SendPaymentResponse } from '../generated/node/ilp/send_payment_response_pb'
import isNode from '../utils'
import { BalanceServiceClient } from '../generated/node/ilp/balance_service_grpc_pb'
import { IlpOverHttpServiceClient } from '../generated/node/ilp/ilp_over_http_service_grpc_pb'

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
    const metaData: Metadata = new Metadata()
    metaData.add('Authorization', bearerToken || '')

    return new Promise((resolve, reject): void => {
      this.balanceClient.getBalance(request, metaData, (error, response) => {
        if (error != null || response === null) {
          reject(error)
          return
        }
        resolve(response)
      })
    })
  }

  send(
    request: SendPaymentRequest,
    bearerToken?: string,
  ): Promise<SendPaymentResponse> {
    const metaData: Metadata = new Metadata()
    metaData.add('Authorization', bearerToken || '')

    return new Promise((resolve, reject): void => {
      this.paymentClient.sendMoney(request, metaData, (error, response) => {
        if (error != null || response === null) {
          reject(error)
          return
        }
        resolve(response)
      })
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
