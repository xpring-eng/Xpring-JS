import { AccountBalance } from './model/account-balance'
import { PaymentResult } from './model/payment-result'
import { PaymentRequest } from './model/payment-request'

export interface IlpClientDecorator {
  /**
   * Retrieve the balance for the given accountId.
   *
   * @param accountId The ILP accountId to retrieve a balance for.
   * @param bearerToken Optional auth token. If using node network client, bearerToken must be supplied, otherwise
   *        it will be picked up from a cookie.
   * @returns A {@link GetBalanceResponse} with balance information of the specified account
   */
  getBalance(accountId: string, bearerToken?: string): Promise<AccountBalance>

  /**
   * Send the given amount of XRP from the source wallet to the destination address.
   *
   * @param paymentRequest A PaymentRequest with options for sending a payment
   * @param bearerToken Optional auth token. If using node network client, bearerToken must be supplied, otherwise
   *        it will be picked up from a cookie.
   * @returns A promise which resolves to a `PaymentResult` of the original amount, the amount sent
   *        in the senders denomination, and the amount that was delivered to the recipient in their denomination, as
   *        well as if the payment was successful
   */
  sendPayment(
    paymentRequest: PaymentRequest,
    bearerToken?: string,
  ): Promise<PaymentResult>
}
