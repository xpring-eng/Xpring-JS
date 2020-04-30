import * as grpc from '@grpc/grpc-js'
import { ServiceClient } from '@grpc/grpc-js/build/src/make-client'
import { GetBalanceResponse } from './Generated/get_balance_response_pb'
import { GetBalanceRequest } from './Generated/get_balance_request_pb'
import { SendPaymentRequest } from './Generated/send_payment_request_pb'
import { SendPaymentResponse } from './Generated/send_payment_response_pb'
import * as BalanceGrpcPb from './Generated/balance_service_grpc_pb'
import * as ILPGrpcPb from './Generated/ilp_over_http_service_grpc_pb'
import { IlpNetworkClient } from './ilp-network-client'
import IlpCredentials from './auth/ilp-credentials'

class GrpcIlpNetworkClient implements IlpNetworkClient {
  private readonly balanceClient: ServiceClient

  private readonly paymentClient: ServiceClient

  public constructor(grpcURL: string) {
    const BalanceServiceClient = grpc.makeClientConstructor(
      BalanceGrpcPb['org.interledger.stream.proto.BalanceService'],
      'BalanceService',
    )
    this.balanceClient = new BalanceServiceClient(
      grpcURL,
      grpc.credentials.createSsl(),
    )

    const IlpOverHttpServiceClient = grpc.makeClientConstructor(
      ILPGrpcPb['org.interledger.stream.proto.IlpOverHttpService'],
      'IlpOverHttpService',
    )
    this.paymentClient = new IlpOverHttpServiceClient(
      grpcURL,
      grpc.credentials.createSsl(),
    )
  }

  getBalance(
    request: GetBalanceRequest,
    accessToken?: string,
  ): Promise<GetBalanceResponse> {
    return new Promise((resolve, reject): void => {
      this.balanceClient.getBalance(
        request,
        IlpCredentials.build(accessToken),
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
    accessToken?: string,
  ): Promise<SendPaymentResponse> {
    return new Promise((resolve, reject): void => {
      this.paymentClient.sendMoney(
        request,
        IlpCredentials.build(accessToken),
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
