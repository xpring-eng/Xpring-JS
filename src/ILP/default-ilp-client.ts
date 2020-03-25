import { IlpClientDecorator } from './ilp-client-decorator'
import isNode from '../Common/utils'
import { IlpNetworkClient } from './ilp-network-client'
import GrpcIlpNetworkClient from './grpc-ilp-network-client'
import GrpcIlpNetworkClientWeb from './grpc-ilp-network-client.web'
import { AccountBalance } from './model/account-balance'
import { PaymentResult } from './model/payment-result'
import { PaymentRequest } from './model/payment-request'

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

  /**
   * Create a new DefaultIlpClient with a custom network client implementation.
   *
   * In general, clients should prefer to call `defaultIlpClientWithEndpoint`. This constructor is provided to improve
   * testability of this class.
   *
   * @param networkClient A network client which will manage remote RPCs to Hermes (the ILP proxy).
   */
  public constructor(private readonly networkClient: IlpNetworkClient) {}

  /**
   * Retrieve the balance for the given accountId.
   *
   * @param accountId The ILP accountId to retrieve a balance for.
   * @param bearerToken Optional auth token. If using node network client, bearerToken must be supplied, otherwise
   *        it will be picked up from a cookie.
   * @returns An AccountBalance with balance information of the specified account
   */
  public async getBalance(
    accountId: string,
    bearerToken?: string,
  ): Promise<AccountBalance> {
    const request = this.networkClient.GetBalanceRequest()
    request.setAccountId(accountId)
    return this.networkClient
      .getBalance(request, bearerToken)
      .then((response) => AccountBalance.from(response))
  }

  /**
   * Send the given amount of XRP from the source wallet to the destination address.
   *
   * @param paymentRequest A PaymentRequest with options for sending a payment
   * @param bearerToken Optional auth token. If using node network client, bearerToken must be supplied, otherwise
   *        it will be picked up from a cookie.
   * @returns A promise which resolves to a `PaymentResponse` of the original amount, the amount sent
   *        in the senders denomination, and the amount that was delivered to the recipient in their denomination, as
   *        well as if the payment was successful
   */
  public async sendPayment(
    paymentRequest: PaymentRequest,
    bearerToken?: string,
  ): Promise<PaymentResult> {
    const request = paymentRequest.toProto()
    return this.networkClient
      .send(request, bearerToken)
      .then((response) => PaymentResult.from(response))
  }
}

export default DefaultIlpClient
