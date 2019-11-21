import { Wallet } from "xpring-common-js";
import { XpringClientDecorator } from "./xpring-client-decorator";
import DefaultXpringClient from "./default-xpring-client";

/* global BigInt */

/**
 * XpringClient is a client which interacts with the Xpring platform.
 */
class XpringClient implements XpringClientDecorator {
  private readonly decoratedClient: XpringClientDecorator;

  /**
   * Create a new XpringClient.
   *
   * The XpringClient will use gRPC to communicate with the given endpoint.
   *
   * @param grpcURL The URL of the gRPC instance to connect to.
   */
  public constructor(grpcURL: string) {
    this.decoratedClient = DefaultXpringClient.defaultXpringClientWithEndpoint(
      grpcURL
    );
  }

  /**
   * Retrieve the balance for the given address.
   *
   * @param address The X-Address to retrieve a balance for.
   * @returns A `BigInt` representing the number of drops of XRP in the account.
   */
  public async getBalance(address: string): Promise<BigInt> {
    return await this.decoratedClient.getBalance(address);
  }

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
    return await this.decoratedClient.send(amount, destination, sender);
  }
}

export default XpringClient;
