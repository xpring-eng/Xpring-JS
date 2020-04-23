import bigInt from 'big-integer'
import { assert } from 'chai'
import IlpClient from '../../src/ILP/ilp-client'
import { PaymentRequest } from '../../src/ILP/model/payment-request'
import IlpError, { IlpErrorType } from '../../src/ILP/ilp-error'

// A timeout for these tests.
const timeoutMs = 60 * 1000 // 1 minute

// A ILP Client that makes requests.
const ILPAddress = 'hermes-envoy-test.xpring.io'
const ILPClientNode = new IlpClient(ILPAddress)

describe('ILP Integration Tests', function (): void {
  it("Get Bob's Account Balance - Node Shim", async function (): Promise<void> {
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
    assert.equal(message.prepaidAmount.valueOf(), 0)
  })

  it('Get Account Balance - Bearer Token', async function (): Promise<void> {
    this.timeout(timeoutMs)

    // GIVEN an account on the devnet connector with accountId = sdk_account1

    // WHEN the balance of that account is requested with an auth token prefixed with 'Bearer '
    try {
      await ILPClientNode.getBalance('sdk_account1', 'Bearer password')
    } catch (error) {
      // THEN an Error is thrown by IlpCredentials
      assert.equal(
        (error as IlpError).errorType,
        IlpErrorType.InvalidAccessToken,
      )
      assert.equal(error.message, IlpError.invalidAccessToken.message)
    }
  })

  it('Send Money - Node Shim', async function (): Promise<void> {
    this.timeout(timeoutMs)
    // GIVEN an account on the connector with accountId = sdk_account1
    // AND an account on the connector with accountId = sdk_account2

    // WHEN a payment is sent from sdk_account1 to sdk_account2 for 10 units
    const request = new PaymentRequest({
      amount: bigInt(10),
      destinationPaymentPointer: '$spsp-test.xpring.io/sdk_account2',
      senderAccountId: 'sdk_account1',
    })
    const message = await ILPClientNode.sendPayment(request, 'password')

    // THEN the originalAmount should be equal to the amount sent
    assert.equal(message.originalAmount.valueOf(), 10)
    // AND the amountSent should be equal to the originalAmount
    assert.equal(message.amountSent.valueOf(), 10)
    // AND the amountDelivered should be 10
    assert.equal(message.amountDelivered.valueOf(), 10)
    // AND the payment should be successful
    assert.equal(message.successfulPayment, true)
  })

  it('Send Money - Bearer Token', async function (): Promise<void> {
    this.timeout(timeoutMs)

    // GIVEN an account on the connector with accountId = sdk_account1
    // AND an account on the connector with accountId = sdk_account2

    // WHEN a payment is sent from sdk_account1 to sdk_account2 for 10 units
    try {
      const request = new PaymentRequest({
        amount: bigInt(10),
        destinationPaymentPointer: '$spsp-test.xpring.io/sdk_account2',
        senderAccountId: 'sdk_account1',
      })
      await ILPClientNode.sendPayment(request, 'Bearer password')
    } catch (error) {
      // THEN an Error is thrown by IlpCredentials
      assert.equal(
        (error as IlpError).errorType,
        IlpErrorType.InvalidAccessToken,
      )
      assert.equal(error.message, IlpError.invalidAccessToken.message)
    }
  })
})
