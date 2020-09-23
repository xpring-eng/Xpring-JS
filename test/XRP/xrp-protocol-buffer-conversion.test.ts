/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain --
 * This rule should never be disabled in production, but for tests,
 * having a x?.y?.z! chain is a succinct way of getting the typing correct.
 */

import bigInt from 'big-integer'
import { assert } from 'chai'

import { Utils, XrplNetwork } from 'xpring-common-js'
import { XrpError, XrpUtils } from '../../src'
import XrpCurrency from '../../src/XRP/model/xrp-currency'
import XrpCurrencyAmount from '../../src/XRP/model/xrp-currency-amount'
import XrpIssuedCurrency from '../../src/XRP/model/xrp-issued-currency'
import XrpMemo from '../../src/XRP/model/xrp-memo'
import XrpPath from '../../src/XRP/model/xrp-path'
import XrpPathElement from '../../src/XRP/model/xrp-path-element'
import XrpPayment from '../../src/XRP/model/xrp-payment'
import XrpSigner from '../../src/XRP/model/xrp-signer'
import XrpTransaction from '../../src/XRP/model/xrp-transaction'
import XrpSignerEntry from '../../src/XRP/model/xrp-signer-entry'
import {
  testPublicKey,
  testTransactionSignature,
  testSequence,
  testFee,
  testMemoData,
  testMemoFormat,
  testMemoType,
  testAccountTransactionID,
  testFlags,
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
  testSignerEntryProto,
  testGetTransactionResponseProto,
  testGetTransactionResponseProtoMandatoryOnly,
  testInvalidCurrencyProtoNoName,
  testInvalidCurrencyProtoNoCode,
  testInvalidIssuedCurrencyProto,
  testInvalidCurrencyAmountProto,
  testInvalidPaymentProtoBadAmount,
  testInvalidPaymentProtoBadDeliverMin,
  testInvalidPaymentProtoBadSendMax,
  testInvalidGetTransactionResponseProto,
  testInvalidGetTransactionResponseProtoUnsupportedType,
} from './fakes/fake-xrp-protobufs'
import { SignerEntry } from '../../src/XRP/Generated/web/org/xrpl/rpc/v1/common_pb'

// TODO(amiecorso): Refactor tests to separate files.
describe('Protocol Buffer Conversion', function (): void {
  // Currency

  it('Convert Currency protobuf to XrpCurrency object', function (): void {
    // GIVEN a Currency protocol buffer with a code and a name.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const currency = XrpCurrency.from(testCurrencyProto)

    // THEN the currency converted as expected.
    assert.deepEqual(currency.code, testCurrencyProto.getCode_asB64())
    assert.deepEqual(currency.name, testCurrencyProto.getName())
  })

  it('Convert Currency protobuf missing required field name', function (): void {
    // GIVEN a Currency protocol buffer missing a name.
    // WHEN the protocol buffer is converted to a native Typescript type THEN an error is thrown.
    assert.throws(
      () => {
        XrpCurrency.from(testInvalidCurrencyProtoNoName)
      },
      XrpError,
      'Currency protobuf missing required field `name`.',
    )
  })

  it('Convert Currency protobuf missing required field code', function (): void {
    // GIVEN a Currency protocol buffer missing a code.
    // WHEN the protocol buffer is converted to a native Typescript type THEN an error is thrown.
    assert.throws(
      () => {
        XrpCurrency.from(testInvalidCurrencyProtoNoCode)
      },
      XrpError,
      'Currency protobuf missing required field `code`.',
    )
  })

  // PathElement

  it('Convert PathElement protobuf with all fields set to XrpPathElement', function (): void {
    // GIVEN a PathElement protocol buffer with all fields set.
    // WHEN the protocol buffer is converted to a native TypeScript type.
    const pathElement = XrpPathElement.from(testPathElementProto)

    // THEN the currency converted as expected.
    assert.equal(
      pathElement.account,
      testPathElementProto.getAccount()!.getAddress(),
    )
    assert.deepEqual(
      pathElement.currency,
      XrpCurrency.from(testPathElementProto.getCurrency()!),
    )
    assert.equal(
      pathElement.issuer,
      testPathElementProto.getIssuer()!.getAddress(),
    )
  })

  it('Convert PathElement protobuf with no fields set to XrpPathElement', function (): void {
    // GIVEN a PathElement protocol buffer with no fields set.
    // WHEN the protocol buffer is converted to a native TypeScript type.
    const pathElement = XrpPathElement.from(testEmptyPathElementProto)

    // THEN the currency converted as expected.
    assert.isUndefined(pathElement.account)
    assert.isUndefined(pathElement.currency)
    assert.isUndefined(pathElement.issuer)
  })

  // Path

  it('Convert Path protobuf with no paths to XrpPath', function (): void {
    // GIVEN a set of paths with zero path elements.
    // WHEN the protocol buffer is converted to a native TypeScript type.
    const path = XrpPath.from(testEmptyPathProto)

    // THEN there are zero paths in the output.
    assert.equal(path.pathElements.length, 0)
  })

  it('Convert Path protobuf with one path element to XrpPath', function (): void {
    // GIVEN a set of paths with one path element.
    // WHEN the protocol buffer is converted to a native TypeScript type.
    const path = XrpPath.from(testPathProtoOneElement)

    // THEN there is one path in the output.
    assert.equal(path.pathElements.length, 1)
  })

  it('Convert Path protobuf with many Paths to XrpPath', function (): void {
    // GIVEN a set of paths with three path elements.
    // WHEN the protocol buffer is converted to a native TypeScript type.
    const path = XrpPath.from(testPathProtoThreeElements)

    // THEN there are multiple paths in the output.
    assert.equal(path.pathElements.length, 3)
  })

  // IssuedCurrency

  it('Convert IssuedCurrency to XrpIssuedCurrency', function (): void {
    // GIVEN an issued currency protocol buffer,
    // WHEN the protocol buffer is converted to a native TypeScript type.
    const issuedCurrency = XrpIssuedCurrency.from(testIssuedCurrencyProto)

    // THEN the issued currency converted as expected.
    assert.deepEqual(
      issuedCurrency?.currency,
      XrpCurrency.from(testIssuedCurrencyProto.getCurrency()!),
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
    const issuedCurrency = XrpIssuedCurrency.from(
      testInvalidIssuedCurrencyProto,
    )

    // THEN the result is undefined
    assert.isUndefined(issuedCurrency)
  })

  // CurrencyAmount tests

  it('Convert CurrencyAmount with drops', function (): void {
    // GIVEN a currency amount protocol buffer with an XRP amount.
    // WHEN the protocol buffer is converted to a native TypeScript type.
    const currencyAmount = XrpCurrencyAmount.from(testCurrencyAmountProtoDrops)

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
    const currencyAmount = XrpCurrencyAmount.from(
      testCurrencyAmountProtoIssuedCurrency,
    )

    // THEN the result has an issued currency set and no drops amount.
    assert.deepEqual(
      currencyAmount?.issuedCurrency,
      XrpIssuedCurrency.from(testIssuedCurrencyProto),
    )
    assert.isUndefined(currencyAmount?.drops)
  })

  it('Convert CurrencyAmount with bad inputs', function (): void {
    // GIVEN a currency amount protocol buffer with no amounts
    // WHEN the protocol buffer is converted to a native TypeScript type.
    const currencyAmount = XrpCurrencyAmount.from(
      testInvalidCurrencyAmountProto,
    )

    // THEN the result is empty
    assert.isUndefined(currencyAmount)
  })

  // Payment

  it('Convert Payment with all fields set', function (): void {
    // GIVEN a payment protocol buffer with all fields set.
    // WHEN the protocol buffer is converted to a native TypeScript type.
    const payment = XrpPayment.from(
      testPaymentProtoAllFieldsSet,
      XrplNetwork.Test,
    )

    // THEN the result is as expected.
    assert.deepEqual(
      payment?.amount,
      XrpCurrencyAmount.from(
        testPaymentProtoAllFieldsSet.getAmount()?.getValue()!,
      ),
    )

    assert.equal(
      payment?.destinationXAddress,
      XrpUtils.encodeXAddress(
        testPaymentProtoAllFieldsSet
          .getDestination()!
          .getValue()!
          .getAddress()!,
        testPaymentProtoAllFieldsSet.getDestinationTag()?.getValue(),
        true,
      ),
    )
    assert.deepEqual(
      payment?.deliverMin,
      XrpCurrencyAmount.from(
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
        .map((path) => XrpPath.from(path)),
    )
    assert.deepEqual(
      payment?.sendMax,
      XrpCurrencyAmount.from(
        testPaymentProtoAllFieldsSet.getSendMax()?.getValue()!,
      ),
    )
  })

  it('Convert Payment with only mandatory fields set', function (): void {
    // GIVEN a payment protocol buffer with only mandatory fields set.
    // WHEN the protocol buffer is converted to a native TypeScript type.
    const payment = XrpPayment.from(
      testPaymentProtoMandatoryFieldsOnly,
      XrplNetwork.Test,
    )

    // THEN the result is as expected.
    assert.deepEqual(
      payment?.amount,
      XrpCurrencyAmount.from(
        testPaymentProtoMandatoryFieldsOnly.getAmount()?.getValue()!,
      ),
    )

    assert.equal(
      payment?.destinationXAddress,
      XrpUtils.encodeXAddress(
        testPaymentProtoMandatoryFieldsOnly
          ?.getDestination()!
          .getValue()!
          .getAddress()!,
        testPaymentProtoMandatoryFieldsOnly?.getDestinationTag()?.getValue(),
        true,
      ),
    )
    assert.isUndefined(payment?.deliverMin)
    assert.isUndefined(payment?.invoiceID)
    assert.isUndefined(payment?.paths)
    assert.isUndefined(payment?.sendMax)
  })

  it('Convert Payment with invalid amount field', function (): void {
    // GIVEN a pyament protocol buffer with an invalid amount field
    // WHEN the protocol buffer is converted to a native TypeScript type THEN the result is undefined
    assert.isUndefined(
      XrpPayment.from(testInvalidPaymentProtoBadAmount, XrplNetwork.Test),
    )
  })

  it('Convert Payment with invalid deliverMin field', function (): void {
    // GIVEN a payment protocol buffer with an invalid deliverMin field
    // WHEN the protocol buffer is converted to a native TypeScript type THEN the result is undefined
    assert.isUndefined(
      XrpPayment.from(testInvalidPaymentProtoBadDeliverMin, XrplNetwork.Test),
    )
  })

  it('Convert Payment with invalid sendMax field', function (): void {
    // GIVEN a payment protocol buffer with an invalid sendMax field
    // WHEN the protocol buffer is converted to a native TypeScript type THEN the result is undefined
    assert.isUndefined(
      XrpPayment.from(testInvalidPaymentProtoBadSendMax, XrplNetwork.Test),
    )
  })

  // Memo

  it('Convert Memo with all fields set', function (): void {
    // GIVEN a memo with all fields set.
    // WHEN the protocol buffer is converted to a native TypeScript type
    const memo = XrpMemo.from(testMemoProtoAllFields)

    // THEN all fields are present and set correctly.
    assert.deepEqual(memo?.data, testMemoData)
    assert.deepEqual(memo?.format, testMemoFormat)
    assert.deepEqual(memo?.type, testMemoType)
  })

  it('Convert Memo with no fields set', function (): void {
    // GIVEN a memo with no fields set.
    // WHEN the protocol buffer is converted to a native TypeScript type
    const memo = XrpMemo.from(testEmptyMemoProto)

    // THEN all fields are undefined.
    assert.isUndefined(memo?.data)
    assert.isUndefined(memo?.format)
    assert.isUndefined(memo?.type)
  })

  // Signer

  it('Convert Signer with all fields set', function (): void {
    // GIVEN a Signer protocol buffer with all fields set.
    // WHEN the protocol buffer is converted to a native TypeScript type.
    const signer = XrpSigner.from(testSignerProto)

    // THEN all fields are present and converted correctly.
    assert.equal(
      signer?.account,
      testSignerProto.getAccount()?.getValue()?.getAddress(),
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

  // SignerEntry

  it('Convert SignerEntry with all fields set', function (): void {
    // GIVEN a SignerEntry protocol buffer with all fields set.
    // WHEN the protocol buffer is converted to a native TypeScript type.
    const signerEntry = XrpSignerEntry.from(testSignerEntryProto)

    // THEN all fields are present and converted correctly.
    assert.equal(
      signerEntry?.account,
      testSignerEntryProto?.getAccount()?.getValue()?.getAddress(),
    )
    assert.equal(
      signerEntry?.signerWeight,
      testSignerEntryProto.getSignerWeight()?.getValue(),
    )
  })

  it('Convert SignerEntry with no fields set', function (): void {
    // GIVEN a SignerEntry protocol buffer with no fields set.
    // WHEN the protocol buffer is converted to a native TypeScript type.
    const signerEntry = XrpSignerEntry.from(new SignerEntry())

    // THEN the result is undefined.
    assert.isUndefined(signerEntry)
  })

  // Transaction

  it('Convert PAYMENT Transaction, all common fields set', function (): void {
    // GIVEN a GetTransactionResponse protobuf containing a Transaction protobuf with all common fields set.
    const transactionProto = testGetTransactionResponseProto.getTransaction()

    // WHEN the protocol buffer is converted to a native TypeScript type.
    const transaction = XrpTransaction.from(
      testGetTransactionResponseProto,
      XrplNetwork.Test,
    )

    // THEN all fields are present and converted correctly.
    assert.equal(transaction?.fee, testFee)
    assert.equal(transaction?.sequence, testSequence)
    assert.equal(transaction?.signingPublicKey, testPublicKey)
    assert.equal(transaction?.transactionSignature, testTransactionSignature)
    assert.equal(transaction?.accountTransactionID, testAccountTransactionID)
    assert.equal(transaction?.flags, testFlags)
    assert.equal(transaction?.lastLedgerSequence, testLastLedgerSequence)
    assert.deepEqual(transaction?.memos, [
      XrpMemo.from(testMemoProtoAllFields)!,
    ])
    assert.deepEqual(transaction?.signers, [XrpSigner.from(testSignerProto)!])
    assert.equal(
      transaction?.sourceXAddress,
      XrpUtils.encodeXAddress(
        transactionProto!.getAccount()!.getValue()!.getAddress()!,
        transactionProto!.getSourceTag()?.getValue(),
        true,
      ),
    )
    assert.equal(transaction?.hash, Utils.toHex(testTransactionHash))
    assert.equal(transaction?.timestamp, expectedTimestamp)
    assert.equal(
      transaction?.deliveredAmount,
      testGetTransactionResponseProto
        .getMeta()
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
    const transactionProto = testGetTransactionResponseProtoMandatoryOnly.getTransaction()

    // WHEN the protocol buffer is converted to a native TypeScript type.
    const transaction = XrpTransaction.from(
      testGetTransactionResponseProtoMandatoryOnly,
      XrplNetwork.Test,
    )

    // THEN all fields are present and converted correctly.
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
    assert.equal(
      transaction?.sourceXAddress,
      XrpUtils.encodeXAddress(
        transactionProto!.getAccount()!.getValue()!.getAddress()!,
        transactionProto!.getSourceTag()?.getValue(),
        true,
      ),
    )
    assert.isUndefined(transaction?.timestamp)
    assert.isUndefined(transaction?.deliveredAmount)
  })

  it('Convert PAYMENT Transaction with bad payment fields', function (): void {
    // GIVEN a GetTransactionResponse protocol buffer with Transaction payment fields which are incorrect
    // WHEN the protocol buffer is converted to a native TypeScript type.
    const transaction = XrpTransaction.from(
      testInvalidGetTransactionResponseProto,
      XrplNetwork.Test,
    )

    // THEN the result is undefined
    assert.isUndefined(transaction)
  })

  it('Convert unsupported transaction type', function (): void {
    // GIVEN a GetTransactionResponse protocol buffer with a Transaction of unsupported type
    // WHEN the protocol buffer is converted to a native TypeScript type.
    const transaction = XrpTransaction.from(
      testInvalidGetTransactionResponseProtoUnsupportedType,
      XrplNetwork.Test,
    )

    // THEN the result is undefined
    assert.isUndefined(transaction)
  })
})
