import { status } from 'grpc'
import { IlpNetworkClient } from '../../../src/ILP/ilp-network-client'
import { GetBalanceResponse } from '../../../src/ILP/Generated/node/get_balance_response_pb'
import { SendPaymentResponse } from '../../../src/ILP/Generated/node/send_payment_response_pb'
import { GetBalanceRequest } from '../../../src/ILP/Generated/node/get_balance_request_pb'
import { SendPaymentRequest } from '../../../src/ILP/Generated/node/send_payment_request_pb'
import FakeGRPCError from './fake-grpc-error'
import XpringIlpError from '../../../src/ILP/xpring-ilp-error'

/**
 * A response for a request to retrieve type T. Either an instance of T, or an error.
 */
type Response<T> = T | Error

export class FakeIlpNetworkClientResponses {
  /**
   * A default error.
   */
  public static defaultError = new Error('fake ilp network client failure')

  /**
   * A fake GRPC error mocking grpc.status.NOT_FOUND
   */
  public static notFoundError = new FakeGRPCError(status.NOT_FOUND)

  /**
   * A fake GRPC error mocking grpc.status.UNAUTHENTICATED
   */
  public static unauthenticatedError = new FakeGRPCError(status.UNAUTHENTICATED)

  /**
   * A fake GRPC error mocking grpc.status.INVALID_ARGUMENT
   */
  public static invalidArgumentError = new FakeGRPCError(
    status.INVALID_ARGUMENT,
  )

  /**
   * A fake GRPC error mocking grpc.status.INTERNAL
   */
  public static internalError = new FakeGRPCError(status.INTERNAL)

  /**
   * A real XpringIlpError which would get thrown if an access token starts with "Bearer "
   */
  public static invalidAccessTokenError = XpringIlpError.invalidAccessToken

  /**
   * A default set of responses that will always succeed.
   */
  public static defaultSuccessfulResponses = new FakeIlpNetworkClientResponses()

  /**
   * A default set of responses that will always fail.
   */
  public static defaultErrorResponses = new FakeIlpNetworkClientResponses(
    FakeIlpNetworkClientResponses.defaultError,
    FakeIlpNetworkClientResponses.defaultError,
  )

  /**
   * A set of responses that will always fail with error = grpc.status.NOT_FOUND.
   */
  public static notFoundErrorResponses = new FakeIlpNetworkClientResponses(
    FakeIlpNetworkClientResponses.notFoundError,
    FakeIlpNetworkClientResponses.notFoundError,
  )

  /**
   * A set of responses that will always fail with error = grpc.status.UNAUTHENTICATED.
   */
  public static unauthenticatedErrorResponses = new FakeIlpNetworkClientResponses(
    FakeIlpNetworkClientResponses.unauthenticatedError,
    FakeIlpNetworkClientResponses.unauthenticatedError,
  )

  /**
   * A set of responses that will always fail with error = grpc.status.INVALID_ARGUMENT.
   */
  public static invalidArgumentErrorResponses = new FakeIlpNetworkClientResponses(
    FakeIlpNetworkClientResponses.invalidArgumentError,
    FakeIlpNetworkClientResponses.invalidArgumentError,
  )

  /**
   * A set of responses that will always fail with error = grpc.status.INTERNAL.
   */
  public static internalErrorResponses = new FakeIlpNetworkClientResponses(
    FakeIlpNetworkClientResponses.internalError,
    FakeIlpNetworkClientResponses.internalError,
  )

  /**
   * A set of responses that will always fail with error = XpringIlpError.invalidAccessToken.
   */
  public static invalidAccessTokenErrorResponses = new FakeIlpNetworkClientResponses(
    FakeIlpNetworkClientResponses.invalidAccessTokenError,
    FakeIlpNetworkClientResponses.invalidAccessTokenError,
  )

  /**
   * Construct a new set of responses.
   *
   * @param getBalanceResponse The response or error that will be returned from the getBalanceResponse request.
   * Default is the default get balance response.
   * @param sendResponse The response or error that will be returned from the send request.
   * Defaults to the default send response.
   */
  public constructor(
    public readonly getBalanceResponse: Response<
      GetBalanceResponse
    > = FakeIlpNetworkClientResponses.defaultGetBalanceResponse(),
    public readonly sendResponse: Response<
      SendPaymentResponse
    > = FakeIlpNetworkClientResponses.defaultSendResponse(),
  ) {}

  /**
   * Construct a default GetBalanceResponse.
   */
  public static defaultGetBalanceResponse(): GetBalanceResponse {
    const response = new GetBalanceResponse()
    response.setAccountId('joeyjojojuniorshabadoo')
    response.setAssetCode('XRP')
    response.setNetBalance(100)
    response.setPrepaidAmount(50)
    response.setClearingBalance(50)

    return response
  }

  /**
   * Construct a default SendPaymentResponse.
   */
  public static defaultSendResponse(): SendPaymentResponse {
    const response = new SendPaymentResponse()
    response.setAmountDelivered(50)
    response.setAmountSent(55)
    response.setOriginalAmount(55)
    response.setSuccessfulPayment(true)
    return response
  }
}

export class FakeIlpNetworkClient implements IlpNetworkClient {
  public constructor(
    private readonly responses: FakeIlpNetworkClientResponses = FakeIlpNetworkClientResponses.defaultSuccessfulResponses,
  ) {}

  getBalance(
    _request: GetBalanceRequest,
    _accessToken: string,
  ): Promise<GetBalanceResponse> {
    const response = this.responses.getBalanceResponse
    if (response instanceof Error) {
      return Promise.reject(response)
    }
    return Promise.resolve(response)
  }

  send(_request: SendPaymentRequest): Promise<SendPaymentResponse> {
    const response = this.responses.sendResponse
    if (response instanceof Error) {
      return Promise.reject(response)
    }
    return Promise.resolve(response)
  }

  /* eslint-disable class-methods-use-this */
  public GetBalanceRequest(): GetBalanceRequest {
    return new GetBalanceRequest()
  }

  public SendPaymentRequest(): SendPaymentRequest {
    return new SendPaymentRequest()
  }
  /* eslint-enable class-methods-use-this */
}
