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
  MemoData,
  MemoFormat,
  MemoType,
} from './Generated/node/org/xrpl/rpc/v1/common_pb'
import {
  Memo,
  Payment,
  Transaction,
} from './Generated/web/org/xrpl/rpc/v1/transaction_pb'
import { AccountAddress } from './Generated/web/org/xrpl/rpc/v1/account_pb'
import { GetFeeResponse } from './Generated/web/org/xrpl/rpc/v1/get_fee_pb'
import XrpClientDecorator from './xrp-client-decorator'
import TransactionStatus from './transaction-status'
import RawTransactionStatus from './raw-transaction-status'
import XrpTransaction from './model/xrp-transaction'
import GrpcNetworkClient from './grpc-xrp-network-client'
import GrpcNetworkClientWeb from './grpc-xrp-network-client.web'
import { XrpNetworkClient } from './xrp-network-client'
import isNode from '../Common/utils'
import XrpError from './xrp-error'
import { LedgerSpecifier } from './Generated/web/org/xrpl/rpc/v1/ledger_pb'
import XrplNetwork from '../Common/xrpl-network'
import SendXrpDetails from './model/send-xrp-details'

/** A margin to pad the current ledger sequence with when submitting transactions. */
const maxLedgerVersionOffset = 10

/**
 * DefaultXrpClient is a client which interacts with the Xpring platform.
 */
export default class DefaultXrpClient implements XrpClientDecorator {
  /**
   * Create a new DefaultXrpClient.
   *
   * The DefaultXrpClient will use gRPC to communicate with the given endpoint.
   *
   * @param grpcUrl The URL of the gRPC instance to connect to.
   * @param network The network this XrpClient is connecting to.
   * @param forceWeb If `true`, then we will use the gRPC-Web client even when on Node. Defaults to false. This is mainly for testing and in the future will be removed when we have browser testing.
   */
  public static defaultXrpClientWithEndpoint(
    grpcURL: string,
    network: XrplNetwork,
    forceWeb = false,
  ): DefaultXrpClient {
    return isNode() && !forceWeb
      ? new DefaultXrpClient(new GrpcNetworkClient(grpcURL), network)
      : new DefaultXrpClient(new GrpcNetworkClientWeb(grpcURL), network)
  }

  /**
   * Create a new DefaultXrpClient with a custom network client implementation.
   *
   * In general, clients should prefer to call `xrpClientWithEndpoint`. This constructor is provided to improve testability of this class.
   *
   * @param networkClient A network client which will manage remote RPCs to Rippled.
   * @param network The network this XrpClient is connecting to.
   */
  public constructor(
    private readonly networkClient: XrpNetworkClient,
    readonly network: XrplNetwork,
  ) {}

  /**
   * Retrieve the balance for the given address.
   *
   * @param address The X-Address to retrieve a balance for.
   * @returns A `BigInteger` representing the number of drops of XRP in the account.
   */
  public async getBalance(address: string): Promise<BigInteger> {
    const classicAddress = Utils.decodeXAddress(address)
    if (!classicAddress) {
      throw XrpError.xAddressRequired
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
      throw XrpError.malformedResponse
    }

    const balance = accountData
      .getBalance()
      ?.getValue()
      ?.getXrpAmount()
      ?.getDrops()
    if (!balance) {
      throw XrpError.malformedResponse
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

    return transactionStatus.transactionStatusCode?.startsWith('tes')
      ? TransactionStatus.Succeeded
      : TransactionStatus.Failed
  }

  /**
   * Send the given amount of XRP from the source wallet to the destination address.
   *
   * @param amount A `BigInteger`, number or numeric string representing the number of drops to send.
   * @param destinationAddress A destination address to send the drops to.
   * @param sender The wallet that XRP will be sent from and which will sign the request.
   * @returns A promise which resolves to a string representing the hash of the submitted transaction.
   */
  public async send(
    amount: BigInteger | number | string,
    destinationAddress: string,
    sender: Wallet,
  ): Promise<string> {
    return this.sendWithDetails({
      amount,
      destination: destinationAddress,
      sender,
    })
  }

  /**
   * Send the given amount of XRP from the source wallet to the destination Pay ID, allowing
   * for additional details to be specified for use with supplementary features of the XRP
   * ledger.
   *
   * @param sendMoneyDetails - a wrapper object containing details for constructing a transaction.
   * @returns A promise which resolves to a string representing the hash of the submitted transaction.
   */
  public async sendWithDetails(
    sendMoneyDetails: SendXrpDetails,
  ): Promise<string> {
    const {
      amount: drops,
      sender,
      destination: destinationAddress,
      memoList,
    } = sendMoneyDetails
    if (!Utils.isValidXAddress(destinationAddress)) {
      throw XrpError.xAddressRequired
    }

    const classicAddress = Utils.decodeXAddress(sender.getAddress())
    if (!classicAddress) {
      throw XrpError.xAddressRequired
    }

    const normalizedDrops = drops.toString()

    const fee = await this.getMinimumFee()
    const accountData = await this.getAccountData(classicAddress.address)
    const openLedgerSequence = await this.getOpenLedgerSequence()

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
    lastLedgerSequence.setValue(openLedgerSequence + maxLedgerVersionOffset)

    const signingPublicKeyBytes = Utils.toBytes(sender.publicKey)
    const signingPublicKey = new SigningPublicKey()
    signingPublicKey.setValue(signingPublicKeyBytes)

    const transaction = new Transaction()
    transaction.setAccount(account)
    transaction.setFee(fee)
    transaction.setSequence(accountData.getSequence())
    transaction.setPayment(payment)
    transaction.setLastLedgerSequence(lastLedgerSequence)

    transaction.setSigningPublicKey(signingPublicKey)

    if (memoList && memoList.length) {
      memoList
        .map((memo) => {
          const xrpMemo = new Memo()
          if (memo.data) {
            const memoData = new MemoData()
            memoData.setValue(memo.data)
            xrpMemo.setMemoData(memoData)
          }
          if (memo.format) {
            const memoFormat = new MemoFormat()
            memoFormat.setValue(memo.format)
            xrpMemo.setMemoFormat(memoFormat)
          }
          if (memo.type) {
            const memoType = new MemoType()
            memoType.setValue(memo.type)
            xrpMemo.setMemoType(memoType)
          }

          return xrpMemo
        })
        .forEach((memo) => transaction.addMemos(memo))
    }

    const signedTransaction = Signer.signTransaction(transaction, sender)
    if (!signedTransaction) {
      throw XrpError.malformedResponse
    }

    const submitTransactionRequest = this.networkClient.SubmitTransactionRequest()
    submitTransactionRequest.setSignedTransaction(signedTransaction)

    const response = await this.networkClient.submitTransaction(
      submitTransactionRequest,
    )

    return Utils.toHex(response.getHash_asU8())
  }

  public async getOpenLedgerSequence(): Promise<number> {
    const getFeeResponse = await this.getFee()
    return getFeeResponse.getLedgerCurrentIndex()
  }

  /**
   * Retrieve the latest validated ledger sequence on the XRP Ledger.
   *
   * Note: This call will throw if the given account does not exist on the ledger at the current time. It is the
   * *caller's responsibility* to ensure this invariant is met.
   *
   * Note: The input address *must* be in a classic address form. Inputs are not checked to this internal method.
   *
   * TODO(keefertaylor): The above requirements are onerous, difficult to reason about and the logic of this method is
   * brittle. Replace this method's implementation when rippled supports a `ledger` RPC via gRPC.
   *
   * @param address An address that exists at the current time. The address is unchecked and must be a classic address.
   * @returns The index of the latest validated ledger.
   * @throws XrpException If there was a problem communicating with the XRP Ledger.
   */
  public async getLatestValidatedLedgerSequence(
    address: string,
  ): Promise<number> {
    // rippled doesn't support a gRPC call that tells us the latest validated ledger sequence. To get around this,
    // query the account info for an account which will exist, using a shortcut for the latest validated ledger. The
    // response will contain the ledger index the information was retrieved at.
    const accountAddress = new AccountAddress()
    accountAddress.setAddress(address)

    const ledgerSpecifier = new LedgerSpecifier()
    ledgerSpecifier.setShortcut(LedgerSpecifier.Shortcut.SHORTCUT_VALIDATED)

    const getAccountInfoRequest = this.networkClient.GetAccountInfoRequest()
    getAccountInfoRequest.setAccount(accountAddress)
    getAccountInfoRequest.setLedger(ledgerSpecifier)

    const getAccountInfoResponse = await this.networkClient.getAccountInfo(
      getAccountInfoRequest,
    )

    return getAccountInfoResponse.getLedgerIndex()
  }

  public async getRawTransactionStatus(
    transactionHash: string,
  ): Promise<RawTransactionStatus> {
    const getTxRequest = this.networkClient.GetTransactionRequest()
    getTxRequest.setHash(Utils.toBytes(transactionHash))

    const getTxResponse = await this.networkClient.getTransaction(getTxRequest)

    return RawTransactionStatus.fromGetTransactionResponse(getTxResponse)
  }

  private async getMinimumFee(): Promise<XRPDropsAmount> {
    const getFeeResponse = await this.getFee()

    const fee = getFeeResponse.getFee()?.getMinimumFee()
    if (!fee) {
      throw XrpError.malformedResponse
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
      throw XrpError.malformedResponse
    }

    const accountData = accountInfo.getAccountData()
    if (!accountData) {
      throw XrpError.malformedResponse
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
      throw XrpError.xAddressRequired
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
   * @param address: The address (account) for which to retrieve payment history.
   * @throws: An error if there was a problem communicating with the XRP Ledger.
   * @return: An array of transactions associated with the account.
   */
  public async paymentHistory(address: string): Promise<Array<XrpTransaction>> {
    const classicAddress = Utils.decodeXAddress(address)
    if (!classicAddress) {
      throw XrpError.xAddressRequired
    }

    const account = this.networkClient.AccountAddress()
    account.setAddress(classicAddress.address)

    const request = this.networkClient.GetAccountTransactionHistoryRequest()
    request.setAccount(account)

    const transactionHistory = await this.networkClient.getTransactionHistory(
      request,
    )

    const getTransactionResponses = transactionHistory.getTransactionsList()

    // Filter transactions to payments only and convert them to XrpTransactions.
    // If a payment transaction fails conversion, throw an error.
    const payments: Array<XrpTransaction> = []
    // eslint-disable-next-line no-restricted-syntax
    for (const getTransactionResponse of getTransactionResponses) {
      const transaction = getTransactionResponse.getTransaction()
      switch (transaction?.getTransactionDataCase()) {
        case Transaction.TransactionDataCase.PAYMENT: {
          const xrpTransaction = XrpTransaction.from(
            getTransactionResponse,
            this.network,
          )
          if (!xrpTransaction) {
            throw XrpError.paymentConversionFailure
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

  /**
   * Retrieve the payment transaction corresponding to the given transaction hash.
   *
   * Note: This method can return transactions that are not included in a fully validated ledger.
   *       See the `validated` field to make this distinction.
   *
   * @param transactionHash The hash of the transaction to retrieve.
   * @throws An error if the transaction hash was invalid.
   * @returns An {@link XrpTransaction} object representing an XRP Ledger transaction.
   */
  public async getPayment(
    transactionHash: string,
  ): Promise<XrpTransaction | undefined> {
    const getTransactionRequest = this.networkClient.GetTransactionRequest()
    getTransactionRequest.setHash(Utils.toBytes(transactionHash))

    const getTransactionResponse = await this.networkClient.getTransaction(
      getTransactionRequest,
    )
    return XrpTransaction.from(getTransactionResponse, this.network)
  }
}
