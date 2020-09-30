import { Signer, Utils, Wallet, XrplNetwork } from 'xpring-common-js'
import XrpUtils from './xrp-utils'
import GrpcNetworkClient from './grpc-xrp-network-client'
import GrpcNetworkClientWeb from './grpc-xrp-network-client.web'
import { XRPDropsAmount } from './Generated/web/org/xrpl/rpc/v1/amount_pb'
import { AccountRoot } from './Generated/web/org/xrpl/rpc/v1/ledger_objects_pb'
import {
  Account,
  LastLedgerSequence,
  SigningPublicKey,
} from './Generated/web/org/xrpl/rpc/v1/common_pb'
import { Transaction } from './Generated/web/org/xrpl/rpc/v1/transaction_pb'
import { AccountAddress } from './Generated/web/org/xrpl/rpc/v1/account_pb'
import { GetFeeResponse } from './Generated/web/org/xrpl/rpc/v1/get_fee_pb'
import TransactionStatus from './transaction-status'
import RawTransactionStatus from './raw-transaction-status'
import { XrpNetworkClient } from './xrp-network-client'
import XrpError, { XrpErrorType } from './xrp-error'
import { LedgerSpecifier } from './Generated/web/org/xrpl/rpc/v1/ledger_pb'
import FinalTransactionResult from './model/final-transaction-result'
import isNode from '../Common/utils'

async function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

/** A margin to pad the current ledger sequence with when submitting transactions. */
const maxLedgerVersionOffset = 10

/**
 * CommonXrplClient is a client which supports the core, common functionality for interacting with the XRP Ledger.
 */
export default class CommonXrplClient {
  /**
   * Creates a new CommonXrplClient.
   *
   * The CommonXrplClient will use gRPC to communicate with the given endpoint.
   *
   * @param grpcUrl The URL of the gRPC instance to connect to.
   * @param network The network this XrpClient is connecting to.
   * @param forceWeb If `true`, then we will use the gRPC-Web client even when on Node. Defaults to false. This is mainly for testing and in the future will be removed when we have browser testing.
   */
  public static commonXrplClientWithEndpoint(
    grpcUrl: string,
    network: XrplNetwork,
    forceWeb = false,
  ): CommonXrplClient {
    return isNode() && !forceWeb
      ? new CommonXrplClient(new GrpcNetworkClient(grpcUrl), network)
      : new CommonXrplClient(new GrpcNetworkClientWeb(grpcUrl), network)
  }

  /**
   * Creates a new CommonXrplClient with a custom network client implementation.
   *
   * @param networkClient A network client which will manage remote RPCs to Rippled.
   * @param network The network this XrpClient is connecting to.
   */
  public constructor(
    public networkClient: XrpNetworkClient,
    readonly network: XrplNetwork,
  ) {
    this.networkClient = networkClient
  }

  /**
   * Retrieves the sequence number of the current open ledger in this rippled node.
   * @see https://xrpl.org/ledgers.html#open-closed-and-validated-ledgers
   */
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
   * TODO: The above requirements are onerous, difficult to reason about and the logic of this method is
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

  /**
   * Retrieves the raw transaction status for the given transaction hash.
   *
   * @param transactionHash: The hash of the transaction.
   * @returns The status of the given transaction.
   */
  public async getRawTransactionStatus(
    transactionHash: string,
  ): Promise<RawTransactionStatus> {
    const getTxRequest = this.networkClient.GetTransactionRequest()
    getTxRequest.setHash(Utils.toBytes(transactionHash))

    const getTxResponse = await this.networkClient.getTransaction(getTxRequest)

    return RawTransactionStatus.fromGetTransactionResponse(getTxResponse)
  }

  /**
   * Retrieves the minimum transaction cost for a reference transaction to be queued for a later ledger,
   * represented in drops of XRP.
   * @see  https://xrpl.org/rippleapi-reference.html#transaction-fees
   * @see https://xrpl.org/fee.html#response-format
   */
  public async getMinimumFee(): Promise<XRPDropsAmount> {
    const getFeeResponse = await this.getFee()

    const fee = getFeeResponse.getFee()?.getMinimumFee()
    if (!fee) {
      throw XrpError.malformedResponse
    }

    return fee
  }

  /**
   * Reports the current state of the open-ledger requirements for the transaction cost.
   * @see https://xrpl.org/rippleapi-reference.html#transaction-fees
   * @see https://xrpl.org/fee.html#response-format
   */
  public async getFee(): Promise<GetFeeResponse> {
    const getFeeRequest = this.networkClient.GetFeeRequest()
    return this.networkClient.getFee(getFeeRequest)
  }

  /**
   * Returns the AccountRoot object containing information about this XRPL account.
   * @see https://xrpl.org/account_info.html#account_info
   *
   * @param address The XRPL account for which to retrieve information.
   */
  public async getAccountData(address: string): Promise<AccountRoot> {
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
  public async prepareBaseTransaction(wallet: Wallet): Promise<Transaction> {
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
  public async signAndSubmitTransaction(
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
  public async getTransactionResult(
    transactionHash: string,
  ): Promise<FinalTransactionResult> {
    const rawStatus = await this.getRawTransactionStatus(transactionHash)
    const isValidated = rawStatus.isValidated
    const transactionStatus = await this.getTransactionStatus(transactionHash)

    return new FinalTransactionResult(
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

    return transactionStatus.transactionStatusCode?.startsWith('tes')
      ? TransactionStatus.Succeeded
      : TransactionStatus.Failed
  }

  /**
   * Waits for a transaction to complete and returns a TransactionResult.
   *
   * @param transactionHash The transaction to wait for.
   * @param wallet The wallet sending the transaction.
   *
   * @returns A Promise resolving to a TransactionResult containing the results of the transaction associated with
   * the given transaction hash.
   */
  public async awaitFinalTransactionResult(
    transactionHash: string,
    wallet: Wallet,
  ): Promise<FinalTransactionResult> {
    const {
      rawTransactionStatus,
      lastLedgerPassed,
    } = await this.awaitFinalTransactionStatus(transactionHash, wallet)
    const finalStatus = this.determineFinalResult(
      rawTransactionStatus,
      lastLedgerPassed,
    )
    return new FinalTransactionResult(
      transactionHash,
      finalStatus,
      rawTransactionStatus.isValidated,
    )
  }

  /**
   * Determines the current TransactionStatus from a RawTransactionStatus (translating from
   * a rippled transaction status code such as `tesSUCCESS`, in conjunction with validated
   * status, into a TransactionStatus enum instance)
   *
   * @param rawTransactionStatus
   */
  private determineFinalResult(
    rawTransactionStatus: RawTransactionStatus,
    lastLedgerPassed: boolean,
  ): TransactionStatus {
    // I don't know if this is actually possible... just making the compiler happy in safest way
    if (!rawTransactionStatus.transactionStatusCode) {
      throw XrpError.malformedResponse
    }
    if (rawTransactionStatus.transactionStatusCode.startsWith('tem')) {
      return TransactionStatus.MalformedTransaction
    }
    if (lastLedgerPassed) {
      return TransactionStatus.LastLedgerPassed
    }
    // Return pending if the transaction is not validated.
    if (!rawTransactionStatus.isValidated) {
      return TransactionStatus.Pending // should never happen, can tighten up the logic
    } else {
      const transactionStatus = rawTransactionStatus.transactionStatusCode?.startsWith(
        'tes',
      )
        ? TransactionStatus.Succeeded
        : TransactionStatus.Failed
      return transactionStatus
    }
  }

  /**
   * The core logic of reliable submission.  Polls the ledger until the result of the transaction
   * can be considered final, meaning it has either been included in a validated ledger, or the
   * transaction's lastLedgerSequence has been surpassed by the latest ledger sequence (meaning it
   * will never be included in a validated ledger.)
   *
   * @param transactionHash The hash of the transaction being awaited.
   * @param sender The address used to obtain the latest ledger sequence.
   */
  public async awaitFinalTransactionStatus(
    transactionHash: string,
    sender: Wallet,
  ): Promise<{
    rawTransactionStatus: RawTransactionStatus
    lastLedgerPassed: boolean
  }> {
    const ledgerCloseTimeMs = 4 * 1000
    await sleep(ledgerCloseTimeMs)

    // Get transaction status.
    let rawTransactionStatus = await this.getRawTransactionStatus(
      transactionHash,
    )
    const { lastLedgerSequence } = rawTransactionStatus
    if (!lastLedgerSequence) {
      return Promise.reject(
        new Error(
          'The transaction did not have a lastLedgerSequence field so transaction status cannot be reliably determined.',
        ),
      )
    }

    // Decode the sending address to a classic address for use in determining the last ledger sequence.
    // An invariant of `getLatestValidatedLedgerSequence` is that the given input address (1) exists when the method
    // is called and (2) is in a classic address form.
    //
    // The sending address should always exist, except in the case where it is deleted. A deletion would supersede the
    // transaction in flight, either by:
    // 1) Consuming the nonce sequence number of the transaction, which would effectively cancel the transaction
    // 2) Occur after the transaction has settled which is an unlikely enough case that we ignore it.
    //
    // This logic is brittle and should be replaced when we have an RPC that can give us this data.
    const classicAddress = XrpUtils.decodeXAddress(sender.getAddress())
    if (!classicAddress) {
      throw new XrpError(
        XrpErrorType.Unknown,
        'The source wallet reported an address which could not be decoded to a classic address',
      )
    }
    const sourceClassicAddress = classicAddress.address

    // Retrieve the latest ledger index.
    let latestLedgerSequence = await this.getLatestValidatedLedgerSequence(
      sourceClassicAddress,
    )

    // Poll until the transaction is validated, or until the lastLedgerSequence has been passed.
    /*
     * In general, performing an await as part of each operation is an indication that the program is not taking full advantage of the parallelization benefits of async/await.
     * Usually, the code should be refactored to create all the promises at once, then get access to the results using Promise.all(). Otherwise, each successive operation will not start until the previous one has completed.
     * But here specifically, it is reasonable to await in a loop, because we need to wait for the ledger, and there is no good way to refactor this.
     * https://eslint.org/docs/rules/no-await-in-loop
     */
    /* eslint-disable no-await-in-loop */
    while (
      latestLedgerSequence <= lastLedgerSequence &&
      !rawTransactionStatus.isValidated
    ) {
      await sleep(ledgerCloseTimeMs)

      // Update latestLedgerSequence and rawTransactionStatus
      latestLedgerSequence = await this.getLatestValidatedLedgerSequence(
        sourceClassicAddress,
      )
      rawTransactionStatus = await this.getRawTransactionStatus(transactionHash)
    }
    /* eslint-enable no-await-in-loop */
    const lastLedgerPassed = latestLedgerSequence > lastLedgerSequence
    return {
      rawTransactionStatus: rawTransactionStatus,
      lastLedgerPassed: lastLedgerPassed,
    }
  }
}
