import * as Networking from "./network-client";
import { XRPLedgerAPIServiceClient } from "../generated/xrp_ledger_grpc_pb";
import {
  GetAccountInfoRequest,
  GetAccountInfoResponse
} from "../generated/account_info_pb";

// import { Fee } from "../generated/fee_pb";
// import { GetFeeRequest } from "../generated/get_fee_request_pb";
// import { GetAccountInfoRequest } from "../generated/get_account_info_request_pb";
// import { SubmitSignedTransactionRequest } from "../generated/submit_signed_transaction_request_pb";
// import { SubmitSignedTransactionResponse } from "../generated/submit_signed_transaction_response_pb";
// import { GetLatestValidatedLedgerSequenceRequest } from "../generated/get_latest_validated_ledger_sequence_request_pb";
// import { LedgerSequence } from "../generated/ledger_sequence_pb";
// import { GetTransactionStatusRequest } from "../generated/get_transaction_status_request_pb";
// import { TransactionStatus } from "../generated/transaction_status_pb";

import { credentials } from "grpc";

/**
 * A GRPC Based network client.
 */
class GRPCNetworkClient implements Networking.NetworkClient {
  private readonly grpcClient: XRPLedgerAPIServiceClient;

  public constructor(grpcURL: string) {
    this.grpcClient = new XRPLedgerAPIServiceClient(
      grpcURL,
      credentials.createInsecure()
    );
  }

  public async getAccountInfo(
    getAccountInfoRequest: GetAccountInfoRequest
  ): Promise<GetAccountInfoResponse> {
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

  // public async getFee(getFeeRequest: GetFeeRequest): Promise<Fee> {
  //   return new Promise((resolve, reject): void => {
  //     this.grpcClient.getFee(getFeeRequest, (error, response): void => {
  //       if (error != null || response == null) {
  //         reject(error);
  //         return;
  //       }
  //       resolve(response);
  //     });
  //   });
  // }

  // public async submitSignedTransaction(
  //   submitSignedTransactionRequest: SubmitSignedTransactionRequest
  // ): Promise<SubmitSignedTransactionResponse> {
  //   return new Promise((resolve, reject): void => {
  //     this.grpcClient.submitSignedTransaction(
  //       submitSignedTransactionRequest,
  //       (error, response): void => {
  //         if (error !== null || response === null) {
  //           reject(error);
  //           return;
  //         }
  //         resolve(response);
  //       }
  //     );
  //   });
  // }

  // public async getLatestValidatedLedgerSequence(
  //   getLatestValidatedLedgerSequenceRequest: GetLatestValidatedLedgerSequenceRequest
  // ): Promise<LedgerSequence> {
  //   return new Promise((resolve, reject): void => {
  //     this.grpcClient.getLatestValidatedLedgerSequence(
  //       getLatestValidatedLedgerSequenceRequest,
  //       (error, response): void => {
  //         if (error != null || response == null) {
  //           reject(error);
  //           return;
  //         }
  //         resolve(response);
  //       }
  //     );
  //   });
  // }

  // public async getTransactionStatus(
  //   getTransactionStatusRequest: GetTransactionStatusRequest
  // ): Promise<TransactionStatus> {
  //   return new Promise((resolve, reject): void => {
  //     this.grpcClient.getTransactionStatus(
  //       getTransactionStatusRequest,
  //       (error, response): void => {
  //         if (error != null || response == null) {
  //           reject(error);
  //           return;
  //         }
  //         resolve(response);
  //       }
  //     );
  //   });
  // }
}

export default GRPCNetworkClient;
