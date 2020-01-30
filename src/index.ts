import { Wallet } from 'xpring-common-js'
import { BigInteger } from 'big-integer'
import { XpringClientDecorator } from './utils/xpring-client-decorator'
import LegacyDefaultXpringClient from './legacy'
import TransactionStatus from './utils/transaction-status'
import ReliableSubmissionXpringClient from './clients/reliable-submission'
import DefaultXpringClient from './clients/default'

export {
  AccountInfo,
  ClassicAddress,
  SubmitSignedTransactionResponse,
  XRPAmount,
  Wallet,
  WalletGenerationResult,
  Utils,
} from 'xpring-common-js'

/**
 * XpringClient is a client which interacts with the Xpring platform.
 */
class XpringClient {
  private readonly decoratedClient: XpringClientDecorator

  /**
   * Create a new XpringClient.
   *
   * The XpringClient will use gRPC to communicate with the given endpoint.
   *
   * @param grpcURL The URL of the gRPC instance to connect to.
   * @param useNewProtocolBuffers If `true`, then the new protocol buffer implementation from rippled will be used. Defaults to false.
   * @param forceWeb If `true`, then we will use the gRPC-Web client even when on Node. Defaults to false. This is mainly for testing and in the future will be removed when we have browser testing.
   */
  public constructor(
    grpcURL: string,
    useNewProtocolBuffers = false,
    forceWeb = false,
  ) {
    const defaultXpringClient = useNewProtocolBuffers
      ? DefaultXpringClient.defaultXpringClientWithEndpoint(grpcURL, forceWeb)
      : LegacyDefaultXpringClient.defaultXpringClientWithEndpoint(
          grpcURL,
          forceWeb,
        )

    this.decoratedClient = new ReliableSubmissionXpringClient(
      defaultXpringClient,
    )
  }

  /**
   * Retrieve the balance for the given address.
   *
   * @param address The X-Address to retrieve a balance for.
   * @returns A `BigInteger` representing the number of drops of XRP in the account.
   */
  public async getBalance(address: string): Promise<BigInteger> {
    return this.decoratedClient.getBalance(address)
  }

  /**
   * Retrieve the transaction status for a given transaction hash.
   *
   * @param transactionHash The hash of the transaction.
   * @returns The status of the given transaction.
   */
  public async getTransactionStatus(
    transactionHash: string,
  ): Promise<TransactionStatus> {
    return this.decoratedClient.getTransactionStatus(transactionHash)
  }

  /**
   * Send the given amount of XRP from the source wallet to the destination address.
   *
   * @param drops A `BigInteger`, number or numeric string representing the number of drops to send.
   * @param destination A destination address to send the drops to.
   * @param sender The wallet that XRP will be sent from and which will sign the request.
   * @returns A promise which resolves to a string representing the hash of the submitted transaction.
   */
  public async send(
    amount: BigInteger | number | string,
    destination: string,
    sender: Wallet,
  ): Promise<string> {
    return this.decoratedClient.send(amount, destination, sender)
  }
}

export default XpringClient
