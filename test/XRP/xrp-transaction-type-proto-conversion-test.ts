import { assert } from 'chai'
import XRPAccountSet from '../../src/XRP/model/xrp-account-set'
import XRPAccountDelete from '../../src/XRP/model/xrp-account-delete'
import XRPCheckCancel from '../../src/XRP/model/xrp-check-cancel'
import XRPCheckCash from '../../src/XRP/model/xrp-check-cash'
import XRPCheckCreate from '../../src/XRP/model/xrp-check-create'
import XRPDepositPreauth from '../../src/XRP/model/xrp-deposit-preauth'
import XRPEscrowCancel from '../../src/XRP/model/xrp-escrow-cancel'
import XRPEscrowCreate from '../../src/XRP/model/xrp-escrow-create'
import XRPEscrowFinish from '../../src/XRP/model/xrp-escrow-finish'
import XRPOfferCancel from '../../src/XRP/model/xrp-offer-cancel'
import XRPOfferCreate from '../../src/XRP/model/xrp-offer-create'
import XRPPaymentChannelClaim from '../../src/XRP/model/xrp-payment-channel-claim'
import XRPPaymentChannelCreate from '../../src/XRP/model/xrp-payment-channel-create'
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
  testPaymentChannelCreateProtoAllFields,
  testPaymentChannelCreateProtoMandatoryOnly,
  testInvalidCheckCancelProto,
  testInvalidCheckCashProto,
  testInvalidCheckCreateProto,
  testInvalidEscrowCancelProto,
  testInvalidEscrowCreateProto,
  testInvalidEscrowFinishProto,
  testInvalidOfferCancelProto,
  testInvalidOfferCreateProto,
  testPaymentChannelClaimProtoAllFields,
  testPaymentChannelClaimProtoMandatoryOnly,
  testInvalidPaymentChannelClaimProto,
  testInvalidPaymentChannelCreateProto,
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

  // AccountDelete

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

  // CheckCancel

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

  // CheckCash

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

  // CheckCreate

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

  // DepositPreauth

  it('Convert DepositPreauth protobuf to XRPDepositPreauth object - authorize set', function (): void {
    // GIVEN a DepositPreauth protocol buffer with authorize field set.
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

  // Escrow Cancel

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

  // EscrowCreate

  it('Convert EscrowCreate protobuf to XRPEscrowCreate object - all fields', function (): void {
    // GIVEN an EscrowCreate protocol buffer with all fields set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const escrowCreate = XRPEscrowCreate.from(testEscrowCreateProtoAllFields)

    // THEN the EscrowCreate converted as expected.
    assert.deepEqual(
      escrowCreate?.amount,
      XRPCurrencyAmount.from(
        testEscrowCreateProtoAllFields.getAmount()!.getValue()!,
      ),
    )
    assert.equal(
      escrowCreate?.destination,
      testEscrowCreateProtoAllFields.getDestination()?.getValue()?.getAddress(),
    )
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
    assert.equal(
      escrowCreate?.destinationTag,
      testEscrowCreateProtoAllFields.getDestinationTag()?.getValue(),
    )
  })

  it('Convert EscrowCreate protobuf to XRPEscrowCreate object - mandatory fields only', function (): void {
    // GIVEN an EscrowCreate protocol buffer with only mandatory fields set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const escrowCreate = XRPEscrowCreate.from(
      testEscrowCreateProtoMandatoryOnly,
    )

    // THEN the EscrowCreate converted as expected.
    assert.deepEqual(
      escrowCreate?.amount,
      XRPCurrencyAmount.from(
        testEscrowCreateProtoMandatoryOnly.getAmount()!.getValue()!,
      ),
    )
    assert.equal(
      escrowCreate?.destination,
      testEscrowCreateProtoMandatoryOnly
        .getDestination()
        ?.getValue()
        ?.getAddress(),
    )
    assert.isUndefined(escrowCreate?.cancelAfter)
    assert.isUndefined(escrowCreate?.finishAfter)
    assert.isUndefined(escrowCreate?.condition)
    assert.isUndefined(escrowCreate?.destinationTag)
  })

  it('Convert EscrowCreate protobuf to XRPEscrowCreate object - missing mandatory field', function (): void {
    // GIVEN an EscrowCreate protocol buffer that's missing a mandatory field.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const escrowCreate = XRPEscrowCreate.from(testInvalidEscrowCreateProto)

    // THEN the result is undefined.
    assert.isUndefined(escrowCreate)
  })

  // EscrowFinish

  it('Convert EscrowFinish protobuf to XRPEscrowFinish object - all fields', function (): void {
    // GIVEN an EscrowFinish protocol buffer with all fields set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const escrowFinish = XRPEscrowFinish.from(testEscrowFinishProtoAllFields)

    // THEN the EscrowFinish converted as expected.
    assert.deepEqual(
      escrowFinish?.owner,
      testEscrowFinishProtoAllFields.getOwner()?.getValue()?.getAddress(),
    )
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

  it('Convert EscrowFinish protobuf to XRPEscrowFinish object - mandatory fields only', function (): void {
    // GIVEN an EscrowFinish protocol buffer with only mandatory fields set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const escrowFinish = XRPEscrowFinish.from(
      testEscrowFinishProtoMandatoryOnly,
    )

    // THEN the EscrowFinish converted as expected.
    assert.deepEqual(
      escrowFinish?.owner,
      testEscrowFinishProtoMandatoryOnly.getOwner()?.getValue()?.getAddress(),
    )
    assert.equal(
      escrowFinish?.offerSequence,
      testEscrowFinishProtoMandatoryOnly.getOfferSequence()?.getValue(),
    )
    assert.isUndefined(escrowFinish?.condition)
    assert.isUndefined(escrowFinish?.fulfillment)
  })

  it('Convert EscrowFinish protobuf to XRPEscrowFinish object - missing required fields', function (): void {
    // GIVEN an EscrowFinish protocol buffer missing a mandatory field.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const escrowFinish = XRPEscrowFinish.from(testInvalidEscrowFinishProto)

    // THEN the result is undefined.
    assert.isUndefined(escrowFinish)
  })

  // OfferCancel

  it('Convert OfferCancel protobuf to XRPOfferCancel object', function (): void {
    // GIVEN an OfferCancel protocol buffer with offerSequence field set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const offerCancel = XRPOfferCancel.from(testOfferCancelProto)

    // THEN the OfferCancel converted as expected.
    assert.deepEqual(
      offerCancel?.offerSequence,
      testOfferCancelProto.getOfferSequence()?.getValue(),
    )
  })

  it('Convert OfferCancel protobuf to XRPOfferCancel object - missing required field', function (): void {
    // GIVEN an OfferCancel protocol buffer missing the offerSequence field.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const offerCancel = XRPOfferCancel.from(testInvalidOfferCancelProto)

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

  // PaymentChannelClaim

  it('Convert PaymentChannelClaim protobuf to XRPPaymentChannelClaim object - all fields', function (): void {
    // GIVEN a PaymentChannelClaim protocol buffer with all fields set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const paymentChannelClaim = XRPPaymentChannelClaim.from(
      testPaymentChannelClaimProtoAllFields,
    )

    // THEN the PaymentChannelClaim converted as expected.
    assert.equal(
      paymentChannelClaim?.channel,
      testPaymentChannelClaimProtoAllFields.getChannel()?.getValue_asB64(),
    )
    assert.deepEqual(
      paymentChannelClaim?.balance,
      XRPCurrencyAmount.from(
        testPaymentChannelClaimProtoAllFields.getBalance()!.getValue()!,
      ),
    )
    assert.deepEqual(
      paymentChannelClaim?.amount,
      XRPCurrencyAmount.from(
        testPaymentChannelClaimProtoAllFields.getAmount()!.getValue()!,
      ),
    )
    assert.equal(
      paymentChannelClaim?.signature,
      testPaymentChannelClaimProtoAllFields
        .getPaymentChannelSignature()
        ?.getValue_asB64(),
    )
    assert.equal(
      paymentChannelClaim?.publicKey,
      testPaymentChannelClaimProtoAllFields.getPublicKey()?.getValue_asB64(),
    )
  })

  it('Convert PaymentChannelClaim protobuf to XRPPaymentChannelClaim object - mandatory field', function (): void {
    // GIVEN a PaymentChannelClaim protocol buffer with only mandatory field set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const paymentChannelClaim = XRPPaymentChannelClaim.from(
      testPaymentChannelClaimProtoMandatoryOnly,
    )

    // THEN the PaymentChannelClaim converted as expected.
    assert.equal(
      paymentChannelClaim?.channel,
      testPaymentChannelClaimProtoMandatoryOnly.getChannel()?.getValue_asB64(),
    )
    assert.isUndefined(paymentChannelClaim?.balance)
    assert.isUndefined(paymentChannelClaim?.amount)
    assert.isUndefined(paymentChannelClaim?.signature)
    assert.isUndefined(paymentChannelClaim?.publicKey)
  })

  it('Convert PaymentChannelClaim protobuf to XRPPaymentChannelClaim object - missing mandatory field', function (): void {
    // GIVEN a PaymentChannelClaim protocol buffer missing the mandatory field.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const paymentChannelClaim = XRPPaymentChannelClaim.from(
      testInvalidPaymentChannelClaimProto,
    )

    // THEN the result is undefined.
    assert.isUndefined(paymentChannelClaim)
  })

  // PaymentChannelCreate

  it('Convert PaymentChannelCreate protobuf to XRPPaymentChannelCreate object - all fields', function (): void {
    // GIVEN a PaymentChannelCreate protocol buffer with all fields set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const paymentChannelCreate = XRPPaymentChannelCreate.from(
      testPaymentChannelCreateProtoAllFields,
    )

    // THEN the PaymentChannelCreate converted as expected.
    assert.deepEqual(
      paymentChannelCreate?.amount,
      XRPCurrencyAmount.from(
        testPaymentChannelCreateProtoAllFields.getAmount()?.getValue(),
      ),
    )
    assert.equal(
      paymentChannelCreate?.destination,
      testPaymentChannelCreateProtoAllFields
        .getDestination()
        ?.getValue()
        ?.getAddress(),
    )
    assert.equal(
      paymentChannelCreate?.settleDelay,
      testPaymentChannelCreateProtoAllFields.getSettleDelay()?.getValue(),
    )
    assert.equal(
      paymentChannelCreate?.publicKey,
      testPaymentChannelCreateProtoAllFields.getPublicKey()?.getValue_asB64(),
    )
    assert.equal(
      paymentChannelCreate?.cancelAfter,
      testPaymentChannelCreateProtoAllFields.getCancelAfter()?.getValue(),
    )
    assert.equal(
      paymentChannelCreate?.destinationTag,
      testPaymentChannelCreateProtoAllFields.getDestinationTag()?.getValue(),
    )
  })

  it('Convert PaymentChannelCreate protobuf to XRPPaymentChannelCreate object - mandatory fields', function (): void {
    // GIVEN a PaymentChannelCreate protocol buffer with only mandatory fields set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const paymentChannelCreate = XRPPaymentChannelCreate.from(
      testPaymentChannelCreateProtoMandatoryOnly,
    )

    // THEN the PaymentChannelCreate converted as expected.
    assert.deepEqual(
      paymentChannelCreate?.amount,
      XRPCurrencyAmount.from(
        testPaymentChannelCreateProtoMandatoryOnly.getAmount()?.getValue(),
      ),
    )
    assert.equal(
      paymentChannelCreate?.destination,
      testPaymentChannelCreateProtoMandatoryOnly
        .getDestination()
        ?.getValue()
        ?.getAddress(),
    )
    assert.isUndefined(paymentChannelCreate?.settleDelay)
    assert.isUndefined(paymentChannelCreate?.publicKey)
    assert.isUndefined(paymentChannelCreate?.cancelAfter)
    assert.isUndefined(paymentChannelCreate?.destinationTag)
  })

  it('Convert PaymentChannelCreate protobuf to XRPPaymentChannelCreate object - missing required field', function (): void {
    // GIVEN a PaymentChannelCreate protocol buffer missing a required field.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const paymentChannelCreate = XRPPaymentChannelCreate.from(
      testInvalidPaymentChannelCreateProto,
    )

    // THEN the result is undefined.
    assert.isUndefined(paymentChannelCreate)
  })
})
