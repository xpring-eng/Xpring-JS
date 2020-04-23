import { assert } from 'chai'
import bigInt from 'big-integer'
import { FakeIlpNetworkClientResponses } from './fakes/fake-ilp-network-client'
import { PaymentRequest } from '../../src/ILP/model/payment-request'
import IlpError from '../../src/ILP/ilp-error'
import FakeDefaultIlpClient from './fakes/fake-default-ilp-client'

// Fake accountId
const accountId = 'test.foo.bar'

// Fake PaymentRequest
const fakePaymentRequest = new PaymentRequest({
  amount: bigInt(100),
  destinationPaymentPointer: '$money/baz',
  senderAccountId: accountId,
})

describe('Default ILP Client', function (): void {
  it('Get balance - success', async function (): Promise<void> {
    // GIVEN a DefaultIlpClient
    const client = FakeDefaultIlpClient.fakeSuceedingNetworkClient()
    // WHEN the balance for an account is requested
    const amount = await client.getBalance(accountId)

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

  it('Get balance - default error', function (done): void {
    // GIVEN a DefaultIlpClient
    const client = FakeDefaultIlpClient.withErrors(
      FakeIlpNetworkClientResponses.defaultError,
    )

    // WHEN the balance for an account is requested
    client.getBalance(accountId).catch((error) => {
      // THEN an error is thrown
      assert.typeOf(error, 'Error')
      assert.equal(
        error.message,
        FakeIlpNetworkClientResponses.defaultError.message,
      )
      done()
    })
  })

  it('Get balance - Not Found Error', function (done): void {
    // GIVEN a DefaultIlpClient with a network client which always throws a grpc.ServiceError
    // with code = grpc.status.NOT_FOUND
    const client = FakeDefaultIlpClient.withErrors(
      FakeIlpNetworkClientResponses.notFoundError,
    )

    // WHEN the balance for an account is requested
    client.getBalance(accountId).catch((error) => {
      // THEN the error is translated to a IlpError
      assert.equal(error as IlpError, IlpError.accountNotFound)
      done()
    })
  })

  it('Get balance - Invalid Argument Error', function (done): void {
    // GIVEN a DefaultIlpClient with a network client which always throws a grpc.ServiceError
    // with code = grpc.status.INVALID_ARGUMENT
    const client = FakeDefaultIlpClient.withErrors(
      FakeIlpNetworkClientResponses.invalidArgumentError,
    )

    // WHEN the balance for an account is requested
    client.getBalance(accountId).catch((error) => {
      // THEN the error is translated to a IlpError
      assert.equal(error as IlpError, IlpError.invalidArgument)
      done()
    })
  })

  it('Get balance - Unauthenticated Error', function (done): void {
    // GIVEN a DefaultIlpClient with a network client which always throws a grpc.ServiceError
    // with code = grpc.status.UNAUTHENTICATED
    const client = FakeDefaultIlpClient.withErrors(
      FakeIlpNetworkClientResponses.unauthenticatedError,
    )

    // WHEN the balance for an account is requested
    client.getBalance(accountId).catch((error) => {
      // THEN the error is translated to a IlpError
      assert.equal(error as IlpError, IlpError.unauthenticated)
      done()
    })
  })

  it('Get balance - Internal Error', function (done): void {
    // GIVEN a DefaultIlpClient with a network client which always throws a grpc.ServiceError
    // with code = grpc.status.INTERNAL
    const client = FakeDefaultIlpClient.withErrors(
      FakeIlpNetworkClientResponses.internalError,
    )

    // WHEN the balance for an account is requested
    client.getBalance(accountId).catch((error) => {
      // THEN the error is translated to a IlpError
      assert.equal(error as IlpError, IlpError.internal)
      done()
    })
  })

  it('Get balance - Unknown Error', function (done): void {
    // GIVEN a DefaultIlpClient with a network client which always throws a grpc.ServiceError
    // with code = grpc.status.INTERNAL
    const client = FakeDefaultIlpClient.withErrors(
      FakeIlpNetworkClientResponses.unknownError,
    )

    // WHEN the balance for an account is requested
    client.getBalance(accountId).catch((error) => {
      // THEN the error is translated to a IlpError
      assert.equal(error as IlpError, IlpError.unknown)
      done()
    })
  })

  it('Get balance - Invalid Access Token', function (done): void {
    // GIVEN a DefaultIlpClient with a network client which always throws a IlpError.invalidAccessToken error
    const client = FakeDefaultIlpClient.withErrors(
      FakeIlpNetworkClientResponses.invalidAccessTokenError,
    )

    // WHEN the balance for an account is requested
    client.getBalance(accountId).catch((error) => {
      // THEN the error is simply rethrown
      assert.equal(error as IlpError, IlpError.invalidAccessToken)
      done()
    })
  })

  it('Send - success', async function (): Promise<void> {
    // GIVEN a DefaultIlpClient
    const client = FakeDefaultIlpClient.fakeSuceedingNetworkClient()

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

  it('Send - error', function (done): void {
    // GIVEN a DefaultIlpClient
    const client = FakeDefaultIlpClient.withErrors(
      FakeIlpNetworkClientResponses.defaultError,
    )

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

  it('Send Payment - Not Found Error', function (done): void {
    // GIVEN a DefaultIlpClient with a network client which always throws a grpc.ServiceError
    // with code = grpc.status.NOT_FOUND
    const client = FakeDefaultIlpClient.withErrors(
      FakeIlpNetworkClientResponses.notFoundError,
    )

    // WHEN a payment is sent
    client.sendPayment(fakePaymentRequest).catch((error) => {
      // THEN the error is translated to a IlpError
      assert.equal(error as IlpError, IlpError.accountNotFound)
      done()
    })
  })

  it('Send Payment - Invalid Argument Error', function (done): void {
    // GIVEN a DefaultIlpClient with a network client which always throws a grpc.ServiceError
    // with code = grpc.status.INVALID_ARGUMENT
    const client = FakeDefaultIlpClient.withErrors(
      FakeIlpNetworkClientResponses.invalidArgumentError,
    )

    // WHEN a payment is sent
    client.sendPayment(fakePaymentRequest).catch((error) => {
      // THEN the error is translated to a IlpError
      assert.equal(error as IlpError, IlpError.invalidArgument)
      done()
    })
  })

  it('Send Payment - Unauthenticated Error', function (done): void {
    // GIVEN a DefaultIlpClient with a network client which always throws a grpc.ServiceError
    // with code = grpc.status.UNAUTHENTICATED
    const client = FakeDefaultIlpClient.withErrors(
      FakeIlpNetworkClientResponses.unauthenticatedError,
    )

    // WHEN a payment is sent
    client.sendPayment(fakePaymentRequest).catch((error) => {
      // THEN the error is translated to a IlpError
      assert.equal(error as IlpError, IlpError.unauthenticated)
      done()
    })
  })

  it('Send Payment - Internal Error', function (done): void {
    // GIVEN a DefaultIlpClient with a network client which always throws a grpc.ServiceError
    // with code = grpc.status.INTERNAL
    const client = FakeDefaultIlpClient.withErrors(
      FakeIlpNetworkClientResponses.internalError,
    )

    // WHEN a payment is sent
    client.sendPayment(fakePaymentRequest).catch((error) => {
      // THEN the error is translated to a IlpError
      assert.equal(error as IlpError, IlpError.internal)
      done()
    })
  })

  it('Send Payment - Unknown Error', function (done): void {
    // GIVEN a DefaultIlpClient with a network client which always throws a grpc.ServiceError
    // with code = grpc.status.INTERNAL
    const client = FakeDefaultIlpClient.withErrors(
      FakeIlpNetworkClientResponses.unknownError,
    )

    // WHEN a payment is sent
    client.sendPayment(fakePaymentRequest).catch((error) => {
      // THEN the error is translated to a IlpError
      assert.equal(error as IlpError, IlpError.unknown)
      done()
    })
  })

  it('Send Payment - Invalid Access Token', function (done): void {
    // GIVEN a DefaultIlpClient with a network client which always throws a IlpError.invalidAccessToken error
    const client = FakeDefaultIlpClient.withErrors(
      FakeIlpNetworkClientResponses.invalidAccessTokenError,
    )

    // WHEN a payment is sent
    client.sendPayment(fakePaymentRequest).catch((error) => {
      // THEN the error is simply rethrown
      assert.equal(error as IlpError, IlpError.invalidAccessToken)
      done()
    })
  })
})
