import { Metadata } from 'grpc-web'
import { IlpNetworkClient } from './ilp-network-client'
import { GetBalanceRequest } from './generated/web/ilp/get_balance_request_pb'
import { GetBalanceResponse } from './generated/web/ilp/get_balance_response_pb'
import { SendPaymentRequest } from './generated/web/ilp/send_payment_request_pb'
import { SendPaymentResponse } from './generated/web/ilp/send_payment_response_pb'
import isNode from './utils'
import { BalanceServiceClient } from './generated/web/ilp/balance_service_grpc_web_pb'
import { IlpOverHttpServiceClient } from './generated/web/ilp/ilp_over_http_service_grpc_web_pb'

class GrpcIlpNetworkClientWeb implements IlpNetworkClient {
  private readonly balanceClient: BalanceServiceClient

  private readonly paymentClient: IlpOverHttpServiceClient

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
    // FIXME wrong credentials
    this.balanceClient = new BalanceServiceClient(grpcURL, null, null)
    this.paymentClient = new IlpOverHttpServiceClient(grpcURL, null, null)
  }

  getBalance(
    request: GetBalanceRequest,
    bearerToken?: string,
  ): Promise<GetBalanceResponse> {
    return new Promise((resolve, reject): void => {
      const metaData: Metadata = { Authorization: bearerToken || '' }

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
    return new Promise((resolve, reject): void => {
      const metaData: Metadata = { Authorization: bearerToken || '' }

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

export default GrpcIlpNetworkClientWeb
