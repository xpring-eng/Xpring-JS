/* eslint-disable no-bitwise -- Explicitly testing bitwise flags in this file */
import { assert } from 'chai'

import RippledFlags from '../../src/XRP/rippled-flags'
import 'mocha'

describe('rippled flags', function (): void {
  it('check - flag present', function (): void {
    // GIVEN a set of flags that contains the tfPartialPayment flag.
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- 1 and 4 are arbitrary chosen
    const flags = RippledFlags.TF_PARTIAL_PAYMENT | 1 | 4

    // WHEN the presence of tfPartialPayment is checked THEN the flag is reported as present.
    assert.isTrue(
      RippledFlags.checkFlag(RippledFlags.TF_PARTIAL_PAYMENT, flags),
    )
  })

  it('check - flag notpresent', function (): void {
    // GIVEN a set of flags that does not contain the tfPartialPayment flag.
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- 1 and 4 are arbitrary chosen
    const flags = 1 | 4

    // WHEN the presence of tfPartialPayment is checked THEN the flag is reported as not present.
    assert.isFalse(
      RippledFlags.checkFlag(RippledFlags.TF_PARTIAL_PAYMENT, flags),
    )
  })
})
