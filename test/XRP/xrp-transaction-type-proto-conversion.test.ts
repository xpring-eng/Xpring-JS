import { assert } from 'chai'

import { Utils } from 'xpring-common-js'
import XrpDepositPreauth from '../../src/XRP/model/xrp-deposit-preauth'
import XrpAccountSet from '../../src/XRP/model/xrp-account-set'
import XrpCheckCreate from '../../src/XRP/model/xrp-check-create'
import XrpCheckCash from '../../src/XRP/model/xrp-check-cash'
import XrpCurrencyAmount from '../../src/XRP/model/xrp-currency-amount'
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
  testInvalidCheckCancelProto,
  testInvalidCheckCashProto,
  testInvalidCheckCreateProto,
  testDepositPreauthProtoSetAuthorize,
  testDepositPreauthProtoSetUnauthorize,
} from './fakes/fake-xrp-transaction-type-protobufs'
import { XRPCurrencyAmount } from '../../src/XRP/model'
import XrplNetwork from '../../src/Common/xrpl-network'
import { AccountDelete } from '../../src/XRP/Generated/web/org/xrpl/rpc/v1/transaction_pb'

describe('Protobuf Conversions - Transaction Types', function (): void {
  // AccountSet

  it('Convert AccountSet protobuf with all fields to XRPAccountSet object', function (): void {
    // GIVEN an AccountSet protocol buffer with all fields set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const accountSet = XrpAccountSet.from(testAccountSetProtoAllFields)

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
    const accountSet = XrpAccountSet.from(testAccountSetProtoOneFieldSet)

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

  it('Convert AccountDelete protobuf with all fields to XrpAccountDelete object', function (): void {
    // GIVEN an AccountDelete protocol buffer with all fields set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const accountDelete = XrpAccountDelete.from(
      testAccountDeleteProto,
      XrplNetwork.Test,
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
      XrplNetwork.Test,
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
      XrplNetwork.Test,
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

  it('Convert CheckCash protobuf to XrpCheckCash object - amount field set', function (): void {
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
      XrpCurrencyAmount.from(
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
      XrpCurrencyAmount.from(
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

  it('Convert CheckCreate protobuf to XrpCheckCreate object - all fields', function (): void {
    // GIVEN a CheckCreate protocol buffer with all fields set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const checkCreate = XrpCheckCreate.from(
      testCheckCreateProtoAllFields,
      XrplNetwork.Test,
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
      XrplNetwork.Test,
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
      XrplNetwork.Test,
    )

    // THEN the result is undefined.
    assert.isUndefined(checkCreate)
  })

  it('Convert DepositPreauth protobuf to XrpDepositPreauth object - authorize set', function (): void {
    // GIVEN a DepositPreauth protocol buffer with authorize field set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const depositPreauth = XrpDepositPreauth.from(
      testDepositPreauthProtoSetAuthorize,
      XrplNetwork.Test,
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
      XrplNetwork.Test,
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
})
