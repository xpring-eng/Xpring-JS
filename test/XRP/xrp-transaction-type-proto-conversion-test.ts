import { assert } from 'chai'
import XRPAccountSet from '../../src/XRP/model/xrp-account-set'
import XRPAccountDelete from '../../src/XRP/model/xrp-account-delete'
import {
  testAccountSetProtoAllFields,
  testAccountSetProtoOneFieldSet,
  testAccountDeleteProto,
} from './fakes/fake-xrp-transaction-type-protobufs'

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
})
