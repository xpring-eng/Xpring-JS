import { assert } from 'chai'
import XRPAccountSet from '../../src/XRP/model/xrp-account-set'
import XRPAccountDelete from '../../src/XRP/model/xrp-account-delete'
import XRPCheckCancel from '../../src/XRP/model/xrp-check-cancel'
import XRPCheckCash from '../../src/XRP/model/xrp-check-cash'
import XRPCheckCreate from '../../src/XRP/model/xrp-check-create'
import XRPDepositPreauth from '../../src/XRP/model/xrp-deposit-preauth'
import XRPEscrowCancel from '../../src/XRP/model/xrp-escrow-cancel'
import {
  testAccountSetProtoAllFields,
  testAccountSetProtoOneFieldSet,
  testAccountDeleteProto,
  testAccountDeleteProtoNoTag,
  testCheckCancelProto,
  testCheckCashProtoWithAmount,
  testCheckCashProtoWithDeliverMin,
  testCheckCreateProtoAllFields,
  testCheckCreateProtoMandatoryFields,
  testInvalidCheckCancelProto,
  testInvalidCheckCashProto,
  testInvalidCheckCreateProto,
  testDepositPreauthProtoSetAuthorize,
  testDepositPreauthProtoSetUnauthorize,
  testEscrowCancelProto,
} from './fakes/fake-xrp-transaction-type-protobufs'
import { XRPCurrencyAmount } from '../../src/XRP/model'

describe('Protobuf Conversions - Transaction Types', function (): void {
  // AccountSet

  it('Convert AccountSet protobuf with all fields to XRPAccountSet object', function (): void {
    // GIVEN an AccountSet protocol buffer with all fields set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const accountSet = XRPAccountSet.from(testAccountSetProtoAllFields)

    // THEN the AccountSet converted as expected.
    assert.deepEqual(
      accountSet?.clearFlag,
      testAccountSetProtoAllFields.getClearFlag()?.getValue(),
    )
    assert.deepEqual(
      accountSet?.domain,
      testAccountSetProtoAllFields.getDomain()?.getValue(),
    )
    assert.deepEqual(
      accountSet?.emailHash,
      testAccountSetProtoAllFields.getEmailHash()?.getValue(),
    )
    assert.deepEqual(
      accountSet?.messageKey,
      testAccountSetProtoAllFields.getMessageKey()?.getValue(),
    )
    assert.deepEqual(
      accountSet?.setFlag,
      testAccountSetProtoAllFields.getSetFlag()?.getValue(),
    )
    assert.deepEqual(
      accountSet?.transferRate,
      testAccountSetProtoAllFields.getTransferRate()?.getValue(),
    )
    assert.deepEqual(
      accountSet?.tickSize,
      testAccountSetProtoAllFields.getTickSize()?.getValue(),
    )
  })

  it('Convert AccountSet protobuf with one field to XRPAccountSet object', function (): void {
    // GIVEN an AccountSet protocol buffer with only one field set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const accountSet = XRPAccountSet.from(testAccountSetProtoOneFieldSet)

    // THEN the AccountSet converted as expected.
    assert.deepEqual(
      accountSet?.clearFlag,
      testAccountSetProtoAllFields.getClearFlag()?.getValue(),
    )
    assert.isUndefined(accountSet?.domain)
    assert.isUndefined(accountSet?.emailHash)
    assert.isUndefined(accountSet?.messageKey)
    assert.isUndefined(accountSet?.setFlag)
    assert.isUndefined(accountSet?.transferRate)
    assert.isUndefined(accountSet?.tickSize)
  })

  it('Convert AccountDelete protobuf with all fields to XRPAccountDelete object', function (): void {
    // GIVEN an AccountDelete protocol buffer with all fields set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const accountDelete = XRPAccountDelete.from(testAccountDeleteProto)

    // THEN the AccountDelete converted as expected.
    assert.deepEqual(
      accountDelete?.destination,
      testAccountDeleteProto.getDestination()?.getValue()?.getAddress(),
    )
    assert.deepEqual(
      accountDelete?.destination,
      testAccountDeleteProto.getDestination()?.getValue()?.getAddress(),
    )
  })

  it('Convert AccountDelete protobuf with no tag to XRPAccountDelete object', function (): void {
    // GIVEN an AccountDelete protocol buffer with only destination field set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const accountDelete = XRPAccountDelete.from(testAccountDeleteProtoNoTag)

    // THEN the AccountDelete converted as expected.
    assert.deepEqual(
      accountDelete?.destination,
      testAccountDeleteProtoNoTag.getDestination()?.getValue()?.getAddress(),
    )
    assert.isUndefined(accountDelete?.destinationTag)
  })

  it('Convert CheckCancel protobuf to XRPCheckCancel object', function (): void {
    // GIVEN a CheckCancel protocol buffer.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const checkCancel = XRPCheckCancel.from(testCheckCancelProto)

    // THEN the CheckCancel converted as expected.
    assert.equal(
      checkCancel?.checkId,
      testCheckCancelProto.getCheckId()?.getValue_asB64(),
    )
  })

  it('Convert CheckCancel protobuf with missing checkId', function (): void {
    // GIVEN a CheckCancel protocol buffer without a checkId.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const checkCancel = XRPCheckCancel.from(testInvalidCheckCancelProto)

    // THEN the result is undefined.
    assert.isUndefined(checkCancel)
  })

  it('Convert CheckCash protobuf to XRPCheckCash object - amount field set', function (): void {
    // GIVEN a valid CheckCash protocol buffer with amount field set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const checkCash = XRPCheckCash.from(testCheckCashProtoWithAmount)

    // THEN the CheckCash converted as expected.
    assert.equal(
      checkCash?.checkId,
      testCheckCashProtoWithAmount.getCheckId()?.getValue_asB64(),
    )
    assert.deepEqual(
      checkCash?.amount,
      XRPCurrencyAmount.from(
        testCheckCashProtoWithAmount.getAmount()!.getValue()!,
      ),
    )
    assert.isUndefined(checkCash?.deliverMin)
  })

  it('Convert CheckCash protobuf to XRPCheckCash object - deliverMin field set', function (): void {
    // GIVEN a valid CheckCash protocol buffer with deliverMin field set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const checkCash = XRPCheckCash.from(testCheckCashProtoWithDeliverMin)

    // THEN the CheckCash converted as expected.
    assert.equal(
      checkCash?.checkId,
      testCheckCashProtoWithDeliverMin.getCheckId()?.getValue_asB64(),
    )
    assert.isUndefined(checkCash?.amount)
    assert.deepEqual(
      checkCash?.deliverMin,
      XRPCurrencyAmount.from(
        testCheckCashProtoWithDeliverMin.getDeliverMin()!.getValue()!,
      ),
    )
  })

  it('Convert invalid CheckCash protobuf to XRPCheckCash object - missing checkId ', function (): void {
    // GIVEN an invalid CheckCash protocol buffer missing the checkId field.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const checkCash = XRPCheckCash.from(testInvalidCheckCashProto)

    // THEN the result is undefined.
    assert.isUndefined(checkCash)
  })

  it('Convert CheckCreate protobuf to XRPCheckCreate object - all fields', function (): void {
    // GIVEN a CheckCreate protocol buffer with all fields set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const checkCreate = XRPCheckCreate.from(testCheckCreateProtoAllFields)

    // THEN the CheckCreate converted as expected.
    assert.equal(
      checkCreate?.destination,
      testCheckCreateProtoAllFields.getDestination()?.getValue()?.getAddress(),
    )
    assert.deepEqual(
      checkCreate?.sendMax,
      XRPCurrencyAmount.from(
        testCheckCreateProtoAllFields.getSendMax()!.getValue()!,
      ),
    )
    assert.equal(
      checkCreate?.destinationTag,
      testCheckCreateProtoAllFields.getDestinationTag()?.getValue(),
    )
    assert.equal(
      checkCreate?.expiration,
      testCheckCreateProtoAllFields.getExpiration()?.getValue(),
    )
    assert.equal(
      checkCreate?.invoiceId,
      testCheckCreateProtoAllFields.getInvoiceId()?.getValue_asB64(),
    )
  })

  it('Convert CheckCreate protobuf to XRPCheckCreate object - mandatory fields', function (): void {
    // GIVEN a CheckCreate protocol buffer with only mandatory fields set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const checkCreate = XRPCheckCreate.from(testCheckCreateProtoMandatoryFields)

    // THEN the CheckCreate converted as expected.
    assert.equal(
      checkCreate?.destination,
      testCheckCreateProtoMandatoryFields
        .getDestination()
        ?.getValue()
        ?.getAddress(),
    )
    assert.deepEqual(
      checkCreate?.sendMax,
      XRPCurrencyAmount.from(
        testCheckCreateProtoMandatoryFields.getSendMax()!.getValue()!,
      ),
    )
    assert.isUndefined(checkCreate?.destinationTag)
    assert.isUndefined(checkCreate?.expiration)
    assert.isUndefined(checkCreate?.invoiceId)
  })

  it('Convert invalid CheckCreate protobuf to XRPCheckCash object - missing destination ', function (): void {
    // GIVEN an invalid CheckCreate protocol buffer missing the destination field.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const checkCreate = XRPCheckCreate.from(testInvalidCheckCreateProto)

    // THEN the result is undefined.
    assert.isUndefined(checkCreate)
  })

  it('Convert DepositPreauth protobuf to XRPDepositPreauth object - authorize set', function (): void {
    // GIVEN a DespoitPreauth protocol buffer with authorize field set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const depositPreauth = XRPDepositPreauth.from(
      testDepositPreauthProtoSetAuthorize,
    )

    // THEN the DepositPreauth converted as expected.
    assert.equal(
      depositPreauth?.authorize,
      testDepositPreauthProtoSetAuthorize
        .getAuthorize()
        ?.getValue()
        ?.getAddress(),
    )
  })

  it('Convert DepositPreauth protobuf to XRPDepositPreauth object - unauthorize set', function (): void {
    // GIVEN a DespoitPreauth protocol buffer with unauthorize field set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const depositPreauth = XRPDepositPreauth.from(
      testDepositPreauthProtoSetUnauthorize,
    )

    // THEN the DepositPreauth converted as expected.
    assert.equal(
      depositPreauth?.unauthorize,
      testDepositPreauthProtoSetUnauthorize
        .getUnauthorize()
        ?.getValue()
        ?.getAddress(),
    )
  })

  it('Convert EscrowCancel protobuf to XRPEscrowCancel object - valid fields', function (): void {
    // GIVEN an EscrowCancel protocol buffer with all fields set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const escrowCancel = XRPEscrowCancel.from(testEscrowCancelProto)

    // THEN the EscrowCancel converted as expected.
    assert.equal(
      escrowCancel?.owner,
      testEscrowCancelProto.getOwner()?.getValue()?.getAddress(),
    )
    assert.equal(
      escrowCancel?.offerSequence,
      testEscrowCancelProto.getOfferSequence()?.getValue(),
    )
  })

  it('Convert EscrowCancel protobuf to XRPEscrowCancel object - missing fields', function (): void {
    // GIVEN an EscrowCancel protocol buffer missing required fields.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const escrowCancel = XRPEscrowCancel.from(testInvalidEscrowCancelProto)

    // THEN the result is undefined.
    assert.isUndefined(escrowCancel)
  })
})