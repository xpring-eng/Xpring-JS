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
})
