//import { assert } from 'chai'
import 'mocha'

import { XrplNetwork } from 'xpring-common-js'
import IssuedCurrencyClient from '../../src/XRP/issued-currency-client'

describe('Issued Currency Client', function (): void {
  it('getAccountTrustLines - initial test', async function (): Promise<void> {
    const issuedCurrencyClient = new IssuedCurrencyClient(XrplNetwork.Test)

    console.log('testing123')
    const response = await issuedCurrencyClient.getAccountTrustLines(
      'doesntmatter',
    )
    console.log(response)
  })
})
