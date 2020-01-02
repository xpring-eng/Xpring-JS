import * as Networking from "./network-client";
import { XRPLedgerAPIClient } from "../generated/legacy/xrp_ledger_grpc_pb";
import { AccountInfo } from "../generated/legacy/account_info_pb";
import { Fee } from "../generated/legacy/fee_pb";
import { GetFeeRequest } from "../generated/legacy/get_fee_request_pb";
import { GetAccountInfoRequest } from "../generated/legacy/get_account_info_request_pb";
import { SubmitSignedTransactionRequest } from "../generated/legacy/submit_signed_transaction_request_pb";
import { SubmitSignedTransactionResponse } from "../generated/legacy/submit_signed_transaction_response_pb";
import { GetLatestValidatedLedgerSequenceRequest } from "../generated/legacy/get_latest_validated_ledger_sequence_request_pb";
import { LedgerSequence } from "../generated/legacy/ledger_sequence_pb";
import { GetTransactionStatusRequest } from "../generated/legacy/get_transaction_status_request_pb";
import { TransactionStatus } from "../generated/legacy/transaction_status_pb";

import { credentials } from "grpc";

/**
 * A GRPC Based network client.
 */
class GRPCNetworkClient implements Networking.NetworkClient {
  private readonly grpcClient: XRPLedgerAPIClient;

  public constructor(grpcURL: string) {
    this.grpcClient = new XRPLedgerAPIClient(
      grpcURL,
      credentials.createInsecure()
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
          if (error !== null || response === null) {
            reject(error);
            return;
          }
          resolve(response);
        }
      );
    });
  }

  public async getLatestValidatedLedgerSequence(
    getLatestValidatedLedgerSequenceRequest: GetLatestValidatedLedgerSequenceRequest
  ): Promise<LedgerSequence> {
    return new Promise((resolve, reject): void => {
      this.grpcClient.getLatestValidatedLedgerSequence(
        getLatestValidatedLedgerSequenceRequest,
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

  public async getTransactionStatus(
    getTransactionStatusRequest: GetTransactionStatusRequest
  ): Promise<TransactionStatus> {
    return new Promise((resolve, reject): void => {
      this.grpcClient.getTransactionStatus(
        getTransactionStatusRequest,
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
