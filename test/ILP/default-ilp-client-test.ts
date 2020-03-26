import { assert } from 'chai'
import bigInt from 'big-integer'
import { FakeIlpNetworkClientResponses } from './fakes/fake-ilp-network-client'
import { PaymentRequest } from '../../src/ILP/model/payment-request'
import XpringIlpError from '../../src/ILP/xpring-ilp-error'
import FakeDefaultIlpClients from './fakes/fake-default-ilp-clients'

const fakePaymentRequest = new PaymentRequest({
  amount: bigInt(100),
  destinationPaymentPointer: '$money/baz',
  senderAccountId: 'test.foo.bar',
})

describe('Default ILP Client', function(): void {
  it('Get balance - success', async function(): Promise<void> {
    // GIVEN a DefaultIlpClient
    const client = FakeDefaultIlpClients.fakeSuceedingNetworkClient()
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

  it('Get balance - default error', function(done): void {
    // GIVEN a DefaultIlpClient
    const client = FakeDefaultIlpClients.fakeErroringNetworkClient()

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

  it('Get balance - Already Exists Error', function(done): void {
    // GIVEN a DefaultIlpClient with a network client which always throws an ALREADY_EXISTS error
    const client = FakeDefaultIlpClients.fakeAlreadyExistsErrorClient()

    // WHEN the balance for an account is requested
    client.getBalance('test.foo.bar').catch((error) => {
      // THEN the error is translated to a XpringIlpError
      assert.equal(error as XpringIlpError, XpringIlpError.accountAlreadyExists)
      done()
    })
  })

  it('Get balance - Not Found Error', function(done): void {
    // GIVEN a DefaultIlpClient with a network client which always throws a NOT_FOUND error
    const client = FakeDefaultIlpClients.fakeNotFoundErrorClient()

    // WHEN the balance for an account is requested
    client.getBalance('test.foo.bar').catch((error) => {
      // THEN the error is translated to a XpringIlpError
      assert.equal(error as XpringIlpError, XpringIlpError.accountNotFound)
      done()
    })
  })

  it('Get balance - Invalid Argument Error', function(done): void {
    // GIVEN a DefaultIlpClient with a network client which always throws an INVALID_ARGUMENT error
    const client = FakeDefaultIlpClients.fakeInvalidArgumentErrorClient()

    // WHEN the balance for an account is requested
    client.getBalance('test.foo.bar').catch((error) => {
      // THEN the error is translated to a XpringIlpError
      assert.equal(error as XpringIlpError, XpringIlpError.invalidArgument)
      done()
    })
  })

  it('Get balance - Unauthenticated Error', function(done): void {
    // GIVEN a DefaultIlpClient with a network client which always throws an UNAUTHENTICATED error
    const client = FakeDefaultIlpClients.fakeUnauthenticatedErrorClient()

    // WHEN the balance for an account is requested
    client.getBalance('test.foo.bar').catch((error) => {
      // THEN the error is translated to a XpringIlpError
      assert.equal(error as XpringIlpError, XpringIlpError.unauthenticated)
      done()
    })
  })

  it('Get balance - Internal Error', function(done): void {
    // GIVEN a DefaultIlpClient with a network client which always throws an INTERNAL error
    const client = FakeDefaultIlpClients.fakeInternalErrorClient()

    // WHEN the balance for an account is requested
    client.getBalance('test.foo.bar').catch((error) => {
      // THEN the error is translated to a XpringIlpError
      assert.equal(error as XpringIlpError, XpringIlpError.internal)
      done()
    })
  })

  it('Get balance - Invalid Access Token', function(done): void {
    // GIVEN a DefaultIlpClient with a network client which always throws a XpringIlpError.invalidAccessToken error
    const client = FakeDefaultIlpClients.fakeInvalidAccessTokenErrorClient()

    // WHEN the balance for an account is requested
    client.getBalance('test.foo.bar').catch((error) => {
      // THEN the error is rethrown
      assert.equal(error as XpringIlpError, XpringIlpError.invalidAccessToken)
      done()
    })
  })

  it('Send - success', async function(): Promise<void> {
    // GIVEN a DefaultIlpClient
    const client = FakeDefaultIlpClients.fakeSuceedingNetworkClient()

    // WHEN a payment request is sent
    const paymentResponse = await client.sendPayment(fakePaymentRequest)

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
    const client = FakeDefaultIlpClients.fakeErroringNetworkClient()

    // WHEN a payment is requested
    client.sendPayment(fakePaymentRequest).catch((error) => {
      // THEN an error is thrown
      assert.typeOf(error, 'Error')
      assert.equal(
        error.message,
        FakeIlpNetworkClientResponses.defaultError.message,
      )
      done()
    })
  })

  it('Send Payment - Already Exists Error', function(done): void {
    // GIVEN a DefaultIlpClient with a network client which always throws an ALREADY_EXISTS error
    const client = FakeDefaultIlpClients.fakeAlreadyExistsErrorClient()

    // WHEN a payment is sent
    client.sendPayment(fakePaymentRequest).catch((error) => {
      // THEN the error is translated to a XpringIlpError
      assert.equal(error as XpringIlpError, XpringIlpError.accountAlreadyExists)
      done()
    })
  })

  it('Send Payment - Not Found Error', function(done): void {
    // GIVEN a DefaultIlpClient with a network client which always throws a NOT_FOUND error
    const client = FakeDefaultIlpClients.fakeNotFoundErrorClient()

    // WHEN a payment is sent
    client.sendPayment(fakePaymentRequest).catch((error) => {
      // THEN the error is translated to a XpringIlpError
      assert.equal(error as XpringIlpError, XpringIlpError.accountNotFound)
      done()
    })
  })

  it('Send Payment - Invalid Argument Error', function(done): void {
    // GIVEN a DefaultIlpClient with a network client which always throws an INVALID_ARGUMENT error
    const client = FakeDefaultIlpClients.fakeInvalidArgumentErrorClient()

    // WHEN a payment is sent
    client.sendPayment(fakePaymentRequest).catch((error) => {
      // THEN the error is translated to a XpringIlpError
      assert.equal(error as XpringIlpError, XpringIlpError.invalidArgument)
      done()
    })
  })

  it('Send Payment - Unauthenticated Error', function(done): void {
    // GIVEN a DefaultIlpClient with a network client which always throws an UNAUTHENTICATED error
    const client = FakeDefaultIlpClients.fakeUnauthenticatedErrorClient()

    // WHEN a payment is sent
    client.sendPayment(fakePaymentRequest).catch((error) => {
      // THEN the error is translated to a XpringIlpError
      assert.equal(error as XpringIlpError, XpringIlpError.unauthenticated)
      done()
    })
  })

  it('Send Payment - Internal Error', function(done): void {
    // GIVEN a DefaultIlpClient with a network client which always throws an INTERNAL error
    const client = FakeDefaultIlpClients.fakeInternalErrorClient()

    // WHEN a payment is sent
    client.sendPayment(fakePaymentRequest).catch((error) => {
      // THEN the error is translated to a XpringIlpError
      assert.equal(error as XpringIlpError, XpringIlpError.internal)
      done()
    })
  })

  it('Send Payment - Invalid Access Token', function(done): void {
    // GIVEN a DefaultIlpClient with a network client which always throws a XpringIlpError.invalidAccessToken error
    const client = FakeDefaultIlpClients.fakeInvalidAccessTokenErrorClient()

    // WHEN a payment is sent
    client.sendPayment(fakePaymentRequest).catch((error) => {
      // THEN the error is rethrown
      assert.equal(error as XpringIlpError, XpringIlpError.invalidAccessToken)
      done()
    })
  })
})
