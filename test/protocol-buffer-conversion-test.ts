import { assert } from 'chai'
import XRPCurrency from '../src/xrp-currency'
import { Currency } from '../src/generated/web/org/xrpl/rpc/v1/amount_pb'

describe('Protocol Buffer Conversion', function(): void {
  it('Convert Currency protobuf to XRPCurrency object', function(): void {
    // GIVEN a Currency protocol buffer with a code and a name.
    const currencyCode: Uint8Array = new Uint8Array([1, 2, 3])
    const currencyName = 'abc'
    const currencyProto: Currency = new Currency()
    currencyProto.setCode(currencyCode)
    currencyProto.setName(currencyName)
    // WHEN the protocol buffer is converted to a native Typescript type.
    const currency = new XRPCurrency(currencyProto)

    // THEN the currency converted as expected.
    assert.deepEqual(currency.code, currencyProto.getCode())
    assert.deepEqual(currency.name, currencyProto.getName())
  })
})
