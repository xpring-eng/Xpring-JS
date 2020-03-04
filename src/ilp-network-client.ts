import { GetBalanceRequest } from './generated/web/ilp/get_balance_request_pb'
import { GetBalanceResponse } from './generated/web/ilp/get_balance_response_pb'
import { SendPaymentRequest } from './generated/web/ilp/send_payment_request_pb'
import { SendPaymentResponse } from './generated/web/ilp/send_payment_response_pb'

export interface IlpNetworkClient {
  /**
   * Retrieve the balance for the given address.
   *
   * @param request the details required for fetching the balance
   * @param bearerToken Optional auth token. If using node network client, bearerToken must be supplied, otherwise
   *        it will be picked up from a cookie.
   * @returns A {@link GetBalanceResponse} with balance information of the specified account
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
   * @param bearerToken Optional auth token. If using node network client, bearerToken must be supplied, otherwise
   *        it will be picked up from a cookie.
   * @returns A promise which resolves to a `SendPaymentResponse` of the original amount, the amount sent
   *        in the senders denomination, and the amount that was delivered to the recipient in their denomination, as
   *        well as if the payment was successful
   */
  send(
    request: SendPaymentRequest,
    bearerToken?: string,
  ): Promise<SendPaymentResponse>

  SendPaymentRequest(): SendPaymentRequest

  GetBalanceRequest(): GetBalanceRequest
}
