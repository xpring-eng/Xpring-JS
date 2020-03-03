import { BigInteger } from 'big-integer'
import { IlpClientDecorator } from './ilp-client-decorator'
import DefaultIlpClient from './default-ilp-client'
import { GetBalanceResponse } from './generated/web/ilp/get_balance_response_pb'
import { SendPaymentResponse } from './generated/web/ilp/send_payment_response_pb'

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
   * @param bearerToken Authentication bearer token.
   * @return A {@link GetBalanceResponse} with balance information of the specified account
   */
  public async getBalance(
    address: string,
    bearerToken?: string,
  ): Promise<GetBalanceResponse> {
    return this.decoratedClient.getBalance(address, bearerToken)
  }

  /**
   * Send the given amount of XRP from the source wallet to the destination address.
   *
   * @param amount A `BigInteger`, number or numeric string representing the number of drops to send.
   * @param paymentPointer the payment pointer to receive funds
   * @param sender the ILP account sending the funds
   * @returns A promise which resolves to a `BigInteger` of the amount that was delivered to the recipient
   */
  public async send(
    amount: BigInteger | number | string,
    paymentPointer: string,
    sender: string,
    bearerToken?: string,
  ): Promise<SendPaymentResponse> {
    return this.decoratedClient.send(
      amount,
      paymentPointer,
      sender,
      bearerToken,
    )
  }
}

export default IlpClient
