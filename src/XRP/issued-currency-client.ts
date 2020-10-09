import { XrplNetwork, XrpUtils, Wallet } from 'xpring-common-js'

import { LimitAmount, SetFlag } from './Generated/web/org/xrpl/rpc/v1/common_pb'
import { AccountAddress } from './Generated/web/org/xrpl/rpc/v1/account_pb'
import {
  Currency,
  CurrencyAmount,
  IssuedCurrencyAmount,
} from './Generated/web/org/xrpl/rpc/v1/amount_pb'
import {
  TrustSet,
  AccountSet,
} from './Generated/web/org/xrpl/rpc/v1/transaction_pb'

import isNode from '../Common/utils'
import CoreXrplClient from './core-xrpl-client'
import GrpcNetworkClient from './network-clients/grpc-xrp-network-client'
import GrpcNetworkClientWeb from './network-clients/grpc-xrp-network-client.web'
import { GrpcNetworkClientInterface } from './network-clients/grpc-network-client-interface'
import JsonRpcNetworkClient from './network-clients/json-rpc-network-client'
import { JsonNetworkClientInterface } from './network-clients/json-network-client-interface'
import { XrpError } from './shared'
import { AccountSetFlag } from './shared/account-set-flag'
import TransactionResult from './shared/transaction-result'
import { AccountLinesResponse } from './shared/rippled-json-rpc-schema'
import TrustLine from './shared/trustline'

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
    const setFlag = new SetFlag()
    setFlag.setValue(AccountSetFlag.asfRequireAuth)

    const accountSet = new AccountSet()
    accountSet.setSetFlag(setFlag)

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
   * Creates a trustline between this XRPL account and an issuer of an IssuedCurrency.
   *
   * @see https://xrpl.org/trustset.html
   *
   * TODO (tedkalaw): Implement qualityIn/qualityOut.
   *
   * @param issuerXAddress The X-Address of the issuer to extend trust to.
   * @param currencyName The currency to this trust line applies to, as a three-letter ISO 4217 Currency Code  or a 160-bit hex value according to currency format.
   * @param amount Decimal representation of the limit to set on this trust line.
   * @param wallet The
   */
  public async createTrustline(
    issuerXAddress: string,
    currencyName: string,
    amount: string,
    wallet: Wallet,
  ): Promise<TransactionResult> {
    if (!XrpUtils.isValidXAddress(issuerXAddress)) {
      throw XrpError.xAddressRequired
    }

    const issuerAccountAddress = new AccountAddress()
    issuerAccountAddress.setAddress(issuerXAddress)

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
}
