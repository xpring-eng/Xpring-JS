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
import { Utils } from '../../src'
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

describe('Protobuf Conversions - Transaction Types', function (): void {
  // AccountSet

  it('Convert AccountSet protobuf to XRPAccountSet object', function (): void {
    // GIVEN an AccountSet protocol buffer with all fields set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const accountSet = XRPAccountSet.from()

    // THEN the AccountSet converted as expected.
    assert.deepEqual()
  })
})
