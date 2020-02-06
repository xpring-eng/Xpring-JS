import { Signer, Utils, Wallet } from 'xpring-common-js'

import bigInt, { BigInteger } from 'big-integer'
import { AccountInfo } from '../generated/web/legacy/account_info_pb'
import { XRPAmount } from '../generated/web/legacy/xrp_amount_pb'

import RawTransactionStatus from '../raw-transaction-status'
import LegacyGRPCNetworkClient from './legacy-grpc-network-client'
import LegacyGRPCNetworkClientWeb from './legacy-grpc-network-client.web'
import { LegacyNetworkClient } from './legacy-network-client'
import { XpringClientDecorator } from '../xpring-client-decorator'
import TransactionStatus from '../transaction-status'
import isNode from '../utils'

/**
 * Error messages from XpringClient.
 */
export class LegacyXpringClientErrorMessages {
  public static readonly malformedResponse = 'Malformed Response.'

  public static readonly signingFailure = 'Unable to sign the transaction'

  public static readonly xAddressRequired =
    'Please use the X-Address format. See: https://xrpaddress.info/.'
}

/** A margin to pad the current ledger sequence with when submitting transactions. */
const ledgerSequenceMargin = 10

/**
 * DefaultXpringClient is a client which interacts with the Xpring platform.
 */
class LegacyDefaultXpringClient implements XpringClientDecorator {
  /**
   * Create a new DefaultXpringClient.
   *
   * The DefaultXpringClient will use gRPC to communicate with the given endpoint.
   *
   * @param grpcURL The URL of the gRPC instance to connect to.
   * @param forceWeb If `true`, then we will use the gRPC-Web client even when on Node. Defaults to false. This is mainly for testing and in the future will be removed when we have browser testing.
   */
  public static defaultXpringClientWithEndpoint(
    grpcURL: string,
    forceWeb = false,
  ): LegacyDefaultXpringClient {
    return isNode() && !forceWeb
      ? new LegacyDefaultXpringClient(new LegacyGRPCNetworkClient(grpcURL))
      : new LegacyDefaultXpringClient(new LegacyGRPCNetworkClientWeb(grpcURL))
  }

  /**
   * Create a new DefaultXpringClient with a custom network client implementation.
   *
   * In general, clients should prefer to call `xpringClientWithEndpoint`. This constructor is provided to improve testability of this class.
   *
   * @param networkClient A network client which will manage remote RPCs to Rippled.
   */
  public constructor(private readonly networkClient: LegacyNetworkClient) {}

  /**
   * Retrieve the balance for the given address.
   *
   * @param address The X-Address to retrieve a balance for.
   * @returns A `BigInteger` representing the number of drops of XRP in the account.
   */
  public async getBalance(address: string): Promise<BigInteger> {
    if (!Utils.isValidXAddress(address)) {
      return Promise.reject(
        new Error(LegacyXpringClientErrorMessages.xAddressRequired),
      )
    }

    return this.getAccountInfo(address).then(async (accountInfo) => {
      const balance = accountInfo.getBalance()
      if (balance === undefined) {
        return Promise.reject(
          new Error(LegacyXpringClientErrorMessages.malformedResponse),
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
  public async getTransactionStatus(
    transactionHash: string,
  ): Promise<TransactionStatus> {
    const transactionStatus = await this.getRawTransactionStatus(
      transactionHash,
    )

    // Return pending if the transaction is not validated.
    if (!transactionStatus.getValidated()) {
      return TransactionStatus.Pending
    }

    return transactionStatus.getTransactionStatusCode().startsWith('tes')
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
        new Error(LegacyXpringClientErrorMessages.xAddressRequired),
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
                  new Error(LegacyXpringClientErrorMessages.malformedResponse),
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
                const signingErrorMessage = `${LegacyXpringClientErrorMessages.signingFailure}. ${signingError.message}`
                return Promise.reject(new Error(signingErrorMessage))
              }
              if (signedTransaction === undefined) {
                return Promise.reject(
                  new Error(LegacyXpringClientErrorMessages.signingFailure),
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
                      new Error(
                        LegacyXpringClientErrorMessages.malformedResponse,
                      ),
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

    return this.networkClient.getTransactionStatus(transactionStatusRequest)
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
          new Error(LegacyXpringClientErrorMessages.malformedResponse),
        )
      }
      return feeAmount
    })
  }

  public async accountExists(address: string): Promise<boolean> {
    // TODO: replace with refactored checkNotXAddress() when complete
    const classicAddress = Utils.decodeXAddress(address)
    if (!classicAddress) {
      throw new Error(LegacyXpringClientErrorMessages.xAddressRequired)
    }
    try {
      await this.getBalance(address)
      return true
    } catch (e) {
      return false
    }
  }
}

export default LegacyDefaultXpringClient
