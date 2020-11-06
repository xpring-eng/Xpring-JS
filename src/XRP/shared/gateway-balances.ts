import { XrpUtils } from 'xpring-common-js'
import { XrpError, XrpErrorType } from '.'
import { GatewayBalancesSuccessfulResponse } from './rippled-web-socket-schema'

/**
 * Represents an amount of an Issued Currency.
 */
export interface IssuedCurrencyValue {
  readonly currency: string
  readonly value: string
}

/**
 * Represents information about a gateway's issued currency balances on the XRPL, as of the most recent validated ledger version.
 * @see https://xrpl.org/gateway_balances.html
 */
export default interface GatewayBalances {
  /**
   * The address of the account that issued the balances, encoded as an X-Address.
   * @see https://xrpaddress.info/
   */
  readonly account: string

  /**
   * (Optional, omitted if empty) Total amounts held that are issued by others.
   * In the recommended configuration, the issuing address should have none.
   */
  readonly assets?: { [account: string]: IssuedCurrencyValue[] }

  /**
   * (Optional, omitted if empty) Amounts issued to the excluded addresses from the request.
   * The keys are addresses and the values are arrays of currency amounts they hold.
   */
  readonly balances?: { [account: string]: IssuedCurrencyValue[] }

  /**
   * (Optional, omitted if empty) Total amounts issued to addresses not excluded, as a map of currencies to the total value issued.
   */
  readonly obligations?: { [currencyCode: string]: string }

  /** (May be omitted) The ledger index of the ledger version that was used to generate this response. */
  readonly ledgerHash?: string
}

export function gatewayBalancesFromResponse(
  gatewayBalancesResponse: GatewayBalancesSuccessfulResponse,
): GatewayBalances {
  const { result } = gatewayBalancesResponse

  if (!result.validated) {
    throw new XrpError(
      XrpErrorType.MalformedResponse,
      'Gateway Balances response indicates unvalidated ledger.',
    )
  }
  const account = result.account
  if (!account) {
    throw new XrpError(
      XrpErrorType.MalformedResponse,
      'gatewayBalancesResponse is missing required field `account`.',
    )
  }
  const xAddress = XrpUtils.encodeXAddress(account, undefined, true)
  if (!xAddress) {
    throw new XrpError(
      XrpErrorType.MalformedResponse,
      'Could not convert account to X-Address.',
    )
  }

  return {
    account: xAddress,
    ledgerHash: result.ledger_hash,
    assets: result.assets,
    balances: result.balances,
    obligations: result.obligations,
  }
}
