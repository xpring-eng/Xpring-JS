import { NetworkClient } from "./network-client";
import GRPCNetworkClient from "./grpc-network-client";
import { GetAccountInfoRequest } from "../terram/generated/get_account_info_request_pb";
import { XRPAmount } from "../terram/generated/xrp_amount_pb";

/**
 * The default network client to use.
 */
const defaultNetworkClient = new GRPCNetworkClient();

/**
 * Error messages from XpringClient.
 */
export class XpringClientErrorMessages {
  public static readonly malformedResponse = "Malformed Response.";
}

/**
 * XpringClient is a client which interacts with the Xpring platform.
 */
class XpringClient {
  /**
   * Create a new XpringClient.
   *
   * @param networkClient A network client which will manager remote RPCs to Rippled.
   */
  public constructor(
    private readonly networkClient: NetworkClient = defaultNetworkClient
  ) {}

  /**
   * Retrieve the balance for the given address.
   *
   * @param address The address to retrieve a balance for.
   * @returns The amount of XRP in the account.
   */
  public async getBalance(address: string): Promise<XRPAmount> {
    const accountInfoRequest = new GetAccountInfoRequest();
    accountInfoRequest.setAddress(address);

    return this.networkClient
      .getAccountInfo(accountInfoRequest)
      .then(async accountInfo => {
        const balance = accountInfo.getBalance();
        if (balance === undefined) {
          return Promise.reject(
            new Error(XpringClientErrorMessages.malformedResponse)
          );
        }

        return balance;
      });
  }
}

export default XpringClient;
