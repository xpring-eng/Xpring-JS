import { NetworkClient } from "network-client";
import GRPCNetworkClient from "grpc-network-client";
import { AccountInfoRequest } from "../generated/rippled_pb";

/**
 * The default network client to use.
 */
const defaultNetworkClient = new GRPCNetworkClient()

/**
 * XpringClient is a client which interacts with the Xpring platform.
 */
class XpringClient {
  /**
   * Create a new XpringClient.
   * 
   * @param networkClient A network client which will manager remote RPCs to Rippled.
   */
  public constructor(private readonly networkClient: NetworkClient = defaultNetworkClient) {}

  /**
   * Retrieve the balance for the given address.
   * 
   * @param address The address to retrieve a balance for.
   * @returns The amount of XRP in the account.
   */
  getBalance(address: string): void {
    const accountInfoRequest = new AccountInfoRequest();
    accountInfoRequest.setAddress(address);

    this.networkClient.getAccountInfo(accountInfoRequest, (error, accountInfo) => {
      if (error != null || accountInfo == null) {
        console.log("Something has gone very wrong: " + error);        
      }
      console.log("Balance was: " + accountInfo);
    });
  }
}

export default XpringClient;
