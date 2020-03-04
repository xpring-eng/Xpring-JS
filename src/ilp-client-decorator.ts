import { BigInteger } from 'big-integer'
import { GetBalanceResponse } from './generated/web/ilp/get_balance_response_pb'
import { SendPaymentResponse } from './generated/web/ilp/send_payment_response_pb'

export interface IlpClientDecorator {
  /**
   * Retrieve the balance for the given address.
   *
   * @param address The ILP address to retrieve a balance for.
   * @param bearerToken Optional auth token. If using node network client, bearerToken must be supplied, otherwise
   *        it will be picked up from a cookie.
   * @returns A {@link GetBalanceResponse} with balance information of the specified account
   */
  getBalance(address: string, bearerToken?: string): Promise<GetBalanceResponse>

  /**
   * Send the given amount of XRP from the source wallet to the destination address.
   *
   * @param amount A `BigInteger`, number or numeric string representing the number of drops to send.
   * @param paymentPointer the payment pointer to receive funds
   * @param sender the ILP account sending the funds
   * @param bearerToken Optional auth token. If using node network client, bearerToken must be supplied, otherwise
   *        it will be picked up from a cookie.
   * @returns A promise which resolves to a `SendPaymentResponse` of the original amount, the amount sent
   *        in the senders denomination, and the amount that was delivered to the recipient in their denomination, as
   *        well as if the payment was successful
   */
  send(
    amount: BigInteger | number | string,
    paymentPointer: string,
    sender: string,
    bearerToken?: string,
  ): Promise<SendPaymentResponse>
}
