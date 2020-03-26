import { IlpClientDecorator } from './ilp-client-decorator'
import isNode from '../Common/utils'
import { IlpNetworkClient } from './ilp-network-client'
import GrpcIlpNetworkClient from './grpc-ilp-network-client'
import GrpcIlpNetworkClientWeb from './grpc-ilp-network-client.web'
import { AccountBalance } from './model/account-balance'
import { PaymentResult } from './model/payment-result'
import { PaymentRequest } from './model/payment-request'
import ErrorHandlerUtils from '../Common/error-handler-utils'

class DefaultIlpClient implements IlpClientDecorator {
  /**
   * Create a new DefaultIlpClient.
   *
   * The DefaultIlpClient will use gRPC to communicate with the given endpoint.
   *
   * @param grpcURL The URL of the gRPC instance to connect to.
   * @param forceWeb If `true`, then we will use the gRPC-Web client even when on Node. Defaults to false.
   * This is mainly for testing and in the future will be removed when we have browser testing.
   */
  public static defaultIlpClientWithEndpoint(
    grpcURL: string,
    forceWeb = false,
  ): DefaultIlpClient {
    return isNode() && !forceWeb
      ? new DefaultIlpClient(new GrpcIlpNetworkClient(grpcURL))
      : new DefaultIlpClient(new GrpcIlpNetworkClientWeb(grpcURL))
  }

  public constructor(private readonly networkClient: IlpNetworkClient) {}

  /**
   * Get the balance of the specified account on the connector.
   *
   * @param accountId The account ID to get the balance for.
   * @param accessToken Optional access token. If using node network client, accessToken must be supplied, otherwise
   *        it will be picked up from a cookie.
   * @return A Promise<AccountBalance> with balance information of the specified account
   * @throws a XpringIlpException if the inputs were invalid or an error occurs during the call.
   */
  public async getBalance(
    accountId: string,
    accessToken?: string,
  ): Promise<AccountBalance> {
    const request = this.networkClient.GetBalanceRequest()
    request.setAccountId(accountId)
    return this.networkClient
      .getBalance(request, accessToken)
      .catch((error) => {
        throw ErrorHandlerUtils.handleIlpServiceError(error)
      })
      .then((response) => AccountBalance.from(response))
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
   * @throws a XpringIlpException if the inputs were invalid or an error occurs during the call.
   */
  public async sendPayment(
    paymentRequest: PaymentRequest,
    accessToken?: string,
  ): Promise<PaymentResult> {
    const request = paymentRequest.toProto()
    return this.networkClient
      .send(request, accessToken)
      .catch((error) => {
        throw ErrorHandlerUtils.handleIlpServiceError(error)
      })
      .then((response) => PaymentResult.from(response))
  }
}

export default DefaultIlpClient
