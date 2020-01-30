import { Signer, Wallet } from 'xpring-common-js'
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
import { XRPAmount } from '../generated/node/legacy/xrp_amount_pb'
import { Payment } from '../generated/node/legacy/payment_pb'
import { Transaction } from '../generated/node/legacy/transaction_pb'
import isNode from '../utils'
import { SignedTransaction } from '../generated/web/legacy/signed_transaction_pb'
import { LegacyNetworkClient } from './legacy-network-client'
import XpringClientErrorMessages from '../xpring-client-error-messages'

/**
 * A GRPC Based network client.
 */
class LegacyGRPCNetworkClientWeb implements LegacyNetworkClient {
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

  public async getAccountInfo(address: string): Promise<AccountInfo> {
    return new Promise((resolve, reject): void => {
      const getAccountInfoRequest = new GetAccountInfoRequest()
      getAccountInfoRequest.setAddress(address)
      this.grpcClient.getAccountInfo(
        getAccountInfoRequest,
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

  public async getFee(): Promise<Fee> {
    return new Promise((resolve, reject): void => {
      const getFeeRequest = new GetFeeRequest()
      this.grpcClient.getFee(getFeeRequest, {}, (error, response): void => {
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

  public async getLatestValidatedLedgerSequence(): Promise<LedgerSequence> {
    return new Promise((resolve, reject): void => {
      const getLatestValidatedLedgerSequenceRequest = new GetLatestValidatedLedgerSequenceRequest()
      this.grpcClient.getLatestValidatedLedgerSequence(
        getLatestValidatedLedgerSequenceRequest,
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

  public async getTransactionStatus(
    transactionHash: string,
  ): Promise<TransactionStatus> {
    return new Promise((resolve, reject): void => {
      const getTransactionStatusRequest = new GetTransactionStatusRequest()
      getTransactionStatusRequest.setTransactionHash(transactionHash)
      this.grpcClient.getTransactionStatus(
        getTransactionStatusRequest,
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

export default LegacyGRPCNetworkClientWeb
