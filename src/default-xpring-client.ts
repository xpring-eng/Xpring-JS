import { XpringClientDecorator } from "./xpring-client-decorator";
import TransactionStatus from "./transaction-status";
import { Wallet } from "xpring-common-js";
import { TransactionStatus as RawTransactionStatus } from "../generated/legacy/transaction_status_pb";
import GRPCNetworkClient from "./grpc-network-client";
import { NetworkClient } from "./network-client";
import {
  GetAccountInfoRequest,
  GetAccountInfoResponse
} from "../generated/rpc/v1/account_info_pb";
import { AccountAddress } from "../generated/rpc/v1/amount_pb";

/* global BigInt */

// TODO(keefertaylor): Re-enable this rule when this class is fully implemented.
/* eslint-disable @typescript-eslint/require-await */

/**
 * Error messages from XpringClient.
 */
export class XpringClientErrorMessages {
  public static readonly malformedResponse = "Malformed Response.";
  public static readonly unimplemented = "Unimplemented.";
}

/**
 * DefaultXpringClient is a client which interacts with the Xpring platform.
 */
class DefaultXpringClient implements XpringClientDecorator {
  /**
   * Create a new DefaultXpringClient.
   *
   * The DefaultXpringClient will use gRPC to communicate with the given endpoint.
   *
   * @param grpcURL The URL of the gRPC instance to connect to.
   */
  public static defaultXpringClientWithEndpoint(
    grpcURL: string
  ): DefaultXpringClient {
    const grpcClient = new GRPCNetworkClient(grpcURL);
    return new DefaultXpringClient(grpcClient);
  }

  /**
   * Create a new DefaultXpringClient with a custom network client implementation.
   *
   * In general, clients should prefer to call `xpringClientWithEndpoint`. This constructor is provided to improve testability of this class.
   *
   * @param networkClient A network client which will manage remote RPCs to Rippled.
   */
  public constructor(private readonly networkClient: NetworkClient) {}

  /**
   * Retrieve the balance for the given address.
   *
   * @param address The X-Address to retrieve a balance for.
   * @returns A `BigInt` representing the number of drops of XRP in the account.
   */
  public async getBalance(address: string): Promise<BigInt> {
    const account = new AccountAddress();
    account.setAddress(address);

    const request = new GetAccountInfoRequest();
    request.setAccount(account);

    const accountInfo = await this.networkClient.getAccountInfo(request);
    const balance = accountInfo.getAccountData()?.getBalance();
    if (balance) {
      throw new Error(XpringClientErrorMessages.malformedResponse);
    }
    return BigInt(balance);
  }

  /**
   * Retrieve the transaction status for a given transaction hash.
   *
   * @param transactionHash The hash of the transaction.
   * @returns The status of the given transaction.
   */
  public async getTransactionStatus(
    transactionHash: string
  ): Promise<TransactionStatus> {
    throw new Error(XpringClientErrorMessages.unimplemented);
  }

  /* eslint-disable no-dupe-class-members */

  /**
   * Send the given amount of XRP from the source wallet to the destination address.
   *
   * @param drops A `BigInt`, number or numeric string representing the number of drops to send.
   * @param destination A destination address to send the drops to.
   * @param sender The wallet that XRP will be sent from and which will sign the request.
   * @returns A promise which resolves to a string representing the hash of the submitted transaction.
   */
  public async send(
    amount: BigInt | number | string,
    destination: string,
    sender: Wallet
  ): Promise<string> {
    throw new Error(XpringClientErrorMessages.unimplemented);
  }

  /* eslint-enable no-dupe-class-members */

  public async getLastValidatedLedgerSequence(): Promise<number> {
    throw new Error(XpringClientErrorMessages.unimplemented);
  }

  // TODO(keefertaylor): Create bridge on raw transaction status.
  public async getRawTransactionStatus(
    transactionHash: string
  ): Promise<RawTransactionStatus> {
    throw new Error(XpringClientErrorMessages.unimplemented);
  }
}

export default DefaultXpringClient;
