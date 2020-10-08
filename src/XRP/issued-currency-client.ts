import { Wallet, XrplNetwork } from 'xpring-common-js'
import GrpcNetworkClient from './network-clients/grpc-xrp-network-client'
import GrpcNetworkClientWeb from './network-clients/grpc-xrp-network-client.web'
import { XrpNetworkClient } from './network-clients/xrp-network-client'
import isNode from '../Common/utils'
import CoreXrplClient from './core-xrpl-client'
import { LimitAmount } from './Generated/web/org/xrpl/rpc/v1/common_pb'
import XrpUtils from './shared/xrp-utils'
import { TransactionResult, XrpError } from './shared'
import { AccountAddress } from './Generated/web/org/xrpl/rpc/v1/account_pb'
import {
  Currency,
  CurrencyAmount,
  IssuedCurrencyAmount,
} from './Generated/web/org/xrpl/rpc/v1/amount_pb'
import { TrustSet } from './Generated/web/org/xrpl/rpc/v1/transaction_pb'

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
    network: XrplNetwork,
    forceWeb = false,
  ): IssuedCurrencyClient {
    return isNode() && !forceWeb
      ? new IssuedCurrencyClient(new GrpcNetworkClient(grpcUrl), network)
      : new IssuedCurrencyClient(new GrpcNetworkClientWeb(grpcUrl), network)
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
    private readonly networkClient: XrpNetworkClient,
    readonly network: XrplNetwork,
  ) {
    this.coreXrplClient = new CoreXrplClient(networkClient, network)
  }

  public shutUpCompiler(): void {
    console.log(this.networkClient)
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
    // TODO (tedkalaw): Support other types of amounts.
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

    return await this.coreXrplClient.getTransactionResult(transactionHash)
  }
}
