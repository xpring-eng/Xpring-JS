import Result from '../../Common/Helpers/result'
import XrpError, { XrpErrorType } from '../../../src/XRP/shared/xrp-error'
import {
  WebSocketAccountLinesResponse,
  WebSocketStatusResponse,
  WebSocketTransactionResponse,
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
    public readonly getAccountLinesResponse: Result<
      WebSocketAccountLinesResponse
    > = FakeWebSocketNetworkClientResponses.defaultGetAccountLinesResponse(),
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

  /**
   * Construct a default response for getAccountLines request.
   */
  public static defaultGetAccountLinesResponse(): WebSocketAccountLinesResponse {
    return {
      id: 'account_lines_r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59',
      type: 'response',
      status: 'success',
      result: {
        account: 'r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59',
        ledger_hash:
          '7866E9E228680D236FF0141D4E2EE9E2914FA35EFC20288DB590BAE0F3500142',
        ledger_index: 11822601,
        validated: true,
        lines: [
          {
            account: 'r3vi7mWxru9rJCxETCyA1CHvzL96eZWx5z',
            balance: '0',
            currency: 'ASP',
            limit: '0',
            limit_peer: '10',
            quality_in: 0,
            quality_out: 0,
          },
          {
            account: 'r3vi7mWxru9rJCxETCyA1CHvzL96eZWx5z',
            balance: '0',
            currency: 'XAU',
            limit: '0',
            limit_peer: '0',
            no_ripple: true,
            no_ripple_peer: true,
            quality_in: 0,
            quality_out: 0,
          },
          {
            account: 'rs9M85karFkCRjvc6KMWn8Coigm9cbcgcx',
            balance: '0',
            currency: '015841551A748AD2C1F76FF6ECB0CCCD00000000',
            limit: '10.01037626125837',
            limit_peer: '0',
            no_ripple: true,
            quality_in: 0,
            quality_out: 0,
          },
        ],
      },
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
    _callback: (data: WebSocketTransactionResponse) => void,
    _account: string,
  ): Promise<WebSocketStatusResponse> {
    const subscribeResponse = this.responses.getSubscribeResponse
    if (subscribeResponse instanceof Error) {
      return Promise.reject(subscribeResponse)
    }

    return Promise.resolve(subscribeResponse)
  }

  getAccountLines(_address: string): Promise<WebSocketAccountLinesResponse> {
    const accountLinesResponse = this.responses.getAccountLinesResponse
    if (accountLinesResponse instanceof Error) {
      return Promise.reject(accountLinesResponse)
    }

    return Promise.resolve(accountLinesResponse)
  }

  close(): void {
    return
  }
}
