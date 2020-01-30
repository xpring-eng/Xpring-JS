import { Utils, Wallet } from 'xpring-common-js'

import bigInt, { BigInteger } from 'big-integer'

import { RawTransactionStatus } from '../utils/raw-transaction'
import LegacyGRPCNetworkClientNode from './grpc/node'
import LegacyGRPCNetworkClientWeb from './grpc/web'
import { XpringClientDecorator } from '../utils/xpring-client-decorator'
import TransactionStatus from '../utils/transaction-status'
import isNode from '../utils'
import { LegacyNetworkClient } from './grpc/network-client'
import XpringClientErrorMessages from '../utils/xpring-client-error-messages'

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
      ? new LegacyDefaultXpringClient(new LegacyGRPCNetworkClientNode(grpcURL))
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
        new Error(XpringClientErrorMessages.xAddressRequired),
      )
    }

    return this.networkClient
      .getAccountInfo(address)
      .then(async (accountInfo) => {
        const balance = accountInfo.getBalance()
        if (balance === undefined) {
          return Promise.reject(
            new Error(XpringClientErrorMessages.malformedResponse),
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
      throw new Error(XpringClientErrorMessages.xAddressRequired)
    }
    const signedTransaction = await this.networkClient.createSignedTransaction(
      amount.toString(),
      destination,
      sender,
      ledgerSequenceMargin,
    )
    const response = await this.networkClient.submitSignedTransaction(
      signedTransaction,
    )

    const transactionBlob = response.getTransactionBlob()
    const transactionHash = Utils.transactionBlobToTransactionHash(
      transactionBlob,
    )
    if (!transactionHash) {
      throw new Error(XpringClientErrorMessages.malformedResponse)
    }
    return transactionHash
  }

  public async getLastValidatedLedgerSequence(): Promise<number> {
    const ledgerSequence = await this.networkClient.getLatestValidatedLedgerSequence()
    return ledgerSequence.getIndex()
  }

  public async getRawTransactionStatus(
    transactionHash: string,
  ): Promise<RawTransactionStatus> {
    return this.networkClient.getTransactionStatus(transactionHash)
  }
}

export default LegacyDefaultXpringClient
