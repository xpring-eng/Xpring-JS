import { XrplNetwork, XrpUtils, Wallet } from 'xpring-common-js'

import { Flags, LimitAmount } from './Generated/web/org/xrpl/rpc/v1/common_pb'
import { AccountAddress } from './Generated/web/org/xrpl/rpc/v1/account_pb'
import {
  Currency,
  CurrencyAmount,
  IssuedCurrencyAmount,
} from './Generated/web/org/xrpl/rpc/v1/amount_pb'
import {
  TrustSet,
  AccountSet,
  Transaction,
} from './Generated/web/org/xrpl/rpc/v1/transaction_pb'

import isNode from '../Common/utils'
import CoreXrplClient from './core-xrpl-client'
import GrpcNetworkClient from './network-clients/grpc-xrp-network-client'
import GrpcNetworkClientWeb from './network-clients/grpc-xrp-network-client.web'
import { GrpcNetworkClientInterface } from './network-clients/grpc-network-client-interface'
import JsonRpcNetworkClient from './network-clients/json-rpc-network-client'
import {
  AccountLinesResponse,
  GatewayBalancesResponse,
} from './shared/rippled-json-rpc-schema'
import { JsonNetworkClientInterface } from './network-clients/json-network-client-interface'
import { XrpError, XrpErrorType } from './shared'
import { AccountSetFlag } from './shared/account-set-flag'
import TransactionResult from './shared/transaction-result'
import GatewayBalances, {
  gatewayBalancesFromResponse,
} from './shared/gateway-balances'
import TrustLine from './shared/trustline'
import { TransferRate } from './Generated/node/org/xrpl/rpc/v1/common_pb'
import {
  WebSocketStatusResponse,
  WebSocketTransactionResponse,
} from './shared/rippled-web-socket-schema'
import { WebSocketNetworkClientInterface } from './network-clients/web-socket-network-client-interface'
import WebSocketNetworkClient from './network-clients/web-socket-network-client'
import { RippledErrorMessages } from './shared/rippled-error-messages'
import TrustSetFlag from './shared/trust-set-flag'

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
    webSocketUrl: string,
    handleWebSocketErrorMessage: (data: string) => void,
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
      new WebSocketNetworkClient(webSocketUrl, handleWebSocketErrorMessage),
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
    readonly webSocketNetworkClient: WebSocketNetworkClientInterface,
    readonly network: XrplNetwork,
  ) {
    this.coreXrplClient = new CoreXrplClient(grpcNetworkClient, network)
  }

  /**
   * Retrieves information about an account's trust lines, which maintain balances of all non-XRP currencies and assets.
   * @see https://xrpl.org/trust-lines-and-issuing.html
   *
   * @param account The account for which to retrieve associated trust lines, encoded as an X-Address.
   * @param peerAccount (Optional) The address of a second account, encoded as an X-Address.
   *                    If provided, show only trust lines connecting the two accounts.
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

    const { error } = accountLinesResponse.result
    if (error) {
      if (error === RippledErrorMessages.accountNotFound) {
        throw XrpError.accountNotFound
      } else {
        throw new XrpError(XrpErrorType.Unknown, error)
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
   * Returns information about the total balances issued by a given account,
   * optionally excluding amounts held by operational addresses.
   * @see https://xrpl.org/issuing-and-operational-addresses.html
   *
   * @param account The account for which to retrieve balance information, encoded as an X-Address.
   * @param accountsToExclude (Optional) An array of operational addresses to exclude from the balances issued, encoded as X-Addresses.
   * @see https://xrpaddress.info/
   * @returns A GatewayBalances object containing information about an account's balances.
   */
  public async getGatewayBalances(
    account: string,
    accountsToExclude: Array<string> = [],
  ): Promise<GatewayBalances> {
    // check issuing account for X-Address format
    const classicAddress = XrpUtils.decodeXAddress(account)
    if (!classicAddress) {
      throw XrpError.xAddressRequired
    }

    // check excludable addresses for X-Address format, and convert to classic addresses for request
    const classicAddressesToExclude = accountsToExclude.map((xAddress) => {
      const excludeClassicAddress = XrpUtils.decodeXAddress(xAddress)
      if (!excludeClassicAddress) {
        throw XrpError.xAddressRequired
      }
      return classicAddress.address
    })

    const gatewayBalancesResponse: GatewayBalancesResponse = await this.jsonNetworkClient.getGatewayBalances(
      classicAddress.address,
      classicAddressesToExclude,
    )

    const { error } = gatewayBalancesResponse.result
    if (!error) {
      return gatewayBalancesFromResponse(gatewayBalancesResponse)
    }
    switch (error) {
      case RippledErrorMessages.accountNotFound:
        throw XrpError.accountNotFound
      case RippledErrorMessages.invalidExcludedAddress:
        throw new XrpError(
          XrpErrorType.InvalidInput,
          'The address(es) supplied to for exclusion were invalid.',
        )
      default:
        throw new XrpError(XrpErrorType.Unknown, error)
    }
  }

  /**
   * Subscribes to an account's incoming transactions, and triggers a callback upon recieving each transaction.
   * @see https://xrpl.org/monitor-incoming-payments-with-websocket.html
   * @see https://xrpl.org/subscribe.html
   *
   * @param account The account from which to subscribe to incoming transactions, encoded as an X-Address.
   * @param callback The function to trigger upon recieving each transaction from the ledger.
   * @returns The response from the websocket confirming the subscription.
   */
  public async monitorIncomingPayments(
    account: string,
    callback: (data: WebSocketTransactionResponse) => void,
  ): Promise<WebSocketStatusResponse> {
    const classicAddress = XrpUtils.decodeXAddress(account)
    if (!classicAddress) {
      throw XrpError.xAddressRequired
    }
    const address = classicAddress.address

    const id = 'monitor_transactions_' + account

    return await this.webSocketNetworkClient.subscribeToAccount(
      id,
      callback,
      address,
    )
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
    return await this.sendTrustSetTransaction(
      issuerXAddress,
      currencyName,
      amount,
      undefined,
      wallet,
    )
  }

  /**
   * Creates an authorized trust line between this XRPL account (issuing account) and another account.
   * Note that the other account must also create a trust line to this issuing account in order to establish a trust line with a non-zero limit.
   * If this method is called before the other account creates a trust line, a trust line with a limit of 0 is created.
   * However, this is only true if this issuing account has already required Authorized Trustlines (see https://xrpl.org/authorized-trust-lines.html),
   * otherwise no trust line is created.
   *
   * @see https://xrpl.org/authorized-trust-lines.html
   *
   * @param accountToAuthorize The X-Address of the address with which to authorize a trust line.
   * @param currencyName The currency to authorize a trust line for.
   * @param wallet The wallet creating the authorized trust line.
   */
  public async authorizeTrustLine(
    accountToAuthorize: string,
    currencyName: string,
    wallet: Wallet,
  ): Promise<TransactionResult> {
    // When authorizing a trust line, the value of the trust line is set to 0.
    // See https://xrpl.org/authorized-trust-lines.html#authorizing-trust-lines
    return await this.sendTrustSetTransaction(
      accountToAuthorize,
      currencyName,
      '0',
      TrustSetFlag.tfSetfAuth,
      wallet,
    )
  }

  /*
   * Creates and sends a TrustSet transaction to the XRPL.
   *
   * @param accountToTrust The account to extend trust to with a trust line.
   * @param currencyName The name of the currency to create a trust line for.
   * @param amount The maximum amount of debt to allow on this trust line.
   * @param wallet A wallet associated with the account extending trust.
   */
  private async sendTrustSetTransaction(
    accountToTrust: string,
    currencyName: string,
    amount: string,
    flags: number | undefined,
    wallet: Wallet,
  ): Promise<TransactionResult> {
    const trustSetTransaction = await this.prepareTrustSetTransaction(
      accountToTrust,
      currencyName,
      amount,
      flags,
      wallet,
    )

    const transactionHash = await this.coreXrplClient.signAndSubmitTransaction(
      trustSetTransaction,
      wallet,
    )

    return await this.coreXrplClient.getFinalTransactionResultAsync(
      transactionHash,
      wallet,
    )
  }

  /**
   * Prepares a TrustSet transaction to be sent and executed on the XRPL.
   *
   * @param accountToTrust The account to extend trust to with a trust line.
   * @param currencyName The name of the currency to create a trust line for.
   * @param amount The maximum amount of debt to allow on this trust line.
   * @param wallet A wallet associated with the account extending trust.
   */
  private async prepareTrustSetTransaction(
    accountToTrust: string,
    currencyName: string,
    amount: string,
    flags: number | undefined,
    wallet: Wallet,
  ): Promise<Transaction> {
    if (!XrpUtils.isValidXAddress(accountToTrust)) {
      throw XrpError.xAddressRequired
    }
    const classicAddress = XrpUtils.decodeXAddress(accountToTrust)
    if (!classicAddress) {
      throw XrpError.xAddressRequired
    }

    // TODO (tedkalaw): Use X-Address directly when ripple-binary-codec supports X-Addresses.
    const issuerAccountAddress = new AccountAddress()
    issuerAccountAddress.setAddress(classicAddress.address)

    if (currencyName === 'XRP') {
      throw new XrpError(
        XrpErrorType.InvalidInput,
        'prepareTrustSetTransaction: Trust lines can only be created for Issued Currencies',
      )
    }
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

    if (flags !== undefined) {
      const transactionFlags = new Flags()
      transactionFlags.setValue(flags)
      transaction.setFlags(transactionFlags)
    }

    return transaction
  }
}
