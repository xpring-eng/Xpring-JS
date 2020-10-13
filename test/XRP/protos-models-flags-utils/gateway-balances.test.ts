import { assert } from 'chai'

import GatewayBalances from '../../../src/XRP/shared/gateway-balances'
import 'mocha'
import { GatewayBalancesResponse } from '../../../src/XRP/shared/rippled-json-rpc-schema'

describe('GatewayBalances Conversion Tests', function (): void {
  it('GatewayBalances from GatewayBalancesResponse - all fields present', function (): void {
    // GIVEN a raw JSON GatewayBalancesResponse
    const testGatewayBalancesResponse: GatewayBalancesResponse = {
      result: {
        account: 'rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q',
        assets: {
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
        },
        balances: {
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
        },
        ledger_hash:
          '980FECF48CA4BFDEC896692C31A50D484BDFE865EC101B00259C413AA3DBD672',
        ledger_index: 14483212,
        obligations: {
          BTC: '5908.324927635318',
          EUR: '992471.7419793958',
          GBP: '4991.38706013193',
          USD: '1997134.20229482',
        },
        status: 'success',
        validated: true,
      },
    }
    // WHEN a GatewayBalances object is constructed from it
    const gatewayBalances = new GatewayBalances(testGatewayBalancesResponse)

    // THEN the result is as expected.
    const expectedGatewayBalances: GatewayBalances = {
      account: 'rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q',
      ledgerHash:
        '980FECF48CA4BFDEC896692C31A50D484BDFE865EC101B00259C413AA3DBD672',
      ledgerIndex: 14483212,
      assets: {
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
      },
      balances: {
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
      },
      obligations: {
        BTC: '5908.324927635318',
        EUR: '992471.7419793958',
        GBP: '4991.38706013193',
        USD: '1997134.20229482',
      },
    }
    assert.deepEqual(gatewayBalances, expectedGatewayBalances)
  })

  it('GatewayBalances from GatewayBalancesResponse - missing some optional fields', function (): void {
    // GIVEN a raw JSON GatewayBalancesResponse
    const testGatewayBalancesResponse: GatewayBalancesResponse = {
      result: {
        account: 'rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q',
        balances: {
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
        },
        ledger_index: 14483212,
        obligations: {
          BTC: '5908.324927635318',
          EUR: '992471.7419793958',
          GBP: '4991.38706013193',
          USD: '1997134.20229482',
        },
        status: 'success',
        validated: true,
      },
    }
    // WHEN a GatewayBalances object is constructed from it
    const gatewayBalances = new GatewayBalances(testGatewayBalancesResponse)

    // THEN the result is as expected.
    const expectedGatewayBalances: GatewayBalances = {
      account: 'rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q',
      ledgerHash: undefined,
      ledgerIndex: 14483212,
      assets: undefined,
      balances: {
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
      },
      obligations: {
        BTC: '5908.324927635318',
        EUR: '992471.7419793958',
        GBP: '4991.38706013193',
        USD: '1997134.20229482',
      },
    }
    assert.deepEqual(gatewayBalances, expectedGatewayBalances)
  })

  it('GatewayBalances from GatewayBalancesResponse - throws if ledger not validated', function (): void {
    // GIVEN a raw JSON GatewayBalancesResponse with validated field set to false
    const testGatewayBalancesResponse: GatewayBalancesResponse = {
      result: {
        account: 'rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q',
        balances: {
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
        },
        ledger_index: 14483212,
        obligations: {
          BTC: '5908.324927635318',
          EUR: '992471.7419793958',
          GBP: '4991.38706013193',
          USD: '1997134.20229482',
        },
        status: 'success',
        validated: false,
      },
    }
    // WHEN a GatewayBalances object is constructed from it THEN an error is thrown.
    assert.throws(() => {
      new GatewayBalances(testGatewayBalancesResponse)
    })
  })

  it('GatewayBalances from GatewayBalancesResponse - throws if account is missing', function (): void {
    // GIVEN a raw JSON GatewayBalancesResponse missing the account field
    const testGatewayBalancesResponse: GatewayBalancesResponse = {
      result: {
        balances: {
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
        },
        ledger_index: 14483212,
        obligations: {
          BTC: '5908.324927635318',
          EUR: '992471.7419793958',
          GBP: '4991.38706013193',
          USD: '1997134.20229482',
        },
        status: 'success',
        validated: false,
      },
    }
    // WHEN a GatewayBalances object is constructed from it THEN an error is thrown.
    assert.throws(() => {
      new GatewayBalances(testGatewayBalancesResponse)
    })
  })
})
