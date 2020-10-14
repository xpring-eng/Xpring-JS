import { XrplNetwork, XrpUtils, Wallet } from 'xpring-common-js'
import GrpcNetworkClient from './network-clients/grpc-xrp-network-client'
import GrpcNetworkClientWeb from './network-clients/grpc-xrp-network-client.web'
import { GrpcNetworkClientInterface } from './network-clients/grpc-network-client-interface'
import isNode from '../Common/utils'
import CoreXrplClient from './core-xrpl-client'
import TrustLine from './shared/trustline'
import JsonRpcNetworkClient from './network-clients/json-rpc-network-client'
import {
  AccountLinesResponse,
  GatewayBalancesResponse,
} from './shared/rippled-json-rpc-schema'
import { JsonNetworkClientInterface } from './network-clients/json-network-client-interface'
import { XrpError } from './shared'
import { AccountSetFlag } from './shared/account-set-flag'
import TransactionResult from './shared/transaction-result'
import GatewayBalances from './shared/gateway-balances'
import { TransferRate } from './Generated/node/org/xrpl/rpc/v1/common_pb'
import { AccountSet } from './Generated/node/org/xrpl/rpc/v1/transaction_pb'

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
   * @see https://xrpaddress.info/
   * @returns An array of TrustLine objects, representing all trust lines associated with this account.
   */
  public async getTrustLines(account: string): Promise<Array<TrustLine>> {
    const classicAddress = XrpUtils.decodeXAddress(account)
    if (!classicAddress) {
      throw XrpError.xAddressRequired
    }
    const accountLinesResponse: AccountLinesResponse = await this.jsonNetworkClient.getAccountLines(
      classicAddress.address,
    )

    if (accountLinesResponse.result.error) {
      throw XrpError.accountNotFound
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
   * @param hotwallet (Optional) An operational address to exclude from the balances issued, or an array of such addresses,
   *                   encoded as X-Addresses.
   * @see https://xrpaddress.info/
   * @returns A GatewayBalances object containing information about an account's balances.
   */
  public async getGatewayBalances(
    account: string,
    hotwallet?: string | Array<string>,
  ): Promise<GatewayBalances> {
    const classicAddress = XrpUtils.decodeXAddress(account)
    if (!classicAddress) {
      throw XrpError.xAddressRequired
    }
    // TODO: verify address format of hotwallet (and add test)
    const gatewayBalancesResponse: GatewayBalancesResponse = await this.jsonNetworkClient.getGatewayBalances(
      classicAddress.address,
      hotwallet,
    )

    if (gatewayBalancesResponse.result.error) {
      throw XrpError.accountNotFound
    }
    return new GatewayBalances(gatewayBalancesResponse)
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
}
