import { Wallet, XrplNetwork } from 'xpring-common-js'
import GrpcNetworkClient from './network-clients/grpc-xrp-network-client'
import GrpcNetworkClientWeb from './network-clients/grpc-xrp-network-client.web'
import { XrpNetworkClient } from './network-clients/xrp-network-client'
import isNode from '../Common/utils'
import CoreXrplClient from './core-xrpl-client'
import { AccountSetFlag } from './shared/account-set-flag'
import { SetFlag } from './Generated/web/org/xrpl/rpc/v1/common_pb'
import { AccountSet } from './Generated/web/org/xrpl/rpc/v1/transaction_pb'
import TransactionResult from './shared/transaction-result'

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
    networkClient: XrpNetworkClient,
    readonly network: XrplNetwork,
  ) {
    this.coreXrplClient = new CoreXrplClient(networkClient, network)
  }

  /**
   * Enable Require Authorization for this XRPL account.
   *
   * @see https://xrpl.org/become-an-xrp-ledger-gateway.html#require-auth
   *
   * @param wallet The wallet associated with the XRPL account enabling Require Authorization and that will sign the request.
   * @returns A promise which resolves to a TransactionResult object that contains the hash of the submitted AccountSet transaction,
   *          the final status, and whether the transaction was included in a validated ledger.
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
}
