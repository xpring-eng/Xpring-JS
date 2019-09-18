import * as Networking from "./network-client";
import { XRPLedgerClient } from "../terram/generated/xrp_ledger_grpc_pb";
import { AccountInfo } from "../terram/generated/account_info_pb";
import { Fee } from "../terram/generated/fee_pb";
import { GetAccountInfoRequest } from "../terram/generated/get_account_info_request_pb";
import { GetFeeRequest } from "../terram/generated/get_fee_request_pb";
import { SubmitSignedTransactionRequest } from "../terram/generated/submit_signed_transaction_request_pb";
import { SubmitSignedTransactionResponse } from "../terram/generated/submit_signed_transaction_response_pb";
import terram from "../terram/src/index";

/**
 * A GRPC Based network client.
 */
class GRPCNetworkClient implements Networking.NetworkClient {
  private readonly grpcClient: XRPLedgerClient;

  public constructor(grpcURL: string) {
    this.grpcClient = new XRPLedgerClient(
      grpcURL,
      terram.grpc.credentials.createInsecure()
    );
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

  public async getFee(getFeeRequest: GetFeeRequest): Promise<Fee> {
    return new Promise((resolve, reject): void => {
      this.grpcClient.getFee(getFeeRequest, (error, response): void => {
        if (error != null || response == null) {
          reject(error);
          return;
        }
        resolve(response);
      });
    });
  }

  public async submitSignedTransaction(
    submitSignedTransactionRequest: SubmitSignedTransactionRequest
  ): Promise<SubmitSignedTransactionResponse> {
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
