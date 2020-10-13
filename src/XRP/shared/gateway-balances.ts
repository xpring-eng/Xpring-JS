import { XrpError, XrpErrorType } from '.'
import {
  GatewayBalancesResponse,
  CurrencyValuePair,
} from './rippled-json-rpc-schema'

/**
 * Represents an amount of an Issued Currency.
 */
export class IssuedCurrencyValue {
  readonly currency: string

  readonly value: string

  public constructor(currencyValuePair: CurrencyValuePair) {
    this.currency = currencyValuePair.currency
    this.value = currencyValuePair.value
  }
}

/**
 * Represents information about a gateway's issued currency balances on the XRPL, as of the most recent validated ledger version.
 * @see https://xrpl.org/gateway_balances.html
 */
export default class GatewayBalances {
  /** The address of the account that issued the balances. */
  readonly account: string

  /**
   */
  readonly assets?: { [account: string]: IssuedCurrencyValue[] }
  readonly balances?: { [account: string]: IssuedCurrencyValue[] }
  readonly obligations?: { [currencyCode: string]: string }
  readonly ledgerHash?: string | undefined
  readonly ledgerIndex?: number | undefined

  public constructor(gatewayBalancesResponse: GatewayBalancesResponse) {
    if (gatewayBalancesResponse.result.validated === false) {
      throw new XrpError(
        XrpErrorType.MalformedResponse,
        'Gateway Balances response indicates unvalidated ledger.',
      )
    }
    const account = gatewayBalancesResponse.result.account
    if (!account) {
      throw new XrpError(
        XrpErrorType.MalformedResponse,
        'gatewayBalancesResponse is missing required field `account`.',
      )
    }
    this.account = account
    this.ledgerHash = gatewayBalancesResponse.result.ledger_hash
    this.ledgerIndex = gatewayBalancesResponse.result.ledger_index
    this.assets = gatewayBalancesResponse.result.assets
    this.balances = gatewayBalancesResponse.result.balances
    this.obligations = gatewayBalancesResponse.result.obligations
  }
}
