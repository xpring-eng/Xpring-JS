import { assert } from 'chai'
import BigNumber from 'bignumber.js'
import { dropsToXrp, xrpToDrops } from '../../src/Common/utils'
import 'mocha'

describe('xrp-drops-conversion', function (): void {
  // xrpToDrops and dropsToXrp tests
  it('dropsToXrp() - works with a typical amount', function (): void {
    // GIVEN a typical, valid drops value, WHEN converted to xrp
    const xrp = dropsToXrp('2000000')

    // THEN the conversion is as expected
    assert.strictEqual(xrp, '2', '2 million drops equals 2 XRP')
  })

  it('dropsToXrp() - works with fractions', function (): void {
    // GIVEN drops amounts that convert to fractional xrp amounts
    // WHEN converted to xrp THEN the conversion is as expected
    let xrp = dropsToXrp('3456789')
    assert.strictEqual(xrp, '3.456789', '3,456,789 drops equals 3.456789 XRP')

    xrp = dropsToXrp('3400000')
    assert.strictEqual(xrp, '3.4', '3,400,000 drops equals 3.4 XRP')

    xrp = dropsToXrp('1')
    assert.strictEqual(xrp, '0.000001', '1 drop equals 0.000001 XRP')

    xrp = dropsToXrp('1.0')
    assert.strictEqual(xrp, '0.000001', '1.0 drops equals 0.000001 XRP')

    xrp = dropsToXrp('1.00')
    assert.strictEqual(xrp, '0.000001', '1.00 drops equals 0.000001 XRP')
  })

  it('dropsToXrp() - works with zero', function (): void {
    // GIVEN several equivalent representations of zero
    // WHEN converted to xrp, THEN the result is zero
    let xrp = dropsToXrp('0')
    assert.strictEqual(xrp, '0', '0 drops equals 0 XRP')

    // negative zero is equivalent to zero
    xrp = dropsToXrp('-0')
    assert.strictEqual(xrp, '0', '-0 drops equals 0 XRP')

    xrp = dropsToXrp('0.00')
    assert.strictEqual(xrp, '0', '0.00 drops equals 0 XRP')

    xrp = dropsToXrp('000000000')
    assert.strictEqual(xrp, '0', '000000000 drops equals 0 XRP')
  })

  it('dropsToXrp() - works with a negative value', function (): void {
    // GIVEN a negative drops amount
    // WHEN converted to xrp
    const xrp = dropsToXrp('-2000000')

    // THEN the conversion is also negative
    assert.strictEqual(xrp, '-2', '-2 million drops equals -2 XRP')
  })

  it('dropsToXrp() - works with a value ending with a decimal point', function (): void {
    // GIVEN a positive or negative drops amount that ends with a decimal point
    // WHEN converted to xrp THEN the conversion is successful and correct
    let xrp = dropsToXrp('2000000.')
    assert.strictEqual(xrp, '2', '2000000. drops equals 2 XRP')

    xrp = dropsToXrp('-2000000.')
    assert.strictEqual(xrp, '-2', '-2000000. drops equals -2 XRP')
  })

  it('dropsToXrp() - works with BigNumber objects', function (): void {
    // GIVEN drops amounts represented as BigNumber objects
    // WHEN converted to xrp THEN the conversions are correct and successful
    let xrp = dropsToXrp(new BigNumber(2000000))
    assert.strictEqual(xrp, '2', '(BigNumber) 2 million drops equals 2 XRP')

    xrp = dropsToXrp(new BigNumber(-2000000))
    assert.strictEqual(xrp, '-2', '(BigNumber) -2 million drops equals -2 XRP')

    xrp = dropsToXrp(new BigNumber(2345678))
    assert.strictEqual(
      xrp,
      '2.345678',
      '(BigNumber) 2,345,678 drops equals 2.345678 XRP',
    )

    xrp = dropsToXrp(new BigNumber(-2345678))
    assert.strictEqual(
      xrp,
      '-2.345678',
      '(BigNumber) -2,345,678 drops equals -2.345678 XRP',
    )
  })

  it('dropsToXrp() - works with a number', function (): void {
    // This is not recommended. Use strings or BigNumber objects to avoid precision errors.

    // GIVEN a drops amount represented as a positive or negative number
    // WHEN converted to xrp THEN the conversion is correct and successful
    let xrp = dropsToXrp(2000000)
    assert.strictEqual(xrp, '2', '(number) 2 million drops equals 2 XRP')

    xrp = dropsToXrp(-2000000)
    assert.strictEqual(xrp, '-2', '(number) -2 million drops equals -2 XRP')
  })

  it('dropsToXrp() - throws with an amount with too many decimal places', function (): void {
    assert.throws(() => {
      dropsToXrp('1.2')
    }, /has too many decimal places/)

    assert.throws(() => {
      dropsToXrp('0.10')
    }, /has too many decimal places/)
  })

  it('dropsToXrp() - throws with an invalid value', function (): void {
    // GIVEN invalid drops values, WHEN converted to xrp, THEN an error is thrown
    assert.throws(() => {
      dropsToXrp('FOO')
    }, /invalid value/)

    assert.throws(() => {
      dropsToXrp('1e-7')
    }, /invalid value/)

    assert.throws(() => {
      dropsToXrp('2,0')
    }, /invalid value/)

    assert.throws(() => {
      dropsToXrp('.')
    }, /dropsToXrp: invalid value '\.', should be a BigNumber or string-encoded number\./)
  })

  it('dropsToXrp() - throws with an amount more than one decimal point', function (): void {
    // GIVEN invalid drops values that contain more than one decimal point
    // WHEN converted to xrp THEN an error is thrown
    assert.throws(() => {
      dropsToXrp('1.0.0')
    }, /dropsToXrp: invalid value '1\.0\.0'/)

    assert.throws(() => {
      dropsToXrp('...')
    }, /dropsToXrp: invalid value '\.\.\.'/)
  })

  it('xrpToDrops() - works with a typical amount', function (): void {
    // GIVEN an xrp amoun that is typical and valid
    // WHEN converted to drops
    const drops = xrpToDrops('2')

    // THEN the conversion is successful and correct
    assert.strictEqual(drops, '2000000', '2 XRP equals 2 million drops')
  })

  it('xrpToDrops() - works with fractions', function (): void {
    // GIVEN xrp amounts that are fractional
    // WHEN converted to drops THEN the conversions are successful and correct
    let drops = xrpToDrops('3.456789')
    assert.strictEqual(drops, '3456789', '3.456789 XRP equals 3,456,789 drops')
    drops = xrpToDrops('3.400000')
    assert.strictEqual(drops, '3400000', '3.400000 XRP equals 3,400,000 drops')
    drops = xrpToDrops('0.000001')
    assert.strictEqual(drops, '1', '0.000001 XRP equals 1 drop')
    drops = xrpToDrops('0.0000010')
    assert.strictEqual(drops, '1', '0.0000010 XRP equals 1 drop')
  })

  it('xrpToDrops() - works with zero', function (): void {
    // GIVEN xrp amounts that are various equivalent representations of zero
    // WHEN converted to drops THEN the conversions are equal to zero
    let drops = xrpToDrops('0')
    assert.strictEqual(drops, '0', '0 XRP equals 0 drops')
    drops = xrpToDrops('-0') // negative zero is equivalent to zero
    assert.strictEqual(drops, '0', '-0 XRP equals 0 drops')
    drops = xrpToDrops('0.000000')
    assert.strictEqual(drops, '0', '0.000000 XRP equals 0 drops')
    drops = xrpToDrops('0.0000000')
    assert.strictEqual(drops, '0', '0.0000000 XRP equals 0 drops')
  })

  it('xrpToDrops() - works with a negative value', function (): void {
    // GIVEN a negative xrp amount
    // WHEN converted to drops THEN the conversion is also negative
    const drops = xrpToDrops('-2')
    assert.strictEqual(drops, '-2000000', '-2 XRP equals -2 million drops')
  })

  it('xrpToDrops() - works with a value ending with a decimal point', function (): void {
    // GIVEN an xrp amount that ends with a decimal point
    // WHEN converted to drops THEN the conversion is correct and successful
    let drops = xrpToDrops('2.')
    assert.strictEqual(drops, '2000000', '2. XRP equals 2000000 drops')
    drops = xrpToDrops('-2.')
    assert.strictEqual(drops, '-2000000', '-2. XRP equals -2000000 drops')
  })

  it('xrpToDrops() - works with BigNumber objects', function (): void {
    // GIVEN an xrp amount represented as a BigNumber object
    // WHEN converted to drops THEN the conversion is correct and successful
    let drops = xrpToDrops(new BigNumber(2))
    assert.strictEqual(
      drops,
      '2000000',
      '(BigNumber) 2 XRP equals 2 million drops',
    )
    drops = xrpToDrops(new BigNumber(-2))
    assert.strictEqual(
      drops,
      '-2000000',
      '(BigNumber) -2 XRP equals -2 million drops',
    )
  })

  it('xrpToDrops() - works with a number', function (): void {
    // This is not recommended. Use strings or BigNumber objects to avoid precision errors.

    // GIVEN an xrp amounts represented as a number (positive and negative)
    // WHEN converted to drops THEN the conversions are successful and correct
    let drops = xrpToDrops(2)
    assert.strictEqual(
      drops,
      '2000000',
      '(number) 2 XRP equals 2 million drops',
    )
    drops = xrpToDrops(-2)
    assert.strictEqual(
      drops,
      '-2000000',
      '(number) -2 XRP equals -2 million drops',
    )
  })

  it('xrpToDrops() - throws with an amount with too many decimal places', function (): void {
    // GIVEN an xrp amount with too many decimal places
    // WHEN converted to a drops amount THEN an error is thrown
    assert.throws(() => {
      xrpToDrops('1.1234567')
    }, /has too many decimal places/)
    assert.throws(() => {
      xrpToDrops('0.0000001')
    }, /has too many decimal places/)
  })

  it('xrpToDrops() - throws with an invalid value', function (): void {
    // GIVEN xrp amounts represented as various invalid values
    // WHEN converted to drops THEN an error is thrown
    assert.throws(() => {
      xrpToDrops('FOO')
    }, /invalid value/)
    assert.throws(() => {
      xrpToDrops('1e-7')
    }, /invalid value/)
    assert.throws(() => {
      xrpToDrops('2,0')
    }, /invalid value/)
    assert.throws(() => {
      xrpToDrops('.')
    }, /xrpToDrops: invalid value '\.', should be a BigNumber or string-encoded number\./)
  })

  it('xrpToDrops() - throws with an amount more than one decimal point', function (): void {
    // GIVEN an xrp amount with more than one decimal point, or all decimal points
    // WHEN converted to drops THEN an error is thrown
    assert.throws(() => {
      xrpToDrops('1.0.0')
    }, /xrpToDrops: invalid value '1\.0\.0'/)
    assert.throws(() => {
      xrpToDrops('...')
    }, /xrpToDrops: invalid value '\.\.\.'/)
  })
})
