import * as assert from 'assert'
import { fail } from 'assert'
import IlpClient from '../src/ilp-client'
// import axios from 'axios'

// A timeout for these tests.
const timeoutMs = 60 * 1000 // 1 minute

// A ILP Client that makes requests.
// const ILPAddress = 'hermes-grpc.ilpv4.dev'
const ILPAddress = '127.0.0.1:6565'
const ILPClientNode = new IlpClient(ILPAddress, false)

describe('ILP Integration Tests', function(): void {
  it("Get Bob's Account Balance - Node Shim", async function(): Promise<void> {
    this.timeout(timeoutMs)
    try {
      const message = await ILPClientNode.getBalance('mustafa', 'password')
      assert.equal(message.getAccountId(), 'mustafa')
      assert.equal(message.getAssetCode(), 'XRP')
      assert.equal(message.getAssetScale(), 9)
      assert.equal(message.getNetBalance(), 0)
      assert.equal(message.getClearingBalance(), 0)
      assert.equal(message.getPrepaidAmount(), 0)
    } catch (e) {
      console.log(e)
      fail()
    }
  })

  it('Send Money - Node Shim', async function(): Promise<void> {
    this.timeout(timeoutMs)
    try {
      const message = await ILPClientNode.send(
        10,
        '$money.ilpv4.dev/alice',
        'mustafa',
        'password',
      )
      assert.equal(message.getOriginalAmount(), 10)
      assert.equal(message.getAmountSent(), 10)
      assert.equal(message.getAmountDelivered(), 10)
      assert.equal(message.getSuccessfulPayment(), true)
    } catch (e) {
      console.log(e)
      fail()
    }
  })
})
