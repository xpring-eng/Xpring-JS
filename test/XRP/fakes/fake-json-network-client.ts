import Result from '../../Common/Helpers/result'
import XrpError, { XrpErrorType } from '../../../src/XRP/shared/xrp-error'
import { AccountLinesResponse } from '../../../src/XRP/shared/json-schema'

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
      return Promise.reject(accountLinesResponse)
    }

    return Promise.resolve(accountLinesResponse)
  }
}
