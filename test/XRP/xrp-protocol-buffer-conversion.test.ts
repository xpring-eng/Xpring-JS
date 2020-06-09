import { assert } from 'chai'
import bigInt from 'big-integer'
import XRPCurrency from '../../src/XRP/model/xrp-currency'
import XRPPathElement from '../../src/XRP/model/xrp-path-element'
import XRPPath from '../../src/XRP/model/xrp-path'
import XRPIssuedCurrency from '../../src/XRP/model/xrp-issued-currency'
import XRPCurrencyAmount from '../../src/XRP/model/xrp-currency-amount'
import XRPPayment from '../../src/XRP/model/xrp-payment'
import XRPMemo from '../../src/XRP/model/xrp-memo'
import XRPSigner from '../../src/XRP/model/xrp-signer'
import XRPTransaction from '../../src/XRP/model/xrp-transaction'
import { Utils, XRPLNetwork } from '../../src'
import {
  testAddress,
  testPublicKey,
  testTransactionSignature,
  testSequence,
  testFee,
  testMemoData,
  testMemoFormat,
  testMemoType,
  testAccountTransactionID,
  testFlags,
  testSourceTag,
  testLastLedgerSequence,
  testTransactionHash,
  expectedTimestamp,
  testIsValidated,
  testLedgerIndex,
  testCurrencyProto,
  testPathElementProto,
  testEmptyPathElementProto,
  testEmptyPathProto,
  testPathProtoOneElement,
  testPathProtoThreeElements,
  testIssuedCurrencyProto,
  testCurrencyAmountProtoDrops,
  testCurrencyAmountProtoIssuedCurrency,
  testPaymentProtoAllFieldsSet,
  testPaymentProtoMandatoryFieldsOnly,
  testMemoProtoAllFields,
  testEmptyMemoProto,
  testSignerProto,
  testGetTransactionResponseProto,
  testGetTransactionResponseProtoMandatoryOnly,
  testInvalidIssuedCurrencyProto,
  testInvalidCurrencyAmountProto,
  testInvalidPaymentProtoBadAmount,
  testInvalidPaymentProtoBadDeliverMin,
  testInvalidPaymentProtoBadSendMax,
  testInvalidGetTransactionResponseProto,
  testInvalidGetTransactionResponseProtoUnsupportedType,
} from './fakes/fake-xrp-protobufs'

// TODO(amiecorso): Refactor tests to separate files.
describe('Protocol Buffer Conversion', function (): void {
  // Currency

  it('Convert Currency protobuf to XRPCurrency object', function (): void {
    // GIVEN a Currency protocol buffer with a code and a name.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const currency = XRPCurrency.from(testCurrencyProto)

    // THEN the currency converted as expected.
    assert.deepEqual(currency.code, testCurrencyProto.getCode())
    assert.deepEqual(currency.name, testCurrencyProto.getName())
  })

  // PathElement

  it('Convert PathElement protobuf with all fields set to XRPPathElement', function (): void {
    // GIVEN a PathElement protocol buffer with all fields set.
    // WHEN the protocol buffer is converted to a native TypeScript type.
    const pathElement = XRPPathElement.from(testPathElementProto)

    // THEN the currency converted as expected.
    assert.equal(
      pathElement?.account,
      testPathElementProto.getAccount()!.getAddress(),
    )
    assert.deepEqual(
      pathElement?.currency,
      XRPCurrency.from(testPathElementProto.getCurrency()!),
    )
    assert.equal(
      pathElement?.issuer,
      testPathElementProto.getIssuer()!.getAddress(),
    )
  })

  it('Convert PathElement protobuf with no fields set to XRPPathElement', function (): void {
    // GIVEN a PathElement protocol buffer with no fields set.
    // WHEN the protocol buffer is converted to a native TypeScript type.
    const pathElement = XRPPathElement.from(testEmptyPathElementProto)

    // THEN the currency converted as expected.
    assert.isUndefined(pathElement?.account)
    assert.isUndefined(pathElement?.currency)
    assert.isUndefined(pathElement?.issuer)
  })

  // Path

  it('Convert Path protobuf with no paths to XRPPath', function (): void {
    // GIVEN a set of paths with zero path elements.
    // WHEN the protocol buffer is converted to a native TypeScript type.
    const path = XRPPath.from(testEmptyPathProto)

    // THEN there are zero paths in the output.
    assert.equal(path?.pathElements.length, 0)
  })

  it('Convert Path protobuf with one path element to XRPPath', function (): void {
    // GIVEN a set of paths with one path element.
    // WHEN the protocol buffer is converted to a native TypeScript type.
    const path = XRPPath.from(testPathProtoOneElement)

    // THEN there is one path in the output.
    assert.equal(path?.pathElements.length, 1)
  })

  it('Convert Path protobuf with many Paths to XRPPath', function (): void {
    // GIVEN a set of paths with three path elements.
    // WHEN the protocol buffer is converted to a native TypeScript type.
    const path = XRPPath.from(testPathProtoThreeElements)

    // THEN there are multiple paths in the output.
    assert.equal(path?.pathElements.length, 3)
  })

  // IssuedCurrency

  it('Convert IssuedCurrency to XRPIssuedCurrency', function (): void {
    // GIVEN an issued currency protocol buffer,
    // WHEN the protocol buffer is converted to a native TypeScript type.
    const issuedCurrency = XRPIssuedCurrency.from(testIssuedCurrencyProto)

    // THEN the issued currency converted as expected.
    assert.deepEqual(
      issuedCurrency?.currency,
      XRPCurrency.from(testIssuedCurrencyProto.getCurrency()!),
    )
    assert.equal(
      issuedCurrency?.issuer,
      testIssuedCurrencyProto.getIssuer()?.getAddress(),
    )
    assert.deepEqual(
      issuedCurrency?.value,
      bigInt(testIssuedCurrencyProto.getValue()),
    )
  })

  it('Convert IssuedCurrency with bad value', function (): void {
    // GIVEN an issued currency protocol buffer with a non numeric value
    // WHEN the protocol buffer is converted to a native TypeScript type.
    const issuedCurrency = XRPIssuedCurrency.from(
      testInvalidIssuedCurrencyProto,
    )

    // THEN the result is undefined
    assert.isUndefined(issuedCurrency)
  })

  // CurrencyAmount tests

  it('Convert CurrencyAmount with drops', function (): void {
    // GIVEN a currency amount protocol buffer with an XRP amount.
    // WHEN the protocol buffer is converted to a native TypeScript type.
    const currencyAmount = XRPCurrencyAmount.from(testCurrencyAmountProtoDrops)

    // THEN the result has drops set and no issued amount.
    assert.isUndefined(currencyAmount?.issuedCurrency)
    assert.equal(
      currencyAmount?.drops,
      testCurrencyAmountProtoDrops.getXrpAmount()?.getDrops(),
    )
  })

  it('Convert CurrencyAmount with Issued Currency', function (): void {
    // GIVEN a currency amount protocol buffer with an issued currency amount.
    // WHEN the protocol buffer is converted to a native TypeScript type.
    const currencyAmount = XRPCurrencyAmount.from(
      testCurrencyAmountProtoIssuedCurrency,
    )

    // THEN the result has an issued currency set and no drops amount.
    assert.deepEqual(
      currencyAmount?.issuedCurrency,
      XRPIssuedCurrency.from(testIssuedCurrencyProto),
    )
    assert.isUndefined(currencyAmount?.drops)
  })

  it('Convert CurrencyAmount with bad inputs', function (): void {
    // GIVEN a currency amount protocol buffer with no amounts
    // WHEN the protocol buffer is converted to a native TypeScript type.
    const currencyAmount = XRPCurrencyAmount.from(
      testInvalidCurrencyAmountProto,
    )

    // THEN the result is empty
    assert.isUndefined(currencyAmount)
  })

  // Payment

  it('Convert Payment with all fields set', function (): void {
    // GIVEN a payment protocol buffer with all fields set.
    // WHEN the protocol buffer is converted to a native TypeScript type.
    const payment = XRPPayment.from(
      testPaymentProtoAllFieldsSet,
      XRPLNetwork.Test,
    )

    // THEN the result is as expected.
    assert.deepEqual(
      payment?.amount,
      XRPCurrencyAmount.from(
        testPaymentProtoAllFieldsSet.getAmount()?.getValue()!,
      ),
    )
    assert.equal(
      payment?.destination,
      testPaymentProtoAllFieldsSet.getDestination()?.getValue()?.getAddress(),
    )
    assert.equal(
      payment?.destinationTag,
      testPaymentProtoAllFieldsSet.getDestinationTag()?.getValue(),
    )
    assert.equal(
      payment?.destinationXAddress,
      Utils.encodeXAddress(
        payment?.destination!,
        payment?.destinationTag,
        true,
      ),
    )
    assert.deepEqual(
      payment?.deliverMin,
      XRPCurrencyAmount.from(
        testPaymentProtoAllFieldsSet.getDeliverMin()?.getValue()!,
      ),
    )
    assert.deepEqual(
      payment?.invoiceID,
      testPaymentProtoAllFieldsSet.getInvoiceId()?.getValue(),
    )
    assert.deepEqual(
      payment?.paths,
      testPaymentProtoAllFieldsSet
        .getPathsList()
        .map((path) => XRPPath.from(path)),
    )
    assert.deepEqual(
      payment?.sendMax,
      XRPCurrencyAmount.from(
        testPaymentProtoAllFieldsSet.getSendMax()?.getValue()!,
      ),
    )
  })

  it('Convert Payment with only mandatory fields set', function (): void {
    // GIVEN a payment protocol buffer with only mandatory fields set.
    // WHEN the protocol buffer is converted to a native TypeScript type.
    const payment = XRPPayment.from(
      testPaymentProtoMandatoryFieldsOnly,
      XRPLNetwork.Test,
    )

    // THEN the result is as expected.
    assert.deepEqual(
      payment?.amount,
      XRPCurrencyAmount.from(
        testPaymentProtoMandatoryFieldsOnly.getAmount()?.getValue()!,
      ),
    )
    assert.equal(
      payment?.destination,
      testPaymentProtoMandatoryFieldsOnly
        .getDestination()
        ?.getValue()
        ?.getAddress(),
    )
    assert.equal(
      payment?.destinationXAddress,
      Utils.encodeXAddress(
        payment?.destination!,
        payment?.destinationTag,
        true,
      ),
    )
    assert.isUndefined(payment?.destinationTag)
    assert.isUndefined(payment?.deliverMin)
    assert.isUndefined(payment?.invoiceID)
    assert.isUndefined(payment?.paths)
    assert.isUndefined(payment?.sendMax)
  })

  it('Convert Payment with invalid amount field', function (): void {
    // GIVEN a pyament protocol buffer with an invalid amount field
    // WHEN the protocol buffer is converted to a native TypeScript type THEN the result is undefined
    assert.isUndefined(
      XRPPayment.from(testInvalidPaymentProtoBadAmount, XRPLNetwork.Test),
    )
  })

  it('Convert Payment with invalid deliverMin field', function (): void {
    // GIVEN a payment protocol buffer with an invalid deliverMin field
    // WHEN the protocol buffer is converted to a native TypeScript type THEN the result is undefined
    assert.isUndefined(
      XRPPayment.from(testInvalidPaymentProtoBadDeliverMin, XRPLNetwork.Test),
    )
  })

  it('Convert Payment with invalid sendMax field', function (): void {
    // GIVEN a payment protocol buffer with an invalid sendMax field
    // WHEN the protocol buffer is converted to a native TypeScript type THEN the result is undefined
    assert.isUndefined(
      XRPPayment.from(testInvalidPaymentProtoBadSendMax, XRPLNetwork.Test),
    )
  })

  // Memo

  it('Convert Memo with all fields set', function (): void {
    // GIVEN a memo with all fields set.
    // WHEN the protocol buffer is converted to a native TypeScript type
    const memo = XRPMemo.from(testMemoProtoAllFields)

    // THEN all fields are present and set correctly.
    assert.deepEqual(memo?.data, testMemoData)
    assert.deepEqual(memo?.format, testMemoFormat)
    assert.deepEqual(memo?.type, testMemoType)
  })

  it('Convert Memo with no fields set', function (): void {
    // GIVEN a memo with no fields set.
    // WHEN the protocol buffer is converted to a native TypeScript type
    const memo = XRPMemo.from(testEmptyMemoProto)

    // THEN all fields are undefined.
    assert.isUndefined(memo?.data)
    assert.isUndefined(memo?.format)
    assert.isUndefined(memo?.type)
  })

  // Signer
  it('Convert Signer with all fields set', function (): void {
    // GIVEN a Signer protocol buffer with all fields set.
    // WHEN the protocol buffer is converted to a native TypeScript type.
    const signer = XRPSigner.from(testSignerProto)

    // THEN all fields are present and converted correctly.
    assert.equal(
      signer?.account,
      testSignerProto?.getAccount()?.getValue()?.getAddress(),
    )
    assert.deepEqual(
      signer?.signingPublicKey,
      testSignerProto.getSigningPublicKey()?.getValue_asU8(),
    )
    assert.deepEqual(
      signer?.transactionSignature,
      testSignerProto.getTransactionSignature()?.getValue_asU8(),
    )
  })

  // Transaction

  it('Convert PAYMENT Transaction, all common fields set', function (): void {
    // GIVEN a GetTransactionResponse protobuf containing a Transaction protobuf with all common fields set.
    // WHEN the protocol buffer is converted to a native TypeScript type.
    const transaction = XRPTransaction.from(
      testGetTransactionResponseProto,
      XRPLNetwork.Test,
    )

    // THEN all fields are present and converted correctly.
    assert.equal(transaction?.account, testAddress)
    assert.equal(transaction?.fee, testFee)
    assert.equal(transaction?.sequence, testSequence)
    assert.equal(transaction?.signingPublicKey, testPublicKey)
    assert.equal(transaction?.transactionSignature, testTransactionSignature)
    assert.equal(transaction?.accountTransactionID, testAccountTransactionID)
    assert.equal(transaction?.flags, testFlags)
    assert.equal(transaction?.lastLedgerSequence, testLastLedgerSequence)
    assert.deepEqual(transaction?.memos, [
      XRPMemo.from(testMemoProtoAllFields)!,
    ])
    assert.deepEqual(transaction?.signers, [XRPSigner.from(testSignerProto)!])
    assert.equal(transaction?.sourceTag, testSourceTag)
    assert.equal(
      transaction?.sourceXAddress,
      Utils.encodeXAddress(transaction?.account!, transaction?.sourceTag, true),
    )
    assert.equal(transaction?.hash, Utils.toHex(testTransactionHash))
    assert.equal(transaction?.timestamp, expectedTimestamp)
    assert.equal(
      transaction?.deliveredAmount,
      testGetTransactionResponseProto
        ?.getMeta()
        ?.getDeliveredAmount()
        ?.getValue()
        ?.getIssuedCurrencyAmount()
        ?.getValue(),
    )
    assert.equal(transaction?.validated, testIsValidated)
    assert.equal(transaction?.ledgerIndex, testLedgerIndex)
  })

  it('Convert PAYMENT Transaction with only mandatory common fields set', function (): void {
    // GIVEN a GetTransactionResponse protocol buffer containing a Transaction protobuf with only mandatory common fields set.
    // WHEN the protocol buffer is converted to a native TypeScript type.
    const transaction = XRPTransaction.from(
      testGetTransactionResponseProtoMandatoryOnly,
      XRPLNetwork.Test,
    )

    // THEN all fields are present and converted correctly.
    assert.equal(transaction?.account, testAddress)
    assert.equal(transaction?.fee, testFee)
    assert.equal(transaction?.sequence, testSequence)
    assert.deepEqual(transaction?.signingPublicKey, testPublicKey)
    assert.deepEqual(
      transaction?.transactionSignature,
      testTransactionSignature,
    )
    assert.equal(transaction?.hash, Utils.toHex(testTransactionHash))
    assert.isUndefined(transaction?.accountTransactionID)
    assert.isUndefined(transaction?.flags)
    assert.isUndefined(transaction?.lastLedgerSequence)
    assert.isUndefined(transaction?.memos)
    assert.isUndefined(transaction?.signers)
    assert.isUndefined(transaction?.sourceTag)
    assert.equal(
      transaction?.sourceXAddress,
      Utils.encodeXAddress(transaction?.account!, transaction?.sourceTag, true),
    )
    assert.isUndefined(transaction?.timestamp)
    assert.isUndefined(transaction?.deliveredAmount)
  })

  it('Convert PAYMENT Transaction with bad payment fields', function (): void {
    // GIVEN a GetTransactionResponse protocol buffer with Transaction payment fields which are incorrect
    // WHEN the protocol buffer is converted to a native TypeScript type.
    const transaction = XRPTransaction.from(
      testInvalidGetTransactionResponseProto,
      XRPLNetwork.Test,
    )

    // THEN the result is undefined
    assert.isUndefined(transaction)
  })

  it('Convert unsupported transaction type', function (): void {
    // GIVEN a GetTransactionResponse protocol buffer with a Transaction of unsupported type
    // WHEN the protocol buffer is converted to a native TypeScript type.
    const transaction = XRPTransaction.from(
      testInvalidGetTransactionResponseProtoUnsupportedType,
      XRPLNetwork.Test,
    )

    // THEN the result is undefined
    assert.isUndefined(transaction)
  })
})
