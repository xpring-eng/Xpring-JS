import { BigInteger } from 'big-integer'
import { GetBalanceResponse } from './generated/web/ilp/get_balance_response_pb'

export interface IlpClientDecorator {
  /**
   * Retrieve the balance for the given address.
   *
   * @param address The ILP address to retrieve a balance for.
   * @returns A `BigInteger` representing the number of drops of XRP in the account.
   */
  getBalance(address: string, bearerToken: string): Promise<GetBalanceResponse>

  /**
   * Send the given amount of XRP from the source wallet to the destination address.
   *
   * @param amount A `BigInteger`, number or numeric string representing the number of drops to send.
   * @param paymentPointer the payment pointer to receive funds
   * @param sender the ILP account sending the funds
   * @returns A promise which resolves to a `BigInteger` of the amount that was delivered to the recipient
   */
  send(
    amount: BigInteger | number | string,
    paymentPointer: string,
    sender: string,
  ): Promise<BigInteger>
}
