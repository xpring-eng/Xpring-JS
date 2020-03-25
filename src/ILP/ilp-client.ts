import { IlpClientDecorator } from './ilp-client-decorator'
import DefaultIlpClient from './default-ilp-client'
import { AccountBalance } from './model/account-balance'
import { PaymentResult } from './model/payment-result'
import { PaymentRequest } from './model/payment-request'

class IlpClient {
  private readonly decoratedClient: IlpClientDecorator

  public constructor(grpcURL: string, forceWeb = false) {
    this.decoratedClient = DefaultIlpClient.defaultIlpClientWithEndpoint(
      grpcURL,
      forceWeb,
    )
  }

  /**
   * Get the balance of the specified account on the connector.
   *
   * @param accountId The account ID to get the balance for.
   * @param accessToken Optional access token. If using node network client, accessToken must be supplied, otherwise
   *        it will be picked up from a cookie.
   * @return A Promise<AccountBalance> with balance information of the specified account
   */
  public async getBalance(
    accountId: string,
    accessToken?: string,
  ): Promise<AccountBalance> {
    return this.decoratedClient.getBalance(accountId, accessToken)
  }

  /**
   * Send a payment from the given accountId to the destinationPaymentPointer payment pointer
   *
   * @param paymentRequest A PaymentRequest with options for sending a payment
   * @param accessToken Optional access token. If using node network client, accessToken must be supplied, otherwise
   *        it will be picked up from a cookie.
   * @returns A promise which resolves to a `PaymentResult` of the original amount, the amount sent
   *        in the senders denomination, and the amount that was delivered to the recipient in their denomination, as
   *        well as if the payment was successful
   */
  public async sendPayment(
    paymentRequest: PaymentRequest,
    accessToken?: string,
  ): Promise<PaymentResult> {
    return this.decoratedClient.sendPayment(paymentRequest, accessToken)
  }
}

export default IlpClient
