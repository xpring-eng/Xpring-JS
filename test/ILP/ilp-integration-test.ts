import bigInt from 'big-integer'
import IlpClient from '../../src/ILP/ilp-client'
import { PaymentRequest } from '../../src/ILP/model/payment-request'

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
    assert.equal(message.accountId, 'sdk_account1')
    // AND assetCode should be XRP
    assert.equal(message.assetCode, 'XRP')
    // AND assetScale should be 9
    assert.equal(message.assetScale, 9)
    // AND netBalance should be less than 0, since sdk_account1 always sends money in the Send Money test
    assert(message.netBalance.lesserOrEquals(0))
    // AND clearingBalance should be less than 0, since sdk_account1 always sends money in the Send Money test
    assert(message.clearingBalance.lesserOrEquals(0))
    // AND prepaidAmount should be 0
    assert.equal(message.prepaidAmount, 0)
  })

  it('Send Money - Node Shim', async function(): Promise<void> {
    this.timeout(timeoutMs)
    // GIVEN an account on the connector with accountId = sdk_account1
    // AND an account on the connector with accountId = sdk_account2

    // WHEN a payment is sent from sdk_account1 to sdk_account2 for 10 units
    const request = new PaymentRequest(
      bigInt(10),
      '$money.ilpv4.dev/sdk_account2',
      'sdk_account1',
    )
    const message = await ILPClientNode.sendPayment(request, 'password')

    // THEN the originalAmount should be equal to the amount sent
    assert.equal(message.originalAmount, 10)
    // AND the amountSent should be equal to the originalAmount
    assert.equal(message.amountSent, 10)
    // AND the amountDelivered should be 10
    assert.equal(message.amountDelivered, 10)
    // AND the payment should be successfull
    assert.equal(message.successfulPayment, true)
  })
})
