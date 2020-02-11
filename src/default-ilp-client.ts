import { IlpClientDecorator } from "./ilp-client-decorator";
import { BigInteger } from "big-integer";
import isNode from "./utils";
import { IlpNetworkClient } from "./ilp-network-client";
import GrpcIlpNetworkClient from "./grpc-ilp-network-client";
import GrpcIlpNetworkClientWeb from "./grpc-ilp-network-client.web";
import { GetBalanceRequest } from "./generated/web/ilp/get_balance_request_pb";
import { GetBalanceResponse } from "./generated/web/ilp/get_balance_response_pb";
import { SendPaymentRequest } from "./generated/web/ilp/send_payment_request_pb";
import { SendPaymentResponse } from "./generated/web/ilp/send_payment_response_pb";
import bigInt = require("big-integer");

class DefaultIlpClient implements IlpClientDecorator {

  public static defaultIlpClientWithEndpoint(
    grpcURL: string,
    forceWeb = false,
  ): DefaultIlpClient {
    return isNode() && !forceWeb
      ? new DefaultIlpClient(new GrpcIlpNetworkClient(grpcURL))
      : new DefaultIlpClient(new GrpcIlpNetworkClientWeb(grpcURL))
  }

  public constructor(private readonly networkClient: IlpNetworkClient) {}

  public async getBalance(address: string): Promise<BigInteger> {
    const request = new GetBalanceRequest();
    request.setAccountId(address)
    const response: GetBalanceResponse = await this.networkClient.getBalance(request)
    return bigInt(response.getNetBalance());

  }

  public async send(amount: BigInteger | number | string, paymentPointer: string, sender: string): Promise<BigInteger> {
    const request = new SendPaymentRequest();
    request.setDestinationPaymentPointer(paymentPointer)
    request.setAmount(Number(amount))
    request.setAccountId(sender)
    const response: SendPaymentResponse = await this.networkClient.send(request)
    return bigInt(response.getAmountSent());
  }

}

export default DefaultIlpClient