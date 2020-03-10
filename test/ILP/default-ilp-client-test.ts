import { assert } from 'chai'
import {
  FakeIlpNetworkClient,
  FakeIlpNetworkClientResponses,
} from '../fakes/fake-ilp-network-client'
import DefaultIlpClient from '../../src/ILP/default-ilp-client'

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
    const successfulGetBalanceResponse = FakeIlpNetworkClientResponses.defaultGetBalanceResponse()
    // WHEN the balance for an account is requested
    const amount = await client.getBalance('test.foo.bar')

    // THEN the balance is returned
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

    // WHEN the balance for an account is requested
    const amount = await client.sendPayment(100, '$money/baz', 'test.foo.bar')

    // THEN the balance is returned
    assert.equal(Number(amount.getAmountDelivered()), 50)
  })

  it('Send - error', function(done): void {
    // GIVEN a DefaultIlpClient
    const client = fakeErroringNetworkClient()

    // WHEN the balance for an account is requested
    client.sendPayment(100, '$money/baz', 'test.foo.bar').catch((error) => {
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
