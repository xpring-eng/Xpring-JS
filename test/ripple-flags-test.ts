/* eslint-disable no-bitwise */
import { assert } from 'chai'
import RippledFlags, { checkFlag } from '../src/rippled-flags'
import 'mocha'

describe('rippled flags', function(): void {
  it('check - flag present', function(): void {
    // GIVEN a set of flags that contains the tfPartialPayment flag.
    const flags = RippledFlags.tfPartialPayment | 1 | 4 // 1 and 4 are arbitrarily chosen numbers.

    // WHEN the presence of tfPartialPayment is checked THEN the flag is reported as present.
    assert.isTrue(checkFlag(RippledFlags.tfPartialPayment, flags))
  })

  it('check - flag notpresent', function(): void {
    // GIVEN a set of flags that does not contain the tfPartialPayment flag.
    const flags = 1 | 4 // 1 and 4 are arbitrarily chosen numbers.

    // WHEN the presence of tfPartialPayment is checked THEN the flag is reported as not present.
    assert.isFalse(checkFlag(RippledFlags.tfPartialPayment, flags))
  })
})
