import * as Networking from "./network-client";
import { XRPLedgerClient } from "../generated/xrp_ledger_pb_service";
import { AccountInfo } from "../generated/account_info_pb";
import { Fee } from "../generated/fee_pb";
import { GetAccountInfoRequest } from "../generated/get_account_info_request_pb";
import { GetFeeRequest } from "../generated/get_fee_request_pb";
import { SubmitSignedTransactionRequest } from "../generated/submit_signed_transaction_request_pb";
import { SubmitSignedTransactionResponse } from "../generated/submit_signed_transaction_response_pb";

/**
 * The default URL to look for a remote Xpring Platfrom GRPC service on.
 */
const defaultGRPCURL = "127.0.0.1:3001";

/**
 * A GRPC Based network client.
 */
class GRPCNetworkClient implements Networking.NetworkClient {
  private readonly grpcClient: XRPLedgerClient;

  public constructor(grpcURL = defaultGRPCURL) {
    this.grpcClient = new XRPLedgerClient(grpcURL);
  }

  public async getAccountInfo(
    getAccountInfoRequest: GetAccountInfoRequest
  ): Promise<AccountInfo> {
    return new Promise((resolve, reject): void => {
      this.grpcClient.getAccountInfo(
        getAccountInfoRequest,
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

  public async getFee(
    getFeeRequest: GetFeeRequest
  ): Promise<Fee> {
    return new Promise((resolve, reject): void => {
      this.grpcClient.getFee(
        getFeeRequest,
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

  public async submitSignedTransaction(submitSignedTransactionRequest: SubmitSignedTransactionRequest): Promise<SubmitSignedTransactionResponse> {
    return new Promise((resolve, reject): void => {
      this.grpcClient.submitSignedTransaction(
        submitSignedTransactionRequest,
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
