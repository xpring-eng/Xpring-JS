import { Utils, Wallet } from 'xpring-common-js'
import bigInt, { BigInteger } from 'big-integer'
import { XpringClientDecorator } from './xpring-client-decorator'
import TransactionStatus from './transaction-status'
import RawTransactionStatus from './raw-transaction-status'
import GRPCNetworkClient from './grpc-network-client'
import GRPCNetworkClientWeb from './grpc-network-client.web'
import { NetworkClient } from './network-client'
<<<<<<< HEAD
import {
  Payment,
  Transaction,
} from './generated/web/org/xrpl/rpc/v1/transaction_pb'
import {
  // GetTransactionRequest,
  GetTransactionResponse,
} from './generated/web/org/xrpl/rpc/v1/get_transaction_pb'
import { GetFeeResponse } from './generated/web/org/xrpl/rpc/v1/get_fee_pb'
=======
import { GetFeeResponse } from './generated/web/rpc/v1/fee_pb'
>>>>>>> origin/master
import {
  AccountAddress,
  CurrencyAmount,
  XRPDropsAmount,
} from './generated/web/org/xrpl/rpc/v1/amount_pb'
import isNode from './utils'

import { AccountRoot } from './generated/web/org/xrpl/rpc/v1/ledger_objects_pb'
import {
  Destination,
  Amount,
  Account,
  LastLedgerSequence,
  SigningPublicKey,
} from './generated/node/org/xrpl/rpc/v1/common_pb'

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
<<<<<<< HEAD
 * A private wrapper class which conforms `GetTxResponse` to the `RawTransaction` interface.
 */
class GetTransactionResponseWrapper implements RawTransactionStatus {
  public constructor(
    private readonly getTransactionResponse: GetTransactionResponse,
  ) {}

  public getValidated(): boolean {
    return this.getTransactionResponse.getValidated()
  }

  public getTransactionStatusCode(): string {
    const meta = this.getTransactionResponse.getMeta()
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
    const value = this.getTransactionResponse
      .getTransaction()
      ?.getLastLedgerSequence()
      ?.getValue()
    if (!value) {
      throw new Error(XpringClientErrorMessages.malformedResponse)
    }
    return value
  }
}

/**
=======
>>>>>>> origin/master
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

    const balance = accountData
      .getBalance()
      ?.getValue()
      ?.getXrpAmount()
      ?.getDrops()
    if (!balance) {
      throw new Error(XpringClientErrorMessages.malformedResponse)
    }

    return bigInt(balance)
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
      throw new Error(XpringClientErrorMessages.xAddressRequired)
    }

    const classicAddress = Utils.decodeXAddress(sender.getAddress())
    if (!classicAddress) {
      throw new Error(XpringClientErrorMessages.xAddressRequired)
    }

    const normalizedAmount = amount.toString()

    const fee = await this.getMinimumFee()
    const accountData = await this.getAccountData(classicAddress.address)
    const lastValidatedLedgerSequence = await this.getLastValidatedLedgerSequence()

    const xrpDropsAmount = new XRPDropsAmount()
    xrpDropsAmount.setDrops(normalizedAmount)

    const currencyAmount = new CurrencyAmount()
    currencyAmount.setXrpAmount(xrpDropsAmount)

    const amount2 = new Amount()
    amount2.setValue(currencyAmount)

    const destinationAccount = new AccountAddress()
    destinationAccount.setAddress(destination)

    const destination2 = new Destination()
    destination2.setValue(destinationAccount)

    const account = new AccountAddress()
    account.setAddress(sender.getAddress())

    const account2 = new Account()
    account2.setValue(account)

    const payment = new Payment()
    payment.setDestination(destination2)
    payment.setAmount(amount2)

    const lastLedgerSequence = new LastLedgerSequence()
    lastLedgerSequence.setValue(
      lastValidatedLedgerSequence + maxLedgerVersionOffset,
    )

    const signingPublicKeyBytes = Utils.toBytes(sender.getPublicKey())
    const signingPublicKey = new SigningPublicKey()
    signingPublicKey.setValue(signingPublicKeyBytes)

    const transaction = new Transaction()
    transaction.setAccount(account2)
    transaction.setFee(fee)
    transaction.setSequence(accountData.getSequence())
    transaction.setPayment(payment)
    transaction.setLastLedgerSequence(lastLedgerSequence)

    transaction.setSigningPublicKey(signingPublicKey)

    const signedTransaction = new Uint8Array([1, 2, 3, 4])
    // Signer.signTransaction(transaction, sender)
    // if (!signedTransaction) {
    //   throw new Error(XpringClientErrorMessages.malformedResponse)
    // }

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
    const getTxRequest = this.networkClient.GetTransactionRequest()
    getTxRequest.setHash(Utils.toBytes(transactionHash))

    const getTxResponse = await this.networkClient.getTransaction(getTxRequest)

<<<<<<< HEAD
    return new GetTransactionResponseWrapper(getTxResponse)
=======
    return RawTransactionStatus.fromGetTxResponse(getTxResponse)
>>>>>>> origin/master
  }

  private async getMinimumFee(): Promise<XRPDropsAmount> {
    const getFeeResponse = await this.getFee()

    const fee = getFeeResponse.getFee()?.getMinimumFee()
    if (!fee) {
      throw new Error(XpringClientErrorMessages.malformedResponse)
    }

    return fee
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
      return false
    }
  }
}

export default DefaultXpringClient
