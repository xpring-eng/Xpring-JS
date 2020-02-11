import { GetBalanceRequest } from './generated/web/ilp/get_balance_request_pb'
import { GetBalanceResponse } from './generated/web/ilp/get_balance_response_pb'
import { SendPaymentRequest } from './generated/web/ilp/send_payment_request_pb'
import { SendPaymentResponse } from './generated/web/ilp/send_payment_response_pb'

export interface IlpNetworkClient {
  getBalance(request: GetBalanceRequest): Promise<GetBalanceResponse>

  send(request: SendPaymentRequest): Promise<SendPaymentResponse>

  SendPaymentRequest(): SendPaymentRequest

  GetBalanceRequest(): GetBalanceRequest
}
