import * as Networking from "./network-client";
import { RippledClient } from "../generated/rippled_pb_service";
import { AccountInfo } from "../generated/rippled_pb";
import { AccountInfoRequest } from "../generated/rippled_pb";

/**
 * A GRPC Based network client.
 */
class GRPCNetworkClient implements Networking.NetworkClient {
  private readonly grpcClient: RippledClient;

  public constructor(grpcURL: string) {
    this.grpcClient = new RippledClient(grpcURL);
  }

  public async getAccountInfo(
    accountInfoRequest: AccountInfoRequest
  ): Promise<AccountInfo> {
    return new Promise((resolve, reject): void => {
      this.grpcClient.getAccountInfo(
        accountInfoRequest,
        (error, response): void => {
          if (error != null || response == null) {
            reject(error);
            return;
          }
          resolve(response);
        }
      );
    });
  }
}

export default GRPCNetworkClient;
