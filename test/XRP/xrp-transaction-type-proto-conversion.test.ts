import { assert } from 'chai'

import { Utils } from 'xpring-common-js'
import XRPAccountSet from '../../src/XRP/model/xrp-account-set'
import XRPOfferCreate from '../../src/XRP/model/xrp-offer-create'
import XrpOfferCancel from '../../src/XRP/model/xrp-offer-cancel'
import XrpEscrowFinish from '../../src/XRP/model/xrp-escrow-finish'
import XrpEscrowCreate from '../../src/XRP/model/xrp-escrow-create'
import XrpEscrowCancel from '../../src/XRP/model/xrp-escrow-cancel'
import XrpDepositPreauth from '../../src/XRP/model/xrp-deposit-preauth'
import XrpCheckCreate from '../../src/XRP/model/xrp-check-create'
import XrpCheckCash from '../../src/XRP/model/xrp-check-cash'
import XrpCheckCancel from '../../src/XRP/model/xrp-check-cancel'
import XrpAccountDelete from '../../src/XRP/model/xrp-account-delete'
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
  testDepositPreauthProtoSetAuthorize,
  testDepositPreauthProtoSetUnauthorize,
  testEscrowCancelProto,
  testEscrowCreateProtoAllFields,
  testEscrowCreateProtoMandatoryOnly,
  testEscrowFinishProtoAllFields,
  testEscrowFinishProtoMandatoryOnly,
  testOfferCancelProto,
  testOfferCreateProtoAllFields,
  testOfferCreateProtoMandatoryOnly,
  testInvalidCheckCancelProto,
  testInvalidCheckCashProto,
  testInvalidCheckCreateProto,
  testInvalidEscrowCancelProto,
  testInvalidEscrowCreateProto,
  testInvalidEscrowFinishProto,
  testInvalidOfferCancelProto,
  testInvalidOfferCreateProto,
} from './fakes/fake-xrp-transaction-type-protobufs'
import { XRPCurrencyAmount } from '../../src/XRP/model'
import XRPLNetwork from '../../src/Common/xrpl-network'
import { AccountDelete } from '../../src/XRP/Generated/web/org/xrpl/rpc/v1/transaction_pb'

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

  // AccountDelete

  it('Convert AccountDelete protobuf with all fields to XRPAccountDelete object', function (): void {
    // GIVEN an AccountDelete protocol buffer with all fields set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const accountDelete = XrpAccountDelete.from(
      testAccountDeleteProto,
      XRPLNetwork.Test,
    )

    // THEN the AccountDelete converted as expected.
    const expectedXAddress = Utils.encodeXAddress(
      testAccountDeleteProto.getDestination()!.getValue()!.getAddress()!,
      testAccountDeleteProto.getDestinationTag()?.getValue(),
      true,
    )
    assert.deepEqual(accountDelete?.destinationXAddress, expectedXAddress)
  })

  it('Convert AccountDelete protobuf with no tag to XrpAccountDelete object', function (): void {
    // GIVEN an AccountDelete protocol buffer with only destination field set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const accountDelete = XrpAccountDelete.from(
      testAccountDeleteProtoNoTag,
      XRPLNetwork.Test,
    )

    // THEN the AccountDelete converted as expected.
    const expectedXAddress = Utils.encodeXAddress(
      testAccountDeleteProtoNoTag.getDestination()!.getValue()!.getAddress()!,
      testAccountDeleteProtoNoTag.getDestinationTag()?.getValue(),
      true,
    )
    assert.deepEqual(accountDelete?.destinationXAddress, expectedXAddress)
  })

  it('Convert AccountDelete protobuf to XrpAccountDelete object - missing destination field', function (): void {
    // GIVEN an AccountDelete protocol buffer missing the destination field.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const accountDelete = XrpAccountDelete.from(
      new AccountDelete(),
      XRPLNetwork.Test,
    )

    // THEN the result is undefined.
    assert.isUndefined(accountDelete)
  })

  it('Convert CheckCancel protobuf to XrpCheckCancel object', function (): void {
    // GIVEN a CheckCancel protocol buffer.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const checkCancel = XrpCheckCancel.from(testCheckCancelProto)

    // THEN the CheckCancel converted as expected.
    assert.equal(
      checkCancel?.checkId,
      testCheckCancelProto.getCheckId()?.getValue_asB64(),
    )
  })

  it('Convert CheckCancel protobuf with missing checkId', function (): void {
    // GIVEN a CheckCancel protocol buffer without a checkId.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const checkCancel = XrpCheckCancel.from(testInvalidCheckCancelProto)

    // THEN the result is undefined.
    assert.isUndefined(checkCancel)
  })

  // CheckCash

  it('Convert CheckCash protobuf to XRPCheckCash object - amount field set', function (): void {
    // GIVEN a valid CheckCash protocol buffer with amount field set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const checkCash = XrpCheckCash.from(testCheckCashProtoWithAmount)

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

  it('Convert CheckCash protobuf to XrpCheckCash object - deliverMin field set', function (): void {
    // GIVEN a valid CheckCash protocol buffer with deliverMin field set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const checkCash = XrpCheckCash.from(testCheckCashProtoWithDeliverMin)

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

  it('Convert invalid CheckCash protobuf to XrpCheckCash object - missing checkId ', function (): void {
    // GIVEN an invalid CheckCash protocol buffer missing the checkId field.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const checkCash = XrpCheckCash.from(testInvalidCheckCashProto)

    // THEN the result is undefined.
    assert.isUndefined(checkCash)
  })

  // CheckCreate

  it('Convert CheckCreate protobuf to XRPCheckCreate object - all fields', function (): void {
    // GIVEN a CheckCreate protocol buffer with all fields set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const checkCreate = XrpCheckCreate.from(
      testCheckCreateProtoAllFields,
      XRPLNetwork.Test,
    )

    // THEN the CheckCreate converted as expected.
    const expectedXAddress = Utils.encodeXAddress(
      testCheckCreateProtoAllFields.getDestination()!.getValue()!.getAddress()!,
      testCheckCreateProtoAllFields.getDestinationTag()?.getValue(),
      true,
    )
    assert.equal(checkCreate?.destinationXAddress, expectedXAddress)
    assert.deepEqual(
      checkCreate?.sendMax,
      XRPCurrencyAmount.from(
        testCheckCreateProtoAllFields.getSendMax()!.getValue()!,
      ),
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

  it('Convert CheckCreate protobuf to XrpCheckCreate object - mandatory fields', function (): void {
    // GIVEN a CheckCreate protocol buffer with only mandatory fields set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const checkCreate = XrpCheckCreate.from(
      testCheckCreateProtoMandatoryFields,
      XRPLNetwork.Test,
    )

    // THEN the CheckCreate converted as expected.
    const expectedXAddress = Utils.encodeXAddress(
      testCheckCreateProtoMandatoryFields
        .getDestination()!
        .getValue()!
        .getAddress()!,
      testCheckCreateProtoMandatoryFields.getDestinationTag()?.getValue(),
      true,
    )
    assert.equal(checkCreate?.destinationXAddress, expectedXAddress)
    assert.deepEqual(
      checkCreate?.sendMax,
      XRPCurrencyAmount.from(
        testCheckCreateProtoMandatoryFields.getSendMax()!.getValue()!,
      ),
    )
    assert.isUndefined(checkCreate?.expiration)
    assert.isUndefined(checkCreate?.invoiceId)
  })

  it('Convert invalid CheckCreate protobuf to XRPCheckCash object - missing destination ', function (): void {
    // GIVEN an invalid CheckCreate protocol buffer missing the destination field.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const checkCreate = XrpCheckCreate.from(
      testInvalidCheckCreateProto,
      XRPLNetwork.Test,
    )

    // THEN the result is undefined.
    assert.isUndefined(checkCreate)
  })

  // DepositPreauth

  it('Convert DepositPreauth protobuf to XRPDepositPreauth object - authorize set', function (): void {
    // GIVEN a DepositPreauth protocol buffer with authorize field set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const depositPreauth = XrpDepositPreauth.from(
      testDepositPreauthProtoSetAuthorize,
      XRPLNetwork.Test,
    )

    // THEN the DepositPreauth converted as expected.
    const expectedXAddress = Utils.encodeXAddress(
      testDepositPreauthProtoSetAuthorize
        .getAuthorize()!
        .getValue()!
        .getAddress()!,
      undefined,
      true,
    )
    assert.equal(depositPreauth?.authorizeXAddress, expectedXAddress)
  })

  it('Convert DepositPreauth protobuf to XrpDepositPreauth object - unauthorize set', function (): void {
    // GIVEN a DespoitPreauth protocol buffer with unauthorize field set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const depositPreauth = XrpDepositPreauth.from(
      testDepositPreauthProtoSetUnauthorize,
      XRPLNetwork.Test,
    )

    // THEN the DepositPreauth converted as expected.
    const expectedXAddress = Utils.encodeXAddress(
      testDepositPreauthProtoSetUnauthorize
        .getUnauthorize()!
        .getValue()!
        .getAddress()!,
      undefined,
      true,
    )
    assert.equal(depositPreauth?.unauthorizeXAddress, expectedXAddress)
  })

  // Escrow Cancel

  it('Convert EscrowCancel protobuf to XRPEscrowCancel object - valid fields', function (): void {
    // GIVEN an EscrowCancel protocol buffer with all fields set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const escrowCancel = XrpEscrowCancel.from(
      testEscrowCancelProto,
      XRPLNetwork.Test,
    )

    // THEN the EscrowCancel converted as expected.
    const expectedXAddress = Utils.encodeXAddress(
      testEscrowCancelProto.getOwner()!.getValue()!.getAddress()!,
      undefined,
      true,
    )
    assert.equal(escrowCancel?.ownerXAddress, expectedXAddress)
    assert.equal(
      escrowCancel?.offerSequence,
      testEscrowCancelProto.getOfferSequence()?.getValue(),
    )
  })

  it('Convert EscrowCancel protobuf to XrpEscrowCancel object - missing fields', function (): void {
    // GIVEN an EscrowCancel protocol buffer missing required fields.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const escrowCancel = XrpEscrowCancel.from(
      testInvalidEscrowCancelProto,
      XRPLNetwork.Test,
    )

    // THEN the result is undefined.
    assert.isUndefined(escrowCancel)
  })

  // EscrowCreate

  it('Convert EscrowCreate protobuf to XrpEscrowCreate object - all fields', function (): void {
    // GIVEN an EscrowCreate protocol buffer with all fields set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const escrowCreate = XrpEscrowCreate.from(
      testEscrowCreateProtoAllFields,
      XRPLNetwork.Test,
    )

    // THEN the EscrowCreate converted as expected.
    const expectedXAddress = Utils.encodeXAddress(
      testEscrowCreateProtoAllFields
        .getDestination()!
        .getValue()!
        .getAddress()!,
      testEscrowCreateProtoAllFields.getDestinationTag()?.getValue(),
      true,
    )
    assert.deepEqual(
      escrowCreate?.amount,
      XRPCurrencyAmount.from(
        testEscrowCreateProtoAllFields.getAmount()!.getValue()!,
      ),
    )
    assert.equal(escrowCreate?.destinationXAddress, expectedXAddress)
    assert.equal(
      escrowCreate?.cancelAfter,
      testEscrowCreateProtoAllFields.getCancelAfter()?.getValue(),
    )
    assert.equal(
      escrowCreate?.finishAfter,
      testEscrowCreateProtoAllFields.getFinishAfter()?.getValue(),
    )
    assert.equal(
      escrowCreate?.condition,
      testEscrowCreateProtoAllFields.getCondition()?.getValue_asB64(),
    )
  })

  it('Convert EscrowCreate protobuf to XrpEscrowCreate object - mandatory fields only', function (): void {
    // GIVEN an EscrowCreate protocol buffer with only mandatory fields set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const escrowCreate = XrpEscrowCreate.from(
      testEscrowCreateProtoMandatoryOnly,
      XRPLNetwork.Test,
    )

    // THEN the EscrowCreate converted as expected.
    const expectedXAddress = Utils.encodeXAddress(
      testEscrowCreateProtoMandatoryOnly
        .getDestination()!
        .getValue()!
        .getAddress()!,
      testEscrowCreateProtoMandatoryOnly.getDestinationTag()?.getValue(),
      true,
    )
    assert.deepEqual(
      escrowCreate?.amount,
      XRPCurrencyAmount.from(
        testEscrowCreateProtoMandatoryOnly.getAmount()!.getValue()!,
      ),
    )
    assert.equal(escrowCreate?.destinationXAddress, expectedXAddress)
    assert.isUndefined(escrowCreate?.cancelAfter)
    assert.isUndefined(escrowCreate?.finishAfter)
    assert.isUndefined(escrowCreate?.condition)
  })

  it('Convert EscrowCreate protobuf to XrpEscrowCreate object - missing mandatory field', function (): void {
    // GIVEN an EscrowCreate protocol buffer that's missing a mandatory field.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const escrowCreate = XrpEscrowCreate.from(
      testInvalidEscrowCreateProto,
      XRPLNetwork.Test,
    )

    // THEN the result is undefined.
    assert.isUndefined(escrowCreate)
  })

  // EscrowFinish

  it('Convert EscrowFinish protobuf to XrpEscrowFinish object - all fields', function (): void {
    // GIVEN an EscrowFinish protocol buffer with all fields set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const escrowFinish = XrpEscrowFinish.from(
      testEscrowFinishProtoAllFields,
      XRPLNetwork.Test,
    )

    // THEN the EscrowFinish converted as expected.
    const expectedXAddress = Utils.encodeXAddress(
      testEscrowFinishProtoAllFields.getOwner()!.getValue()!.getAddress()!,
      undefined,
      true,
    )
    assert.deepEqual(escrowFinish?.ownerXAddress, expectedXAddress)
    assert.equal(
      escrowFinish?.offerSequence,
      testEscrowFinishProtoAllFields.getOfferSequence()?.getValue(),
    )
    assert.equal(
      escrowFinish?.condition,
      testEscrowFinishProtoAllFields.getCondition()?.getValue(),
    )
    assert.equal(
      escrowFinish?.fulfillment,
      testEscrowFinishProtoAllFields.getFulfillment()?.getValue(),
    )
  })

  it('Convert EscrowFinish protobuf to XrpEscrowFinish object - mandatory fields only', function (): void {
    // GIVEN an EscrowFinish protocol buffer with only mandatory fields set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const escrowFinish = XrpEscrowFinish.from(
      testEscrowFinishProtoMandatoryOnly,
      XRPLNetwork.Test,
    )

    // THEN the EscrowFinish converted as expected.
    const expectedXAddress = Utils.encodeXAddress(
      testEscrowFinishProtoMandatoryOnly.getOwner()!.getValue()!.getAddress()!,
      undefined,
      true,
    )
    assert.deepEqual(escrowFinish?.ownerXAddress, expectedXAddress)
    assert.equal(
      escrowFinish?.offerSequence,
      testEscrowFinishProtoMandatoryOnly.getOfferSequence()?.getValue(),
    )
    assert.isUndefined(escrowFinish?.condition)
    assert.isUndefined(escrowFinish?.fulfillment)
  })

  it('Convert EscrowFinish protobuf to XrpEscrowFinish object - missing required fields', function (): void {
    // GIVEN an EscrowFinish protocol buffer missing a mandatory field.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const escrowFinish = XrpEscrowFinish.from(
      testInvalidEscrowFinishProto,
      XRPLNetwork.Test,
    )

    // THEN the result is undefined.
    assert.isUndefined(escrowFinish)
  })

<<<<<<< HEAD:test/XRP/xrp-transaction-type-proto-conversion-test.ts
  // OfferCancel

  it('Convert OfferCancel protobuf to XRPOfferCancel object', function (): void {
=======
  it('Convert OfferCancel protobuf to XrpOfferCancel object', function (): void {
>>>>>>> ac/10-offercancel:test/XRP/xrp-transaction-type-proto-conversion.test.ts
    // GIVEN an OfferCancel protocol buffer with offerSequence field set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const offerCancel = XrpOfferCancel.from(testOfferCancelProto)

    // THEN the OfferCancel converted as expected.
    assert.deepEqual(
      offerCancel?.offerSequence,
      testOfferCancelProto.getOfferSequence()?.getValue(),
    )
  })

  it('Convert OfferCancel protobuf to XrpOfferCancel object - missing required field', function (): void {
    // GIVEN an OfferCancel protocol buffer missing the offerSequence field.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const offerCancel = XrpOfferCancel.from(testInvalidOfferCancelProto)

    // THEN the result is undefined.
    assert.isUndefined(offerCancel)
  })

  // OfferCreate

  it('Convert OfferCreate protobuf to XRPOfferCreate object', function (): void {
    // GIVEN an OfferCreate protocol buffer with all fields set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const offerCreate = XRPOfferCreate.from(testOfferCreateProtoAllFields)

    // THEN the OfferCreate converted as expected.
    assert.equal(
      offerCreate?.expiration,
      testOfferCreateProtoAllFields.getExpiration()?.getValue(),
    )
    assert.equal(
      offerCreate?.offerSequence,
      testOfferCreateProtoAllFields.getOfferSequence()?.getValue(),
    )
    assert.deepEqual(
      offerCreate?.takerGets,
      XRPCurrencyAmount.from(
        testOfferCreateProtoAllFields.getTakerGets()!.getValue()!,
      ),
    )
    assert.deepEqual(
      offerCreate?.takerPays,
      XRPCurrencyAmount.from(
        testOfferCreateProtoAllFields.getTakerPays()!.getValue()!,
      ),
    )
  })

  it('Convert OfferCreate protobuf to XRPOfferCreate object - mandatory fields', function (): void {
    // GIVEN an OfferCreate protocol buffer with only mandatory fields set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const offerCreate = XRPOfferCreate.from(testOfferCreateProtoMandatoryOnly)

    // THEN the OfferCreate converted as expected.
    assert.isUndefined(offerCreate?.expiration)
    assert.isUndefined(offerCreate?.offerSequence)
    assert.deepEqual(
      offerCreate?.takerGets,
      XRPCurrencyAmount.from(
        testOfferCreateProtoMandatoryOnly.getTakerGets()!.getValue()!,
      ),
    )
    assert.deepEqual(
      offerCreate?.takerPays,
      XRPCurrencyAmount.from(
        testOfferCreateProtoMandatoryOnly.getTakerPays()!.getValue()!,
      ),
    )
  })

  it('Convert OfferCreate protobuf to XRPOfferCreate object - missing required field', function (): void {
    // GIVEN an OfferCreate protocol buffer missing a required field.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const offerCreate = XRPOfferCreate.from(testInvalidOfferCreateProto)

    // THEN the result is undefined.
    assert.isUndefined(offerCreate)
  })
})
