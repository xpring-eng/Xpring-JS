import { assert } from 'chai'
import bigInt from 'big-integer'
import XRPCurrency from '../src/XRP/xrp-currency'
import XRPPathElement from '../src/XRP/xrp-path-element'
import XRPPath from '../src/XRP/xrp-path'
import XRPIssuedCurrency from '../src/XRP/xrp-issued-currency'
import XRPCurrencyAmount from '../src/XRP/xrp-currency-amount'
import XRPPayment from '../src/XRP/xrp-payment'
import {
  Currency,
  CurrencyAmount,
  IssuedCurrencyAmount,
  XRPDropsAmount,
} from '../src/generated/web/org/xrpl/rpc/v1/amount_pb'
import {
  Amount,
  Destination,
  DestinationTag,
  DeliverMin,
  InvoiceID,
  SendMax,
} from '../src/generated/web/org/xrpl/rpc/v1/common_pb'
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
    // GIVEN a set of paths with zero paths.
    const pathProto = new Payment.Path()

    // WHEN the protocol buffer is converted to a native TypeScript type.
    const path = XRPPath.from(pathProto)

    // THEN there are zero paths in the output.
    assert.equal(path?.pathElements.length, 0)
  })

  it('Convert Path protobuf with one Path to XRPPath', function(): void {
    // GIVEN a set of paths with one path.
    const pathProto = new Payment.Path()
    pathProto.addElements(testPathElement)

    // WHEN the protocol buffer is converted to a native TypeScript type.
    const path = XRPPath.from(pathProto)

    // THEN there is one path in the output.
    assert.equal(path?.pathElements.length, 1)
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
    const path = XRPPath.from(pathProto)

    // THEN there are multiple paths in the output.
    assert.equal(path?.pathElements.length, 3)
  })

  // IssuedCurrency

  it('Convert IssuedCurrency to XRPIssuedCurrency', function(): void {
    // GIVEN an issued currency protocol buffer,
    // WHEN the protocol buffer is converted to a native TypeScript type.
    const issuedCurrency = XRPIssuedCurrency.from(testIssuedCurrency)

    // THEN the issued currency converted as expected.
    assert.deepEqual(
      issuedCurrency?.currency,
      XRPCurrency.from(testIssuedCurrency.getCurrency()!),
    )
    assert.equal(
      issuedCurrency?.issuer,
      testIssuedCurrency.getIssuer()?.getAddress(),
    )
    assert.deepEqual(
      issuedCurrency?.value,
      bigInt(testIssuedCurrency.getValue()),
    )
  })

  it('Convert IssuedCurrency with bad value', function(): void {
    // GIVEN an issued currency protocol buffer with a non numeric value
    const issuedCurrencyProto = testInvalidIssuedCurrency

    // WHEN the protocol buffer is converted to a native TypeScript type.
    const issuedCurrency = XRPIssuedCurrency.from(issuedCurrencyProto)

    // THEN the result is undefined
    assert.isUndefined(issuedCurrency)
  })

  // CurrencyAmount tests

  it('Convert CurrencyAmount with drops', function(): void {
    // GIVEN a currency amount protocol buffer with an XRP amount.
    const drops = '10'
    const currencyAmountProto = new CurrencyAmount()
    const xrpDropsAmountProto = new XRPDropsAmount()
    xrpDropsAmountProto.setDrops(drops)
    currencyAmountProto.setXrpAmount(xrpDropsAmountProto)

    // WHEN the protocol buffer is converted to a native TypeScript type.
    const currencyAmount = XRPCurrencyAmount.from(currencyAmountProto)

    // THEN the result has drops set and no issued amount.
    assert.isUndefined(currencyAmount?.issuedCurrency)
    assert.equal(currencyAmount?.drops, drops)
  })

  it('Convert CurrencyAmount with Issued Currency', function(): void {
    // GIVEN a currency amount protocol buffer with an issued currency amount.
    const currencyAmountProto = new CurrencyAmount()
    currencyAmountProto.setIssuedCurrencyAmount(testIssuedCurrency)

    // WHEN the protocol buffer is converted to a native TypeScript type.
    const currencyAmount = XRPCurrencyAmount.from(currencyAmountProto)

    // THEN the result has an issued currency set and no drops amount.
    assert.deepEqual(
      currencyAmount?.issuedCurrency,
      XRPIssuedCurrency.from(testIssuedCurrency),
    )
    assert.isUndefined(currencyAmount?.drops)
  })

  it('Convert CurrencyAmount with bad inputs', function(): void {
    // GIVEN a currency amount protocol buffer with no amounts
    const currencyAmountProto = new CurrencyAmount()
    currencyAmountProto.setIssuedCurrencyAmount(testInvalidIssuedCurrency)

    // WHEN the protocol buffer is converted to a native TypeScript type.
    const currencyAmount = XRPCurrencyAmount.from(currencyAmountProto)

    // THEN the result is empty
    assert.isUndefined(currencyAmount)
  })

  // Payment

  it('Convert Payment with all fields set', function(): void {
    // GIVEN a pyament protocol buffer with all fields set.
    // amount
    const currencyAmountProto = new CurrencyAmount()
    currencyAmountProto.setIssuedCurrencyAmount(testIssuedCurrency)
    const amountProto = new Amount()
    amountProto.setValue(currencyAmountProto)

    // destination
    const accountAddressProto = new AccountAddress()
    accountAddressProto.setAddress('r123')
    const destinationProto = new Destination()
    destinationProto.setValue(accountAddressProto)

    // destinationTag
    const destinationTagProto = new DestinationTag()
    destinationTagProto.setValue(2)

    // deliverMin
    const xrpAmountProto = new XRPDropsAmount()
    xrpAmountProto.setDrops('10')
    const deliverMinCurrencyAmountProto = new CurrencyAmount()
    deliverMinCurrencyAmountProto.setXrpAmount(xrpAmountProto)
    const deliverMinProto = new DeliverMin()
    deliverMinProto.setValue(deliverMinCurrencyAmountProto)

    // invoiceID
    const invoiceIDProto = new InvoiceID()
    invoiceIDProto.setValue(new Uint8Array([1, 2, 3]))

    // paths
    const accountAddressProto456 = new AccountAddress()
    accountAddressProto456.setAddress('r456')
    const accountAddressProto789 = new AccountAddress()
    accountAddressProto789.setAddress('r789')
    const accountAddressProtoABC = new AccountAddress()
    accountAddressProtoABC.setAddress('rabc')

    const pathElementProto456 = new Payment.PathElement()
    pathElementProto456.setAccount(accountAddressProto456)
    const pathElementProto789 = new Payment.PathElement()
    pathElementProto789.setAccount(accountAddressProto789)
    const pathElementProtoABC = new Payment.PathElement()
    pathElementProtoABC.setAccount(accountAddressProtoABC)

    const pathProtoOneElement = new Payment.Path()
    pathProtoOneElement.setElementsList([pathElementProto456])
    const pathProtoTwoElements = new Payment.Path()
    pathProtoTwoElements.setElementsList([
      pathElementProto789,
      pathElementProtoABC,
    ])

    const paths = [pathProtoOneElement, pathProtoTwoElements]

    // sendMax
    const sendMaxXrpDropsAmountProto = new XRPDropsAmount()
    sendMaxXrpDropsAmountProto.setDrops('20')
    const sendMaxCurrencyAmountProto = new CurrencyAmount()
    sendMaxCurrencyAmountProto.setXrpAmount(sendMaxXrpDropsAmountProto)
    const sendMaxProto = new SendMax()
    sendMaxProto.setValue(sendMaxCurrencyAmountProto)

    // finally, populate paymentProto
    const paymentProto = new Payment()
    paymentProto.setAmount(amountProto)
    paymentProto.setDestination(destinationProto)
    paymentProto.setDestinationTag(destinationTagProto)
    paymentProto.setDeliverMin(deliverMinProto)
    paymentProto.setInvoiceId(invoiceIDProto)
    paymentProto.setPathsList(paths)
    paymentProto.setSendMax(sendMaxProto)

    // WHEN the protocol buffer is converted to a native TypeScript type.
    const payment = XRPPayment.from(paymentProto)

    // THEN the result is as expected.
    assert.deepEqual(
      payment?.amount,
      XRPCurrencyAmount.from(paymentProto.getAmount()?.getValue()!),
    )
    assert.equal(
      payment?.destination,
      paymentProto
        .getDestination()
        ?.getValue()
        ?.getAddress(),
    )
    assert.equal(
      payment?.destinationTag,
      paymentProto.getDestinationTag()?.getValue(),
    )
    assert.deepEqual(
      payment?.deliverMin,
      XRPCurrencyAmount.from(paymentProto.getDeliverMin()?.getValue()!),
    )
    assert.deepEqual(
      payment?.invoiceID,
      paymentProto.getInvoiceId()?.getValue(),
    )
    assert.deepEqual(
      payment?.paths,
      paymentProto.getPathsList().map((path) => XRPPath.from(path)),
    )
    assert.deepEqual(
      payment?.sendMax,
      XRPCurrencyAmount.from(paymentProto.getSendMax()?.getValue()!),
    )
  })

  it('Convert Payment with only mandatory fields set', function(): void {
    // GIVEN a payment protocol buffer with only mandatory fields set.
    // amount
    const currencyAmountProto = new CurrencyAmount()
    currencyAmountProto.setIssuedCurrencyAmount(testIssuedCurrency)
    const amountProto = new Amount()
    amountProto.setValue(currencyAmountProto)

    // destination
    const accountAddressProto = new AccountAddress()
    accountAddressProto.setAddress('r123')
    const destinationProto = new Destination()
    destinationProto.setValue(accountAddressProto)

    const paymentProto = new Payment()
    paymentProto.setAmount(amountProto)
    paymentProto.setDestination(destinationProto)

    // WHEN the protocol buffer is converted to a native TypeScript type.
    const payment = XRPPayment.from(paymentProto)

    // THEN the result is as expected.
    assert.deepEqual(
      payment?.amount,
      XRPCurrencyAmount.from(paymentProto.getAmount()?.getValue()!),
    )
    assert.equal(
      payment?.destination,
      paymentProto
        .getDestination()
        ?.getValue()
        ?.getAddress(),
    )
    assert.isUndefined(payment?.destinationTag)
    assert.isUndefined(payment?.deliverMin)
    assert.isUndefined(payment?.invoiceID)
    assert.isUndefined(payment?.paths)
    assert.isUndefined(payment?.sendMax)
  })

  it('Convert Payment with invalid amount field', function(): void {
    // GIVEN a pyament protocol buffer with an invalid amount field
    // amount (invalid)
    const currencyAmountProto = new CurrencyAmount()
    currencyAmountProto.setIssuedCurrencyAmount(testInvalidIssuedCurrency)
    const amountProto = new Amount()
    amountProto.setValue(currencyAmountProto)

    // destination
    const accountAddressProto = new AccountAddress()
    accountAddressProto.setAddress('r123')
    const destinationProto = new Destination()
    destinationProto.setValue(accountAddressProto)

    const paymentProto = new Payment()
    paymentProto.setAmount(amountProto)
    paymentProto.setDestination(destinationProto)

    // WHEN the protocol buffer is converted to a native TypeScript type THEN the result is undefined
    assert.isUndefined(XRPPayment.from(paymentProto))
  })

  it('Convert Payment with invalid deliverMin field', function(): void {
    // GIVEN a payment protocol buffer with an invalid deliverMin field
    // amount
    const currencyAmountProto = new CurrencyAmount()
    currencyAmountProto.setIssuedCurrencyAmount(testIssuedCurrency)
    const amountProto = new Amount()
    amountProto.setValue(currencyAmountProto)

    // destination
    const accountAddressProto = new AccountAddress()
    accountAddressProto.setAddress('r123')
    const destinationProto = new Destination()
    destinationProto.setValue(accountAddressProto)

    // deliverMin (invalid)
    const deliverMinCurrencyAmountProto = new CurrencyAmount()
    deliverMinCurrencyAmountProto.setIssuedCurrencyAmount(
      testInvalidIssuedCurrency,
    )
    const deliverMinProto = new DeliverMin()
    deliverMinProto.setValue(deliverMinCurrencyAmountProto)

    const paymentProto = new Payment()
    paymentProto.setAmount(amountProto)
    paymentProto.setDestination(destinationProto)
    paymentProto.setDeliverMin(deliverMinProto)

    // WHEN the protocol buffer is converted to a native TypeScript type THEN the result is undefined
    assert.isUndefined(XRPPayment.from(paymentProto))
  })

  it('Convert Payment with invalid sendMax field', function(): void {
    // GIVEN a payment protocol buffer with an invalid sendMax field
    // amount
    const currencyAmountProto = new CurrencyAmount()
    currencyAmountProto.setIssuedCurrencyAmount(testIssuedCurrency)
    const amountProto = new Amount()
    amountProto.setValue(currencyAmountProto)

    // destination
    const accountAddressProto = new AccountAddress()
    accountAddressProto.setAddress('r123')
    const destinationProto = new Destination()
    destinationProto.setValue(accountAddressProto)

    // sendMax (invalid)
    const sendMaxCurrencyAmountProto = new CurrencyAmount()
    sendMaxCurrencyAmountProto.setIssuedCurrencyAmount(
      testInvalidIssuedCurrency,
    )
    const sendMaxProto = new SendMax()
    sendMaxProto.setValue(sendMaxCurrencyAmountProto)

    const paymentProto = new Payment()
    paymentProto.setAmount(amountProto)
    paymentProto.setDestination(destinationProto)
    paymentProto.setSendMax(sendMaxProto)

    // WHEN the protocol buffer is converted to a native TypeScript type THEN the result is undefined
    assert.isUndefined(XRPPayment.from(paymentProto))
  })
})
