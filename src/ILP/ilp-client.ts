import { IlpClientDecorator } from './ilp-client-decorator'
import DefaultIlpClient from './default-ilp-client'
import { AccountBalance } from './model/account-balance'
import { PaymentRequest } from './model/payment-request'
import { PaymentResponse } from './model/payment-response'

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
   * @param bearerToken Optional auth token. If using node network client, bearerToken must be supplied, otherwise
   *        it will be picked up from a cookie.
   * @return A {@link GetBalanceResponse} with balance information of the specified account
   */
  public async getBalance(
    accountId: string,
    bearerToken?: string,
  ): Promise<AccountBalance> {
    return this.decoratedClient.getBalance(accountId, bearerToken)
  }

  /**
   * Send the given amount of XRP from the source wallet to the destination address.
   *
   * @param amount A `BigInteger`, number or numeric string representing the number of drops to send.
   * @param destinationPaymentPointer the payment pointer to receive funds
   * @param senderAccountId the ILP account sending the funds
   * @param bearerToken Optional auth token. If using node network client, bearerToken must be supplied, otherwise
   *        it will be picked up from a cookie.
   * @returns A promise which resolves to a `SendPaymentResponse` of the original amount, the amount sent
   *        in the senders denomination, and the amount that was delivered to the recipient in their denomination, as
   *        well as if the payment was successful
   */
  public async sendPayment(
    paymentRequest: PaymentRequest,
    bearerToken?: string,
  ): Promise<PaymentResponse> {
    return this.decoratedClient.sendPayment(paymentRequest, bearerToken)
  }
}

export default IlpClient
