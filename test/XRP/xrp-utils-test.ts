import { assert } from 'chai'	
import BigNumber from 'bignumber.js'	
import { dropsToXrp, xrpToDrops } from '../../src/XRP/xrp-utils'	
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
})
