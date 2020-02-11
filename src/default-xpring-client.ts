import { Signer, Utils, Wallet } from 'xpring-common-js'
import bigInt, { BigInteger } from 'big-integer'
import grpc from 'grpc'
import { XpringClientDecorator } from './xpring-client-decorator'
import TransactionStatus from './transaction-status'
import RawTransactionStatus from './raw-transaction-status'
import GRPCNetworkClient from './grpc-network-client'
import GRPCNetworkClientWeb from './grpc-network-client.web'
import { NetworkClient } from './network-client'
import { GetTxResponse } from './generated/web/rpc/v1/tx_pb'
import { GetFeeResponse } from './generated/web/rpc/v1/fee_pb'
import {
  AccountAddress,
  CurrencyAmount,
  XRPDropsAmount,
} from './generated/web/rpc/v1/amount_pb'
import isNode from './utils'
import { Payment, Transaction } from './generated/web/rpc/v1/transaction_pb'
import { AccountRoot } from './generated/web/rpc/v1/ledger_objects_pb'

/** A margin to pad the current ledger sequence with when submitting transactions. */
const maxLedgerVersionOffset = 10

/**
 * Error messages from XpringClient.
 */
export class XpringClientErrorMessages {
  public static readonly malformedResponse = 'Malformed Response.'

  public static readonly signingFailure = 'Unable to sign the transaction'

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
    amount: BigInteger | number | string,
    destination: string,
    sender: Wallet,
  ): Promise<string> {
    if (!Utils.isValidXAddress(destination)) {
      throw new Error(XpringClientErrorMessages.xAddressRequired)
    }

    const classicAddress = Utils.decodeXAddress(sender.getAddress())
    if (!classicAddress) {
      throw new Error(XpringClientErrorMessages.xAddressRequired)
    }

    const normalizedAmount = bigInt(amount.toString())

    const fee = await this.getMinimumFee()
    const accountData = await this.getAccountData(classicAddress.address)
    const lastValidatedLedgerSequence = await this.getLastValidatedLedgerSequence()

    const xrpDropsAmount = new XRPDropsAmount()
    xrpDropsAmount.setDrops(normalizedAmount.toJSNumber())

    const currencyAmount = new CurrencyAmount()
    currencyAmount.setXrpAmount(xrpDropsAmount)

    const destinationAccount = new AccountAddress()
    destinationAccount.setAddress(destination)

    const payment = new Payment()
    payment.setDestination(destinationAccount)
    payment.setAmount(currencyAmount)

    const account = new AccountAddress()
    account.setAddress(sender.getAddress())

    const transaction = new Transaction()
    transaction.setAccount(account)
    transaction.setFee(fee)
    transaction.setSequence(accountData.getSequence())
    transaction.setPayment(payment)
    transaction.setLastLedgerSequence(
      lastValidatedLedgerSequence + maxLedgerVersionOffset,
    )

    const signingPublicKeyBytes = Utils.toBytes(sender.getPublicKey())
    transaction.setSigningPublicKey(signingPublicKeyBytes)

    const signedTransaction = Signer.signTransaction(transaction, sender)
    if (!signedTransaction) {
      throw new Error(XpringClientErrorMessages.malformedResponse)
    }

    const submitTransactionRequest = this.networkClient.SubmitTransactionRequest()
    submitTransactionRequest.setSignedTransaction(signedTransaction)

    const response = await this.networkClient.submitTransaction(
      submitTransactionRequest,
    )

    return Utils.toHex(response.getHash_asU8())
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

  private async getFee(): Promise<GetFeeResponse> {
    const getFeeRequest = this.networkClient.GetFeeRequest()
    return this.networkClient.getFee(getFeeRequest)
  }

  private async getAccountData(address: string): Promise<AccountRoot> {
    const account = this.networkClient.AccountAddress()
    account.setAddress(address)

    const request = this.networkClient.GetAccountInfoRequest()
    request.setAccount(account)

    const accountInfo = await this.networkClient.getAccountInfo(request)
    if (!accountInfo) {
      throw new Error(XpringClientErrorMessages.malformedResponse)
    }

    const accountData = accountInfo.getAccountData()
    if (!accountData) {
      throw new Error(XpringClientErrorMessages.malformedResponse)
    }

    return accountData
  }

  /**
   * Check if an address exists on the XRP Ledger.
   *
   * @param address The address to check the existence of.
   * @returns A boolean if the account is on the ledger.
   */
  public async accountExists(address: string): Promise<boolean> {
    const classicAddress = Utils.decodeXAddress(address)
    if (!classicAddress) {
      throw new Error(XpringClientErrorMessages.xAddressRequired)
    }
    try {
      await this.getBalance(address)
      return true
    } catch (e) {
      if (
        Object.prototype.hasOwnProperty.call(e, 'code') &&
        e.code === grpc.status.NOT_FOUND
      ) {
        return false
      }
      throw e // error code other than NOT_FOUND should re-throw error
    }
  }
}

export default DefaultXpringClient
