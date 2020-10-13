import { Utils, Wallet, XrplNetwork } from 'xpring-common-js'
import XrpUtils from './shared/xrp-utils'
import bigInt, { BigInteger } from 'big-integer'
import { StatusCode as grpcStatusCode } from 'grpc-web'
import {
  CurrencyAmount,
  XRPDropsAmount,
} from './Generated/web/org/xrpl/rpc/v1/amount_pb'
import {
  Destination,
  Amount,
  MemoData,
  MemoFormat,
  MemoType,
  Authorize,
  Unauthorize,
} from './Generated/web/org/xrpl/rpc/v1/common_pb'
import {
  Memo,
  Payment,
  Transaction,
  DepositPreauth,
} from './Generated/web/org/xrpl/rpc/v1/transaction_pb'
import { AccountAddress } from './Generated/web/org/xrpl/rpc/v1/account_pb'
import XrpClientDecorator from './xrp-client-decorator'
import TransactionStatus from './shared/transaction-status'
import XrpTransaction from './protobuf-wrappers/xrp-transaction'
import GrpcNetworkClient from './network-clients/grpc-xrp-network-client'
import GrpcNetworkClientWeb from './network-clients/grpc-xrp-network-client.web'
import { GrpcNetworkClientInterface } from './network-clients/grpc-network-client-interface'
import isNode from '../Common/utils'
import XrpError from './shared/xrp-error'
import { LedgerSpecifier } from './Generated/web/org/xrpl/rpc/v1/ledger_pb'
import SendXrpDetails from './shared/send-xrp-details'
import { AccountSetFlag } from './shared/account-set-flag'
import TransactionResult from './shared/transaction-result'
import CoreXrplClient from './core-xrpl-client'

/**
 * DefaultXrpClient is a client for handling XRP payments on the XRPL.
 */
export default class DefaultXrpClient implements XrpClientDecorator {
  private coreXrplClient: CoreXrplClient

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
    grpcUrl: string,
    network: XrplNetwork,
    forceWeb = false,
  ): DefaultXrpClient {
    return isNode() && !forceWeb
      ? new DefaultXrpClient(new GrpcNetworkClient(grpcUrl), network)
      : new DefaultXrpClient(new GrpcNetworkClientWeb(grpcUrl), network)
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
    private readonly networkClient: GrpcNetworkClientInterface,
    readonly network: XrplNetwork,
  ) {
    this.coreXrplClient = new CoreXrplClient(networkClient, network)
  }

  /**
   * Retrieve the balance for the given address.
   *
   * @param address The X-Address to retrieve a balance for.
   * @returns A `BigInteger` representing the number of drops of XRP in the account.
   */
  public async getBalance(address: string): Promise<BigInteger> {
    const classicAddress = XrpUtils.decodeXAddress(address)
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
    return await this.coreXrplClient.getTransactionStatus(transactionHash)
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
   * Send the given amount of XRP from the source wallet to the destination address, allowing
   * for additional details to be specified for use with supplementary features of the XRP ledger.
   *
   * @param sendXrpDetails - a wrapper object containing details for constructing a transaction.
   * @returns A promise which resolves to a string representing the hash of the submitted transaction.
   */
  public async sendWithDetails(
    sendXrpDetails: SendXrpDetails,
  ): Promise<string> {
    const {
      amount: drops,
      sender,
      destination: destinationAddress,
      memoList,
    } = sendXrpDetails
    if (!XrpUtils.isValidXAddress(destinationAddress)) {
      throw XrpError.xAddressRequired
    }

    const normalizedDrops = drops.toString()
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

    const payment = new Payment()
    payment.setDestination(destination)
    payment.setAmount(amount)

    const transaction = await this.coreXrplClient.prepareBaseTransaction(sender)
    transaction.setPayment(payment)

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

    return this.coreXrplClient.signAndSubmitTransaction(transaction, sender)
  }

  /**
   * Check if an address exists on the XRP Ledger.
   *
   * @param address The address to check the existence of.
   * @returns A boolean if the account is on the ledger.
   */
  public async accountExists(address: string): Promise<boolean> {
    const classicAddress = XrpUtils.decodeXAddress(address)
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
    const classicAddress = XrpUtils.decodeXAddress(address)
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
          payments.push(xrpTransaction)
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
  public async getPayment(transactionHash: string): Promise<XrpTransaction> {
    const getTransactionRequest = this.networkClient.GetTransactionRequest()
    getTransactionRequest.setHash(Utils.toBytes(transactionHash))

    const getTransactionResponse = await this.networkClient.getTransaction(
      getTransactionRequest,
    )
    return XrpTransaction.from(getTransactionResponse, this.network)
  }

  /**
   * Enable Deposit Authorization for this XRPL account.
   *
   * @see https://xrpl.org/depositauth.html
   *
   * @param wallet The wallet associated with the XRPL account enabling Deposit Authorization and that will sign the request.
   * @returns A promise which resolves to a TransactionResult object that represents the result of this transaction.
   */
  public async enableDepositAuth(wallet: Wallet): Promise<TransactionResult> {
    return this.coreXrplClient.changeFlag(
      AccountSetFlag.asfDepositAuth,
      true,
      wallet,
    )
  }

  /**
   * Enables DepositPreauth and authorizes an XRPL account to send to this XRPL account.
   *
   * @see https://xrpl.org/depositpreauth.html
   *
   * @param xAddressToAuthorize The X-Address of the sender to enable DepositPreauth for.
   * @param wallet The wallet associated with the XRPL account enabling a deposit preauthorization and that will sign the request.
   */
  public async authorizeSendingAccount(
    xAddressToAuthorize: string,
    wallet: Wallet,
  ): Promise<TransactionResult> {
    const classicAddress = XrpUtils.decodeXAddress(xAddressToAuthorize)
    if (!classicAddress) {
      throw XrpError.xAddressRequired
    }

    const accountAddressToAuthorize = new AccountAddress()
    accountAddressToAuthorize.setAddress(xAddressToAuthorize)

    const authorize = new Authorize()
    authorize.setValue(accountAddressToAuthorize)

    const depositPreauth = new DepositPreauth()
    depositPreauth.setAuthorize(authorize)

    const transaction = await this.coreXrplClient.prepareBaseTransaction(wallet)
    transaction.setDepositPreauth(depositPreauth)

    const transactionHash = await this.coreXrplClient.signAndSubmitTransaction(
      transaction,
      wallet,
    )
    return await this.coreXrplClient.getTransactionResult(transactionHash)
  }

  /**
   * Disables DepositPreauth and unauthorizes an XRPL account to send to this XRPL account.
   *
   * @see https://xrpl.org/depositpreauth.html
   *
   * @param xAddressToUnauthorize The X-Address of the sender to unauthorize.
   * @param wallet The wallet associated with the XRPL account revoking a deposit preauthorization, and that will sign the request.
   */
  public async unauthorizeSendingAccount(
    xAddressToUnauthorize: string,
    wallet: Wallet,
  ): Promise<TransactionResult> {
    const classicAddress = XrpUtils.decodeXAddress(xAddressToUnauthorize)
    if (!classicAddress) {
      throw XrpError.xAddressRequired
    }

    const accountAddressToUnauthorize = new AccountAddress()
    accountAddressToUnauthorize.setAddress(xAddressToUnauthorize)

    const unauthorize = new Unauthorize()
    unauthorize.setValue(accountAddressToUnauthorize)

    const depositPreauth = new DepositPreauth()
    depositPreauth.setUnauthorize(unauthorize)

    const transaction = await this.coreXrplClient.prepareBaseTransaction(wallet)
    transaction.setDepositPreauth(depositPreauth)

    const transactionHash = await this.coreXrplClient.signAndSubmitTransaction(
      transaction,
      wallet,
    )
    return await this.coreXrplClient.getTransactionResult(transactionHash)
  }
}
