import { GetBalanceRequest } from './generated/web/ilp/get_balance_request_pb'
import { GetBalanceResponse } from './generated/web/ilp/get_balance_response_pb'
import { SendPaymentRequest } from './generated/web/ilp/send_payment_request_pb'
import { SendPaymentResponse } from './generated/web/ilp/send_payment_response_pb'

export interface IlpNetworkClient {
  /**
   * Retrieve the balance for the given address.
   *
   * @param request the details required for fetching the balance
   * @param bearerToken
   * @returns a response with details about the balance including the type of currency and amount
   */
  getBalance(
    request: GetBalanceRequest,
    bearerToken?: string,
  ): Promise<GetBalanceResponse>

  /**
   * Send the given amount of XRP from the source wallet to the destination address.
   *
   * @param request the details of which account to send from, which payment pointer to receive to, and the amount to
   * send
   * @returns a response with details about the payment including whether or not it was successful and the amount
   * delivered to the recipient
   */
  send(
    request: SendPaymentRequest,
    bearerToken?: string,
  ): Promise<SendPaymentResponse>

  SendPaymentRequest(): SendPaymentRequest

  GetBalanceRequest(): GetBalanceRequest
}
