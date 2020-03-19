import { assert } from 'chai'
import bigInt from 'big-integer'
import XRPCurrency from '../src/XRP/xrp-currency'
import XRPPathElement from '../src/XRP/xrp-path-element'
import XRPPath from '../src/XRP/xrp-path'
import XRPIssuedCurrency from '../src/XRP/xrp-issued-currency'
import {
  Currency,
  IssuedCurrencyAmount,
} from '../src/generated/web/org/xrpl/rpc/v1/amount_pb'
import { Payment } from '../src/generated/web/org/xrpl/rpc/v1/transaction_pb'
import { AccountAddress } from '../src/generated/web/org/xrpl/rpc/v1/account_pb'

// TODO(amiecorso): Refactor tests to separate files.
// Set up global variables for use in test cases
const testCurrencyProto: Currency = new Currency()
testCurrencyProto.setCode(new Uint8Array([1, 2, 3]))
testCurrencyProto.setName('currencyName')

const testAccountAddress = new AccountAddress()
testAccountAddress.setAddress('r123')

const testAccountAddressIssuer = new AccountAddress()
testAccountAddressIssuer.setAddress('r456')

// Populate test PathElement
const testPathElement = new Payment.PathElement()
testPathElement.setCurrency(testCurrencyProto)
testPathElement.setAccount(testAccountAddress)
testPathElement.setIssuer(testAccountAddressIssuer)

describe('Protocol Buffer Conversion', function(): void {
  // Currency

  it('Convert Currency protobuf to XRPCurrency object', function(): void {
    // GIVEN a Currency protocol buffer with a code and a name.
    const currencyCode: Uint8Array = new Uint8Array([1, 2, 3])
    const currencyName = 'abc'
    const currencyProto: Currency = new Currency()
    currencyProto.setCode(currencyCode)
    currencyProto.setName(currencyName)

    // WHEN the protocol buffer is converted to a native Typescript type.
    const currency = XRPCurrency.from(currencyProto)

    // THEN the currency converted as expected.
    assert.deepEqual(currency.code, currencyProto.getCode())
    assert.deepEqual(currency.name, currencyProto.getName())
  })

  // PathElement

  it('Convert PathElement protobuf with all fields set to XRPPathElement', function(): void {
    // GIVEN a PathElement protocol buffer with all fields set.
    const pathElementProto = testPathElement

    // WHEN the protocol buffer is converted to a native TypeScript type.
    const pathElement = XRPPathElement.from(pathElementProto)

    // THEN the currency converted as expected.
    assert.equal(
      pathElement?.account,
      pathElementProto.getAccount()!.getAddress(),
    )
    assert.deepEqual(
      pathElement?.currency,
      XRPCurrency.from(pathElementProto.getCurrency()!),
    )
    assert.equal(
      pathElement?.issuer,
      pathElementProto.getIssuer()!.getAddress(),
    )
  })

  it('Convert PathElement protobuf with no fields set to XRPPathElement', function(): void {
    // GIVEN a PathElement protocol buffer with no fields set.
    const pathElementProto = new Payment.PathElement()

    // WHEN the protocol buffer is converted to a native TypeScript type.
    const pathElement = XRPPathElement.from(pathElementProto)

    // THEN the currency converted as expected.
    assert.isUndefined(pathElement?.account)
    assert.isUndefined(pathElement?.currency)
    assert.isUndefined(pathElement?.issuer)
  })

  // Path

  it('Convert Path protobuf with no paths to XRPPath', function(): void {
    // GIVEN a set of paths with zero path elements.
    const pathProto = new Payment.Path()

    // WHEN the protocol buffer is converted to a native TypeScript type.
    const path = XRPPath.from(pathProto)

    // THEN there are zero paths in the output.
    assert.equal(path?.pathElements.length, 0)
  })

  it('Convert Path protobuf with one Path to XRPPath', function(): void {
    // GIVEN a set of paths with one path element.
    const pathProto = new Payment.Path()
    pathProto.addElements(testPathElement)

    // WHEN the protocol buffer is converted to a native TypeScript type.
    const path = XRPPath.from(pathProto)

    // THEN there is one path in the output.
    assert.equal(path?.pathElements.length, 1)
  })

  it('Convert Path protobuf with many Paths to XRPPath', function(): void {
    // GIVEN a set of paths with three path elements.
    const pathProto = new Payment.Path()
    pathProto.setElementsList([
      testPathElement,
      testPathElement,
      testPathElement,
    ])

    // WHEN the protocol buffer is converted to a native TypeScript type.
    const path = XRPPath.from(pathProto)

    // THEN there are multiple paths in the output.
    assert.equal(path?.pathElements.length, 3)
  })
                 
  // IssuedCurrency

  it('Convert IssuedCurrency to XRPIssuedCurrency', function(): void {
    // GIVEN an issued currency protocol buffer
    const issuedCurrencyProto = new IssuedCurrencyAmount()
    issuedCurrencyProto.setCurrency(testCurrencyProto)
    const accountAddressProto = new AccountAddress()
    accountAddressProto.setAddress('r123')
    issuedCurrencyProto.setIssuer(accountAddressProto)
    issuedCurrencyProto.setValue('12345')

    // WHEN the protocol buffer is converted to a native TypeScript type.
    const issuedCurrency = XRPIssuedCurrency.from(issuedCurrencyProto)

    // THEN the issued currency converted as expected.
    assert.deepEqual(
      issuedCurrency?.currency,
      XRPCurrency.from(issuedCurrencyProto.getCurrency()!),
    )
    assert.equal(
      issuedCurrency?.issuer,
      issuedCurrencyProto.getIssuer()?.getAddress(),
    )
    assert.deepEqual(
      issuedCurrency?.value,
      bigInt(issuedCurrencyProto.getValue()),
    )
  })

  it('Convert IssuedCurrency with bad value', function(): void {
    // GIVEN an issued currency protocol buffer with a non numeric value
    const issuedCurrencyProto = new IssuedCurrencyAmount()
    issuedCurrencyProto.setCurrency(testCurrencyProto)
    const accountAddressProto = new AccountAddress()
    accountAddressProto.setAddress('r123')
    issuedCurrencyProto.setIssuer(accountAddressProto)
    issuedCurrencyProto.setValue('xrp') // non-numeric

    // WHEN the protocol buffer is converted to a native TypeScript type.
    const issuedCurrency = XRPIssuedCurrency.from(issuedCurrencyProto)

    // THEN the result is undefined
    assert.isUndefined(issuedCurrency)
  })
})
