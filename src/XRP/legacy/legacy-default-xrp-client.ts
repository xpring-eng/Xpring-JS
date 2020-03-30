/* eslint-disable class-methods-use-this */
import { Signer, Utils, Wallet } from 'xpring-common-js'

import bigInt, { BigInteger } from 'big-integer'
import { AccountInfo } from '../Generated/web/legacy/account_info_pb'
import { XRPAmount } from '../Generated/web/legacy/xrp_amount_pb'

import RawTransactionStatus from '../raw-transaction-status'
import LegacyGRPCNetworkClient from './legacy-grpc-xrp-network-client'
import LegacyGRPCNetworkClientWeb from './legacy-grpc-xrp-network-client.web'
import { LegacyXRPNetworkClient } from './legacy-xrp-network-client'
import { XRPClientDecorator } from '../xrp-client-decorator'
import TransactionStatus from '../transaction-status'
import XRPTransaction from '../model/xrp-transaction'
import isNode from '../../Common/utils'

/**
 * Error messages from XRPClient.
 */
export class LegacyXRPClientErrorMessages {
  public static readonly malformedResponse = 'Malformed Response.'

  public static readonly signingFailure = 'Unable to sign the transaction'

  public static readonly xAddressRequired =
    'Please use the X-Address format. See: https://xrpaddress.info/.'

  public static readonly unimplemented = 'Unimplemented.'
}

/** A margin to pad the current ledger sequence with when submitting transactions. */
const ledgerSequenceMargin = 10

/**
 * DefaultXRPClient is a client which interacts with the Xpring platform.
 */
class LegacyDefaultXRPClient implements XRPClientDecorator {
  /**
   * Create a new DefaultXRPClient.
   *
   * The DefaultXRPClient will use gRPC to communicate with the given endpoint.
   *
   * @param grpcURL The URL of the gRPC instance to connect to.
   * @param forceWeb If `true`, then we will use the gRPC-Web client even when on Node. Defaults to false. This is mainly for testing and in the future will be removed when we have browser testing.
   */
  public static defaultXRPClientWithEndpoint(
    grpcURL: string,
    forceWeb = false,
  ): LegacyDefaultXRPClient {
    return isNode() && !forceWeb
      ? new LegacyDefaultXRPClient(new LegacyGRPCNetworkClient(grpcURL))
      : new LegacyDefaultXRPClient(new LegacyGRPCNetworkClientWeb(grpcURL))
  }

  /**
   * Create a new DefaultXRPClient with a custom network client implementation.
   *
   * In general, clients should prefer to call `XRPClientWithEndpoint`. This constructor is provided to improve testability of this class.
   *
   * @param networkClient A network client which will manage remote RPCs to Rippled.
   */
  public constructor(private readonly networkClient: LegacyXRPNetworkClient) {}

  /**
   * Retrieve the balance for the given address.
   *
   * @param address The X-Address to retrieve a balance for.
   * @returns A `BigInteger` representing the number of drops of XRP in the account.
   */
  public async getBalance(address: string): Promise<BigInteger> {
    if (!Utils.isValidXAddress(address)) {
      return Promise.reject(
        new Error(LegacyXRPClientErrorMessages.xAddressRequired),
      )
    }

    return this.getAccountInfo(address).then(async (accountInfo) => {
      const balance = accountInfo.getBalance()
      if (balance === undefined) {
        return Promise.reject(
          new Error(LegacyXRPClientErrorMessages.malformedResponse),
        )
      }

      return bigInt(balance.getDrops())
    })
  }

  /**
   * Retrieve the transaction status for a given transaction hash.
   *
   * @param transactionHash The hash of the transaction.
   * @returns The status of the given transaction.
   */
  public async getPaymentStatus(
    transactionHash: string,
  ): Promise<TransactionStatus> {
    const transactionStatus = await this.getRawTransactionStatus(
      transactionHash,
    )

    // Return pending if the transaction is not validated.
    if (!transactionStatus.isValidated) {
      return TransactionStatus.Pending
    }

    return transactionStatus.transactionStatusCode.startsWith('tes')
      ? TransactionStatus.Succeeded
      : TransactionStatus.Failed
  }

  /**
   * Send the given amount of XRP from the source wallet to the destination address.
   *
   * @param drops A `BigInteger`, number or numeric string representing the number of drops to send.
   * @param destination A destination address to send the drops to.
   * @param sender The wallet that XRP will be sent from and which will sign the request.
   * @returns A promise which resolves to a string representing the hash of the submitted transaction.
   */
  public async send(
    amount: BigInteger | number | string,
    destination: string,
    sender: Wallet,
  ): Promise<string> {
    if (!Utils.isValidXAddress(destination)) {
      return Promise.reject(
        new Error(LegacyXRPClientErrorMessages.xAddressRequired),
      )
    }

    const normalizedAmount = bigInt(amount.toString())

    return this.getFee().then(async (fee) => {
      return this.getAccountInfo(sender.getAddress()).then(
        async (accountInfo) => {
          return this.getLastValidatedLedgerSequence().then(
            async (ledgerSequence) => {
              if (accountInfo.getSequence() === undefined) {
                return Promise.reject(
                  new Error(LegacyXRPClientErrorMessages.malformedResponse),
                )
              }

              const xrpAmount = this.networkClient.XRPAmount()
              xrpAmount.setDrops(normalizedAmount.toString())

              const payment = this.networkClient.Payment()
              payment.setXrpAmount(xrpAmount)
              payment.setDestination(destination)

              const transaction = this.networkClient.Transaction()
              transaction.setAccount(sender.getAddress())
              transaction.setFee(fee)
              transaction.setSequence(accountInfo.getSequence())
              transaction.setPayment(payment)
              transaction.setLastLedgerSequence(
                ledgerSequence + ledgerSequenceMargin,
              )
              transaction.setSigningPublicKeyHex(sender.getPublicKey())

              let signedTransaction
              try {
                signedTransaction = Signer.signLegacyTransaction(
                  transaction,
                  sender,
                )
              } catch (signingError) {
                const signingErrorMessage = `${LegacyXRPClientErrorMessages.signingFailure}. ${signingError.message}`
                return Promise.reject(new Error(signingErrorMessage))
              }
              if (signedTransaction === undefined) {
                return Promise.reject(
                  new Error(LegacyXRPClientErrorMessages.signingFailure),
                )
              }

              const submitSignedTransactionRequest = this.networkClient.SubmitSignedTransactionRequest()
              submitSignedTransactionRequest.setSignedTransaction(
                signedTransaction,
              )

              return this.networkClient
                .submitSignedTransaction(submitSignedTransactionRequest)
                .then(async (response) => {
                  const transactionBlob = response.getTransactionBlob()
                  const transactionHash = Utils.transactionBlobToTransactionHash(
                    transactionBlob,
                  )
                  if (!transactionHash) {
                    return Promise.reject(
                      new Error(LegacyXRPClientErrorMessages.malformedResponse),
                    )
                  }
                  return Promise.resolve(transactionHash)
                })
            },
          )
        },
      )
    })
  }

  public async getLastValidatedLedgerSequence(): Promise<number> {
    const getLatestValidatedLedgerSequenceRequest = this.networkClient.GetLatestValidatedLedgerSequenceRequest()
    const ledgerSequence = await this.networkClient.getLatestValidatedLedgerSequence(
      getLatestValidatedLedgerSequenceRequest,
    )
    return ledgerSequence.getIndex()
  }

  public async getRawTransactionStatus(
    transactionHash: string,
  ): Promise<RawTransactionStatus> {
    const transactionStatusRequest = this.networkClient.GetTransactionStatusRequest()
    transactionStatusRequest.setTransactionHash(transactionHash)

    const transactionStatus = await this.networkClient.getTransactionStatus(
      transactionStatusRequest,
    )

    return RawTransactionStatus.fromTransactionStatus(transactionStatus)
  }

  private async getAccountInfo(address: string): Promise<AccountInfo> {
    const getAccountInfoRequest = this.networkClient.GetAccountInfoRequest()
    getAccountInfoRequest.setAddress(address)
    return this.networkClient.getAccountInfo(getAccountInfoRequest)
  }

  private async getFee(): Promise<XRPAmount> {
    const getFeeRequest = this.networkClient.GetFeeRequest()

    return this.networkClient.getFee(getFeeRequest).then(async (fee) => {
      const feeAmount = fee.getAmount()
      if (feeAmount === undefined) {
        return Promise.reject(
          new Error(LegacyXRPClientErrorMessages.malformedResponse),
        )
      }
      return feeAmount
    })
  }

  public async accountExists(address: string): Promise<boolean> {
    const classicAddress = Utils.decodeXAddress(address)
    if (!classicAddress) {
      throw new Error(LegacyXRPClientErrorMessages.xAddressRequired)
    }
    try {
      await this.getBalance(address)
      return true
    } catch (e) {
      return false
    }
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  public paymentHistory(_address: string): Promise<Array<XRPTransaction>> {
    throw new Error(LegacyXRPClientErrorMessages.unimplemented)
  }
}

export default LegacyDefaultXRPClient
