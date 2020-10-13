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
          ],
          rPFLkxQk6xUGdGYEykqe7PR25Gr7mLHDc8: [
            {
              currency: 'EUR',
              value: '4000000000000000e-27',
            },
          ],
          rPU6VbckqCLW4kb51CWqZdxvYyQrQVsnSj: [
            {
              currency: 'BTC',
              value: '1029900000000000e-26',
            },
          ],
          rpR95n1iFkTqpoy1e878f4Z1pVHVtWKMNQ: [
            {
              currency: 'BTC',
              value: '4000000000000000e-30',
            },
          ],
          rwmUaXsWtXU4Z843xSYwgt1is97bgY8yj6: [
            {
              currency: 'BTC',
              value: '8700000000000000e-30',
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
    assert.exists(gatewayBalances)
  })
})
