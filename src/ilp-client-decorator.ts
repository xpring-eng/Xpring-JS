import { BigInteger } from "big-integer";

export interface IlpClientDecorator {

  /**
   * Retrieve the balance for the given address.
   *
   * @param address The X-Address to retrieve a balance for.
   * @returns A `BigInteger` representing the number of drops of XRP in the account.
   */
  getBalance(address: string): Promise<BigInteger>

  /**
   * Send the given amount of XRP from the source wallet to the destination address.
   *
   * @param amount A `BigInteger`, number or numeric string representing the number of drops to send.
   * @param paymentPointer the payment pointer to receive funds
   * @param sender the ILP account sending the funds
   * @returns A promise which resolves to a string representing the hash of the submitted transaction.
   */
  send(
    amount: BigInteger | number | string,
    paymentPointer: string,
    sender: string,
  ): Promise<BigInteger>
}