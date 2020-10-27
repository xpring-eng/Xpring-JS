import { assert } from 'chai'
import { Wallet, XrplNetwork, XrpUtils } from 'xpring-common-js'
import WebSocketNetworkClient from '../../src/XRP/network-clients/web-socket-network-client'
import { WebSocketTransactionResponse } from '../../src/XRP/shared/rippled-web-socket-schema'
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

  it('subscribeToAccount - valid request', async function (): Promise<void> {
    this.timeout(timeoutMs)

    const xAddress = wallet.getAddress()
    const classicAddress = XrpUtils.decodeXAddress(xAddress)
    const address = classicAddress!.address

    const xrpAmount = '100'
    const subscriptionId = 'subscribe_transaction_' + address

    let messageReceived = false
    const callback = (data: WebSocketTransactionResponse) => {
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
    const response = await webSocketNetworkClient.subscribeToAccount(
      subscriptionId,
      callback,
      address,
    )

    // THEN the subscribe request is successfully submitted and received
    assert.equal(response.status, 'success')
    assert.equal(response.type, 'response')
    assert.equal(response.id, subscriptionId)

    // WHEN a payment is sent to that address
    await xrpClient.send(xrpAmount, xAddress, wallet2)

    await waitUntilMessageReceived()

    //THEN the payment is successfully received
    assert(messageReceived)
  })

  it('subscribeToAccount - bad address', async function (): Promise<void> {
    this.timeout(timeoutMs)

    const address = 'badAddress'
    const subscriptionId = 'subscribe_transaction_' + address

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const callback = (_data: WebSocketTransactionResponse) => {}
    // GIVEN a test address that has at least one trust line on testnet
    // WHEN monitorIncomingPayments is called for that address THEN an error is thrown.
    try {
      await webSocketNetworkClient.subscribeToAccount(
        subscriptionId,
        callback,
        address,
      )
    } catch (e) {
      if (!(e instanceof XrpError)) {
        assert.fail('wrong error')
      }
    }
  })
})
