import { Utils, Wallet } from 'xpring-common-js'
import bigInt, { BigInteger } from 'big-integer'
import { XpringClientDecorator } from '../utils/xpring-client-decorator'
import TransactionStatus from '../utils/transaction-status'
import RawTransaction from '../utils/raw-transaction'
import GRPCNetworkClientNode from '../grpc/node'
import GRPCNetworkClientWeb from '../grpc/web'
import { XRPDropsAmount } from '../grpc/generated/web/rpc/v1/amount_pb' // TODO would be nice to have 0 references to generated files here
import isNode from '../utils'
import { NetworkClientDecorator } from '../utils/network-client-decorator'
import XpringClientErrorMessages from '../utils/xpring-client-error-messages'

// TODO(keefertaylor): Re-enable this rule when this class is fully implemented.
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */

/**
 * DefaultXpringClient is a client which interacts with the Xpring platform.
 */
class DefaultXpringClient implements XpringClientDecorator {
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
  ): DefaultXpringClient {
    return isNode() && !forceWeb
      ? new DefaultXpringClient(new GRPCNetworkClientNode(grpcURL))
      : new DefaultXpringClient(new GRPCNetworkClientWeb(grpcURL))
  }

  /**
   * Create a new DefaultXpringClient with a custom network client implementation.
   *
   * In general, clients should prefer to call `xpringClientWithEndpoint`. This constructor is provided to improve testability of this class.
   *
   * @param networkClient A network client which will manage remote RPCs to Rippled.
   */
  public constructor(private readonly networkClient: NetworkClientDecorator) {}

  /**
   * Retrieve the balance for the given address.
   *
   * @param address The X-Address to retrieve a balance for.
   * @returns A `BigInteger` representing the number of drops of XRP in the account.
   */
  public async getBalance(address: string): Promise<BigInteger> {
    const classicAddress = Utils.decodeXAddress(address)
    if (!classicAddress) {
      return Promise.reject(
        new Error(XpringClientErrorMessages.xAddressRequired),
      )
    }

    const accountInfo = await this.networkClient.getAccountInfo(
      classicAddress.address,
    )
    const accountData = accountInfo.getAccountData()
    if (!accountData) {
      throw new Error(XpringClientErrorMessages.malformedResponse)
    }

    const balance = accountData.getBalance()
    if (!balance) {
      throw new Error(XpringClientErrorMessages.malformedResponse)
    }
    return bigInt(balance.getDrops())
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
    _amount: BigInteger | number | string,
    _destination: string,
    _sender: Wallet,
  ): Promise<string> {
    throw new Error(XpringClientErrorMessages.unimplemented)
  }

  public async getLastValidatedLedgerSequence(): Promise<number> {
    const getFeeResponse = await this.networkClient.getFee()
    return getFeeResponse.getLedgerCurrentIndex()
  }

  public async getRawTransactionStatus(
    transactionHash: string,
  ): Promise<RawTransaction> {
    const getTxResponse = await this.networkClient.getTx(transactionHash)
    return new RawTransaction(getTxResponse)
  }

  // TODO Keefer implement method and remove tslint ignore and fix tsconfig nounusedlocals
  // tslint:disable-next-line
  private async getMinimumFee(): Promise<XRPDropsAmount> {
    const getFeeResponse = await this.networkClient.getFee()

    const fee = getFeeResponse.getDrops()
    if (!fee) {
      throw new Error(XpringClientErrorMessages.malformedResponse)
    }

    const minimumFee = fee.getMinimumFee()
    if (!minimumFee) {
      throw new Error(XpringClientErrorMessages.malformedResponse)
    }

    return minimumFee
  }
}

export default DefaultXpringClient
