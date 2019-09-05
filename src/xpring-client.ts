import { NetworkClient } from "./network-client";
import GRPCNetworkClient from "./grpc-network-client";
import { AccountInfoRequest } from "../generated/rippled_pb";
import { XRPAmount } from "../generated/XRPAmount_pb";

/**
 * The default network client to use.
 */
const defaultNetworkClient = new GRPCNetworkClient();

/**
 * Error messages from XpringClient.
 */
class XpringClientErrorMessages {
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
  public getBalance(address: string): Promise<XRPAmount> {
    const accountInfoRequest = new AccountInfoRequest();
    accountInfoRequest.setAddress(address);

    return new Promise((resolve, reject) => {
      let accountInfoPromise = this.networkClient.getAccountInfo(
        accountInfoRequest
      );

      accountInfoPromise.then(accountInfo => {
        const accountData = accountInfo.getAccountData();
        if (accountData == undefined) {
          reject(new Error(XpringClientErrorMessages.malformedResponse));
          return;
        }

        const balance = accountData.getBalance();
        if (balance == undefined) {
          reject(new Error(XpringClientErrorMessages.malformedResponse));
          return;
        }

        const xrpAmount = new XRPAmount();
        xrpAmount.setDrops(balance);

        resolve(xrpAmount);
      });

      accountInfoPromise.catch(error => {
        reject(error);
      });
    });
  }
}

export default XpringClient;
