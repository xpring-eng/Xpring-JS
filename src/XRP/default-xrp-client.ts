/* eslint-disable no-restricted-syntax */
import { Signer, Utils, Wallet, XrplNetwork } from 'xpring-common-js'
import XrpUtils from './xrp-utils'
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
  SetFlag,
  Authorize,
} from './Generated/web/org/xrpl/rpc/v1/common_pb'
import {
  AccountSet,
  Memo,
  Payment,
  Transaction,
  DepositPreauth,
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
import SendXrpDetails from './model/send-xrp-details'
import { AccountSetFlag } from './model/account-set-flag'
import TransactionResult from './model/transaction-result'

/** A margin to pad the current ledger sequence with when submitting transactions. */
const maxLedgerVersionOffset = 10

/**
 * DefaultXrpClient is a client which interacts with the XRP Ledger.
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
    return await this.getTransactionStatus(transactionHash)
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

    const transaction = await this.prepareBaseTransaction(sender)
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

    return this.signAndSubmitTransaction(transaction, sender)
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

  /**
   * Enable Deposit Authorization for this XRPL account.
   *
   * @see https://xrpl.org/depositauth.html
   *
   * @param wallet The wallet associated with the XRPL account enabling Deposit Authorization and that will sign the request.
   * @returns A promise which resolves to a TransactionResult object that contains the hash of the submitted AccountSet transaction,
   *          the preliminary status, and whether the transaction has been included in a validated ledger yet.
   */
  public async enableDepositAuth(wallet: Wallet): Promise<TransactionResult> {
    const setFlag = new SetFlag()
    setFlag.setValue(AccountSetFlag.asfDepositAuth)

    const accountSet = new AccountSet()
    accountSet.setSetFlag(setFlag)

    const transaction = await this.prepareBaseTransaction(wallet)
    transaction.setAccountSet(accountSet)

    const transactionHash = await this.signAndSubmitTransaction(
      transaction,
      wallet,
    )

    return await this.getTransactionResult(transactionHash)
  }

  /**
   * TODO: Doc and stuff
   * @param wallet The wallet associated with the XRPL account enabling DepositPreauth and that will sign the request.
   */
  public async authorizeDepositPreauth(
    xAddressToAuthorize: string,
    wallet: Wallet,
  ): Promise<TransactionResult> {
    const classicAddress = XrpUtils.decodeXAddress(xAddressToAuthorize)
    if (!classicAddress) {
      throw XrpError.xAddressRequired
    }

    const senderAccountAddress = new AccountAddress()
    senderAccountAddress.setAddress(xAddressToAuthorize)

    const authorize = new Authorize()
    authorize.setValue(senderAccountAddress)

    const depositPreauth = new DepositPreauth()
    depositPreauth.setAuthorize(authorize)

    const transaction = await this.prepareBaseTransaction(wallet)
    transaction.setDepositPreauth(depositPreauth)

    const transactionHash = await this.signAndSubmitTransaction(
      transaction,
      wallet,
    )

    const rawStatus = await this.getRawTransactionStatus(transactionHash)
    const isValidated = rawStatus.isValidated
    const transactionStatus = await this.getPaymentStatus(transactionHash)

    return new TransactionResult(
      transactionHash,
      transactionStatus,
      isValidated,
    )
  }

  /**
   * Populates the required fields common to all transaction types.
   *
   * @see https://xrpl.org/transaction-common-fields.html
   *
   * Note: The returned Transaction object must still be assigned transaction-specific details.
   * Some transaction types require a different fee (or no fee), in which case the fee should be overwritten appropriately
   * when constructing the transaction-specific details. (See https://xrpl.org/transaction-cost.html)
   *
   * @param wallet The wallet that will sign and submit this transaction.
   * @returns A promise which resolves to a Transaction protobuf with the required common fields populated.
   */
  private async prepareBaseTransaction(wallet: Wallet): Promise<Transaction> {
    const classicAddress = XrpUtils.decodeXAddress(wallet.getAddress())
    if (!classicAddress) {
      throw XrpError.xAddressRequired
    }

    const fee = await this.getMinimumFee()
    const accountData = await this.getAccountData(classicAddress.address)
    const openLedgerSequence = await this.getOpenLedgerSequence()

    const senderAccountAddress = new AccountAddress()
    senderAccountAddress.setAddress(wallet.getAddress())

    const account = new Account()
    account.setValue(senderAccountAddress)

    const lastLedgerSequence = new LastLedgerSequence()
    lastLedgerSequence.setValue(openLedgerSequence + maxLedgerVersionOffset)

    const signingPublicKeyBytes = Utils.toBytes(wallet.publicKey)
    const signingPublicKey = new SigningPublicKey()
    signingPublicKey.setValue(signingPublicKeyBytes)

    const transaction = new Transaction()
    transaction.setAccount(account)
    transaction.setFee(fee)
    transaction.setSequence(accountData.getSequence())
    transaction.setLastLedgerSequence(lastLedgerSequence)
    transaction.setSigningPublicKey(signingPublicKey)

    return transaction
  }

  /**
   * Signs the provided transaction using the wallet and submits to the XRPL network.
   *
   * @param transaction The transaction to be signed and submitted.
   * @param wallet The wallet that will sign and submit this transaction.
   * @returns A promise which resolves to a string representing the hash of the submitted transaction.
   */
  private async signAndSubmitTransaction(
    transaction: Transaction,
    wallet: Wallet,
  ): Promise<string> {
    const signedTransaction = Signer.signTransaction(transaction, wallet)
    if (!signedTransaction) {
      throw XrpError.signingError
    }

    const submitTransactionRequest = this.networkClient.SubmitTransactionRequest()
    submitTransactionRequest.setSignedTransaction(signedTransaction)

    const response = await this.networkClient.submitTransaction(
      submitTransactionRequest,
    )

    return Utils.toHex(response.getHash_asU8())
  }

  /**
   * Returns a detailed TransactionResult for a given XRPL transaction hash.
   *
   * @param transactionHash The transaction hash to populate a TransactionResult for.
   * @returns A Promise which resolves to a TransactionResult associated with the given transaction hash.
   */
  private async getTransactionResult(
    transactionHash: string,
  ): Promise<TransactionResult> {
    const rawStatus = await this.getRawTransactionStatus(transactionHash)
    const isValidated = rawStatus.isValidated
    const transactionStatus = await this.getTransactionStatus(transactionHash)

    return new TransactionResult(
      transactionHash,
      transactionStatus,
      isValidated,
    )
  }

  /**
   * Retrieve the transaction status for a Transaction given a transaction hash.
   *
   * Note: This method will only work for Payment type transactions which do not have the tf_partial_payment attribute set.
   * @see https://xrpl.org/payment.html#payment-flags
   *
   * @param transactionHash The hash of the transaction.
   * @returns A TransactionStatus containing the status of the given transaction.
   */
  private async getTransactionStatus(
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
}
