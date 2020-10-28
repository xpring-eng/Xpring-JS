import { XrplNetwork, XrpUtils, Wallet } from 'xpring-common-js'

import {
  LimitAmount,
  Amount,
  TransferRate,
  Destination,
} from './Generated/web/org/xrpl/rpc/v1/common_pb'
import { AccountAddress } from './Generated/web/org/xrpl/rpc/v1/account_pb'
import {
  Currency,
  CurrencyAmount,
  IssuedCurrencyAmount,
} from './Generated/web/org/xrpl/rpc/v1/amount_pb'
import {
  TrustSet,
  AccountSet,
  Payment,
} from './Generated/web/org/xrpl/rpc/v1/transaction_pb'

import isNode from '../Common/utils'
import CoreXrplClient from './core-xrpl-client'
import GrpcNetworkClient from './network-clients/grpc-xrp-network-client'
import GrpcNetworkClientWeb from './network-clients/grpc-xrp-network-client.web'
import { GrpcNetworkClientInterface } from './network-clients/grpc-network-client-interface'
import JsonRpcNetworkClient from './network-clients/json-rpc-network-client'
import { JsonNetworkClientInterface } from './network-clients/json-network-client-interface'
import { XrpError, XrpErrorType } from './shared'
import { AccountSetFlag } from './shared/account-set-flag'
import TransactionResult from './shared/transaction-result'
import { AccountLinesResponse } from './shared/rippled-json-rpc-schema'
import TrustLine from './shared/trustline'
import { SendMax } from 'xpring-common-js/build/src/XRP/generated/org/xrpl/rpc/v1/common_pb'

/**
 * IssuedCurrencyClient is a client for working with Issued Currencies on the XRPL.
 * @see https://xrpl.org/issued-currencies-overview.html
 */
export default class IssuedCurrencyClient {
  private coreXrplClient: CoreXrplClient

  /**
   * Create a new IssuedCurrencyClient.
   *
   * The IssuedCurrencyClient will use gRPC to communicate with the given endpoint.
   *
   * @param grpcUrl The URL of the gRPC instance to connect to.
   * @param network The network this IssuedCurrencyClient is connecting to.
   * @param forceWeb If `true`, then we will use the gRPC-Web client even when on Node. Defaults to false. This is mainly for testing and in the future will be removed when we have browser testing.
   */
  public static issuedCurrencyClientWithEndpoint(
    grpcUrl: string,
    jsonUrl: string,
    network: XrplNetwork,
    forceWeb = false,
  ): IssuedCurrencyClient {
    const grpcNetworkClient =
      isNode() && !forceWeb
        ? new GrpcNetworkClient(grpcUrl)
        : new GrpcNetworkClientWeb(grpcUrl)
    return new IssuedCurrencyClient(
      grpcNetworkClient,
      new JsonRpcNetworkClient(jsonUrl),
      network,
    )
  }

  /**
   * Create a new IssuedCurrencyClient with a custom network client implementation.
   *
   * In general, clients should prefer to call `issuedCurrencyClientWithEndpoint`. This constructor is provided to improve testability of this class.
   *
   * @param networkClient A network client which will manage remote RPCs to Rippled.
   * @param network The network this IssuedCurrencyClient is connecting to.
   */
  public constructor(
    grpcNetworkClient: GrpcNetworkClientInterface,
    private readonly jsonNetworkClient: JsonNetworkClientInterface,
    readonly network: XrplNetwork,
  ) {
    this.coreXrplClient = new CoreXrplClient(grpcNetworkClient, network)
  }

  /**
   * Retrieves information about an account's trust lines, which maintain balances of all non-XRP currencies and assets.
   * @see https://xrpl.org/trust-lines-and-issuing.html
   *
   * @param account The account for which to retrieve associated trust lines, encoded as an X-Address.
   * @param peerAccount (Optional) The address of a second account. If provided, show only trust lines connecting the two accounts.
   * @see https://xrpaddress.info/
   * @returns An array of TrustLine objects, representing all trust lines associated with this account.
   */
  public async getTrustLines(
    account: string,
    peerAccount?: string,
  ): Promise<Array<TrustLine>> {
    const classicAddress = XrpUtils.decodeXAddress(account)
    if (!classicAddress) {
      throw XrpError.xAddressRequired
    }
    if (peerAccount) {
      const peerClassicAddress = XrpUtils.decodeXAddress(peerAccount)
      if (!peerClassicAddress) {
        throw XrpError.xAddressRequired
      }
    }

    const accountLinesResponse: AccountLinesResponse = await this.jsonNetworkClient.getAccountLines(
      classicAddress.address,
      peerAccount,
    )

    if (accountLinesResponse.result.error) {
      if (accountLinesResponse.result.error === 'actNotFound') {
        throw XrpError.accountNotFound
      } else {
        throw new XrpError(
          XrpErrorType.Unknown,
          accountLinesResponse.result.error,
        )
      }
    }

    const rawTrustLines = accountLinesResponse.result.lines
    if (rawTrustLines === undefined) {
      throw XrpError.malformedResponse
    }
    const trustLines: Array<TrustLine> = []
    rawTrustLines.map((trustLineJson) => {
      trustLines.push(new TrustLine(trustLineJson))
    })
    return trustLines
  }

  /**
   * Enable Require Authorization for this XRPL account.
   *
   * @see https://xrpl.org/become-an-xrp-ledger-gateway.html#require-auth
   *
   * @param wallet The wallet associated with the XRPL account enabling Require Authorization and that will sign the request.
   * @returns A promise which resolves to a TransactionResult object that represents the result of this transaction.
   */
  public async requireAuthorizedTrustlines(
    wallet: Wallet,
  ): Promise<TransactionResult> {
    return this.coreXrplClient.changeFlag(
      AccountSetFlag.asfRequireAuth,
      true,
      wallet,
    )
  }

  /**
   * Disable Require Authorization for this XRPL account.
   *
   * @see https://xrpl.org/become-an-xrp-ledger-gateway.html#require-auth
   *
   * @param wallet The wallet associated with the XRPL account disabling Require Authorization and that will sign the request.
   * @returns A promise which resolves to a TransactionResult object that represents the result of this transaction.
   */
  public async allowUnauthorizedTrustlines(
    wallet: Wallet,
  ): Promise<TransactionResult> {
    return this.coreXrplClient.changeFlag(
      AccountSetFlag.asfRequireAuth,
      false,
      wallet,
    )
  }

  /**
   * Enable Default Ripple for this XRPL account.
   *
   * @see https://xrpl.org/become-an-xrp-ledger-gateway.html#default-ripple
   *
   * @param wallet The wallet associated with the XRPL account enabling Default Ripple and that will sign the request.
   * @returns A promise which resolves to a TransactionResult object that represents the result of this transaction.
   */
  public async enableRippling(wallet: Wallet): Promise<TransactionResult> {
    return this.coreXrplClient.changeFlag(
      AccountSetFlag.asfDefaultRipple,
      true,
      wallet,
    )
  }

  /**
   * Enable Disallow XRP for this XRPL account.
   * Note that the meaning of this flag is not enforced by rippled, and is only intended for use by client applications.
   *
   * @see https://xrpl.org/become-an-xrp-ledger-gateway.html#disallow-xrp
   *
   * @param wallet The wallet associated with the XRPL account enabling Disallow XRP and that will sign the request.
   * @returns A promise which resolves to a TransactionResult object that represents the result of this transaction.
   */
  public async disallowIncomingXrp(wallet: Wallet): Promise<TransactionResult> {
    return this.coreXrplClient.changeFlag(
      AccountSetFlag.asfDisallowXRP,
      true,
      wallet,
    )
  }

  /**
   * Disable Disallow XRP for this XRPL account.
   * Note that the meaning of this flag is not enforced by rippled, and is only intended for use by client applications.
   *
   * @see https://xrpl.org/become-an-xrp-ledger-gateway.html#disallow-xrp
   *
   * @param wallet The wallet associated with the XRPL account disabling Disallow XRP and that will sign the request.
   * @returns A promise which resolves to a TransactionResult object that represents the result of this transaction.
   */
  public async allowIncomingXrp(wallet: Wallet): Promise<TransactionResult> {
    return this.coreXrplClient.changeFlag(
      AccountSetFlag.asfDisallowXRP,
      false,
      wallet,
    )
  }

  /**
   * Enable Require Destination Tags for this XRPL account.
   *
   * @see https://xrpl.org/require-destination-tags.html
   *
   * @param wallet The wallet associated with the XRPL account enabling Require Destination Tags and that will sign the request.
   * @returns A promise which resolves to a TransactionResult object that represents the result of this transaction.
   */
  public async requireDestinationTags(
    wallet: Wallet,
  ): Promise<TransactionResult> {
    return this.coreXrplClient.changeFlag(
      AccountSetFlag.asfRequireDest,
      true,
      wallet,
    )
  }

  /**
   * Disable Require Destination for this XRPL account.
   *
   * @see https://xrpl.org/require-destination-tags.html
   *
   * @param wallet The wallet associated with the XRPL account disabling Require Destination and that will sign the request.
   * @returns A promise which resolves to a TransactionResult object that represents the result of this transaction.
   */
  public async allowNoDestinationTag(
    wallet: Wallet,
  ): Promise<TransactionResult> {
    return this.coreXrplClient.changeFlag(
      AccountSetFlag.asfRequireDest,
      false,
      wallet,
    )
  }

  /**
   * Set the Transfer Fees for an issuing account.
   * The Transfer Fee is a percentage to charge when two users transfer an issuer's IOUs on the XRPL.
   *
   * @see https://xrpl.org/transfer-fees.html
   *
   * @param transferFee The amount you must send for the recipient to get 1 billion units of the same currency.
   *                    It cannot be set to less than 1000000000 or more than 2000000000.
   * @param wallet The wallet associated with the issuing account, and that will sign the request.
   * @returns A promise which resolves to a TransactionResult object that represents the result of this transaction.
   */
  public async setTransferFee(
    transferFee: number,
    wallet: Wallet,
  ): Promise<TransactionResult> {
    const transferRate = new TransferRate()
    transferRate.setValue(transferFee)

    const accountSet = new AccountSet()
    accountSet.setTransferRate(transferRate)

    const transaction = await this.coreXrplClient.prepareBaseTransaction(wallet)
    transaction.setAccountSet(accountSet)

    const transactionHash = await this.coreXrplClient.signAndSubmitTransaction(
      transaction,
      wallet,
    )

    return await this.coreXrplClient.getFinalTransactionResultAsync(
      transactionHash,
      wallet,
    )
  }

  /**
   * Enable Global Freeze for this XRPL account.
   *
   * @see https://xrpl.org/freezes.html#global-freeze
   *
   * @param wallet The wallet associated with the XRPL account enabling Global Freeze and that will sign the request.
   * @returns A promise which resolves to a TransactionResult object that represents the result of this transaction.
   */
  public async enableGlobalFreeze(wallet: Wallet): Promise<TransactionResult> {
    return this.coreXrplClient.changeFlag(
      AccountSetFlag.asfGlobalFreeze,
      true,
      wallet,
    )
  }

  /**
   * Disable Global Freeze for this XRPL account.
   *
   * @see https://xrpl.org/freezes.html#global-freeze
   *
   * @param wallet The wallet associated with the XRPL account disabling Global Freeze and that will sign the request.
   * @returns A promise which resolves to a TransactionResult object that represents the result of this transaction.
   */
  public async disableGlobalFreeze(wallet: Wallet): Promise<TransactionResult> {
    return this.coreXrplClient.changeFlag(
      AccountSetFlag.asfGlobalFreeze,
      false,
      wallet,
    )
  }

  /**
   * Permanently enable No Freeze for this XRPL account.
   *
   * @see https://xrpl.org/freezes.html#no-freeze
   *
   * @param wallet The wallet associated with the XRPL account enabling No Freeze and that will sign the request.
   * @returns A promise which resolves to a TransactionResult object that represents the result of this transaction.
   */
  public async enableNoFreeze(wallet: Wallet): Promise<TransactionResult> {
    return this.coreXrplClient.changeFlag(
      AccountSetFlag.asfNoFreeze,
      true,
      wallet,
    )
  }

  /**
   * Creates a trust line between this XRPL account and an issuer of an IssuedCurrency.
   *
   * @see https://xrpl.org/trustset.html
   *
   * TODO (tedkalaw): Implement qualityIn/qualityOut.
   *
   * @param issuerXAddress The X-Address of the issuer to extend trust to.
   * @param currencyName The currency this trust line applies to, as a three-letter ISO 4217 Currency Code  or a 160-bit hex value according to currency format.
   * @param amount Decimal representation of the limit to set on this trust line.
   * @param wallet The wallet creating the trustline.
   */
  public async createTrustLine(
    issuerXAddress: string,
    currencyName: string,
    amount: string,
    wallet: Wallet,
  ): Promise<TransactionResult> {
    if (!XrpUtils.isValidXAddress(issuerXAddress)) {
      throw XrpError.xAddressRequired
    }
    const classicAddress = XrpUtils.decodeXAddress(issuerXAddress)
    if (!classicAddress) {
      throw XrpError.xAddressRequired
    }

    if (currencyName === 'XRP') {
      throw new XrpError(
        XrpErrorType.InvalidInput,
        'createTrustLine: Trust lines can only be created for Issued Currencies',
      )
    }

    // TODO (tedkalaw): Use X-Address directly when ripple-binary-codec supports X-Addresses.
    const issuerAccountAddress = new AccountAddress()
    issuerAccountAddress.setAddress(classicAddress.address)

    const currency = new Currency()
    currency.setName(currencyName)

    const issuedCurrencyAmount = new IssuedCurrencyAmount()
    issuedCurrencyAmount.setCurrency(currency)
    issuedCurrencyAmount.setIssuer(issuerAccountAddress)
    // TODO (tedkalaw): Support other types of amounts (number, bigInt, etc)
    issuedCurrencyAmount.setValue(amount)

    const currencyAmount = new CurrencyAmount()
    currencyAmount.setIssuedCurrencyAmount(issuedCurrencyAmount)

    const limit = new LimitAmount()
    limit.setValue(currencyAmount)

    const trustSet = new TrustSet()
    trustSet.setLimitAmount(limit)

    const transaction = await this.coreXrplClient.prepareBaseTransaction(wallet)
    transaction.setTrustSet(trustSet)

    const transactionHash = await this.coreXrplClient.signAndSubmitTransaction(
      transaction,
      wallet,
    )

    return await this.coreXrplClient.getFinalTransactionResultAsync(
      transactionHash,
      wallet,
    )
  }

  /**
   * Sends issued currency from one account to another.  This method can be used to create issued currency, dispense issued currency from
   * an operational address, send issued currency from one XRPL account to another (as long as the payment only involves a single currency,
   * i.e. is not cross-currency), or to redeem issued currency at the issuing address.
   * The specific case depends on the relationship among the parameters.
   *
   * TODO: (acorso) Remove this, and make that ^^ better.: ================================================================================
   * Notes to reviewers:
   *
   * Case - ALL:
   *      The destination address is NOT the same as the sending address of the transaction.
   *      (This should only be true for currency exchange payments, which is a cross-currency payment to yourself.)
   *
   *      The SendMax field (if present) should always indicate the same currency and issuer as the Amount field... otherwise, it would
   *      be considered a cross-currency payment (which are triggered by different currencies in Amount v.s. SendMax fields).
   *      SendMax values are not parameterized here, and are instead derived from the provided values for issuer, currency, etc.
   *       - therefore this method is incapable of initiating a cross-currency payment.
   *
   *
   * Case - Creating an issued currency:
   *      The sending address of the transaction is the same address as the issuer of the `Amount` field.
   *
   *      No SendMax field is required because the Transfer Fee doesn't apply to transactions in which
   *              the originator or the destination address is the same as the issuer.
   *               (you don't get charged to handle your own money, or let your customers redeem their money with you.)
   *
   *      ... does the destination address need to have a trustline established to the sender/issuer?
   *
   *
   * Case - dispensing an issued currency from an operational address (https://xrpl.org/issuing-and-operational-addresses.html):
   *      The sending address (an operational address) is not the same address as the issuer of the `Amount` field
   *
   *      Issuer needs to allow rippling (https://xrpl.org/rippling.html).
   *
   *      A SendMax field is required here, because the transfer fee will apply as the sender of this txn is not the issuer.
   *
   *
   * Case - sending an issued currency payment from one XRPL address to another:
   *      Identical to dispensing an issued currency from an operational address (which is just making an issued currency payment)
   *
   *
   * Case - redeeming an issued currency with the issuer:
   *      The destination address is the same address as the issuer of the `Amount` field.
   *
   *      No SendMax field is required because the Transfer Fee doesn't apply (see first Case above)
   *==================================================================================================================================
   *
   * @param sender The Wallet from which issued currency will be sent, and that will sign the transaction.
   * @param destinationAddress The destination address (recipient) for the payment, encoded as an X-address (see https://xrpaddress.info/).
   * @param currency The three-letter currency code of the issued currency being sent.
   * @param issuer The issuing address of the issued currency being sent.
   * @param value The amount of issued currency to send.
   * @param transferFee Optional - can be omitted if sender address or destinationAddress are the same address as the issuer.
   *                    The transfer fee associated with the issuing account, expressed as a percentage. (i.e. a value of .5 indicates a 0.5% transfer fee).
   */
  // TODO: (acorso) make this private if/when incorporated into higher level convenience methods
  // TODO: (acorso) consider using an object for potentially long list of params
  public async sendIssuedCurrency(
    sender: Wallet,
    destinationAddress: string,
    currency: string,
    issuer: string,
    value: string,
    transferFee?: number,
  ): Promise<TransactionResult> {
    if (!XrpUtils.isValidXAddress(destinationAddress)) {
      throw new XrpError(
        XrpErrorType.XAddressRequired,
        'Destination address must be in X-address format.  See https://xrpaddress.info/.',
      )
    }

    // TODO: (acorso) we don't need to convert back to a classic address once the ripple-binary-codec supports X-addresses for issued currencies.
    const issuerClassicAddress = XrpUtils.decodeXAddress(issuer)
    if (!issuerClassicAddress) {
      throw new XrpError(
        XrpErrorType.XAddressRequired,
        'Issuer address must be in X-address format.  See https://xrpaddress.info/.',
      )
    }
    if (!issuerClassicAddress.address) {
      throw new XrpError(
        XrpErrorType.XAddressRequired,
        'Decoded classic address is missing address field.',
      )
    }

    const currencyProto = new Currency()
    currencyProto.setName(currency)

    const issuerAccountAddress = new AccountAddress()
    issuerAccountAddress.setAddress(issuerClassicAddress.address)

    const issuedCurrency = new IssuedCurrencyAmount()
    issuedCurrency.setCurrency(currencyProto)
    issuedCurrency.setIssuer(issuerAccountAddress)
    issuedCurrency.setValue(value)

    const currencyAmount = new CurrencyAmount()
    currencyAmount.setIssuedCurrencyAmount(issuedCurrency)

    const amount = new Amount()
    amount.setValue(currencyAmount)

    const destinationAccountAddress = new AccountAddress()
    destinationAccountAddress.setAddress(destinationAddress)

    const destination = new Destination()
    destination.setValue(destinationAccountAddress)

    // Construct Payment fields
    const payment = new Payment()
    payment.setDestination(destination)
    // Note that the destinationTag doesn't need to be explicitly set here, because the ripple-binary-codec will decode this X-Address and
    // assign the decoded destinationTag before signing.
    payment.setAmount(amount)

    if (!(transferFee === undefined)) {
      // Construct SendMax - value should be intended amount + relevant transfer fee
      // Note that a transfer fee doesn't apply if the source address (of this transaction) and the issuing address of the currency being
      // sent are the same (i.e. issuer sending currency directly) OR if the issuer of the currency and the destination are the same
      // (i.e. redeeming an issued currency).
      // However, it also doesn't hurt to include a SendMax field, it just won't nd up being used (added this to questions just to make sure).

      const numericValue = Number(value)
      const sendMaxValue = Math.ceil((1 + transferFee / 100) * numericValue)

      const sendMaxIssuedCurrencyAmount = new IssuedCurrencyAmount()
      sendMaxIssuedCurrencyAmount.setCurrency(currencyProto)
      sendMaxIssuedCurrencyAmount.setIssuer(issuerAccountAddress)
      sendMaxIssuedCurrencyAmount.setValue(String(sendMaxValue))

      const sendMaxCurrencyAmount = new CurrencyAmount()
      sendMaxCurrencyAmount.setIssuedCurrencyAmount(sendMaxIssuedCurrencyAmount)

      const sendMax = new SendMax()
      sendMax.setValue(sendMaxCurrencyAmount)

      payment.setSendMax(sendMax)
    }

    const transaction = await this.coreXrplClient.prepareBaseTransaction(sender)
    transaction.setPayment(payment)

    // TODO: (acorso) structure this like we have `sendXrp` v.s. `sendXrpWithDetails` to allow for additional optional fields, such as memos.
    //  as well as potentially:
    // TODO: (acorso) learn about partial payments and whether they're essential to offer WRT to issued currencies (https://xrpl.org/payment.html#partial-payments)
    // TODO: (acorso) learn about other payment flags and whether they're essential to offer WRT to issued currencies (https://xrpl.org/payment.html#payment-flags)

    const transactionHash = await this.coreXrplClient.signAndSubmitTransaction(
      transaction,
      sender,
    )
    return this.coreXrplClient.getFinalTransactionResultAsync(
      transactionHash,
      sender,
    )
  }
}
