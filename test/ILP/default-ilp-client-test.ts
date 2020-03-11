import { assert } from 'chai'
import bigInt from 'big-integer'
import {
  FakeIlpNetworkClient,
  FakeIlpNetworkClientResponses,
} from './fakes/fake-ilp-network-client'
import DefaultIlpClient from '../../src/ILP/default-ilp-client'
import { PaymentRequest } from '../../src/ILP/model/payment-request'

const fakeSuceedingNetworkClient = (): DefaultIlpClient => {
  return new DefaultIlpClient(new FakeIlpNetworkClient())
}
const fakeErroringNetworkClient = (): DefaultIlpClient => {
  return new DefaultIlpClient(
    new FakeIlpNetworkClient(
      FakeIlpNetworkClientResponses.defaultErrorResponses,
    ),
  )
}

// const successfulSendPaymentResponse = FakeIlpNetworkClientResponses.defaultSendResponse()

describe('Default ILP Client', function(): void {
  it('Get balance - success', async function(): Promise<void> {
    // GIVEN a DefaultIlpClient
    const client = fakeSuceedingNetworkClient()
    // WHEN the balance for an account is requested
    const amount = await client.getBalance('test.foo.bar')

    // THEN the balance is returned
    const successfulGetBalanceResponse = FakeIlpNetworkClientResponses.defaultGetBalanceResponse()
    assert.equal(amount.accountId, successfulGetBalanceResponse.getAccountId())
    assert.equal(amount.assetCode, successfulGetBalanceResponse.getAssetCode())
    assert.equal(
      amount.assetScale,
      successfulGetBalanceResponse.getAssetScale(),
    )
    assert.equal(
      Number(amount.clearingBalance),
      successfulGetBalanceResponse.getClearingBalance(),
    )
    assert.equal(
      Number(amount.prepaidAmount),
      successfulGetBalanceResponse.getPrepaidAmount(),
    )
    assert.equal(
      Number(amount.netBalance),
      successfulGetBalanceResponse.getNetBalance(),
    )
  })

  it('Get balance - error', function(done): void {
    // GIVEN a DefaultIlpClient
    const client = fakeErroringNetworkClient()

    // WHEN the balance for an account is requested
    client.getBalance('test.foo.bar').catch((error) => {
      // THEN an error is thrown
      assert.typeOf(error, 'Error')
      assert.equal(
        error.message,
        FakeIlpNetworkClientResponses.defaultError.message,
      )
      done()
    })
  })

  it('Send - success', async function(): Promise<void> {
    // GIVEN a DefaultIlpClient
    const client = fakeSuceedingNetworkClient()

    // WHEN a payment request is sent
    const request = new PaymentRequest({
      amount: bigInt(100),
      destinationPaymentPointer: '$money/baz',
      senderAccountId: 'test.foo.bar',
    })
    const paymentResponse = await client.sendPayment(request)

    const successfulPaymentResponse = FakeIlpNetworkClientResponses.defaultSendResponse()
    // THEN the original amount is equal to mocked original amount
    assert.equal(
      Number(paymentResponse.originalAmount),
      successfulPaymentResponse.getOriginalAmount(),
    )
    // AND the delivered amount is equal to the mocked delivered amount
    assert.equal(
      Number(paymentResponse.amountDelivered),
      successfulPaymentResponse.getAmountDelivered(),
    )
    // AND the amount sent is equal to the mocked amount sent
    assert.equal(
      Number(paymentResponse.amountSent),
      successfulPaymentResponse.getAmountSent(),
    )
    // AND the payment success is equal to the payment success of the mocked response
    assert.equal(
      paymentResponse.successfulPayment,
      successfulPaymentResponse.getSuccessfulPayment(),
    )
  })

  it('Send - error', function(done): void {
    // GIVEN a DefaultIlpClient
    const client = fakeErroringNetworkClient()

    // WHEN a payment is requested
    const request = new PaymentRequest({
      amount: bigInt(100),
      destinationPaymentPointer: '$money/baz',
      senderAccountId: 'test.foo.bar',
    })
    client.sendPayment(request).catch((error) => {
      // THEN an error is thrown
      assert.typeOf(error, 'Error')
      assert.equal(
        error.message,
        FakeIlpNetworkClientResponses.defaultError.message,
      )
      done()
    })
  })
})
