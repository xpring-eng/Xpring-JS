import bigInt, { BigInteger } from 'big-integer'
import { GetBalanceResponse } from '../../generated/node/ilp/get_balance_response_pb'

/**
 * Response object for requests to get an account's balance
 */
export class AccountBalance {
  /**
   * The accountId for this account balance.
   */
  readonly accountId: string

  /**
   * Currency code or other asset identifier that this account's balances will be denominated in
   */
  readonly assetCode: string

  /**
   * Interledger amounts are integers, but most currencies are typically represented as # fractional units, e.g. cents.
   * This property defines how many Interledger units make # up one regular unit. For dollars, this would usually be set
   * to 9, so that Interledger # amounts are expressed in nano-dollars.
   *
   * This is an int representing this account's asset scale.
   */
  readonly assetScale: number

  /**
   * The amount of units representing the clearing position this Connector operator holds with the account owner. A
   * positive clearing balance indicates the Connector operator has an outstanding liability (i.e., owes money) to the
   * account holder. A negative clearing balance represents an asset (i.e., the account holder owes money to the
   * operator).
   *
   * A BigInteger representing the net clearing balance of this account.
   */
  readonly clearingBalance: BigInteger

  /**
   * The number of units that the account holder has prepaid. This value is factored into the value returned by
   * netBalance(), and is generally never negative.
   *
   * A BigInteger representing the number of units the counterparty (i.e., owner of this account) has
   * prepaid with this Connector.
   */
  readonly prepaidAmount: BigInteger

  /**
   * The amount of units representing the aggregate position this Connector operator holds with the account owner. A
   * positive balance indicates the Connector operator has an outstanding liability (i.e., owes money) to the account
   * holder. A negative balance represents an asset (i.e., the account holder owes money to the operator). This value is
   * the sum of the clearing balance and the prepaid amount.
   *
   * A BigInteger representing the net clearingBalance of this account.
   */
  readonly netBalance: BigInteger

  /**
   * Private constructor to initialize an AccountBalance
   */
  constructor(options: {
    accountId: string
    assetCode: string
    assetScale: number
    clearingBalance: BigInteger
    prepaidAmount: BigInteger
  }) {
    this.accountId = options.accountId
    this.assetCode = options.assetCode
    this.assetScale = options.assetScale
    this.clearingBalance = options.clearingBalance
    this.prepaidAmount = options.prepaidAmount
    this.netBalance = options.clearingBalance.add(options.prepaidAmount)
  }

  /**
   * Constructs an AccountBalance from a GetBalanceResponse
   *
   * @param getBalanceResponse a GetBalanceResponse (protobuf object) whose field values will be used
   *                           to construct an AccountBalance
   * @return an AccountBalance with its fields set via the analogous protobuf fields.
   */
  static from(getBalanceResponse: GetBalanceResponse): AccountBalance {
    return new AccountBalance({
      accountId: getBalanceResponse.getAccountId(),
      assetCode: getBalanceResponse.getAssetCode(),
      assetScale: getBalanceResponse.getAssetScale(),
      clearingBalance: bigInt(getBalanceResponse.getClearingBalance()),
      prepaidAmount: bigInt(getBalanceResponse.getPrepaidAmount()),
    })
  }
}

export default AccountBalance
