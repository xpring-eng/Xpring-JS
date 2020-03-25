import { XRPLedgerAPIClient } from '../Generated/web/legacy/xrp_ledger_grpc_web_pb'
import { AccountInfo } from '../Generated/web/legacy/account_info_pb'
import { Fee } from '../Generated/web/legacy/fee_pb'
import { GetFeeRequest } from '../Generated/web/legacy/get_fee_request_pb'
import { GetAccountInfoRequest } from '../Generated/web/legacy/get_account_info_request_pb'
import { SubmitSignedTransactionRequest } from '../Generated/web/legacy/submit_signed_transaction_request_pb'
import { SubmitSignedTransactionResponse } from '../Generated/web/legacy/submit_signed_transaction_response_pb'
import { GetLatestValidatedLedgerSequenceRequest } from '../Generated/web/legacy/get_latest_validated_ledger_sequence_request_pb'
import { LedgerSequence } from '../Generated/web/legacy/ledger_sequence_pb'
import { GetTransactionStatusRequest } from '../Generated/web/legacy/get_transaction_status_request_pb'
import { TransactionStatus } from '../Generated/web/legacy/transaction_status_pb'
import { XRPAmount } from '../Generated/node/legacy/xrp_amount_pb'
import { Payment } from '../Generated/node/legacy/payment_pb'
import { Transaction } from '../Generated/node/legacy/transaction_pb'
import { LegacyXRPNetworkClient } from './legacy-xrp-network-client'
import isNode from '../../Common/utils'

/**
 * A GRPC Based network client.
 */
class LegacyXRPGRPCNetworkClient implements LegacyXRPNetworkClient {
  private readonly grpcClient: XRPLedgerAPIClient

  public constructor(grpcURL: string) {
    if (isNode()) {
      try {
        // This polyfill hack enables XMLHttpRequest on the global node.js state
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore eslint-disable-line
        global.XMLHttpRequest = require('xhr2') // eslint-disable-line
      } catch {
        // Swallow the error here for browsers
      }
    }
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

export default LegacyXRPGRPCNetworkClient
