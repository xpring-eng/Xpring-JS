import * as Networking from "./network-client";
import { XRPLedgerClient } from "../generated/xrp_ledger_pb_service";
import { AccountInfo } from "../generated/account_info_pb";
import { GetAccountInfoRequest } from "../generated/get_account_info_request_pb";

/**
 * A GRPC Based network client.
 */
class GRPCNetworkClient implements Networking.NetworkClient {
  private readonly grpcClient: XRPLedgerClient;

  public constructor(grpcURL: string) {
    this.grpcClient = new XRPLedgerClient(grpcURL);
  }

  public async getAccountInfo(
    accountInfoRequest: GetAccountInfoRequest
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
