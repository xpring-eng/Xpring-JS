/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain --
 * This rule should never be disabled in production, but for tests,
 * having a x?.y?.z! chain is a succinct way of getting the typing correct.
 */

import bigInt from 'big-integer'
import { assert } from 'chai'

import { Utils, XrplNetwork } from 'xpring-common-js'
import { XrpError, XrpUtils } from '../../../src'
import XrpCurrency from '../../../src/XRP/protobuf-wrappers/xrp-currency'
import XrpCurrencyAmount from '../../../src/XRP/protobuf-wrappers/xrp-currency-amount'
import XrplIssuedCurrency from '../../../src/XRP/protobuf-wrappers/xrpl-issued-currency'
import XrpMemo from '../../../src/XRP/protobuf-wrappers/xrp-memo'
import XrpPath from '../../../src/XRP/protobuf-wrappers/xrp-path'
import XrpPathElement from '../../../src/XRP/protobuf-wrappers/xrp-path-element'
import XrpPayment from '../../../src/XRP/protobuf-wrappers/xrp-payment'
import XrpSigner from '../../../src/XRP/protobuf-wrappers/xrp-signer'
import XrpTransaction from '../../../src/XRP/protobuf-wrappers/xrp-transaction'
import XrpSignerEntry from '../../../src/XRP/protobuf-wrappers/xrp-signer-entry'
import {
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
  testPathElementProtoWithAccount,
  testPathElementProtoWithCurrencyIssuer,
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
  testGetTransactionResponseProtoSigners,
  testInvalidIssuedCurrencyProtoBadValue,
  testInvalidIssuedCurrencyProtoBadIssuer,
  testInvalidIssuedCurrencyProtoBadCurrency,
  testInvalidCurrencyProtoNoName,
  testInvalidCurrencyProtoNoCode,
  testInvalidCurrencyAmountProto,
  testInvalidCurrencyAmountProtoEmpty,
  testInvalidPathElementWithAccountIssuer,
  testInvalidPathElementWithAccountCurrency,
  testInvalidPathElementProtoEmpty,
  testInvalidPaymentProtoNoAmount,
  testInvalidPaymentProtoBadDestination,
  testInvalidPaymentProtoNoDestination,
  testInvalidPaymentProtoXrpPaths,
  testInvalidPaymentProtoXrpSendMax,
  testInvalidSignerProtoNoAccount,
  testInvalidSignerProtoBadAccount,
  testInvalidSignerProtoNoPublicKey,
  testInvalidSignerProtoNoTxnSignature,
  testInvalidSignerEntryProtoNoAccount,
  testInvalidSignerEntryProtoBadAccount,
  testInvalidSignerEntryProtoNoSignerWeight,
  testInvalidGetTransactionResponseProto,
  testInvalidGetTransactionResponseProtoUnsupportedType,
  testInvalidGetTransactionResponseProtoNoTransaction,
  testInvalidGetTransactionResponseProtoNoAccount,
  testInvalidGetTransactionResponseProtoBadAccount,
  testInvalidGetTransactionResponseProtoNoFee,
  testInvalidGetTransactionResponseProtoBadFee,
  testInvalidGetTransactionResponseProtoNoSequence,
  testInvalidGetTransactionResponseProtoNoSigningPublicKey,
  testInvalidGetTransactionResponseProtoNoSigners,
  testInvalidGetTransactionResponseProtoNoSignature,
  testInvalidGetTransactionResponseProtoNoData,
  testInvalidGetTransactionResponseProtoNoHash,
} from '../fakes/fake-xrp-protobufs'

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
    assert.throws(() => {
      XrpCurrency.from(testInvalidCurrencyProtoNoName)
    }, XrpError)
  })

  it('Convert Currency protobuf missing required field code', function (): void {
    // GIVEN a Currency protocol buffer missing a code.
    // WHEN the protocol buffer is converted to a native Typescript type THEN an error is thrown.
    assert.throws(() => {
      XrpCurrency.from(testInvalidCurrencyProtoNoCode)
    }, XrpError)
  })

  // PathElement

  it('Convert PathElement protobuf with one valid field set to XrpPathElement', function (): void {
    // GIVEN a PathElement protocol buffer with account field set.
    // WHEN the protocol buffer is converted to a native TypeScript type.
    const pathElement = XrpPathElement.from(testPathElementProtoWithAccount)

    // THEN the currency converted as expected.
    assert.equal(
      pathElement.account,
      testPathElementProtoWithAccount.getAccount()!.getAddress(),
    )
    assert.equal(pathElement.currency, undefined)
    assert.equal(pathElement.issuer, undefined)
  })

  it('Convert PathElement protobuf with two valid fields set to XrpPathElement', function (): void {
    // GIVEN a PathElement protocol buffer with currency and issuer fields set.
    // WHEN the protocol buffer is converted to a native TypeScript type.
    const pathElement = XrpPathElement.from(
      testPathElementProtoWithCurrencyIssuer,
    )

    // THEN the currency converted as expected.
    assert.equal(pathElement.account, undefined)
    assert.deepEqual(
      pathElement.currency,
      XrpCurrency.from(testPathElementProtoWithCurrencyIssuer.getCurrency()!),
    )
    assert.equal(
      pathElement.issuer,
      testPathElementProtoWithCurrencyIssuer.getIssuer()!.getAddress(),
    )
  })

  it('Convert PathElement protobuf with mutually exclusive fields set to XrpPathElement', function (): void {
    // GIVEN a PathElement protocol buffer with account and currency fields set.
    // WHEN the protocol buffer is converted to a native Typescript type THEN an error is thrown.
    assert.throws(() => {
      XrpPathElement.from(testInvalidPathElementWithAccountCurrency)
    }, XrpError)
  })

  it('Convert PathElement protobuf with different mutually exclusive fields set to XrpPathElement', function (): void {
    // GIVEN a PathElement protocol buffer with account and issuer fields set.
    // WHEN the protocol buffer is converted to a native Typescript type THEN an error is thrown.
    assert.throws(() => {
      XrpPathElement.from(testInvalidPathElementWithAccountIssuer)
    }, XrpError)
  })

  it('Convert PathElement protobuf with no fields set to XrpPathElement', function (): void {
    // GIVEN a PathElement protocol buffer with no fields set.
    // WHEN the protocol buffer is converted to a native Typescript type THEN an error is thrown.
    assert.throws(() => {
      XrpPathElement.from(testInvalidPathElementProtoEmpty)
    }, XrpError)
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

  it('Convert IssuedCurrency to XrplIssuedCurrency', function (): void {
    // GIVEN an IssuedCurrency protocol buffer,
    // WHEN the protocol buffer is converted to a native TypeScript type.
    const issuedCurrency = XrplIssuedCurrency.from(testIssuedCurrencyProto)

    // THEN the IssuedCurrency converted as expected.
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
    // GIVEN an IssuedCurrency protocol buffer with an invalid value field
    // WHEN the protocol buffer is converted to a native TypeScript type THEN an error is thrown.
    assert.throws(() => {
      XrplIssuedCurrency.from(testInvalidIssuedCurrencyProtoBadValue)
    }, XrpError)
  })

  it('Convert IssuedCurrency with bad issuer', function (): void {
    // GIVEN an IssuedCurrency protocol buffer with a missing issuer field
    // WHEN the protocol buffer is converted to a native TypeScript type THEN an error is thrown.
    assert.throws(() => {
      XrplIssuedCurrency.from(testInvalidIssuedCurrencyProtoBadIssuer)
    }, XrpError)
  })

  it('Convert IssuedCurrency with bad currency', function (): void {
    // GIVEN an IssuedCurrency protocol buffer with a missing currency field
    // WHEN the protocol buffer is converted to a native TypeScript type THEN an error is thrown.
    assert.throws(() => {
      XrplIssuedCurrency.from(testInvalidIssuedCurrencyProtoBadCurrency)
    }, XrpError)
  })

  // CurrencyAmount tests

  it('Convert CurrencyAmount with drops', function (): void {
    // GIVEN a CurrencyAmount protocol buffer with an XRP amount.
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
    // GIVEN a CurrencyAmount protocol buffer with an issued currency amount.
    // WHEN the protocol buffer is converted to a native TypeScript type.
    const currencyAmount = XrpCurrencyAmount.from(
      testCurrencyAmountProtoIssuedCurrency,
    )

    // THEN the result has an issued currency set and no drops amount.
    assert.deepEqual(
      currencyAmount?.issuedCurrency,
      XrplIssuedCurrency.from(testIssuedCurrencyProto),
    )
    assert.isUndefined(currencyAmount?.drops)
  })

  it('Convert CurrencyAmount with bad inputs', function (): void {
    // GIVEN a CurrencyAmount protocol buffer with no amounts
    // WHEN the protocol buffer is converted to a native TypeScript type THEN an error is thrown.
    assert.throws(() => {
      XrpCurrencyAmount.from(testInvalidCurrencyAmountProto)
    }, XrpError)
  })

  it('Convert CurrencyAmount with nothing set', function (): void {
    // GIVEN a CurrencyAmount protocol buffer with nothing set
    // WHEN the protocol buffer is converted to a native TypeScript type THEN an error is thrown.
    assert.throws(() => {
      XrpCurrencyAmount.from(testInvalidCurrencyAmountProtoEmpty)
    }, XrpError)
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
      payment.amount,
      XrpCurrencyAmount.from(
        testPaymentProtoAllFieldsSet.getAmount()?.getValue()!,
      ),
    )

    assert.equal(
      payment.destinationXAddress,
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
      payment.deliverMin,
      XrpCurrencyAmount.from(
        testPaymentProtoAllFieldsSet.getDeliverMin()?.getValue()!,
      ),
    )
    assert.deepEqual(
      payment.invoiceID,
      testPaymentProtoAllFieldsSet.getInvoiceId()?.getValue(),
    )
    assert.deepEqual(
      payment.paths,
      testPaymentProtoAllFieldsSet
        .getPathsList()
        .map((path) => XrpPath.from(path)),
    )
    assert.deepEqual(
      payment.sendMax,
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
      payment.amount,
      XrpCurrencyAmount.from(
        testPaymentProtoMandatoryFieldsOnly.getAmount()?.getValue()!,
      ),
    )

    assert.equal(
      payment.destinationXAddress,
      XrpUtils.encodeXAddress(
        testPaymentProtoMandatoryFieldsOnly
          ?.getDestination()!
          .getValue()!
          .getAddress()!,
        testPaymentProtoMandatoryFieldsOnly?.getDestinationTag()?.getValue(),
        true,
      ),
    )

    assert.deepEqual(
      payment.sendMax,
      XrpCurrencyAmount.from(
        testPaymentProtoMandatoryFieldsOnly.getSendMax()?.getValue()!,
      ),
    )
    assert.isUndefined(payment.deliverMin)
    assert.isUndefined(payment.invoiceID)
    assert.isUndefined(payment.paths)
  })

  it('Convert Payment without amount field', function (): void {
    // GIVEN a payment protocol buffer without amount field
    // WHEN the protocol buffer is converted to a native TypeScript type THEN an error is thrown
    assert.throws(() => {
      XrpPayment.from(testInvalidPaymentProtoNoAmount, XrplNetwork.Test)
    }, XrpError)
  })

  it('Convert Payment without destination field', function (): void {
    // GIVEN a payment protocol buffer without destination field
    // WHEN the protocol buffer is converted to a native TypeScript type THEN an error is thrown
    assert.throws(() => {
      XrpPayment.from(testInvalidPaymentProtoNoDestination, XrplNetwork.Test)
    }, XrpError)
  })

  it('Convert Payment with invalid destination field', function (): void {
    // GIVEN a payment protocol buffer with an invalid destination field
    // WHEN the protocol buffer is converted to a native TypeScript type THEN an error is thrown
    assert.throws(() => {
      XrpPayment.from(testInvalidPaymentProtoBadDestination, XrplNetwork.Test)
    }, XrpError)
  })

  it('Convert Payment with paths field in XRP transaction', function (): void {
    // GIVEN a payment protocol buffer with a paths field in an XRP transaction
    // WHEN the protocol buffer is converted to a native TypeScript type THEN an error is thrown
    assert.throws(() => {
      XrpPayment.from(testInvalidPaymentProtoXrpPaths, XrplNetwork.Test)
    }, XrpError)
  })

  it('Convert Payment with sendMax field in XRP transaction', function (): void {
    // GIVEN a payment protocol buffer with a sendMax field in an XRP transaction
    // WHEN the protocol buffer is converted to a native TypeScript type THEN an error is thrown
    assert.throws(() => {
      XrpPayment.from(testInvalidPaymentProtoXrpSendMax, XrplNetwork.Test)
    }, XrpError)
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
    // WHEN the protocol buffer is converted to a native TypeScript type THEN an error is thrown.
    assert.throws(() => {
      XrpMemo.from(testEmptyMemoProto)
    }, XrpError)
  })

  // Signer

  it('Convert Signer protobuf with all fields set', function (): void {
    // GIVEN a Signer protocol buffer with all fields set.
    // WHEN the protocol buffer is converted to a native TypeScript type.
    const signer = XrpSigner.from(testSignerProto, XrplNetwork.Test)

    // THEN all fields are present and converted correctly.
    assert.equal(
      signer?.accountXAddress,
      XrpUtils.encodeXAddress(
        testSignerProto.getAccount()?.getValue()?.getAddress()!,
        undefined,
        true,
      ),
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

  it('Convert Signer protobuf missing required field account', function (): void {
    // GIVEN a Signer protocol buffer missing an account.
    // WHEN the protocol buffer is converted to a native Typescript type THEN an error is thrown.
    assert.throws(() => {
      XrpSigner.from(testInvalidSignerProtoNoAccount, XrplNetwork.Test)
    }, XrpError)
  })

  it('Convert Signer protobuf with invalid field account', function (): void {
    // GIVEN a Signer protocol buffer with an invalid account.
    // WHEN the protocol buffer is converted to a native Typescript type THEN an error is thrown.
    assert.throws(() => {
      XrpSigner.from(testInvalidSignerProtoBadAccount, XrplNetwork.Test)
    }, XrpError)
  })

  it('Convert Signer protobuf missing required field SigningPubKey', function (): void {
    // GIVEN a Signer protocol buffer missing a public key.
    // WHEN the protocol buffer is converted to a native Typescript type THEN an error is thrown.
    assert.throws(() => {
      XrpSigner.from(testInvalidSignerProtoNoPublicKey, XrplNetwork.Test)
    }, XrpError)
  })

  it('Convert Signer protobuf missing required field TxnSignature', function (): void {
    // GIVEN a Signer protocol buffer missing a transaction signature.
    // WHEN the protocol buffer is converted to a native Typescript type THEN an error is thrown.
    assert.throws(() => {
      XrpSigner.from(testInvalidSignerProtoNoTxnSignature, XrplNetwork.Test)
    }, XrpError)
  })

  // SignerEntry

  it('Convert SignerEntry with all fields set', function (): void {
    // GIVEN a SignerEntry protocol buffer with all fields set.
    // WHEN the protocol buffer is converted to a native TypeScript type.
    const signerEntry = XrpSignerEntry.from(
      testSignerEntryProto,
      XrplNetwork.Test,
    )

    // THEN all fields are present and converted correctly.
    const expectedXAddress = XrpUtils.encodeXAddress(
      testSignerEntryProto.getAccount()?.getValue()?.getAddress()!,
      undefined,
      true,
    )
    assert.equal(signerEntry.accountXAddress, expectedXAddress)
    assert.equal(
      signerEntry.signerWeight,
      testSignerEntryProto.getSignerWeight()?.getValue(),
    )
  })

  it('Convert SignerEntry with no account field set', function (): void {
    // GIVEN a SignerEntry protocol buffer with no account field set.
    // WHEN the protocol buffer is converted to a native TypeScript type THEN an error is thrown.
    assert.throws(() => {
      XrpSignerEntry.from(
        testInvalidSignerEntryProtoNoAccount,
        XrplNetwork.Test,
      )
    }, XrpError)
  })

  it('Convert SignerEntry with bad account field', function (): void {
    // GIVEN a SignerEntry protocol buffer with a bad account field.
    // WHEN the protocol buffer is converted to a native TypeScript type THEN an error is thrown.
    assert.throws(() => {
      XrpSignerEntry.from(
        testInvalidSignerEntryProtoBadAccount,
        XrplNetwork.Test,
      )
    }, XrpError)
  })

  it('Convert SignerEntry with no SignerWeight field set', function (): void {
    // GIVEN a SignerEntry protocol buffer with no signerWeight field set.
    // WHEN the protocol buffer is converted to a native TypeScript type THEN an error is thrown.
    assert.throws(() => {
      XrpSignerEntry.from(
        testInvalidSignerEntryProtoNoSignerWeight,
        XrplNetwork.Test,
      )
    }, XrpError)
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
    assert.equal(transaction.fee, testFee)
    assert.equal(transaction.sequence, testSequence)
    assert.equal(
      transaction.signingPublicKey,
      transactionProto?.getSigningPublicKey()?.getValue_asB64(),
    )
    assert.equal(transaction.transactionSignature, testTransactionSignature)
    assert.equal(transaction.accountTransactionID, testAccountTransactionID)
    assert.equal(transaction.flags, testFlags)
    assert.equal(transaction.lastLedgerSequence, testLastLedgerSequence)
    assert.deepEqual(transaction.memos, [XrpMemo.from(testMemoProtoAllFields)!])
    assert.deepEqual(transaction.signers, [
      XrpSigner.from(testSignerProto, XrplNetwork.Test)!,
    ])
    assert.equal(
      transaction.sourceXAddress,
      XrpUtils.encodeXAddress(
        transactionProto!.getAccount()!.getValue()!.getAddress()!,
        transactionProto!.getSourceTag()?.getValue(),
        true,
      ),
    )
    assert.equal(transaction.hash, Utils.toHex(testTransactionHash))
    assert.equal(transaction.timestamp, expectedTimestamp)
    assert.equal(
      transaction.deliveredAmount,
      testGetTransactionResponseProto
        .getMeta()
        ?.getDeliveredAmount()
        ?.getValue()
        ?.getIssuedCurrencyAmount()
        ?.getValue(),
    )
    assert.equal(transaction.validated, testIsValidated)
    assert.equal(transaction.ledgerIndex, testLedgerIndex)
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
    assert.equal(transaction.fee, testFee)
    assert.equal(transaction.sequence, testSequence)
    assert.deepEqual(
      transaction.signingPublicKey,
      transactionProto?.getSigningPublicKey()?.getValue_asB64(),
    )
    assert.deepEqual(transaction.transactionSignature, testTransactionSignature)
    assert.equal(transaction.hash, Utils.toHex(testTransactionHash))
    assert.isUndefined(transaction.accountTransactionID)
    assert.isUndefined(transaction.flags)
    assert.isUndefined(transaction.lastLedgerSequence)
    assert.isUndefined(transaction.memos)
    assert.isUndefined(transaction.signers)
    assert.equal(
      transaction.sourceXAddress,
      XrpUtils.encodeXAddress(
        transactionProto!.getAccount()!.getValue()!.getAddress()!,
        transactionProto!.getSourceTag()?.getValue(),
        true,
      ),
    )
    assert.isUndefined(transaction.timestamp)
    assert.isUndefined(transaction.deliveredAmount)
  })

  it('Convert PAYMENT Transaction with mandatory common fields set, with signers instead of public key', function (): void {
    // GIVEN a GetTransactionResponse protocol buffer containing a Transaction protobuf with only mandatory common fields set.
    const transactionProto = testGetTransactionResponseProtoSigners.getTransaction()

    // WHEN the protocol buffer is converted to a native TypeScript type.
    const transaction = XrpTransaction.from(
      testGetTransactionResponseProtoSigners,
      XrplNetwork.Test,
    )

    // THEN all fields are present and converted correctly.
    assert.equal(transaction.fee, testFee)
    assert.equal(transaction.sequence, testSequence)
    assert.deepEqual(
      transaction.signingPublicKey,
      transactionProto?.getSigningPublicKey()?.getValue_asB64(),
    )
    assert.deepEqual(transaction.transactionSignature, testTransactionSignature)
    assert.equal(transaction.hash, Utils.toHex(testTransactionHash))
    assert.isUndefined(transaction.accountTransactionID)
    assert.isUndefined(transaction.flags)
    assert.isUndefined(transaction.lastLedgerSequence)
    assert.isUndefined(transaction.memos)
    assert.deepEqual(transaction.signers, [
      XrpSigner.from(testSignerProto, XrplNetwork.Test)!,
    ])
    assert.equal(
      transaction.sourceXAddress,
      XrpUtils.encodeXAddress(
        transactionProto?.getAccount()!.getValue()!.getAddress()!,
        transactionProto?.getSourceTag()?.getValue(),
        true,
      ),
    )
    assert.isUndefined(transaction.timestamp)
    assert.isUndefined(transaction.deliveredAmount)
  })

  it('Convert PAYMENT Transaction with bad payment fields', function (): void {
    // GIVEN a GetTransactionResponse protocol buffer with Transaction payment fields which are incorrect
    // WHEN the protocol buffer is converted to a native TypeScript type THEN an error is thrown.
    assert.throws(() => {
      XrpTransaction.from(
        testInvalidGetTransactionResponseProto,
        XrplNetwork.Test,
      )
    }, XrpError)
  })

  it('Convert unsupported transaction type', function (): void {
    // GIVEN a GetTransactionResponse protocol buffer with a Transaction of unsupported type
    // WHEN the protocol buffer is converted to a native TypeScript type THEN an error is thrown.
    assert.throws(() => {
      XrpTransaction.from(
        testInvalidGetTransactionResponseProtoUnsupportedType,
        XrplNetwork.Test,
      )
    }, XrpError)
  })

  it('Convert Transaction with no transaction', function (): void {
    // GIVEN a GetTransactionResponse protocol buffer with no Transaction field
    // WHEN the protocol buffer is converted to a native TypeScript type THEN an error is thrown.
    assert.throws(() => {
      XrpTransaction.from(
        testInvalidGetTransactionResponseProtoNoTransaction,
        XrplNetwork.Test,
      )
    }, XrpError)
  })

  it('Convert PAYMENT Transaction with no account', function (): void {
    // GIVEN a GetTransactionResponse protocol buffer with a Transaction field missing an account field
    // WHEN the protocol buffer is converted to a native TypeScript type THEN an error is thrown.
    assert.throws(() => {
      XrpTransaction.from(
        testInvalidGetTransactionResponseProtoNoAccount,
        XrplNetwork.Test,
      )
    }, XrpError)
  })

  it('Convert PAYMENT Transaction with bad account', function (): void {
    // GIVEN a GetTransactionResponse protocol buffer with a Transaction field with a bad account field
    // WHEN the protocol buffer is converted to a native TypeScript type THEN an error is thrown.
    assert.throws(() => {
      XrpTransaction.from(
        testInvalidGetTransactionResponseProtoBadAccount,
        XrplNetwork.Test,
      )
    }, XrpError)
  })

  it('Convert PAYMENT Transaction with no fee', function (): void {
    // GIVEN a GetTransactionResponse protocol buffer with a Transaction field missing a fee field
    // WHEN the protocol buffer is converted to a native TypeScript type THEN an error is thrown.
    assert.throws(() => {
      XrpTransaction.from(
        testInvalidGetTransactionResponseProtoNoFee,
        XrplNetwork.Test,
      )
    }, XrpError)
  })

  it('Convert PAYMENT Transaction with bad fee', function (): void {
    // GIVEN a GetTransactionResponse protocol buffer with a Transaction field with a bad fee field
    // WHEN the protocol buffer is converted to a native TypeScript type THEN an error is thrown.
    assert.throws(() => {
      XrpTransaction.from(
        testInvalidGetTransactionResponseProtoBadFee,
        XrplNetwork.Test,
      )
    }, XrpError)
  })

  it('Convert PAYMENT Transaction with no sequence', function (): void {
    // GIVEN a GetTransactionResponse protocol buffer with a Transaction field missing a sequence field
    // WHEN the protocol buffer is converted to a native TypeScript type THEN an error is thrown.
    assert.throws(() => {
      XrpTransaction.from(
        testInvalidGetTransactionResponseProtoNoSequence,
        XrplNetwork.Test,
      )
    }, XrpError)
  })

  it('Convert PAYMENT Transaction with no signingPublicKey', function (): void {
    // GIVEN a GetTransactionResponse protocol buffer with a Transaction field missing a signingPublicKey field
    // WHEN the protocol buffer is converted to a native TypeScript type THEN an error is thrown.
    assert.throws(() => {
      XrpTransaction.from(
        testInvalidGetTransactionResponseProtoNoSigningPublicKey,
        XrplNetwork.Test,
      )
    }, XrpError)
  })

  it('Convert PAYMENT Transaction with no signers', function (): void {
    // GIVEN a GetTransactionResponse protocol buffer with a Transaction field missing a signers field
    // WHEN the protocol buffer is converted to a native TypeScript type THEN an error is thrown.
    assert.throws(() => {
      XrpTransaction.from(
        testInvalidGetTransactionResponseProtoNoSigners,
        XrplNetwork.Test,
      )
    }, XrpError)
  })

  it('Convert PAYMENT Transaction with no transactionSignature', function (): void {
    // GIVEN a GetTransactionResponse protocol buffer with a Transaction field missing a transactionSignature field
    // WHEN the protocol buffer is converted to a native TypeScript type THEN an error is thrown.
    assert.throws(() => {
      XrpTransaction.from(
        testInvalidGetTransactionResponseProtoNoSignature,
        XrplNetwork.Test,
      )
    }, XrpError)
  })

  it('Convert PAYMENT Transaction with no data', function (): void {
    // GIVEN a GetTransactionResponse protocol buffer with a Transaction field missing a data field
    // WHEN the protocol buffer is converted to a native TypeScript type THEN an error is thrown.
    assert.throws(() => {
      XrpTransaction.from(
        testInvalidGetTransactionResponseProtoNoData,
        XrplNetwork.Test,
      )
    }, XrpError)
  })

  it('Convert PAYMENT Transaction with no hash', function (): void {
    // GIVEN a GetTransactionResponse protocol buffer with a Transaction field missing a hash field
    // WHEN the protocol buffer is converted to a native TypeScript type THEN an error is thrown.
    assert.throws(() => {
      XrpTransaction.from(
        testInvalidGetTransactionResponseProtoNoHash,
        XrplNetwork.Test,
      )
    }, XrpError)
  })
})
