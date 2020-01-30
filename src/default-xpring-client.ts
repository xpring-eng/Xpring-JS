import { Utils, Wallet } from 'xpring-common-js'
import bigInt, { BigInteger } from 'big-integer'
import { XpringClientDecorator } from './xpring-client-decorator'
import TransactionStatus from './transaction-status'
import RawTransactionStatus from './raw-transaction-status'
import GRPCNetworkClient from './grpc-network-client'
import GRPCNetworkClientWeb from './grpc-network-client.web'
import { NetworkClient } from './network-client'
import { GetTxResponse } from './generated/web/rpc/v1/tx_pb'
import { GetFeeResponse } from './generated/web/rpc/v1/fee_pb'
import { XRPDropsAmount } from './generated/web/rpc/v1/amount_pb'
import isNode from './utils'

// TODO(keefertaylor): Re-enable this rule when this class is fully implemented.
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */

/**
 * Error messages from XpringClient.
 */
export class XpringClientErrorMessages {
  public static readonly malformedResponse = 'Malformed Response.'

  public static readonly unimplemented = 'Unimplemented.'

  /* eslint-disable @typescript-eslint/indent */
  public static readonly xAddressRequired =
    'Please use the X-Address format. See: https://xrpaddress.info/.'
  /* eslint-enable @typescript-eslint/indent */
}

/**
 * A private wrapper class which conforms `GetTxResponse` to the `RawTransaction` interface.
 */
class GetTxResponseWrapper implements RawTransactionStatus {
  public constructor(private readonly getTxResponse: GetTxResponse) {}

  public getValidated(): boolean {
    return this.getTxResponse.getValidated()
  }

  public getTransactionStatusCode(): string {
    const meta = this.getTxResponse.getMeta()
    if (!meta) {
      throw new Error(XpringClientErrorMessages.malformedResponse)
    }

    const transactionResult = meta.getTransactionResult()
    if (!transactionResult) {
      throw new Error(XpringClientErrorMessages.malformedResponse)
    }

    return transactionResult.getResult()
  }

  public getLastLedgerSequence(): number {
    const transaction = this.getTxResponse.getTransaction()
    if (!transaction) {
      throw new Error(XpringClientErrorMessages.malformedResponse)
    }

    return transaction.getLastLedgerSequence()
  }
}

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
      ? new DefaultXpringClient(new GRPCNetworkClient(grpcURL))
      : new DefaultXpringClient(new GRPCNetworkClientWeb(grpcURL))
  }

  /**
   * Create a new DefaultXpringClient with a custom network client implementation.
   *
   * In general, clients should prefer to call `xpringClientWithEndpoint`. This constructor is provided to improve testability of this class.
   *
   * @param networkClient A network client which will manage remote RPCs to Rippled.
   */
  public constructor(private readonly networkClient: NetworkClient) {}

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

    const account = this.networkClient.AccountAddress()
    account.setAddress(classicAddress.address)

    const request = this.networkClient.GetAccountInfoRequest()
    request.setAccount(account)

    const accountInfo = await this.networkClient.getAccountInfo(request)
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
    const getFeeResponse = await this.getFee()
    return getFeeResponse.getLedgerCurrentIndex()
  }

  public async getRawTransactionStatus(
    transactionHash: string,
  ): Promise<RawTransactionStatus> {
    const getTxRequest = this.networkClient.GetTxRequest()
    getTxRequest.setHash(Utils.toBytes(transactionHash))

    const getTxResponse = await this.networkClient.getTx(getTxRequest)

    return new GetTxResponseWrapper(getTxResponse)
  }

  // TODO Keefer implement method and remove tslint ignore and fix tsconfig nounusedlocals
  // tslint:disable-next-line
  private async getMinimumFee(): Promise<XRPDropsAmount> {
    const getFeeResponse = await this.getFee()

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

  // TODO(keefertaylor): Add tests for this method once send is hooked up.
  private async getFee(): Promise<GetFeeResponse> {
    const getFeeRequest = this.networkClient.GetFeeRequest()
    return this.networkClient.getFee(getFeeRequest)
  }
}

export default DefaultXpringClient
