import Result from '../../Common/Helpers/result'
import XrpError, { XrpErrorType } from '../../../src/XRP/shared/xrp-error'
import {
  WebSocketResponse,
  WebSocketStatusResponse,
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
   * @param getSubscribeResponse The response or error that will be returned from the getAccountLines request.
   *                                Default is the example at https://xrpl.org/account_lines.html#response-format for JSON-RPC.
   */
  public constructor(
    public readonly getSubscribeResponse: Result<
      WebSocketStatusResponse
    > = FakeWebSocketNetworkClientResponses.defaultSubscribeResponse(),
  ) {}

  /**
   * Construct a default response for getAccountLines request.
   */
  public static defaultSubscribeResponse(): WebSocketStatusResponse {
    return {
      id: 'subscribe_transaction',
      result: undefined,
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
    _id: string,
    _callback: (data: WebSocketResponse) => void,
    _account: string,
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
