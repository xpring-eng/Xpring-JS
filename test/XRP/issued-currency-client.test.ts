//import { assert } from 'chai'
import 'mocha'

import { XrplNetwork } from 'xpring-common-js'
import IssuedCurrencyClient from '../../src/XRP/issued-currency-client'

describe('Issued Currency Client', function (): void {
  it('getAccountTrustLines - initial test', function (): void {
    const issuedCurrencyClient = new IssuedCurrencyClient(XrplNetwork.Test)

    issuedCurrencyClient.getAccountTrustLines('doesntmatter')
  })
})
