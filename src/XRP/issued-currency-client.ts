import { XrplNetwork, Wallet } from 'xpring-common-js'

import {
  Flags,
  LimitAmount,
  Amount,
  TransferRate,
  Destination,
  TakerPays,
  QualityIn,
  QualityOut,
} from './Generated/web/org/xrpl/rpc/v1/common_pb'
import { AccountAddress } from './Generated/web/org/xrpl/rpc/v1/account_pb'
import {
  Currency,
  CurrencyAmount,
  IssuedCurrencyAmount,
  XRPDropsAmount,
} from './Generated/web/org/xrpl/rpc/v1/amount_pb'
import {
  TrustSet,
  AccountSet,
  Payment,
  Transaction,
} from './Generated/web/org/xrpl/rpc/v1/transaction_pb'

import isNode from '../Common/utils'
import CoreXrplClient from './core-xrpl-client'
import GrpcNetworkClient from './network-clients/grpc-xrp-network-client'
import GrpcNetworkClientWeb from './network-clients/grpc-xrp-network-client.web'
import { GrpcNetworkClientInterface } from './network-clients/grpc-network-client-interface'
import { XrpError, XrpErrorType } from './shared'
import { AccountSetFlag } from './shared/account-set-flag'
import TransactionResult from './shared/transaction-result'
import GatewayBalances, {
  gatewayBalancesFromResponse,
} from './shared/gateway-balances'
import TrustLine from './shared/trustline'
import {
  AccountLinesResponse,
  AccountLinesSuccessfulResponse,
  WebSocketFailureResponse,
  TransactionResponse,
  GatewayBalancesResponse,
  GatewayBalancesSuccessfulResponse,
  RipplePathFindSuccessfulResponse,
  PathElement,
  ResponseStatus,
  SourceCurrency,
} from './shared/rippled-web-socket-schema'
import { WebSocketNetworkClientInterface } from './network-clients/web-socket-network-client-interface'
import WebSocketNetworkClient from './network-clients/web-socket-network-client'
import {
  Expiration,
  OfferSequence,
  SendMax,
  TakerGets,
} from 'xpring-common-js/build/src/XRP/generated/org/xrpl/rpc/v1/common_pb'
import { RippledErrorMessages } from './shared/rippled-error-messages'
import TrustSetFlag from './shared/trust-set-flag'
import { BigNumber } from 'bignumber.js'
import {
  OfferCancel,
  OfferCreate,
} from 'xpring-common-js/build/src/XRP/generated/org/xrpl/rpc/v1/transaction_pb'
import IssuedCurrency from './shared/issued-currency'
import XrpUtils from './shared/xrp-utils'
import OfferCreateFlag from './shared/offer-create-flag'

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

    const accountLinesResponse: AccountLinesResponse = await this.webSocketNetworkClient.getAccountLines(
      classicAddress.address,
      peerAccount,
    )

    const error = (accountLinesResponse as WebSocketFailureResponse).error
    if (error) {
      if (error === RippledErrorMessages.accountNotFound) {
        throw XrpError.accountNotFound
      } else {
        throw new XrpError(XrpErrorType.Unknown, error)
      }
    }

    const accountLinesSuccessfulResponse = accountLinesResponse as AccountLinesSuccessfulResponse
    const rawTrustLines = accountLinesSuccessfulResponse.result.lines
    if (rawTrustLines === undefined) {
      throw XrpError.malformedResponse
    }
    const trustLines: Array<TrustLine> = []
    rawTrustLines.map((trustline) => {
      trustLines.push(new TrustLine(trustline))
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

    const gatewayBalancesResponse: GatewayBalancesResponse = await this.webSocketNetworkClient.getGatewayBalances(
      classicAddress.address,
      classicAddressesToExclude,
    )

    const error = (gatewayBalancesResponse as WebSocketFailureResponse).error
    if (!error) {
      return gatewayBalancesFromResponse(
        gatewayBalancesResponse as GatewayBalancesSuccessfulResponse,
      )
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
   * Subscribes to all transactions that affect the specified account, and triggers a callback upon
   * receiving each transaction.
   * @see https://xrpl.org/monitor-incoming-payments-with-websocket.html
   * @see https://xrpl.org/subscribe.html
   *
   * @param account The account for which to subscribe to relevant transactions, encoded as an X-Address.
   * @param callback The function to trigger upon receiving a transaction event from the ledger.
   * @returns Whether the request to subscribe succeeded.
   */
  public async monitorAccountTransactions(
    account: string,
    callback: (data: TransactionResponse) => void,
  ): Promise<boolean> {
    const classicAddress = XrpUtils.decodeXAddress(account)
    if (!classicAddress) {
      throw XrpError.xAddressRequired
    }

    const response = await this.webSocketNetworkClient.subscribeToAccount(
      classicAddress.address,
      callback,
    )
    return response.status === ResponseStatus.success
  }

  /**
   * Unsubscribes from transactions that affect the specified account.
   * @see https://xrpl.org/unsubscribe.html
   *
   * @param account The account from which to unsubscribe from, encoded as an X-Address.
   * @returns Whether the request to unsubscribe succeeded.
   */
  public async stopMonitoringAccountTransactions(
    account: string,
  ): Promise<boolean> {
    const classicAddress = XrpUtils.decodeXAddress(account)
    if (!classicAddress) {
      throw XrpError.xAddressRequired
    }

    const response = await this.webSocketNetworkClient.unsubscribeFromAccount(
      classicAddress.address,
    )
    return response.status === ResponseStatus.success
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
   * Get the Transfer Fees for a given issuing account.
   * The Transfer Fee is a percentage to charge when two users transfer an issuer's IOUs on the XRPL.
   *
   * @see https://xrpl.org/transfer-fees.html
   *
   * @param address The X-address for which the transfer rate is requested.
   * @returns A promise which resolves to a number that represents the transfer fee associated with that issuing account,
   *          or undefined if one is not specified.
   */
  public async getTransferFee(address: string): Promise<number | undefined> {
    const classicAddress = XrpUtils.decodeXAddress(address)
    if (!classicAddress) {
      throw XrpError.xAddressRequired
    }

    const accountRoot = await this.coreXrplClient.getAccountData(
      classicAddress.address,
    )
    return accountRoot.getTransferRate()?.getValue()
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

    return this.coreXrplClient.getFinalTransactionResultAsync(
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
   * @param issuerXAddress The X-Address of the issuer to extend trust to.
   * @param currencyName The currency this trust line applies to, as a three-letter ISO 4217 Currency Code  or a 160-bit hex value according to currency format.
   * @param amount Decimal representation of the limit to set on this trust line.
   * @param wallet The wallet creating the trustline.
   * @param qualityIn (Optional) Value incoming balances on this trust line at the ratio of this number per 1,000,000,000 units.
   *                  A value of 0 is shorthand for treating balances at face value.
   * @param qualityOut (Optional) Value outgoing balances on this trust line at the ratio of this number per 1,000,000,000 units.
   *                  A value of 0 is shorthand for treating balances at face value.
   */
  public async createTrustLine(
    issuerXAddress: string,
    currencyName: string,
    amount: string,
    wallet: Wallet,
    qualityIn?: number,
    qualityOut?: number,
  ): Promise<TransactionResult> {
    return this.sendTrustSetTransaction(
      issuerXAddress,
      currencyName,
      amount,
      undefined,
      wallet,
      qualityIn,
      qualityOut,
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
    return this.sendTrustSetTransaction(
      accountToAuthorize,
      currencyName,
      '0',
      TrustSetFlag.tfSetfAuth,
      wallet,
    )
  }

  /**
   * Freezes the trust line between this account (issuing account) and another account.
   * Note that the trust line's limit is set to 0.
   *
   * @see https://xrpl.org/freezes.html#enabling-or-disabling-individual-freeze
   *
   * @param trustLinePeerAccount The X-Address of the account involved in the trust line being frozen.
   * @param currencyName The currency of the trust line to freeze.
   * @param wallet The wallet freezing the trust line.
   */
  public async freezeTrustLine(
    trustLinePeerAccount: string,
    currencyName: string,
    wallet: Wallet,
  ): Promise<TransactionResult> {
    return this.sendTrustSetTransaction(
      trustLinePeerAccount,
      currencyName,
      // You can change the trust line when you freeze it, but an amount of 0
      // would be the most conservative amount.
      '0',
      TrustSetFlag.tfSetFreeze,
      wallet,
    )
  }

  /**
   * Unfreezes the trust line between this account (issuing account) and another account.
   * Note that the trust line's limit is set to 0.
   *
   * @see https://xrpl.org/freezes.html#enabling-or-disabling-individual-freeze
   *
   * @param trustLinePeerAccount The X-Address of the account involved in the trust line being unfrozen.
   * @param currencyName The currency of the trust line to unfreeze.
   * @param wallet The wallet unfreezing the trust line.
   */
  public async unfreezeTrustLine(
    trustLinePeerAccount: string,
    currencyName: string,
    wallet: Wallet,
  ): Promise<TransactionResult> {
    return this.sendTrustSetTransaction(
      trustLinePeerAccount,
      currencyName,
      // You can change the trust line amount when you unfreeze it, but this would typically
      // be used by gateways, who will maintain an amount of 0.
      '0',
      TrustSetFlag.tfClearFreeze,
      wallet,
    )
  }

  /**
   * Disables rippling on the trust line between this account (issuing account) and another account.
   *
   * @see https://xrpl.org/rippling.html#enabling-disabling-no-ripple
   *
   * @param trustLinePeerAccount The X-Address of the account involved in the trust line being disabled to ripple.
   * @param currencyName The currency of the trust line being disbaled to ripple.
   * @param amount The maximum amount of debt to allow on this trust line.
   * @param wallet The wallet disabling rippling on the trust line.
   */
  public async disableRipplingForTrustLine(
    trustLinePeerAccount: string,
    currencyName: string,
    amount: string,
    wallet: Wallet,
  ): Promise<TransactionResult> {
    return this.sendTrustSetTransaction(
      trustLinePeerAccount,
      currencyName,
      amount,
      TrustSetFlag.tfSetNoRipple,
      wallet,
    )
  }

  /**
   * Re-enables rippling on the trust line between this account (issuing account) and another account.
   *
   * @see https://xrpl.org/rippling.html#enabling-disabling-no-ripple
   *
   * @param trustLinePeerAccount trustLinePeerAccount The X-Address of the account involved in the trust line being re-enabled to ripple.
   * @param currencyName The currency of the trust line being re-enabled to ripple.
   * @param amount The maximum amount of debt to allow on this trust line.
   * @param wallet The wallet re-enabling rippling on the trust line.
   */
  public async enableRipplingForTrustLine(
    trustLinePeerAccount: string,
    currencyName: string,
    amount: string,
    wallet: Wallet,
  ): Promise<TransactionResult> {
    return this.sendTrustSetTransaction(
      trustLinePeerAccount,
      currencyName,
      amount,
      TrustSetFlag.tfClearNoRipple,
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
   * @param qualityIn (Optional) Value incoming balances on this trust line at the ratio of this number per 1,000,000,000 units.
   *                  A value of 0 is shorthand for treating balances at face value.
   * @param qualityOut (Optional) Value outgoing balances on this trust line at the ratio of this number per 1,000,000,000 units.
   *                  A value of 0 is shorthand for treating balances at face value.
   */
  private async sendTrustSetTransaction(
    accountToTrust: string,
    currencyName: string,
    amount: string,
    flags: number | undefined,
    wallet: Wallet,
    qualityIn?: number,
    qualityOut?: number,
  ): Promise<TransactionResult> {
    const trustSetTransaction = await this.prepareTrustSetTransaction(
      accountToTrust,
      currencyName,
      amount,
      flags,
      wallet,
      qualityIn,
      qualityOut,
    )

    const transactionHash = await this.coreXrplClient.signAndSubmitTransaction(
      trustSetTransaction,
      wallet,
    )

    return this.coreXrplClient.getFinalTransactionResultAsync(
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
   * @param qualityIn (Optional) Value incoming balances on this trust line at the ratio of this number per 1,000,000,000 units.
   *                  A value of 0 is shorthand for treating balances at face value.
   * @param qualityOut (Optional) Value outgoing balances on this trust line at the ratio of this number per 1,000,000,000 units.
   *                  A value of 0 is shorthand for treating balances at face value.
   */
  private async prepareTrustSetTransaction(
    accountToTrust: string,
    currencyName: string,
    amount: string,
    flags: number | undefined,
    wallet: Wallet,
    qualityInAmount?: number,
    qualityOutAmount?: number,
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

    if (qualityInAmount) {
      const qualityIn = new QualityIn()
      qualityIn.setValue(qualityInAmount)
      trustSet.setQualityIn(qualityIn)
    }

    if (qualityOutAmount) {
      const qualityOut = new QualityOut()
      qualityOut.setValue(qualityOutAmount)
      trustSet.setQualityOut(qualityOut)
    }

    const transaction = await this.coreXrplClient.prepareBaseTransaction(wallet)
    transaction.setTrustSet(trustSet)

    if (flags !== undefined) {
      const transactionFlags = new Flags()
      transactionFlags.setValue(flags)
      transaction.setFlags(transactionFlags)
    }

    return transaction
  }

  /**
   * Creates new issued currency on a trustline to the destination account. Note that the destination account must have a trustline
   * extended to the sender of this transaction (the "issuer" of this issued currency) or no issued currency will be created.
   *
   * @param sender The Wallet creating the issued currency, and that will sign the transaction.
   * @param destination The destination address (recipient) of the issued currency, encoded as an X-address (see https://xrpaddress.info/).
   * @param currency The three-letter currency code of the issued currency being created.
   * @param amount The amount of issued currency to create.
   * @param sendMaxValue The max amount to send.
   */
  public async createIssuedCurrency(
    sender: Wallet,
    destination: string,
    currency: string,
    amount: string,
  ): Promise<TransactionResult> {
    const issuer = sender.getAddress()
    const issuedCurrency = {
      currency,
      issuer,
      value: amount,
    }
    return this.issuedCurrencyPayment(sender, destination, issuedCurrency)
  }

  /**
   * Redeems issued currency back to the original issuer.
   * Typically, this should trigger off-ledger action by the issuing institution.
   *
   * @param sender The Wallet redeeming the issued currency, and that will sign the transaction.
   * @param issuer The original issuer of the issued currency, encoded as an X-address (see https://xrpaddress.info/).
   * @param currency The three-letter currency code of the issued currency being redeemed.
   * @param amount The amount of issued currency to redeem.
   * @param sendMaxValue The max amount to send.
   */
  public async redeemIssuedCurrency(
    sender: Wallet,
    issuedCurrency: IssuedCurrency,
  ): Promise<TransactionResult> {
    // Redemption of issued currency is achieved by sending issued currency directly to the original issuer.
    // However, the issuer field specified in the amount is treated as a special case in this circumstance, and should be
    // set to the address of the account initiating the redemption.
    // See: https://xrpl.org/payment.html#special-issuer-values-for-sendmax-and-amount
    const specialIssuedCurrency: IssuedCurrency = {
      ...issuedCurrency,
      issuer: sender.getAddress(),
    }
    return this.issuedCurrencyPayment(
      sender,
      issuedCurrency.issuer,
      specialIssuedCurrency,
    )
  }

  /**
   * Sends issued currency from one (non-issuing) account to another.
   *
   * @param sender The Wallet from which issued currency will be sent, and that will sign the transaction.
   * @param destination The destination address for the payment, encoded as an X-address (see https://xrpaddress.info/).
   * @param issuedCurrency The issued currency being sent.
   * @param transferFee (Optional) The transfer fee associated with the issuing account, expressed as a percentage. (i.e. a value of .5 indicates
   *               a 0.5% transfer fee).  Supply this field for automatic calculation of the sendMax value for this payment.
   *               Either this or sendMaxvalue may be specified, but not both.
   * @param sendMaxValue (Optional) A manual specification of the maximum amount of source currency this payment is allowed to cost,
   *               including transfer fees, exchange rates, and slippage. Does not include the XRP destroyed as a cost for submitting
   *               the transaction. Either this or transferFee may be specified, but not both.
   */
  public async sendIssuedCurrencyPayment(
    sender: Wallet,
    destination: string,
    issuedCurrency: IssuedCurrency,
    transferFee?: number,
    sendMaxValue?: string,
  ): Promise<TransactionResult> {
    if (sender.getAddress() === issuedCurrency.issuer) {
      throw new XrpError(
        XrpErrorType.InvalidInput,
        'The sending address cannot be the same as the issuing address. To create issued currency, use `createIssuedCurrency`.',
      )
    }
    if (destination === issuedCurrency.issuer) {
      throw new XrpError(
        XrpErrorType.InvalidInput,
        'The destination address cannot be the same as the issuer. To redeem issued currency, use `redeemIssuedCurrency`.',
      )
    }

    return this.issuedCurrencyPayment(
      sender,
      destination,
      issuedCurrency,
      transferFee,
      sendMaxValue,
    )
  }

  /**
   * Send a cross-currency payment. Note that the source and destination currencies cannot both be XRP.
   * The XRPL is queried for viable paths as part of transaction construction.  If no paths are found,
   * an error is thrown and no transaction is submitted.
   *
   * @see https://xrpl.org/cross-currency-payments.html
   *
   * @param sender The wallet from which currency will be sent, and that will sign the transaction.
   * @param destination The address of the payment's recipient, encoded as an X-Address.
   * @param maxSourceAmount Highest amount of source currency this transaction is allowed to cost, including transfer fees,
   *               exchange rates, and slippage. Does not include the XRP destroyed as a cost for submitting the transaction.
   *               For XRP, specify amount as a string of drops.
   *               For issued currencies, specify an IssuedCurrency object with currency, issuer, and value fields.
   * @param deliverAmount The amount of currency to deliver. For XRP, specify amount as a string of drops.  For issued currencies,
   *               specify an IssuedCurrency object with currency, issuer, and value fields.
   */
  public async sendCrossCurrencyPayment(
    sender: Wallet,
    destination: string,
    maxSourceAmount: string | IssuedCurrency,
    deliverAmount: string | IssuedCurrency,
  ): Promise<TransactionResult> {
    if (!XrpUtils.isValidXAddress(destination)) {
      throw new XrpError(
        XrpErrorType.XAddressRequired,
        'Destination address must be in X-address format.  See https://xrpaddress.info/.',
      )
    }

    // Both source amount and deliver amount can't both be XRP:
    if (
      XrpUtils.isString(deliverAmount) &&
      XrpUtils.isString(maxSourceAmount)
    ) {
      throw new XrpError(
        XrpErrorType.InvalidInput,
        'A cross-currency payment should involve at least one issued currency.',
      )
    }
    if (
      XrpUtils.isIssuedCurrency(deliverAmount) &&
      XrpUtils.isIssuedCurrency(maxSourceAmount) &&
      (deliverAmount as IssuedCurrency).currency ===
        (maxSourceAmount as IssuedCurrency).currency &&
      (deliverAmount as IssuedCurrency).issuer ===
        (maxSourceAmount as IssuedCurrency).issuer
    ) {
      throw new XrpError(
        XrpErrorType.InvalidInput,
        'A Cross Currency payment must specify different currencies for deliverAmount and maxSourceAmount.',
      )
    }

    // Create representation of the currency to SOURCE
    const sourceAmountProto = this.createCurrencyAmount(maxSourceAmount)

    // Create representation of the currency to DELIVER
    const deliverAmountProto = this.createAmount(deliverAmount)

    // Create destination proto
    const destinationAccountAddress = new AccountAddress()
    destinationAccountAddress.setAddress(destination)

    const destinationProto = new Destination()
    destinationProto.setValue(destinationAccountAddress)

    // Construct Payment fields
    const payment = new Payment()
    payment.setDestination(destinationProto)
    // Note that the destinationTag doesn't need to be explicitly set here, because the ripple-binary-codec will decode this X-Address and
    // assign the decoded destinationTag before signing.

    payment.setAmount(deliverAmountProto)

    // Assign sourceCurrencyAmount as sendMax for Payment
    const sendMax = new SendMax()
    sendMax.setValue(sourceAmountProto)
    payment.setSendMax(sendMax)

    // Determine if there is a viable path
    const sourceCurrencyName = XrpUtils.isString(maxSourceAmount)
      ? 'XRP'
      : (maxSourceAmount as IssuedCurrency).currency
    const sourceCurrency: SourceCurrency = {
      currency: sourceCurrencyName,
    }
    const sourceCurrencies = [sourceCurrency]

    const sourceClassicAddress = XrpUtils.decodeXAddress(sender.getAddress())
    if (!sourceClassicAddress) {
      throw XrpError.xAddressRequired
    }

    const destinationClassicAddress = XrpUtils.decodeXAddress(destination)
    if (!destinationClassicAddress) {
      throw XrpError.xAddressRequired
    }

    let pathFindResponse = await this.webSocketNetworkClient.findRipplePath(
      sourceClassicAddress.address,
      destinationClassicAddress.address,
      deliverAmount,
      undefined,
      sourceCurrencies,
    )

    // If failure response from websocket, throw
    if (pathFindResponse.status !== 'success') {
      pathFindResponse = pathFindResponse as WebSocketFailureResponse
      throw new XrpError(XrpErrorType.Unknown, pathFindResponse.error_message)
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    pathFindResponse = pathFindResponse as RipplePathFindSuccessfulResponse
    const pathAlternatives = pathFindResponse.result.alternatives

    // If no viable paths exist, throw
    if (pathAlternatives.length === 0) {
      throw new XrpError(
        XrpErrorType.NoViablePaths,
        'No paths exist to execute cross-currency payment.',
      )
    }

    // Otherwise, find the cheapest path
    let currentBestPathset = pathAlternatives[0].paths_computed
    let currentCheapestSourceAmount = new BigNumber(
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      (pathAlternatives[0].source_amount as IssuedCurrency).value,
    )
    pathAlternatives.forEach((possiblePath) => {
      const numericSourceAmount = new BigNumber(
        (possiblePath.source_amount as IssuedCurrency).value,
      )
      if (numericSourceAmount < currentCheapestSourceAmount) {
        currentBestPathset = possiblePath.paths_computed
        currentCheapestSourceAmount = numericSourceAmount
      }
    })

    // Assign best pathset to Payment protobuf
    currentBestPathset.forEach((path: PathElement[]) => {
      const pathProto = new Payment.Path()
      path.forEach((pathElement: PathElement) => {
        const pathElementProto = new Payment.PathElement()
        if (pathElement.account) {
          const accountAddressProto = new AccountAddress()
          accountAddressProto.setAddress(pathElement.account)
          pathElementProto.setAccount(accountAddressProto)
        }
        if (pathElement.currency) {
          const currencyProto = new Currency()
          currencyProto.setName(pathElement.currency)
          pathElementProto.setCurrency(currencyProto)
        }
        if (pathElement.issuer) {
          const issuerAccountAddressProto = new AccountAddress()
          issuerAccountAddressProto.setAddress(pathElement.issuer)
          pathElementProto.setIssuer(issuerAccountAddressProto)
        }
        pathProto.addElements(pathElementProto)
      })
      payment.addPaths(pathProto)
    })

    const transaction = await this.coreXrplClient.prepareBaseTransaction(sender)
    transaction.setPayment(payment)

    const transactionHash = await this.coreXrplClient.signAndSubmitTransaction(
      transaction,
      sender,
    )
    return this.coreXrplClient.getFinalTransactionResultAsync(
      transactionHash,
      sender,
    )
  }

  // TODO: (acorso) Make this method private and expose more opinionated public APIs.
  // TODO: (acorso) structure this like we have `sendXrp` v.s. `sendXrpWithDetails` to allow for additional optional fields, such as memos.
  //  as well as potentially:
  // TODO: (acorso) learn about partial payments and whether they're essential to offer WRT to issued currencies (https://xrpl.org/payment.html#partial-payments)
  // TODO: (acorso) learn about other payment flags and whether they're essential to offer WRT to issued currencies (https://xrpl.org/payment.html#payment-flags)

  /**
   * Sends issued currency from one account to another.  This method can be used to create issued currency, dispense issued currency from
   * an operational address, send issued currency from one XRPL account to another (as long as the payment only involves a single currency,
   * i.e. is not cross-currency), or to redeem issued currency at the issuing address.
   * The specific case being executed is determined by the relationship among the parameters.
   *
   * @param sender The Wallet from which issued currency will be sent, and that will sign the transaction.
   * @param destination The destination address (recipient) for the payment, encoded as an X-address (see https://xrpaddress.info/).
   * @param issuedCurrency The issued currency being sent.
   * @param transferFee (Optional) The transfer fee associated with the issuing account, expressed as a percentage. (i.e. a value of .5 indicates
   *               a 0.5% transfer fee).  Supply this field for automatic calculation of the sendMax value for this payment.
   *               Either this or sendMaxvalue may be specified, but not both.
   * @param sendMaxValue (Optional) A manual specification of the maximum amount of source currency this payment is allowed to cost,
   *               including transfer fees, exchange rates, and slippage. Does not include the XRP destroyed as a cost for submitting \
   *               the transaction. Either this or transferFee may be specified, but not both.
   */
  public async issuedCurrencyPayment(
    sender: Wallet,
    destination: string,
    issuedCurrency: IssuedCurrency,
    transferFee?: number,
    sendMaxValue?: string,
  ): Promise<TransactionResult> {
    if (transferFee && sendMaxValue) {
      throw new XrpError(
        XrpErrorType.InvalidInput,
        'Specify the `transferFee` or `sendMaxValue` fields, but not both.',
      )
    }
    if (!XrpUtils.isValidXAddress(destination)) {
      throw new XrpError(
        XrpErrorType.XAddressRequired,
        'Destination address must be in X-address format.  See https://xrpaddress.info/.',
      )
    }

    // TODO: (acorso) we don't need to convert back to a classic address once the ripple-binary-codec supports X-addresses for issued currencies.
    const issuerClassicAddress = XrpUtils.decodeXAddress(issuedCurrency.issuer)
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
    currencyProto.setName(issuedCurrency.currency)

    const issuerAccountAddress = new AccountAddress()
    issuerAccountAddress.setAddress(issuerClassicAddress.address)

    const issuedCurrencyAmount = new IssuedCurrencyAmount()
    issuedCurrencyAmount.setCurrency(currencyProto)
    issuedCurrencyAmount.setIssuer(issuerAccountAddress)
    issuedCurrencyAmount.setValue(issuedCurrency.value)

    const currencyAmount = new CurrencyAmount()
    currencyAmount.setIssuedCurrencyAmount(issuedCurrencyAmount)

    const amountProto = new Amount()
    amountProto.setValue(currencyAmount)

    const destinationAccountAddress = new AccountAddress()
    destinationAccountAddress.setAddress(destination)

    const destinationProto = new Destination()
    destinationProto.setValue(destinationAccountAddress)

    // Construct Payment fields
    const payment = new Payment()
    payment.setDestination(destinationProto)
    // Note that the destinationTag doesn't need to be explicitly set here, because the ripple-binary-codec will decode this X-Address and
    // assign the decoded destinationTag before signing.
    payment.setAmount(amountProto)

    // If transferFee was supplied, calculate the sendMax value, otherwise use the manual override sendMaxValue.
    // Either or both may be undefined.
    const calculatedSendMaxValue = transferFee
      ? this.calculateSendMaxValue(issuedCurrency.value, transferFee)
      : sendMaxValue

    if (calculatedSendMaxValue) {
      const sendMaxIssuedCurrencyAmount = new IssuedCurrencyAmount()
      sendMaxIssuedCurrencyAmount.setCurrency(currencyProto)
      sendMaxIssuedCurrencyAmount.setIssuer(issuerAccountAddress)
      sendMaxIssuedCurrencyAmount.setValue(calculatedSendMaxValue)

      const sendMaxCurrencyAmount = new CurrencyAmount()
      sendMaxCurrencyAmount.setIssuedCurrencyAmount(sendMaxIssuedCurrencyAmount)

      const sendMax = new SendMax()
      sendMax.setValue(sendMaxCurrencyAmount)

      payment.setSendMax(sendMax)
    }

    const transaction = await this.coreXrplClient.prepareBaseTransaction(sender)
    transaction.setPayment(payment)

    const transactionHash = await this.coreXrplClient.signAndSubmitTransaction(
      transaction,
      sender,
    )
    return this.coreXrplClient.getFinalTransactionResultAsync(
      transactionHash,
      sender,
    )
  }

  /**
   * Calculates the sendMaxValue by applying the transferFee to the amount being sent and ensuring the total amount
   * fits within maximum decimal precision.
   * @see https://xrpl.org/currency-formats.html#issued-currency-precision
   *
   * @param amount The amount of issued currency to pay to the destination.
   * @param transferFee The transfer fee associated with the issuing account, expressed as a percentage.
   *                    (i.e. a value of .5 indicates a 0.5% transfer fee).
   */
  public calculateSendMaxValue(amount: string, transferFee: number): string {
    if (transferFee < 0) {
      throw new XrpError(
        XrpErrorType.InvalidInput,
        'Transfer Fee must be positive.',
      )
    }
    // maximum allowed decimal precision for issued currency values.
    const maxDecimalPrecision = 15
    const numericAmount = new BigNumber(amount)
    const transferRate = new BigNumber(1 + transferFee / 100)

    // calculate the total sendMaxValue with any number of decimal places.
    const rawSendMaxValue: BigNumber = numericAmount.multipliedBy(transferRate)

    if (rawSendMaxValue.toFixed().length <= maxDecimalPrecision) {
      return rawSendMaxValue.toFixed()
    }

    // If we have too many digits of precision, express with scientific notation but fit within decimal precision.
    return rawSendMaxValue.toExponential(14, 0).replace(/e\+/, 'e')
  }

  /**
   * Creates an offer on the XRP Ledger.
   * @see https://xrpl.org/offers.html
   * @see https://xrpl.org/offercreate.html#offercreate
   *
   * @param sender The Wallet creating this offer, and that will sign the transaction.
   * @param takerGetsAmount The amount and type of currency being provided by the offer creator.
   *               Use a string to specify XRP, or an IssuedCurrency object to specify an issued currency.
   * @param takerPaysAmount The amount and type of currency being requested by the offer creator.
   *               Use a string to specify XRP, or an IssuedCurrency object to specify an issued currency.
   * @param offerSequence (Optional) An offer to delete first, specified by the sequence number of a previous OfferCreate transaction.
   *               If specified, cancel any offer object in the ledger that was created by that transaction.
   *               It is not considered an error if the offer specified does not exist.
   * @param expiration (Optional) Time after which the offer is no longer active, in seconds since the Ripple Epoch.
   *               (See https://xrpl.org/basic-data-types.html#specifying-time)
   * @param passive (Optional, defaults to false) If enabled, the offer does not consume offers that exactly match it, and instead becomes
   *               an Offer object in the ledger. It still consumes offers that cross it.
   * @param immediateOrCancel (Optional, defaults to false) Treat the offer as an Immediate or Cancel order. If enabled, the offer never becomes
   *               a ledger object: it only tries to match existing offers in the ledger. If the offer cannot match any offers
   *               immediately, it executes "successfully" without trading any currency. In this case, the transaction has the
   *               result code tesSUCCESS, but creates no Offer objects in the ledger.
   *               (see https://en.wikipedia.org/wiki/Immediate_or_cancel)
   * @param fillOrKill (Optional, defaults to false) Treat the offer as a Fill or Kill order. Only try to match existing offers in the ledger,
   *               and only do so if the entire TakerPays quantity can be obtained. If the fix1578 amendment is enabled and
   *               the offer cannot be executed when placed, the transaction has the result code tecKILLED; otherwise, the
   *               transaction uses the result code tesSUCCESS even when it was killed without trading any currency.
   *               (see https://en.wikipedia.org/wiki/Fill_or_kill)
   * @param sell (Optional, defaults to false) Exchange the entire TakerGets amount, even if it means obtaining more than the TakerPays amount in exchange.
   */
  public async createOffer(
    sender: Wallet,
    takerGetsAmount: string | IssuedCurrency,
    takerPaysAmount: string | IssuedCurrency,
    offerSequence?: number,
    expiration?: number,
    passive?: boolean,
    immediateOrCancel?: boolean,
    fillOrKill?: boolean,
    sell?: boolean,
  ): Promise<TransactionResult> {
    const takerGetsCurrencyAmount = this.createCurrencyAmount(takerGetsAmount)
    const takerGets = new TakerGets()
    takerGets.setValue(takerGetsCurrencyAmount)

    const takerPaysCurrencyAmount = this.createCurrencyAmount(takerPaysAmount)
    const takerPays = new TakerPays()
    takerPays.setValue(takerPaysCurrencyAmount)

    const offerCreate = new OfferCreate()
    offerCreate.setTakerGets(takerGets)
    offerCreate.setTakerPays(takerPays)

    if (offerSequence) {
      const offerSequenceProto = new OfferSequence()
      offerSequenceProto.setValue(offerSequence)
      offerCreate.setOfferSequence(offerSequenceProto)
    }

    if (expiration) {
      const expirationProto = new Expiration()
      expirationProto.setValue(expiration)
      offerCreate.setExpiration(expirationProto)
    }

    let flagsValue = 0
    if (passive) {
      flagsValue |= OfferCreateFlag.TF_PASSIVE
    }
    if (immediateOrCancel) {
      flagsValue |= OfferCreateFlag.TF_IMMEDIATE_OR_CANCEL
    }
    if (fillOrKill) {
      flagsValue |= OfferCreateFlag.TF_FILL_OR_KILL
    }
    if (sell) {
      flagsValue |= OfferCreateFlag.TF_SELL
    }

    const flags = new Flags()
    flags.setValue(flagsValue)

    const transaction = await this.coreXrplClient.prepareBaseTransaction(sender)
    transaction.setOfferCreate(offerCreate)
    if (flagsValue != 0) {
      transaction.setFlags(flags)
    }

    const transactionHash = await this.coreXrplClient.signAndSubmitTransaction(
      transaction,
      sender,
    )

    return this.coreXrplClient.getFinalTransactionResultAsync(
      transactionHash,
      sender,
    )
  }

  /**
   * Cancels an offer on the XRP Ledger.
   * @see https://xrpl.org/offers.html
   * @see https://xrpl.org/offercancel.html#offercancel
   *
   * @param sender The Wallet cancelling this offer, and that will sign the transaction.
   * @param offerSequence The sequence number of a previous OfferCreate transaction.
   *               If specified, cancel any offer object in the ledger that was created by that transaction.
   *               It is not considered an error if the offer specified does not exist.
   */
  public async cancelOffer(
    sender: Wallet,
    offerSequence: number,
  ): Promise<TransactionResult> {
    const offerSequenceProto = new OfferSequence()
    offerSequenceProto.setValue(offerSequence)

    const offerCancel = new OfferCancel()
    offerCancel.setOfferSequence(offerSequenceProto)

    const transaction = await this.coreXrplClient.prepareBaseTransaction(sender)
    transaction.setOfferCancel(offerCancel)

    const transactionHash = await this.coreXrplClient.signAndSubmitTransaction(
      transaction,
      sender,
    )

    return this.coreXrplClient.getFinalTransactionResultAsync(
      transactionHash,
      sender,
    )
  }

  /**
   * Constructs and returns a CurrencyAmount protobuf that represents either an XRP drops amount or Issued Currency amount, which can then be
   * assigned to a higher order protobuf that requires a CurrencyAmount.
   *
   * @param amount The string (for XRP amounts) or IssuedCurrency object (for issued currencies) from which to construct a CurrencyAmount protobuf.
   */
  private createCurrencyAmount(
    amount: string | IssuedCurrency,
  ): CurrencyAmount {
    const currencyAmount = new CurrencyAmount()
    if (XrpUtils.isString(amount)) {
      const xrpDropsAmount = new XRPDropsAmount()
      xrpDropsAmount.setDrops(amount as string)
      currencyAmount.setXrpAmount(xrpDropsAmount)
    } else {
      const currency = new Currency()
      currency.setName((amount as IssuedCurrency).currency)

      const accountAddress = new AccountAddress()
      accountAddress.setAddress((amount as IssuedCurrency).issuer)

      const issuedCurrencyAmount = new IssuedCurrencyAmount()
      issuedCurrencyAmount.setIssuer(accountAddress)
      issuedCurrencyAmount.setCurrency(currency)
      issuedCurrencyAmount.setValue((amount as IssuedCurrency).value)

      currencyAmount.setIssuedCurrencyAmount(issuedCurrencyAmount)
    }
    return currencyAmount
  }

  /**
   * Constructs and returns an Amount protocol buffer object with all sub-objects such as an XRPDropsAmount or IssuedCurrencyAmount.
   *
   * @param amount The string (for XRP amounts) or IssuedCurrency object (for issued currencies) from which to construct a Amount protobuf.
   */
  private createAmount(amount: string | IssuedCurrency): Amount {
    const currencyAmount = this.createCurrencyAmount(amount)
    const amountProto = new Amount()
    amountProto.setValue(currencyAmount)
    return amountProto
  }
}
