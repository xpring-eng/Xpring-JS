import { NetworkClient } from "../../src/network-client";
import { AccountData } from "../../generated/rippled_pb";
import { AccountInfo } from "../../generated/rippled_pb";
import { AccountInfoRequest } from "../../generated/rippled_pb";

/**
 * A response for a request ot retrieve type T. Either an instance of T, or an error.
 */
type Response<T> = T | Error;

/**
 * A list of responses the fake network client will give.
 */
export class FakeNetworkClientResponses {
  /**
   * A default error.
   */
  public static defaultError = new Error("fake network client failure");

  /**
   * A default set of responses that will always succeed.
   */
  public static defaultSuccessfulResponses = new FakeNetworkClientResponses();

  /**
   * A default set of responses that will always fail.
   */
  public static defaultErrorResponses = new FakeNetworkClientResponses(
    FakeNetworkClientResponses.defaultError
  );

  /**
   * Construct a new set of responses.
   *
   * @param getAccountInfoResponse The response or error that will be returned from the getAccountInfo request. Default is the default account info response.
   */
  public constructor(
    public readonly getAccountInfoResponse: Response<
      AccountInfo
    > = FakeNetworkClientResponses.defaultAccountInfoResponse()
  ) {}

  /**
   * Construct a default AccountInfoResponse.
   */
  public static defaultAccountInfoResponse(): AccountInfo {
    const accountData = new AccountData();
    accountData.setBalance("4000");

    const accountInfo = new AccountInfo();
    accountInfo.setAccountData(accountData);

    return accountInfo;
  }
}

/**
 * A fake network client which stubs network interaction.
 */
export class FakeNetworkClient implements NetworkClient {
  public constructor(
    private readonly responses: FakeNetworkClientResponses = FakeNetworkClientResponses.defaultSuccessfulResponses
  ) {}

  getAccountInfo(
    _accountInfoRequest: AccountInfoRequest
  ): Promise<AccountInfo> {
    const accountInfoResponse = this.responses.getAccountInfoResponse;
    return new Promise(function(resolve, reject) {
      if (accountInfoResponse instanceof Error) {
        reject(accountInfoResponse);
        return;
      }

      resolve(accountInfoResponse);
    });
  }
}
