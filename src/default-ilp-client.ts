import bigInt, { BigInteger } from 'big-integer'
import { IlpClientDecorator } from './ilp-client-decorator'
import isNode from './utils'
import { IlpNetworkClient } from './ilp-network-client'
import GrpcIlpNetworkClient from './grpc-ilp-network-client'
import GrpcIlpNetworkClientWeb from './grpc-ilp-network-client.web'
import { GetBalanceResponse } from './generated/web/ilp/get_balance_response_pb'
import { SendPaymentResponse } from './generated/web/ilp/send_payment_response_pb'

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
   * Retrieve the balance for the given address.
   *
   * @param address The ILP address to retrieve a balance for.
   * @returns A `BigInteger` representing the number of drops of XRP in the account.
   */
  public async getBalance(address: string): Promise<BigInteger> {
    const request = this.networkClient.GetBalanceRequest()
    request.setAccountId(address)
    const response: GetBalanceResponse = await this.networkClient.getBalance(
      request,
    )
    return bigInt(response.getNetBalance())
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
  ): Promise<BigInteger> {
    const request = this.networkClient.SendPaymentRequest()
    request.setDestinationPaymentPointer(paymentPointer)
    request.setAmount(Number(amount))
    request.setAccountId(sender)
    const response: SendPaymentResponse = await this.networkClient.send(request)
    return bigInt(response.getAmountDelivered())
  }
}

export default DefaultIlpClient
