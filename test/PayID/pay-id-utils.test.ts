import { assert } from 'chai'

import { PayIdUtils } from '../../src/index'
import 'mocha'

describe('PayIdUtils', function (): void {
  it('parse PayID - valid', function (): void {
    // GIVEN a PayID with a host and a path.
    const host = 'xpring.money'
    const path = 'georgewashington'
    const rawPayID = `${path}$${host}`

    // WHEN it is parsed to components.
    const payIDComponents = PayIdUtils.parsePayId(rawPayID)

    // THEN the host and path are set correctly.
    assert.equal(payIDComponents?.host, host)
    assert.equal(payIDComponents?.path, `/${path}`)
  })

  it('parse PayID - valid multiple dollar signs', function (): void {
    // GIVEN a PayID with more than one '$'.
    const host = 'xpring.money'
    const path = 'george$$$washington$'
    const rawPayID = `${path}$${host}`

    // WHEN it is parsed to components.
    const payIDComponents = PayIdUtils.parsePayId(rawPayID)

    // THEN the host and path are set correctly.
    assert.equal(payIDComponents?.host, host)
    assert.equal(payIDComponents?.path, `/${path}`)
  })

  it('parse PayID - invalid multiple dollar signs (ends with $)', function (): void {
    // GIVEN a PayID in which the host ends with a $.
    const host = 'xpring.money$'
    const path = 'george$$$washington$'
    const rawPayID = `${path}$${host}`

    // WHEN it is parsed to components.
    const payIDComponents = PayIdUtils.parsePayId(rawPayID)

    // THEN the PayID failed to parse.
    assert.isUndefined(payIDComponents)
  })

  it('parse PayID - no dollar signs', function (): void {
    // GIVEN a PayID that contains no dollar signs
    const rawPayID = `georgewashington@xpring.money`

    // WHEN it is parsed to components.
    const payIDComponents = PayIdUtils.parsePayId(rawPayID)

    // THEN the PayID failed to parse.
    assert.isUndefined(payIDComponents)
  })

  it('parse PayID - empty host', function (): void {
    // GIVEN a PayID with an empty host.
    const host = ''
    const path = 'georgewashington'
    const rawPayID = `${path}$${host}`

    // WHEN it is parsed to components.
    const payIDComponents = PayIdUtils.parsePayId(rawPayID)

    // THEN the PayID failed to parse.
    assert.isUndefined(payIDComponents)
  })

  it('parse PayID - empty path', function (): void {
    // GIVEN a PayID with an empty path.
    const host = 'xpring.money'
    const path = ''
    const rawPayID = `${path}$${host}`

    // WHEN it is parsed to components.
    const payIDComponents = PayIdUtils.parsePayId(rawPayID)

    // THEN the PayID failed to parse.
    assert.isUndefined(payIDComponents)
  })

  it('parse PayID - non-ascii characters', function (): void {
    // GIVEN a PayID with non-ascii characters.
    const rawPayID = 'ZA̡͊͠͝LGΌIS̯͈͕̹̘̱ͮ$TO͇̹̺ͅƝ̴ȳ̳TH̘Ë͖́̉ ͠P̯͍̭O̚N̐Y̡'

    // WHEN it is parsed to components THEN the result is undefined
    assert.isUndefined(PayIdUtils.parsePayId(rawPayID))
  })
})
