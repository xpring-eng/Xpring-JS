import { Wallet } from "xpring-common-js";

/** A decorator interface for XpringClients. */
export interface XpringClientDecorator {
  /**
   * Retrieve the balance for the given address.
   *
   * @param address The X-Address to retrieve a balance for.
   * @returns A `BigInt` representing the number of drops of XRP in the account.
   */

  getBalance(address: string): Promise<BigInt>;

  /**
   * Send the given amount of XRP from the source wallet to the destination address.
   *
   * @param drops A `BigInt`, number or numeric string representing the number of drops to send.
   * @param destination A destination address to send the drops to.
   * @param sender The wallet that XRP will be sent from and which will sign the request.
   * @returns A promise which resolves to a string representing the hash of the submitted transaction.
   */
  send(
    amount: BigInt | number | string,
    destination: string,
    sender: Wallet
  ): Promise<string>;
}
