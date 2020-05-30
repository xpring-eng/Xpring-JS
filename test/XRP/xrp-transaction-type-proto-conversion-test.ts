import { assert } from 'chai'
import XRPAccountSet from '../../src/XRP/model/xrp-account-set'
import { testAccountSetProtoAllFields } from './fakes/fake-xrp-transaction-type-protobufs'

describe('Protobuf Conversions - Transaction Types', function (): void {
  // AccountSet

  it('Convert AccountSet protobuf to XRPAccountSet object', function (): void {
    // GIVEN an AccountSet protocol buffer with all fields set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const accountSet = XRPAccountSet.from(testAccountSetProtoAllFields)

    // THEN the AccountSet converted as expected.
    assert.deepEqual(
      accountSet?.clearFlag,
      testAccountSetProtoAllFields.getClearFlag().getValue(),
    )
  })
})
