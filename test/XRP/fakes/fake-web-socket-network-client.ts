import Result from '../../Common/Helpers/result'
import XrpError, { XrpErrorType } from '../../../src/XRP/shared/xrp-error'
import {
  WebSocketAccountLinesResponse,
  WebSocketGatewayBalancesResponse,
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
    public readonly getGatewayBalancesResponse: Result<
      WebSocketGatewayBalancesResponse
    > = FakeWebSocketNetworkClientResponses.defaultGetGatewayBalancesResponse(),
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

  /**
   * Construct a default response for getGatewayBalances request.
   */
  public static defaultGetGatewayBalancesResponse(): WebSocketGatewayBalancesResponse {
    return {
      id: 'gateway_balances_rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q',
      status: 'success',
      type: 'response',
      result: {
        account: 'rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q',
        assets: {
          r9F6wk8HkXrgYWoJ7fsv4VrUBVoqDVtzkH: [
            {
              currency: 'BTC',
              value: '5444166510000000e-26',
            },
          ],
          rPFLkxQk6xUGdGYEykqe7PR25Gr7mLHDc8: [
            {
              currency: 'EUR',
              value: '4000000000000000e-27',
            },
          ],
          rPU6VbckqCLW4kb51CWqZdxvYyQrQVsnSj: [
            {
              currency: 'BTC',
              value: '1029900000000000e-26',
            },
          ],
          rpR95n1iFkTqpoy1e878f4Z1pVHVtWKMNQ: [
            {
              currency: 'BTC',
              value: '4000000000000000e-30',
            },
          ],
          rwmUaXsWtXU4Z843xSYwgt1is97bgY8yj6: [
            {
              currency: 'BTC',
              value: '8700000000000000e-30',
            },
          ],
        },
        balances: {
          rKm4uWpg9tfwbVSeATv4KxDe6mpE9yPkgJ: [
            {
              currency: 'EUR',
              value: '29826.1965999999',
            },
          ],
          ra7JkEzrgeKHdzKgo4EUUVBnxggY4z37kt: [
            {
              currency: 'USD',
              value: '13857.70416',
            },
          ],
        },
        ledger_hash:
          '980FECF48CA4BFDEC896692C31A50D484BDFE865EC101B00259C413AA3DBD672',
        ledger_index: 14483212,
        obligations: {
          BTC: '5908.324927635318',
          EUR: '992471.7419793958',
          GBP: '4991.38706013193',
          USD: '1997134.20229482',
        },
        validated: true,
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
    _account: string,
    _callback: (data: WebSocketTransactionResponse) => void,
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

  getGatewayBalances(
    _address: string,
    _addressesToExclude?: string | Array<string>,
  ): Promise<WebSocketGatewayBalancesResponse> {
    const gatewayBalancesResponse = this.responses.getGatewayBalancesResponse
    if (gatewayBalancesResponse instanceof Error) {
      return Promise.reject(gatewayBalancesResponse)
    }

    return Promise.resolve(gatewayBalancesResponse)
  }

  close(): void {
    return
  }
}
