import { Wallet, XrplNetwork } from 'xpring-common-js'
import GrpcNetworkClient from './network-clients/grpc-xrp-network-client'
import GrpcNetworkClientWeb from './network-clients/grpc-xrp-network-client.web'
import { XrpNetworkClient } from './network-clients/xrp-network-client'
import isNode from '../Common/utils'
import CoreXrplClient from './core-xrpl-client'
import { AccountSetFlag } from './shared/account-set-flag'
import { SetFlag, ClearFlag } from './Generated/web/org/xrpl/rpc/v1/common_pb'
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
   * Helper function. Sets/clears a flag value.
   * @param flag The desired flag that is being changed.
   * @param enable Whether the flag is being enabled (true if enabling, false if disabling).
   * @param wallet The wallet associated with the XRPL account enabling Require Authorization and that will sign the request.
   * @returns A promise which resolves to a TransactionResult object that represents the result of this transaction.
   */
  private async changeFlag(
    flag: number,
    enable: boolean,
    wallet: Wallet,
  ): Promise<TransactionResult> {
    const accountSet = new AccountSet()

    if (enable) {
      const setFlag = new SetFlag()
      setFlag.setValue(flag)
      accountSet.setSetFlag(setFlag)
    } else {
      const clearFlag = new ClearFlag()
      clearFlag.setValue(flag)
      accountSet.setClearFlag(clearFlag)
    }

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
    return this.changeFlag(AccountSetFlag.asfRequireAuth, true, wallet)
  }

  /**
   * Enable Disallow XRP for this XRPL account.
   *
   * @see https://xrpl.org/become-an-xrp-ledger-gateway.html#require-auth
   *
   * @param wallet The wallet associated with the XRPL account enabling Disallow XRP and that will sign the request.
   * @returns A promise which resolves to a TransactionResult object that represents the result of this transaction.
   */
  public async disallowIncomingXrp(wallet: Wallet): Promise<TransactionResult> {
    return this.changeFlag(AccountSetFlag.asfDisallowXRP, true, wallet)
  }
}
