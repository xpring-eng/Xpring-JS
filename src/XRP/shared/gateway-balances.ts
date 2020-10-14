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
  readonly assets: { [account: string]: IssuedCurrencyValue[] }
  readonly balances: { [account: string]: IssuedCurrencyValue[] }
  readonly obligations: { [currencyCode: string]: string }
  readonly ledgerHash: string | undefined
  readonly ledgerIndex: number | undefined

  public constructor(gatewayBalancesResponse: GatewayBalancesResponse) {
    if (!gatewayBalancesResponse.result.validated === false) {
      throw new XrpError(
        XrpErrorType.MalformedResponse,
        'Gateway Balances response indicates unvalidated ledger.',
      )
    }
    const account = gatewayBalancesResponse.result.account
    if (!account) {
      throw XrpError.malformedResponse
    }
    this.account = account
    this.ledgerHash = gatewayBalancesResponse.result.ledger_hash
    this.ledgerIndex = gatewayBalancesResponse.result.ledger_index

    // populate assets
    const responseAssets = gatewayBalancesResponse.result.assets
    if (!responseAssets) {
      throw new XrpError(
        XrpErrorType.MalformedProtobuf,
        'Gateway Balances response is missing `assets` field.',
      )
    }
    const assets = {}
    for (const accountKey in responseAssets) {
      const currencyValuePairArray: Array<CurrencyValuePair> =
        responseAssets[accountKey]
      const issuedCurrencyValueArray: Array<IssuedCurrencyValue> = []
      for (const currencyValuePair of currencyValuePairArray) {
        const issuedCurrencyValue = new IssuedCurrencyValue(currencyValuePair)
        issuedCurrencyValueArray.push(issuedCurrencyValue)
      } // end for currencyValuePair
      assets[accountKey] = issuedCurrencyValueArray
    } // end for accountKey
    this.assets = assets

    // populate balances
    const responseBalances = gatewayBalancesResponse.result.balances
    if (!responseBalances) {
      throw new XrpError(
        XrpErrorType.MalformedProtobuf,
        'Gateway Balances response is missing `balances` field.',
      )
    }
    const balances = {}
    for (const accountKey in responseBalances) {
      const currencyValuePairArray: Array<CurrencyValuePair> =
        responseBalances[accountKey]
      const issuedCurrencyValueArray: Array<IssuedCurrencyValue> = []
      for (const currencyValuePair of currencyValuePairArray) {
        const issuedCurrencyValue = new IssuedCurrencyValue(currencyValuePair)
        issuedCurrencyValueArray.push(issuedCurrencyValue)
      } // end for currencyValuePair
      balances[accountKey] = issuedCurrencyValueArray
    } // end for accountKey
    this.balances = balances

    // populate obligations
    const responseObligations = gatewayBalancesResponse.result.obligations
    if (!responseObligations) {
      throw new XrpError(
        XrpErrorType.MalformedProtobuf,
        'Gateway Balances response is missing `obligations` field.',
      )
    }
    this.obligations = responseObligations
  }
}
