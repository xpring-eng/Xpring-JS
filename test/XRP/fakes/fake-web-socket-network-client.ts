import Result from '../../Common/Helpers/result'
import XrpError, { XrpErrorType } from '../../../src/XRP/shared/xrp-error'
import {
  WebSocketStatusResponse,
  TransactionResponse,
} from '../../../src/XRP/shared/rippled-web-socket-schema'

/**
 * A list of responses the fake network client will give.
 */
export class FakeWebSocketNetworkClientResponses {
  /**
   * A default error.
   */
  // TODO: what should an error really look like in this context?
  public static defaultError = new XrpError(XrpErrorType.Unknown, 'Test error')

  /**
   * A default set of responses that will always succeed.
   */
  public static defaultSuccessfulResponses = new FakeWebSocketNetworkClientResponses()

  /**
   * A default set of responses that will always fail.
   */
  public static defaultErrorResponses = new FakeWebSocketNetworkClientResponses(
    FakeWebSocketNetworkClientResponses.defaultError,
  )

  /**
   * Construct a new set of responses.
   *
   * @param getSubscribeResponse The response or error that will be returned from the subscribe request.
   */
  public constructor(
    public readonly getSubscribeResponse: Result<
      WebSocketStatusResponse
    > = FakeWebSocketNetworkClientResponses.defaultSubscribeResponse(),
  ) {}

  /**
   * Construct a default response for a subscribe request.
   */
  public static defaultSubscribeResponse(): WebSocketStatusResponse {
    return {
      id:
        'monitor_transactions_X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH',
      result: {},
      status: 'success',
      type: 'response',
    }
  }
}

/**
 * A fake network client which stubs network interaction.
 */
export class FakeWebSocketNetworkClient {
  public constructor(
    private readonly responses: FakeWebSocketNetworkClientResponses = FakeWebSocketNetworkClientResponses.defaultSuccessfulResponses,
  ) {}

  subscribeToAccount(
    _account: string,
    _id: string,
    _callback: (data: TransactionResponse) => void,
  ): Promise<WebSocketStatusResponse> {
    const subscribeResponse = this.responses.getSubscribeResponse
    if (subscribeResponse instanceof Error) {
      return Promise.reject(subscribeResponse)
    }

    return Promise.resolve(subscribeResponse)
  }

  close(): void {
    return
  }
}
