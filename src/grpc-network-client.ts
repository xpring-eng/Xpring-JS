import * as Networking from "./network-client";
import { RippledClient } from "../generated/rippled_pb_service";
import { AccountInfo } from "../generated/rippled_pb";
import { AccountInfoRequest } from "../generated/rippled_pb";

/**
 * The default URL to look for a remote Xpring Platfrom GRPC service on.
 */
const defaultGRPCURL = "127.0.0.1:3001";

/**
 * A GRPC Based network client.
 */
class GRPCNetworkClient implements Networking.NetworkClient {
  private readonly grpcClient: RippledClient;

  constructor(grpcURL = defaultGRPCURL) {
    this.grpcClient = new RippledClient(grpcURL);
  }

  getAccountInfo(
    accountInfoRequest: AccountInfoRequest
  ): Promise<AccountInfo> {
    console.log("You called me!");

    return new Promise((resolve, reject) => {
      this.grpcClient.getAccountInfo(accountInfoRequest, (error, response) => {
        if (error != null || response == null) {
          reject(error);
          return
        }
        resolve(response);
      });
    })
  }
}

export default GRPCNetworkClient;
