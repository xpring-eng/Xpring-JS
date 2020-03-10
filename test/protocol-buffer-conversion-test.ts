import { assert } from 'chai'
// commenting out for temporary testability of this class
// TODO(amiecorso) restore
// import bigInt from 'big-integer'
import XRPCurrency from '../src/xrp-currency'
import XRPIssuedCurrency from '../src/xrp-issued-currency'
import XRPCurrencyAmount from '../src/xrp-currency-amount'
import XRPPathElement from '../src/xrp-path-element'
import XRPPath from '../src/xrp-path'
import {
  Currency,
  CurrencyAmount,
  IssuedCurrencyAmount,
  XRPDropsAmount,
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

// test IssuedCurrencyAmount
const testIssuedCurrency = new IssuedCurrencyAmount()
testIssuedCurrency.setCurrency(testCurrencyProto)
testIssuedCurrency.setIssuer(testAccountAddress)
testIssuedCurrency.setValue('100')

// test Invalid IssuedCurrencyAmount
const testInvalidIssuedCurrency = new IssuedCurrencyAmount()
testInvalidIssuedCurrency.setCurrency(testCurrencyProto)
testInvalidIssuedCurrency.setIssuer(testAccountAddress)
testInvalidIssuedCurrency.setValue('xrp')

describe('Protocol Buffer Conversion', function(): void {
  // Currency tests
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

  // PathElement tests
  it('Convert PathElement protobuf with all fields set to XRPPathElement', function(): void {
    // GIVEN a PathElement protocol buffer with all fields set.
    const pathElementProto = testPathElement

    // WHEN the protocol buffer is converted to a native TypeScript type.
    const pathElement = new XRPPathElement(pathElementProto)

    // THEN the currency converted as expected.
    assert.equal(
      pathElement.account,
      pathElementProto.getAccount()!.getAddress(),
    )
    assert.deepEqual(
      pathElement.currency,
      new XRPCurrency(pathElementProto.getCurrency()!),
    )
    assert.equal(pathElement.issuer, pathElementProto.getIssuer()!.getAddress())
  })

  it('Convert PathElement protobuf with no fields set to XRPPathElement', function(): void {
    // GIVEN a PathElement protocol buffer with no fields set.
    const pathElementProto = new Payment.PathElement()

    // WHEN the protocol buffer is converted to a native TypeScript type.
    const pathElement = new XRPPathElement(pathElementProto)

    // THEN the currency converted as expected.
    assert.isUndefined(pathElement.account)
    assert.isUndefined(pathElement.currency)
    assert.isUndefined(pathElement.issuer)
  })

  // Path tests
  it('Convert Path protobuf with no paths to XRPPath', function(): void {
    // GIVEN a set of paths with zero paths.
    const pathProto = new Payment.Path()

    // WHEN the protocol buffer is converted to a native TypeScript type.
    const path = new XRPPath(pathProto)

    // THEN there are zero paths in the output.
    assert.equal(path.pathElements.length, 0)
  })

  it('Convert Path protobuf with one Path to XRPPath', function(): void {
    // GIVEN a set of paths with one path.
    const pathProto = new Payment.Path()
    pathProto.addElements(testPathElement)

    // WHEN the protocol buffer is converted to a native TypeScript type.
    const path = new XRPPath(pathProto)

    // THEN there is one path in the output.
    assert.equal(path.pathElements.length, 1)
  })

  it('Convert Path protobuf with many Paths to XRPPath', function(): void {
    // GIVEN a set of paths with one path.
    const pathProto = new Payment.Path()
    pathProto.setElementsList([
      testPathElement,
      testPathElement,
      testPathElement,
    ])

    // WHEN the protocol buffer is converted to a native TypeScript type.
    const path = new XRPPath(pathProto)

    // THEN there are multiple paths in the output.
    assert.equal(path.pathElements.length, 3)
  })

  // IssuedCurrency tests
  it('Convert IssuedCurrency to XRPIssuedCurrency', function(): void {
    // GIVEN an issued currency protocol buffer
    const issuedCurrencyProto = new IssuedCurrencyAmount()
    issuedCurrencyProto.setCurrency(testCurrencyProto)
    const accountAddressProto = new AccountAddress()
    accountAddressProto.setAddress('r123')
    issuedCurrencyProto.setIssuer(accountAddressProto)
    issuedCurrencyProto.setValue('12345')

    // WHEN the protocol buffer is converted to a native TypeScript type.
    const issuedCurrency = new XRPIssuedCurrency(issuedCurrencyProto)

    // THEN the issued currency converted as expected.
    assert.equal(
      issuedCurrency?.currency,
      new XRPCurrency(issuedCurrencyProto.getCurrency()!),
    )
    assert.equal(
      issuedCurrency?.issuer,
      issuedCurrencyProto.getIssuer()?.getAddress(),
    )
    // Commenting out for temporary testability of this class
    // TOD(amiecorso): restore
    // assert.equal(issuedCurrency?.value, bigInt(issuedCurrencyProto.getValue()))
    assert.equal(issuedCurrency?.value, issuedCurrencyProto.getValue())
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
    const issuedCurrency = new XRPIssuedCurrency(issuedCurrencyProto)

    // THEN the result is undefined
    assert.isUndefined(issuedCurrency)
  })

  // CurrencyAmount tests
  it('Convert CurrencyAmount with drops', function(): void {
    // GIVEN a currency amount protocol buffer with an XRP amount.
    const drops = '10' // TODO: double check that this should really be a string?
    const currencyAmountProto = new CurrencyAmount()
    const xrpDropsAmountProto = new XRPDropsAmount()
    xrpDropsAmountProto.setDrops(drops)
    currencyAmountProto.setXrpAmount(xrpDropsAmountProto)

    // WHEN the protocol buffer is converted to a native TypeScript type.
    const currencyAmount = new XRPCurrencyAmount(currencyAmountProto)

    // THEN the result has drops set and no issued amount.
    assert.isUndefined(currencyAmount?.issuedCurrency)
    assert.isUndefined(currencyAmount?.drops, drops)
  })

  it('Convert CurrencyAmount with Issued Currency', function(): void {
    // GIVEN a currency amount protocol buffer with an issued currency amount.
    const currencyAmountProto = new CurrencyAmount()
    currencyAmountProto.setIssuedCurrencyAmount(testIssuedCurrency)

    // WHEN the protocol buffer is converted to a native TypeScript type.
    const currencyAmount = new XRPCurrencyAmount(currencyAmountProto)

    // THEN the result has an issued currency set and no amount.
    assert.equal(
      currencyAmount?.issuedCurrency,
      new XRPIssuedCurrency(testIssuedCurrency),
    )
    assert.isUndefined(currencyAmount?.drops)
  })

  it('Convert CurrencyAmount with bad inputs', function(): void {
    // GIVEN a currency amount protocol buffer with no amounts
    const currencyAmountProto = new CurrencyAmount()
    currencyAmountProto.setIssuedCurrencyAmount(testInvalidIssuedCurrency)

    // WHEN the protocol buffer is converted to a native TypeScript type.
    const currencyAmount = new XRPCurrencyAmount(currencyAmountProto)

    // THEN the result is undefined
    assert.isUndefined(currencyAmount)
  })
})
