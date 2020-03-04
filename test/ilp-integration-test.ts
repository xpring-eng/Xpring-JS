// import { fail } from 'assert'
import IlpClient from '../src/ilp-client'

import assert = require('assert')

// A timeout for these tests.
const timeoutMs = 60 * 1000 // 1 minute

// A ILP Client that makes requests.
const ILPAddress = 'hermes-grpc.ilpv4.dev'
const ILPClientNode = new IlpClient(ILPAddress, false)

describe('ILP Integration Tests', function(): void {
  it("Get Bob's Account Balance - Node Shim", async function(): Promise<void> {
    this.timeout(timeoutMs)
    try {
      const message = await ILPClientNode.getBalance('sdk_account1', 'password')
      assert.equal(message.getAccountId(), 'sdk_account1')
      assert.equal(message.getAssetCode(), 'XRP')
      assert.equal(message.getAssetScale(), 9)
      assert(message.getNetBalance() <= 0)
      assert(message.getClearingBalance() <= 0)
      assert(message.getPrepaidAmount() >= 0)
    } catch (e) {
      console.log(e)
      assert.fail()
    }
  })

  it('Send Money - Node Shim', async function(): Promise<void> {
    this.timeout(timeoutMs)
    try {
      const message = await ILPClientNode.send(
        10,
        '$money.ilpv4.dev/sdk_account2',
        'sdk_account1',
        'password',
      )
      assert.equal(message.getOriginalAmount(), 10)
      assert.equal(message.getAmountSent(), 10)
      assert.equal(message.getAmountDelivered(), 10)
      assert.equal(message.getSuccessfulPayment(), true)
    } catch (e) {
      console.log(e)
      assert.fail()
    }
  })
})
