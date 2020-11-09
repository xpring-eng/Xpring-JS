import { assert } from 'chai'

import GatewayBalances, {
  gatewayBalancesFromResponse,
} from '../../../src/XRP/shared/gateway-balances'
import 'mocha'
import { XrpUtils } from 'xpring-common-js'

const testLedgerHash =
  '980FECF48CA4BFDEC896692C31A50D484BDFE865EC101B00259C413AA3DBD672'

const testLedgerIndex = 14483212

const testAssets = {
  r9F6wk8HkXrgYWoJ7fsv4VrUBVoqDVtzkH: [
    {
      currency: 'BTC',
      value: '5444166510000000e-26',
    },
    {
      currency: 'EUR',
      value: '7000000000000000e-26',
    },
  ],
  rPFLkxQk6xUGdGYEykqe7PR25Gr7mLHDc8: [
    {
      currency: 'EUR',
      value: '4000000000000000e-27',
    },
  ],
}

const testBalances = {
  rKm4uWpg9tfwbVSeATv4KxDe6mpE9yPkgJ: [
    {
      currency: 'EUR',
      value: '29826.1965999999',
    },
  ],
  ra7JkEzrgeKHdzKgo4EUUVBnxggY4z37kt: [
    {
      currency: 'USD',
      value: '13857.70416',
    },
  ],
}

const testObligations = {
  BTC: '5908.324927635318',
  EUR: '992471.7419793958',
  GBP: '4991.38706013193',
  USD: '1997134.20229482',
}

const baseResult = {
  account: 'rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q',
  obligations: testObligations,
  status: 'success',
}

const expectedAddress = XrpUtils.encodeXAddress(
  'rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q',
  undefined,
  true,
)!

describe('GatewayBalances Conversion Tests', function (): void {
  it('GatewayBalances from GatewayBalancesResponse - all fields present', function (): void {
    // GIVEN a raw JSON GatewayBalancesResponse
    const testGatewayBalancesResponse = {
      id: 'gateway_balances',
      status: 'success',
      type: 'response',
      result: {
        ...baseResult,
        assets: testAssets,
        balances: testBalances,
        ledger_hash: testLedgerHash,
        ledger_index: testLedgerIndex,
        validated: true,
      },
    }

    // WHEN a GatewayBalances object is constructed from it
    const gatewayBalances = gatewayBalancesFromResponse(
      testGatewayBalancesResponse,
    )

    // THEN the result is as expected.
    const expectedGatewayBalances: GatewayBalances = {
      account: expectedAddress,
      ledgerHash: testLedgerHash,
      assets: testAssets,
      balances: testBalances,
      obligations: testObligations,
    }
    assert.deepEqual(gatewayBalances, expectedGatewayBalances)
  })

  it('GatewayBalances from GatewayBalancesResponse - missing some optional fields', function (): void {
    // GIVEN a raw JSON GatewayBalancesResponse
    const testGatewayBalancesResponse = {
      id: 'gateway_balances',
      status: 'success',
      type: 'response',
      result: { ...baseResult, balances: testBalances, validated: true },
    }

    // WHEN a GatewayBalances object is constructed from it
    const gatewayBalances = gatewayBalancesFromResponse(
      testGatewayBalancesResponse,
    )

    // THEN the result is as expected.
    const expectedGatewayBalances: GatewayBalances = {
      account: expectedAddress,
      ledgerHash: undefined,
      assets: undefined,
      balances: testBalances,
      obligations: testObligations,
    }
    assert.deepEqual(gatewayBalances, expectedGatewayBalances)
  })

  it('GatewayBalances from GatewayBalancesResponse - throws if ledger not validated', function (): void {
    // GIVEN a raw JSON GatewayBalancesResponse with validated field set to false
    const testGatewayBalancesResponse = {
      id: 'gateway_balances',
      status: 'success',
      type: 'response',
      result: { ...baseResult, validated: false },
    }

    // WHEN a GatewayBalances object is constructed from it THEN an error is thrown.
    assert.throws(() => {
      gatewayBalancesFromResponse(testGatewayBalancesResponse)
    })
  })

  it('GatewayBalances from GatewayBalancesResponse - throws if account is missing', function (): void {
    // GIVEN a raw JSON GatewayBalancesResponse missing the account field
    const testGatewayBalancesResponse = {
      id: 'gateway_balances',
      status: 'success',
      type: 'response',
      result: { account: undefined, validated: true },
    }

    // WHEN a GatewayBalances object is constructed from it THEN an error is thrown.
    assert.throws(() => {
      gatewayBalancesFromResponse(testGatewayBalancesResponse)
    })
  })
})
