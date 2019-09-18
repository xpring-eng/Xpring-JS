import { NetworkClient } from "./network-client";
import GRPCNetworkClient from "./grpc-network-client";
import { GetAccountInfoRequest } from "../terram/generated/get_account_info_request_pb";
import { XRPAmount } from "../terram/generated/xrp_amount_pb";

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
   * The XpringClient will use gRPC to communicate with the given endpoint.
   *
   * @param grpcURL The URL of the gRPC instance to connect to.
   */
  public static xpringClientWithEndpoint(grpcURL: string): XpringClient {
    const grpcClient = new GRPCNetworkClient(grpcURL);
    return new XpringClient(grpcClient);
  }

  /**
   * Create a new XpringClient with a custom network client implementation.
   *
   * In general, clients should prefer to call `xpringClientWithEndpoint`. This constructor is provided to improve testability of this class.
   *
   * @param networkClient A network client which will manage remote RPCs to Rippled.
   */
  public constructor(private readonly networkClient: NetworkClient) {}

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
