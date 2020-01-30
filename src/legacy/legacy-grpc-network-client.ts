import { credentials } from 'grpc'
import { Wallet, Signer } from 'xpring-common-js'
import { XRPLedgerAPIClient } from '../generated/node/legacy/xrp_ledger_grpc_pb'
import { AccountInfo } from '../generated/node/legacy/account_info_pb'
import { Fee } from '../generated/node/legacy/fee_pb'
import { GetFeeRequest } from '../generated/node/legacy/get_fee_request_pb'
import { GetAccountInfoRequest } from '../generated/node/legacy/get_account_info_request_pb'
import { SubmitSignedTransactionRequest } from '../generated/node/legacy/submit_signed_transaction_request_pb'
import { SubmitSignedTransactionResponse } from '../generated/node/legacy/submit_signed_transaction_response_pb'
import { GetLatestValidatedLedgerSequenceRequest } from '../generated/node/legacy/get_latest_validated_ledger_sequence_request_pb'
import { LedgerSequence } from '../generated/node/legacy/ledger_sequence_pb'
import { GetTransactionStatusRequest } from '../generated/node/legacy/get_transaction_status_request_pb'
import { TransactionStatus } from '../generated/node/legacy/transaction_status_pb'
import { XRPAmount } from '../generated/node/legacy/xrp_amount_pb'
import { Payment } from '../generated/node/legacy/payment_pb'
import { Transaction } from '../generated/node/legacy/transaction_pb'
import { SignedTransaction } from '../generated/node/legacy/signed_transaction_pb'
import { LegacyNetworkClient } from './legacy-network-client'
import XpringClientErrorMessages from '../xpring-client-error-messages'

/**
 * A GRPC Based network client.
 */
class LegacyGRPCNetworkClientNode implements LegacyNetworkClient {
  private readonly grpcClient: XRPLedgerAPIClient

  public constructor(grpcURL: string) {
    this.grpcClient = new XRPLedgerAPIClient(
      grpcURL,
      credentials.createInsecure(),
    )
  }

  public async getAccountInfo(address: string): Promise<AccountInfo> {
    return new Promise((resolve, reject): void => {
      const getAccountInfoRequest = new GetAccountInfoRequest()
      getAccountInfoRequest.setAddress(address)
      this.grpcClient.getAccountInfo(
        getAccountInfoRequest,
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

  public async getFee(): Promise<Fee> {
    return new Promise((resolve, reject): void => {
      const getFeeRequest = new GetFeeRequest()
      this.grpcClient.getFee(getFeeRequest, (error, response): void => {
        if (error !== null || response === null) {
          reject(error)
          return
        }
        resolve(response)
      })
    })
  }

  public async submitSignedTransaction(
    signedTransaction: SignedTransaction,
  ): Promise<SubmitSignedTransactionResponse> {
    return new Promise((resolve, reject): void => {
      const submitSignedTransactionRequest = new SubmitSignedTransactionRequest()
      submitSignedTransactionRequest.setSignedTransaction(signedTransaction)
      this.grpcClient.submitSignedTransaction(
        submitSignedTransactionRequest,
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

  public async getLatestValidatedLedgerSequence(): Promise<LedgerSequence> {
    return new Promise((resolve, reject): void => {
      const getLatestValidatedLedgerSequenceRequest = new GetLatestValidatedLedgerSequenceRequest()
      this.grpcClient.getLatestValidatedLedgerSequence(
        getLatestValidatedLedgerSequenceRequest,
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

  public async getTransactionStatus(
    transactionHash: string,
  ): Promise<TransactionStatus> {
    return new Promise((resolve, reject): void => {
      const getTransactionStatusRequest = new GetTransactionStatusRequest()
      getTransactionStatusRequest.setTransactionHash(transactionHash)
      this.grpcClient.getTransactionStatus(
        getTransactionStatusRequest,
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

  public async createSignedTransaction(
    normalizedAmount: string,
    destination: string,
    sender: Wallet,
    ledgerSequenceMargin: number,
  ): Promise<SignedTransaction> {
    const fee = await this.getFee()
    const accountInfo = await this.getAccountInfo(sender.getAddress())
    const ledgerSequence = await this.getLatestValidatedLedgerSequence()
    const lastLedger = ledgerSequence.toObject().index + ledgerSequenceMargin
    const xrpAmount = new XRPAmount()
    xrpAmount.setDrops(normalizedAmount.toString())

    const payment = new Payment()
    payment.setXrpAmount(xrpAmount)
    payment.setDestination(destination)

    const transaction = new Transaction()
    transaction.setAccount(sender.getAddress())
    transaction.setFee(fee.getAmount())
    transaction.setSequence(accountInfo.getSequence())
    transaction.setPayment(payment)
    transaction.setLastLedgerSequence(lastLedger)
    transaction.setSigningPublicKeyHex(sender.getPublicKey())

    try {
      const signedTransaction = Signer.signLegacyTransaction(
        transaction,
        sender,
      )
      if (signedTransaction === undefined) {
        throw new Error(XpringClientErrorMessages.signingFailure)
      }
      return signedTransaction
    } catch (signingError) {
      const signingErrorMessage = `${XpringClientErrorMessages.signingFailure}. ${signingError.message}`
      throw new Error(signingErrorMessage)
    }
  }
}

export default LegacyGRPCNetworkClientNode
