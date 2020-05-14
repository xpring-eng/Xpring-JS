/* eslint-disable no-restricted-syntax */
import { Signer, Utils, Wallet } from 'xpring-common-js'
import bigInt, { BigInteger } from 'big-integer'
import { StatusCode as grpcStatusCode } from 'grpc-web'
import {
  CurrencyAmount,
  XRPDropsAmount,
} from './Generated/web/org/xrpl/rpc/v1/amount_pb'
import { AccountRoot } from './Generated/web/org/xrpl/rpc/v1/ledger_objects_pb'
import {
  Destination,
  Amount,
  Account,
  LastLedgerSequence,
  SigningPublicKey,
} from './Generated/node/org/xrpl/rpc/v1/common_pb'
import {
  Payment,
  Transaction,
} from './Generated/web/org/xrpl/rpc/v1/transaction_pb'
import { AccountAddress } from './Generated/web/org/xrpl/rpc/v1/account_pb'
import { GetFeeResponse } from './Generated/web/org/xrpl/rpc/v1/get_fee_pb'
import { XRPClientDecorator } from './xrp-client-decorator'
import TransactionStatus from './transaction-status'
import RawTransactionStatus from './raw-transaction-status'
import XRPTransaction from './model/xrp-transaction'
import GRPCNetworkClient from './grpc-xrp-network-client'
import GRPCNetworkClientWeb from './grpc-xrp-network-client.web'
import { XRPNetworkClient } from './xrp-network-client'
import isNode from '../Common/utils'
import XRPError from './xrp-error'
import { LedgerSpecifier } from './Generated/web/org/xrpl/rpc/v1/ledger_pb'

/** A margin to pad the current ledger sequence with when submitting transactions. */
const maxLedgerVersionOffset = 10

/**
 * DefaultXRPClient is a client which interacts with the Xpring platform.
 */
class DefaultXRPClient implements XRPClientDecorator {
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
  ): DefaultXRPClient {
    return isNode() && !forceWeb
      ? new DefaultXRPClient(new GRPCNetworkClient(grpcURL))
      : new DefaultXRPClient(new GRPCNetworkClientWeb(grpcURL))
  }

  /**
   * Create a new DefaultXRPClient with a custom network client implementation.
   *
   * In general, clients should prefer to call `xrpClientWithEndpoint`. This constructor is provided to improve testability of this class.
   *
   * @param networkClient A network client which will manage remote RPCs to Rippled.
   */
  public constructor(private readonly networkClient: XRPNetworkClient) {}

  /**
   * Retrieve the balance for the given address.
   *
   * @param address The X-Address to retrieve a balance for.
   * @returns A `BigInteger` representing the number of drops of XRP in the account.
   */
  public async getBalance(address: string): Promise<BigInteger> {
    const classicAddress = Utils.decodeXAddress(address)
    if (!classicAddress) {
      throw XRPError.xAddressRequired
    }

    const account = this.networkClient.AccountAddress()
    account.setAddress(classicAddress.address)

    const request = this.networkClient.GetAccountInfoRequest()
    request.setAccount(account)

    const ledger = new LedgerSpecifier()
    ledger.setShortcut(LedgerSpecifier.Shortcut.SHORTCUT_VALIDATED)
    request.setLedger(ledger)

    const accountInfo = await this.networkClient.getAccountInfo(request)
    const accountData = accountInfo.getAccountData()
    if (!accountData) {
      throw XRPError.malformedResponse
    }

    const balance = accountData
      .getBalance()
      ?.getValue()
      ?.getXrpAmount()
      ?.getDrops()
    if (!balance) {
      throw XRPError.malformedResponse
    }

    return bigInt(balance)
  }

  /**
   * Retrieve the transaction status for a Payment given transaction hash.
   *
   * Note: This method will only work for Payment type transactions which do not have the tf_partial_payment attribute set.
   * @see https://xrpl.org/payment.html#payment-flags
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
   * @param destinationAddress A destination address to send the drops to.
   * @param sender The wallet that XRP will be sent from and which will sign the request.
   * @returns A promise which resolves to a string representing the hash of the submitted transaction.
   */
  public async send(
    drops: BigInteger | number | string,
    destinationAddress: string,
    sender: Wallet,
  ): Promise<string> {
    if (!Utils.isValidXAddress(destinationAddress)) {
      throw XRPError.xAddressRequired
    }

    const classicAddress = Utils.decodeXAddress(sender.getAddress())
    if (!classicAddress) {
      throw XRPError.xAddressRequired
    }

    const normalizedDrops = drops.toString()

    const fee = await this.getMinimumFee()
    const accountData = await this.getAccountData(classicAddress.address)
    const lastValidatedLedgerSequence = await this.getLastValidatedLedgerSequence()

    const xrpDropsAmount = new XRPDropsAmount()
    xrpDropsAmount.setDrops(normalizedDrops)

    const currencyAmount = new CurrencyAmount()
    currencyAmount.setXrpAmount(xrpDropsAmount)

    const amount = new Amount()
    amount.setValue(currencyAmount)

    const destinationAccountAddress = new AccountAddress()
    destinationAccountAddress.setAddress(destinationAddress)

    const destination = new Destination()
    destination.setValue(destinationAccountAddress)

    const senderAccountAddress = new AccountAddress()
    senderAccountAddress.setAddress(sender.getAddress())

    const account = new Account()
    account.setValue(senderAccountAddress)

    const payment = new Payment()
    payment.setDestination(destination)
    payment.setAmount(amount)

    const lastLedgerSequence = new LastLedgerSequence()
    lastLedgerSequence.setValue(
      lastValidatedLedgerSequence + maxLedgerVersionOffset,
    )

    const signingPublicKeyBytes = Utils.toBytes(sender.getPublicKey())
    const signingPublicKey = new SigningPublicKey()
    signingPublicKey.setValue(signingPublicKeyBytes)

    const transaction = new Transaction()
    transaction.setAccount(account)
    transaction.setFee(fee)
    transaction.setSequence(accountData.getSequence())
    transaction.setPayment(payment)
    transaction.setLastLedgerSequence(lastLedgerSequence)

    transaction.setSigningPublicKey(signingPublicKey)

    const signedTransaction = Signer.signTransaction(transaction, sender)
    if (!signedTransaction) {
      throw XRPError.malformedResponse
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
    const getTxRequest = this.networkClient.GetTransactionRequest()
    getTxRequest.setHash(Utils.toBytes(transactionHash))

    const getTxResponse = await this.networkClient.getTransaction(getTxRequest)

    return RawTransactionStatus.fromGetTransactionResponse(getTxResponse)
  }

  /**
   * Check if the given ledger sequence number is validated.
   *
   * @param ledgerSequence The ledger sequence to check.
   * @return A boolean indicating if the given sequence is validated.
   */
  public async isLedgerSequenceValidated(
    ledgerSequence: number,
  ): Promise<boolean> {
    // Genesis account - will always exist.
    const genesisAdress = 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh'

    const account = this.networkClient.AccountAddress()
    account.setAddress(genesisAdress)

    const ledgerSpecifier = new LedgerSpecifier()
    ledgerSpecifier.setSequence(ledgerSequence)

    const request = this.networkClient.GetAccountInfoRequest()
    request.setAccount(account)
    request.setLedger(ledgerSpecifier)

    try {
      const accountInfo = await this.networkClient.getAccountInfo(request)
      return accountInfo.getValidated()
    } catch (error) {
      if (error.details === 'ledgerNotFound' && error.code === 5) {
        return false
      }
      throw error
    }
  }

  private async getMinimumFee(): Promise<XRPDropsAmount> {
    const getFeeResponse = await this.getFee()

    const fee = getFeeResponse.getFee()?.getMinimumFee()
    if (!fee) {
      throw XRPError.malformedResponse
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

    const ledger = new LedgerSpecifier()
    ledger.setShortcut(LedgerSpecifier.Shortcut.SHORTCUT_VALIDATED)
    request.setLedger(ledger)

    const accountInfo = await this.networkClient.getAccountInfo(request)
    if (!accountInfo) {
      throw XRPError.malformedResponse
    }

    const accountData = accountInfo.getAccountData()
    if (!accountData) {
      throw XRPError.malformedResponse
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
      throw XRPError.xAddressRequired
    }
    try {
      await this.getBalance(address)
      return true
    } catch (error) {
      if (error?.code === grpcStatusCode.NOT_FOUND) {
        return false
      }
      throw error // error code other than NOT_FOUND should re-throw error
    }
  }

  /**
   * Return the history of payments for the given account.
   *
   * Note: This method only works for payment type transactions, see: https://xrpl.org/payment.html
   * Note: This method only returns the history that is contained on the remote node, which may not contain a full history of the network.
   *
   * @param address: The address (account) for which to retrive payment history.
   * @throws: An error if there was a problem communicating with the XRP Ledger.
   * @return: An array of transactions associated with the account.
   */
  public async paymentHistory(address: string): Promise<Array<XRPTransaction>> {
    const classicAddress = Utils.decodeXAddress(address)
    if (!classicAddress) {
      throw XRPError.xAddressRequired
    }

    const account = this.networkClient.AccountAddress()
    account.setAddress(classicAddress.address)

    const request = this.networkClient.GetAccountTransactionHistoryRequest()
    request.setAccount(account)

    const transactionHistory = await this.networkClient.getTransactionHistory(
      request,
    )

    const getTransactionResponses = transactionHistory.getTransactionsList()

    // Filter transactions to payments only and convert them to XRPTransactions.
    // If a payment transaction fails conversion, throw an error.
    const payments: Array<XRPTransaction> = []
    // eslint-disable-next-line no-restricted-syntax
    for (const getTransactionResponse of getTransactionResponses) {
      const transaction = getTransactionResponse.getTransaction()
      switch (transaction?.getTransactionDataCase()) {
        case Transaction.TransactionDataCase.PAYMENT: {
          const xrpTransaction = XRPTransaction.from(getTransactionResponse)
          if (!xrpTransaction) {
            throw XRPError.paymentConversionFailure
          } else {
            payments.push(xrpTransaction)
          }
          break
        }
        default:
        // Intentionally do nothing, non-payment type transactions are ignored.
      }
    } // end for
    return payments
  }
}

export default DefaultXRPClient
