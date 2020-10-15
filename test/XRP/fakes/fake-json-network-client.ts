import Result from '../../Common/Helpers/result'
import XrpError, { XrpErrorType } from '../../../src/XRP/shared/xrp-error'
import {
  AccountLinesResponse,
  GatewayBalancesResponse,
} from '../../../src/XRP/shared/rippled-json-rpc-schema'

/**
 * A list of responses the fake network client will give.
 */
export class FakeJsonNetworkClientResponses {
  /**
   * A default error.
   */
  // TODO: what should an error really look like in this context?
  public static defaultError = new XrpError(XrpErrorType.Unknown, 'Test error')

  /**
   * A default set of responses that will always succeed.
   */
  public static defaultSuccessfulResponses = new FakeJsonNetworkClientResponses()

  /**
   * A default set of responses that will always fail.
   */
  public static defaultErrorResponses = new FakeJsonNetworkClientResponses(
    FakeJsonNetworkClientResponses.defaultError,
  )

  /**
   * Construct a new set of responses.
   *
   * @param getAccountLinesResponse The response or error that will be returned from the getAccountLines request.
   *                                Default is the example at https://xrpl.org/account_lines.html#response-format for JSON-RPC.
   */
  public constructor(
    public readonly getAccountLinesResponse: Result<
      AccountLinesResponse
    > = FakeJsonNetworkClientResponses.defaultGetAccountLinesResponse(),
    public readonly getGatewayBalancesReponse: Result<
      GatewayBalancesResponse
    > = FakeJsonNetworkClientResponses.defaultGetGatewayBalancesResponse(),
  ) {}

  /**
   * Construct a default response for getAccountLines request.
   */
  public static defaultGetAccountLinesResponse(): AccountLinesResponse {
    return {
      result: {
        account: 'r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59',
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
        status: 'success',
      },
    }
  }

  /**
   * Construct a default response for getGatewayBalances request.
   */
  public static defaultGetGatewayBalancesResponse(): GatewayBalancesResponse {
    return {
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
        status: 'success',
        validated: true,
      },
    }
  }
}

/**
 * A fake network client which stubs network interaction.
 */
export class FakeJsonNetworkClient {
  public constructor(
    private readonly responses: FakeJsonNetworkClientResponses = FakeJsonNetworkClientResponses.defaultSuccessfulResponses,
  ) {}

  getAccountLines(_address: string): Promise<AccountLinesResponse> {
    const accountLinesResponse = this.responses.getAccountLinesResponse
    if (accountLinesResponse instanceof Error) {
      console.log('account lines response was instance of error')
      return Promise.reject(accountLinesResponse)
    }

    return Promise.resolve(accountLinesResponse)
  }

  getGatewayBalances(
    _address: string,
    _hotwallet?: string | Array<string>,
  ): Promise<GatewayBalancesResponse> {
    const gatewayBalancesResponse = this.responses.getGatewayBalancesReponse
    if (gatewayBalancesResponse instanceof Error) {
      return Promise.reject(gatewayBalancesResponse)
    }

    return Promise.resolve(gatewayBalancesResponse)
  }
}
