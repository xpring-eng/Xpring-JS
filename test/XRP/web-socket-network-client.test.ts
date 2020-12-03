import { assert } from 'chai'
import { Wallet, XrplNetwork, XrpUtils } from 'xpring-common-js'
import WebSocketNetworkClient from '../../src/XRP/network-clients/web-socket-network-client'
import {
  TransactionResponse,
  ResponseStatus,
  AccountOffersSuccessfulResponse,
  WebSocketFailureResponse,
} from '../../src/XRP/shared/rippled-web-socket-schema'
import XrpError from '../../src/XRP/shared/xrp-error'
import XrpClient from '../../src/XRP/xrp-client'
import IssuedCurrency from '../../src/XRP/shared/issued-currency'
import IssuedCurrencyClient from '../../src/XRP/issued-currency-client'

import XRPTestUtils from './helpers/xrp-test-utils'
import { RIPPLED_URL, TEST_TIMEOUT_MS } from '../Common/constants'
import { RippledErrorMessages } from '../../src/XRP/shared/rippled-error-messages'

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

  it('subscribeToAccount/unsubscribeFromAccount - valid request', async function (): Promise<void> {
    this.timeout(TEST_TIMEOUT_MS)

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

    const xrpClient = new XrpClient(RIPPLED_URL, XrplNetwork.Test)

    // GIVEN a valid test address
    const xAddress = wallet.getAddress()
    const classicAddress = XrpUtils.decodeXAddress(xAddress)
    const address = classicAddress!.address

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
    await xrpClient.sendXrp(xrpAmount, xAddress, wallet2)

    // THEN the payment is not received by the callback
    // (If a payment is received, fail will be called in the callback)
  })

  it('subscribeToAccount - bad address', async function (): Promise<void> {
    this.timeout(TEST_TIMEOUT_MS)

    // GIVEN a test address that is malformed.
    const address = 'badAddress'

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

  it('unsubscribeFromAccount - not-subscribed address', async function (): Promise<void> {
    this.timeout(TEST_TIMEOUT_MS)

    // GIVEN a test address that is not subscribed to.
    const xAddress = wallet2.getAddress()
    const classicAddress = XrpUtils.decodeXAddress(xAddress)
    const address = classicAddress!.address

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
    this.timeout(TEST_TIMEOUT_MS)

    // GIVEN a test address that is malformed.
    const address = 'badAddress'

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

  it('getAccountOffers - valid requests', async function (): Promise<void> {
    this.timeout(TEST_TIMEOUT_MS)

    const issuedCurrencyClient = IssuedCurrencyClient.issuedCurrencyClientWithEndpoint(
      RIPPLED_URL,
      rippledWebSocketUrl,
      console.log,
      XrplNetwork.Test,
    )

    // GIVEN a valid test address with no offers
    const xAddress = wallet.getAddress()
    const classicAddress = XrpUtils.decodeXAddress(xAddress)
    const address = classicAddress!.address

    // WHEN getAccountOffers is called for that address
    const accountOfferResponse = await webSocketNetworkClient.getAccountOffers(
      address,
    )

    // THEN the request is successfully submitted and received, with no listed offers
    assert.equal(accountOfferResponse.status, ResponseStatus.success)
    assert.equal(accountOfferResponse.type, 'response')

    const result = (accountOfferResponse as AccountOffersSuccessfulResponse)
      .result

    assert.equal(result.account, address)
    assert.isEmpty(result.offers)
    this.timeout(TEST_TIMEOUT_MS)

    // GIVEN a valid test address with an offer
    const takerGetsIssuedCurrency: IssuedCurrency = {
      issuer: address,
      currency: 'FAK',
      value: '100',
    }
    const takerPaysXrp = '50'

    await issuedCurrencyClient.createOffer(
      wallet,
      takerGetsIssuedCurrency,
      takerPaysXrp,
    )

    // WHEN getAccountOffers is called for that address
    const accountOfferResponse2 = await webSocketNetworkClient.getAccountOffers(
      address,
    )

    // THEN the request is successfully submitted and received, with the one listed offer
    assert.equal(accountOfferResponse2.status, ResponseStatus.success)
    assert.equal(accountOfferResponse2.type, 'response')

    const result2 = (accountOfferResponse2 as AccountOffersSuccessfulResponse)
      .result

    assert.equal(result2.account, address)
    assert.isNotEmpty(result2.offers)

    const offer = result2.offers[0]

    assert.equal(offer.taker_pays, takerPaysXrp)
    assert.deepEqual(offer.taker_gets, takerGetsIssuedCurrency)

    issuedCurrencyClient.webSocketNetworkClient.close()
  })

  it('getAccountOffers - bad address', async function (): Promise<void> {
    this.timeout(TEST_TIMEOUT_MS)

    // GIVEN a test address that is malformed.
    const address = 'badAddress'

    // WHEN getAccountOffers is called for that address THEN an error is thrown.
    const response = await webSocketNetworkClient.getAccountOffers(address)

    assert.equal(response.status, ResponseStatus.error)
    assert.equal(response.type, 'response')

    const errorResponse = response as WebSocketFailureResponse

    assert.equal(errorResponse.error, RippledErrorMessages.accountNotFound)
  })
})
