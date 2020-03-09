// import { fail } from 'assert'
import IlpClient from '../src/ilp-client'

import assert = require('assert')

// A timeout for these tests.
const timeoutMs = 60 * 1000 // 1 minute

// A ILP Client that makes requests.
const ILPAddress = 'hermes-grpc.ilpv4.dev'
const ILPClientNode = new IlpClient(ILPAddress)

describe('ILP Integration Tests', function(): void {
  it("Get Bob's Account Balance - Node Shim", async function(): Promise<void> {
    this.timeout(timeoutMs)
    // GIVEN an account on the devnet connector with accountId = sdk_account1

    // WHEN the balance of that account is requested
    const message = await ILPClientNode.getBalance('sdk_account1', 'password')

    // THEN accountId should be sdk_account1
    assert.equal(message.getAccountId(), 'sdk_account1')
    // AND assetCode should be XRP
    assert.equal(message.getAssetCode(), 'XRP')
    // AND assetScale should be 9
    assert.equal(message.getAssetScale(), 9)
    // AND netBalance should be less than 0, since sdk_account1 always sends money in the Send Money test
    assert(message.getNetBalance() <= 0)
    // AND clearingBalance should be less than 0, since sdk_account1 always sends money in the Send Money test
    assert(message.getClearingBalance() <= 0)
    // AND prepaidAmount should be 0
    assert.equal(message.getPrepaidAmount(), 0)
  })

  it('Send Money - Node Shim', async function(): Promise<void> {
    this.timeout(timeoutMs)
    // GIVEN an account on the connector with accountId = sdk_account1
    // AND an account on the connector with accountId = sdk_account2

    // WHEN a payment is sent from sdk_account1 to sdk_account2 for 10 units
    const message = await ILPClientNode.sendPayment(
      10,
      '$money.ilpv4.dev/sdk_account2',
      'sdk_account1',
      'password',
    )

    // THEN the originalAmount should be equal to the amount sent
    assert.equal(message.getOriginalAmount(), 10)
    // AND the amountSent should be equal to the originalAmount
    assert.equal(message.getAmountSent(), 10)
    // AND the amountDelivered should be 10
    assert.equal(message.getAmountDelivered(), 10)
    // AND the payment should be successfull
    assert.equal(message.getSuccessfulPayment(), true)
  })
})
