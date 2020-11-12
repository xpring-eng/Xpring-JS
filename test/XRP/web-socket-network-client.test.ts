import { assert } from 'chai'
import { Wallet, XrplNetwork, XrpUtils } from 'xpring-common-js'
import WebSocketNetworkClient from '../../src/XRP/network-clients/web-socket-network-client'
import {
  ResponseStatus,
  TransactionResponse,
  RipplePathFindSuccessfulResponse,
  IssuedCurrency,
} from '../../src/XRP/shared/rippled-web-socket-schema'
import XrpError from '../../src/XRP/shared/xrp-error'
import XrpClient from '../../src/XRP/xrp-client'

import XRPTestUtils from './helpers/xrp-test-utils'

// A timeout for these tests.
// eslint-disable-next-line @typescript-eslint/no-magic-numbers -- 1 minute in milliseconds
const timeoutMs = 60 * 1000

const rippledGrpcUrl = 'test.xrp.xpring.io:50051'
const rippledWebSocketUrl = 'wss://wss.test.xrp.xpring.io'

const webSocketNetworkClient = new WebSocketNetworkClient(
  rippledWebSocketUrl,
  console.log,
)

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

describe('WebSocket Tests', function (): void {
  // Retry integration tests on failure.
  this.retries(3)

  // A Wallet with some balance on Testnet.
  let wallet: Wallet
  let wallet2: Wallet
  before(async function () {
    wallet = await XRPTestUtils.randomWalletFromFaucet()
    wallet2 = await XRPTestUtils.randomWalletFromFaucet()
  })

  after(function (done) {
    webSocketNetworkClient.close()
    done()
  })

  it('subscribeToAccount/unsubscribeFromAccount - valid request', async function (): Promise<
    void
  > {
    this.timeout(timeoutMs)

    const xAddress = wallet.getAddress()
    const classicAddress = XrpUtils.decodeXAddress(xAddress)
    const address = classicAddress!.address

    const xrpAmount = '100'

    let messageReceived = false
    const callback = (data: TransactionResponse) => {
      if (messageReceived) {
        assert.fail('Second message should not be received after unsubscribing')
      }
      messageReceived = true
      assert.equal(data.engine_result, 'tesSUCCESS')
      assert.equal(data.engine_result_code, 0)
      assert.equal(
        data.engine_result_message,
        'The transaction was applied. Only final in a validated ledger.',
      )
      assert.equal(data.meta.TransactionResult, 'tesSUCCESS')
      assert.equal(data.status, 'closed')
      assert.equal(data.type, 'transaction')
      assert.equal(data.validated, true)
      assert.equal(data.transaction.Amount, xrpAmount)
      assert.equal(data.transaction.Destination, address)
      assert.equal(data.transaction.TransactionType, 'Payment')
    }

    const waitUntilMessageReceived = async () => {
      while (!messageReceived) {
        await sleep(5)
      }
    }

    const xrpClient = new XrpClient(rippledGrpcUrl, XrplNetwork.Test)

    // GIVEN a valid test address
    // WHEN subscribeToAccount is called for that address
    const subscribeResponse = await webSocketNetworkClient.subscribeToAccount(
      address,
      callback,
    )

    // THEN the subscribe request is successfully submitted and received
    assert.equal(subscribeResponse.status, ResponseStatus.success)
    assert.equal(subscribeResponse.type, 'response')

    // WHEN a payment is sent to that address
    await xrpClient.sendXrp(xrpAmount, xAddress, wallet2)

    await waitUntilMessageReceived()

    // THEN the payment is successfully received
    assert(messageReceived)

    // WHEN unsubscribe is called for that address
    const unsubscribeResponse = await webSocketNetworkClient.unsubscribeFromAccount(
      address,
    )

    // THEN the unsubscribe request is successfully submitted and received
    assert.equal(unsubscribeResponse.status, ResponseStatus.success)
    assert.equal(unsubscribeResponse.type, 'response')

    // WHEN a payment is sent to that address
    await xrpClient.send(xrpAmount, xAddress, wallet2)

    // THEN the payment is not received by the callback
    // (If a payment is received, fail will be called in the callback)
  })

  it('subscribeToAccount - bad address', async function (): Promise<void> {
    this.timeout(timeoutMs)

    const address = 'badAddress'

    // GIVEN a test address that is malformed.
    // WHEN subscribeToAccount is called for that address THEN an error is thrown.
    try {
      await webSocketNetworkClient.subscribeToAccount(
        address,
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        () => {},
      )
      assert.fail('Method call should fail')
    } catch (e) {
      if (!(e instanceof XrpError)) {
        assert.fail('wrong error')
      }
    }
  })

  it('unsubscribeFromAccount - not-subscribed address', async function (): Promise<
    void
  > {
    this.timeout(timeoutMs)

    const xAddress = wallet2.getAddress()
    const classicAddress = XrpUtils.decodeXAddress(xAddress)
    const address = classicAddress!.address

    // GIVEN a test address that is not subscribed to.
    // WHEN unsubscribeFromAccount is called for that address THEN an error is thrown.
    try {
      await webSocketNetworkClient.unsubscribeFromAccount(address)
      assert.fail('Method call should fail')
    } catch (e) {
      if (!(e instanceof XrpError)) {
        assert.fail('wrong error')
      }
    }
  })

  it('unsubscribeFromAccount - bad address', async function (): Promise<void> {
    this.timeout(timeoutMs)

    const address = 'badAddress'

    // GIVEN a test address that is malformed.
    // WHEN unsubscribeFromAccount is called for that address THEN an error is thrown.
    try {
      await webSocketNetworkClient.unsubscribeFromAccount(address)
      assert.fail('Method call should fail')
    } catch (e) {
      if (!(e instanceof XrpError)) {
        assert.fail('wrong error')
      }
    }
  })

  it('findRipplePath - mandatory fields', async function (): Promise<void> {
    this.timeout(timeoutMs)

    const sourceAddress = XrpUtils.decodeXAddress(wallet.getAddress())!.address
    const destinationAddress = XrpUtils.decodeXAddress(wallet2.getAddress())!
      .address

    const xrpAmount = '100'

    // GIVEN two valid test addresses
    // WHEN findRipplePath is called between those addresses
    const response = await webSocketNetworkClient.findRipplePath(
      sourceAddress,
      destinationAddress,
      xrpAmount,
    )

    // THEN the request is successfully submitted and received
    assert.equal(response.status, 'success')
    assert.equal(response.type, 'response')

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const result = (response as RipplePathFindSuccessfulResponse).result

    assert.equal(result.destination_account, destinationAddress)
    assert.equal(result.destination_amount, xrpAmount)
    assert.equal(result.source_account, sourceAddress)
    assert.include(result.destination_currencies, 'XRP')
  })

  it('findRipplePath - all fields', async function (): Promise<void> {
    this.timeout(timeoutMs)

    const sourceAddress = XrpUtils.decodeXAddress(wallet.getAddress())!.address
    const destinationAddress = XrpUtils.decodeXAddress(wallet2.getAddress())!
      .address

    // const xrpAmount = '100'
    const destinationAmount: IssuedCurrency = {
      issuer: 'razqQKzJRdB4UxFPWf5NEpEG3WMkmwgcXA',
      currency: 'CNY',
      value: '50',
    }
    const sendMaxAmount = '100'

    // GIVEN two valid test addresses
    // WHEN findRipplePath is called between those addresses
    const response = await webSocketNetworkClient.findRipplePath(
      sourceAddress,
      destinationAddress,
      destinationAmount,
      sendMaxAmount,
    )

    console.log(response)
    // THEN the request is successfully submitted and received
    assert.equal(response.status, 'success')
    assert.equal(response.type, 'response')

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const result = (response as RipplePathFindSuccessfulResponse).result

    assert.equal(result.destination_account, destinationAddress)
    assert.equal(result.destination_amount, destinationAmount)
    assert.equal(result.source_account, sourceAddress)
    assert.include(result.destination_currencies, 'XRP')
  })
})
