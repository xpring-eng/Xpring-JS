import { assert } from 'chai'

import TrustLine from '../../../src/XRP/shared/trustline'
import 'mocha'
import { TrustLineResponse } from '../../../src/XRP/shared/rippled-web-socket-schema'

describe('TrustLine Conversion Tests', function (): void {
  it('TrustLine from Object - all fields present', function (): void {
    // GIVEN a raw object representing a trust line on the XRPL
    const testTrustLineAllFields: TrustLineResponse = {
      account: 'r3vi7mWxru9rJCxETCyA1CHvzL96eZWx5z',
      balance: '0',
      currency: 'USD',
      limit: '0',
      limit_peer: '10',
      quality_in: 0,
      quality_out: 0,
      no_ripple: true,
      no_ripple_peer: true,
      authorized: true,
      peer_authorized: true,
      freeze: true,
      freeze_peer: true,
    }

    // WHEN a TrustLine object is constructed from it
    const trustLine = new TrustLine(testTrustLineAllFields)

    // THEN the result is as expected.
    assert.equal(trustLine.account, 'r3vi7mWxru9rJCxETCyA1CHvzL96eZWx5z')
    assert.equal(trustLine.balance, '0')
    assert.equal(trustLine.currency, 'USD')
    assert.equal(trustLine.limit, '0')
    assert.equal(trustLine.limitPeer, '10')
    assert.equal(trustLine.qualityIn, 0)
    assert.equal(trustLine.qualityOut, 0)
    assert.equal(trustLine.noRipple, true)
    assert.equal(trustLine.noRipplePeer, true)
    assert.equal(trustLine.authorized, true)
    assert.equal(trustLine.peerAuthorized, true)
    assert.equal(trustLine.freeze, true)
    assert.equal(trustLine.freezePeer, true)
  })

  it('TrustLine from Object - missing some optional booleans', function (): void {
    // GIVEN a raw object representing a trust line on the XRPL with some missing optional fields
    const testTrustLineMissingOptionals: TrustLineResponse = {
      account: 'r3vi7mWxru9rJCxETCyA1CHvzL96eZWx5z',
      balance: '0',
      currency: 'USD',
      limit: '0',
      limit_peer: '10',
      quality_in: 0,
      quality_out: 0,
    }

    // WHEN a TrustLine object is constructed from it
    const trustLine = new TrustLine(testTrustLineMissingOptionals)

    // THEN the result is as expected
    assert.equal(trustLine.account, 'r3vi7mWxru9rJCxETCyA1CHvzL96eZWx5z')
    assert.equal(trustLine.balance, '0')
    assert.equal(trustLine.currency, 'USD')
    assert.equal(trustLine.limit, '0')
    assert.equal(trustLine.limitPeer, '10')
    assert.equal(trustLine.qualityIn, 0)
    assert.equal(trustLine.qualityOut, 0)
    assert.equal(trustLine.noRipple, false)
    assert.equal(trustLine.noRipplePeer, false)
    assert.equal(trustLine.authorized, false)
    assert.equal(trustLine.peerAuthorized, false)
    assert.equal(trustLine.freeze, false)
    assert.equal(trustLine.freezePeer, false)
  })

  it('TrustLine from Object - optional booleans presented as false', function (): void {
    // GIVEN a raw object representing a trust line on the XRPL with optional falsey booleans explicitly set to false
    const testTrustLineFalseOptionals: TrustLineResponse = {
      account: 'r3vi7mWxru9rJCxETCyA1CHvzL96eZWx5z',
      balance: '0',
      currency: 'USD',
      limit: '0',
      limit_peer: '10',
      quality_in: 0,
      quality_out: 0,
      no_ripple: false,
      authorized: true,
      peer_authorized: false,
      freeze: true,
    }

    // WHEN a TrustLine object is constructed from it
    const trustLine = new TrustLine(testTrustLineFalseOptionals)

    // THEN the result is as expected
    assert.equal(trustLine.account, 'r3vi7mWxru9rJCxETCyA1CHvzL96eZWx5z')
    assert.equal(trustLine.balance, '0')
    assert.equal(trustLine.currency, 'USD')
    assert.equal(trustLine.limit, '0')
    assert.equal(trustLine.limitPeer, '10')
    assert.equal(trustLine.qualityIn, 0)
    assert.equal(trustLine.qualityOut, 0)
    assert.equal(trustLine.noRipple, false)
    assert.equal(trustLine.noRipplePeer, false)
    assert.equal(trustLine.authorized, true)
    assert.equal(trustLine.peerAuthorized, false)
    assert.equal(trustLine.freeze, true)
    assert.equal(trustLine.freezePeer, false)
  })
})
