import { GetBalanceRequest } from './Generated/get_balance_request_pb'
import { GetBalanceResponse } from './Generated/get_balance_response_pb'
import { SendPaymentRequest } from './Generated/send_payment_request_pb'
import { SendPaymentResponse } from './Generated/send_payment_response_pb'

export interface IlpNetworkClient {
  /**
   * Retrieve the balance for the given address.
   *
   * @param request the details required for fetching the balance
   * @param accessToken Optional access token. If using node network client, accessToken must be supplied, otherwise
   *        it will be picked up from a cookie.
   * @returns A {@link GetBalanceResponse} with balance information of the specified account
   */
  getBalance(
    request: GetBalanceRequest,
    accessToken?: string,
  ): Promise<GetBalanceResponse>

  /**
   * Send the given amount of XRP from the source wallet to the destination address.
   *
   * @param request the details of which account to send from, which payment pointer to receive to, and the amount to
   * send
   * @param accessToken Optional access token. If using node network client, accessToken must be supplied, otherwise
   *        it will be picked up from a cookie.
   * @returns A promise which resolves to a `SendPaymentResponse` of the original amount, the amount sent
   *        in the senders denomination, and the amount that was delivered to the recipient in their denomination, as
   *        well as if the payment was successful
   */
  send(
    request: SendPaymentRequest,
    accessToken?: string,
  ): Promise<SendPaymentResponse>

  SendPaymentRequest(): SendPaymentRequest

  GetBalanceRequest(): GetBalanceRequest
}
