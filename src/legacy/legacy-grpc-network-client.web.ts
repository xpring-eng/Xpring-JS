import { XRPLedgerAPIClient } from '../generated/web/legacy/xrp_ledger_grpc_web_pb'
import { AccountInfo } from '../generated/web/legacy/account_info_pb'
import { Fee } from '../generated/web/legacy/fee_pb'
import { GetFeeRequest } from '../generated/web/legacy/get_fee_request_pb'
import { GetAccountInfoRequest } from '../generated/web/legacy/get_account_info_request_pb'
import { SubmitSignedTransactionRequest } from '../generated/web/legacy/submit_signed_transaction_request_pb'
import { SubmitSignedTransactionResponse } from '../generated/web/legacy/submit_signed_transaction_response_pb'
import { GetLatestValidatedLedgerSequenceRequest } from '../generated/web/legacy/get_latest_validated_ledger_sequence_request_pb'
import { LedgerSequence } from '../generated/web/legacy/ledger_sequence_pb'
import { GetTransactionStatusRequest } from '../generated/web/legacy/get_transaction_status_request_pb'
import { TransactionStatus } from '../generated/web/legacy/transaction_status_pb'
import { LegacyNetworkClient } from './legacy-network-client'
import { XRPAmount } from '../generated/node/legacy/xrp_amount_pb'
import { Payment } from '../generated/node/legacy/payment_pb'
import { Transaction } from '../generated/node/legacy/transaction_pb'

/**
 * A GRPC Based network client.
 */
class LegacyGRPCNetworkClient implements LegacyNetworkClient {
  private readonly grpcClient: XRPLedgerAPIClient

  public constructor(grpcURL: string) {
    this.grpcClient = new XRPLedgerAPIClient(grpcURL)
  }

  public async getAccountInfo(
    getAccountInfoRequest: GetAccountInfoRequest,
  ): Promise<AccountInfo> {
    return new Promise((resolve, reject): void => {
      this.grpcClient.getAccountInfo(
        getAccountInfoRequest,
        {},
        (error, response): void => {
          if (error != null || response == null) {
            reject(error)
            return
          }
          resolve(response)
        },
      )
    })
  }

  public async getFee(getFeeRequest: GetFeeRequest): Promise<Fee> {
    return new Promise((resolve, reject): void => {
      this.grpcClient.getFee(getFeeRequest, {}, (error, response): void => {
        if (error != null || response == null) {
          reject(error)
          return
        }
        resolve(response)
      })
    })
  }

  public async submitSignedTransaction(
    submitSignedTransactionRequest: SubmitSignedTransactionRequest,
  ): Promise<SubmitSignedTransactionResponse> {
    return new Promise((resolve, reject): void => {
      this.grpcClient.submitSignedTransaction(
        submitSignedTransactionRequest,
        {},
        (error, response): void => {
          if (error !== null || response === null) {
            reject(error)
            return
          }
          resolve(response)
        },
      )
    })
  }

  public async getLatestValidatedLedgerSequence(
    getLatestValidatedLedgerSequenceRequest: GetLatestValidatedLedgerSequenceRequest,
  ): Promise<LedgerSequence> {
    return new Promise((resolve, reject): void => {
      this.grpcClient.getLatestValidatedLedgerSequence(
        getLatestValidatedLedgerSequenceRequest,
        {},
        (error, response): void => {
          if (error != null || response == null) {
            reject(error)
            return
          }
          resolve(response)
        },
      )
    })
  }

  public async getTransactionStatus(
    getTransactionStatusRequest: GetTransactionStatusRequest,
  ): Promise<TransactionStatus> {
    return new Promise((resolve, reject): void => {
      this.grpcClient.getTransactionStatus(
        getTransactionStatusRequest,
        {},
        (error, response): void => {
          if (error != null || response == null) {
            reject(error)
            return
          }
          resolve(response)
        },
      )
    })
  }

  /* eslint-disable class-methods-use-this */
  public XRPAmount(): XRPAmount {
    return new XRPAmount()
  }

  public Payment(): Payment {
    return new Payment()
  }

  public Transaction(): Transaction {
    return new Transaction()
  }

  public SubmitSignedTransactionRequest(): SubmitSignedTransactionRequest {
    return new SubmitSignedTransactionRequest()
  }

  public GetLatestValidatedLedgerSequenceRequest(): GetLatestValidatedLedgerSequenceRequest {
    return new GetLatestValidatedLedgerSequenceRequest()
  }

  public GetTransactionStatusRequest(): GetTransactionStatusRequest {
    return new GetTransactionStatusRequest()
  }

  public GetAccountInfoRequest(): GetAccountInfoRequest {
    return new GetAccountInfoRequest()
  }

  public GetFeeRequest(): GetFeeRequest {
    return new GetFeeRequest()
  }
  /* eslint-enable class-methods-use-this */
}

export default LegacyGRPCNetworkClient
