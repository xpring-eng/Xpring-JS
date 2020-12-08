import { assert } from 'chai'
import { Wallet, XrplNetwork, XrpUtils } from 'xpring-common-js'
import WebSocketNetworkClient from '../../src/XRP/network-clients/web-socket-network-client'
import GrpcNetworkClient from '../../src/XRP/network-clients/grpc-xrp-network-client'
import {
  ResponseStatus,
  WebSocketFailureResponse,
  TransactionResponse,
  AccountOffersSuccessfulResponse,
  RipplePathFindSuccessfulResponse,
  SourceCurrency,
} from '../../src/XRP/shared/rippled-web-socket-schema'
import XrpError from '../../src/XRP/shared/xrp-error'
import XrpClient from '../../src/XRP/xrp-client'
import IssuedCurrency from '../../src/XRP/shared/issued-currency'
import IssuedCurrencyClient from '../../src/XRP/issued-currency-client'

import XRPTestUtils from './helpers/xrp-test-utils'
import { RippledErrorMessages } from '../../src/XRP/shared/rippled-error-messages'

// A timeout for these tests.
// eslint-disable-next-line @typescript-eslint/no-magic-numbers -- 1 minute in milliseconds
const timeoutMs = 60 * 1000

const rippledGrpcUrl = 'test.xrp.xpring.io:50051'
const rippledWebSocketUrl = 'wss://wss.test.xrp.xpring.io'

const webSocketNetworkClient = new WebSocketNetworkClient(
  rippledWebSocketUrl,
  console.log,
)

const grpcNetworkClient = new GrpcNetworkClient(rippledGrpcUrl)

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

describe('WebSocket Tests', function (): void {
  // A Wallet with some balance on Testnet.
  let wallet: Wallet
  let wallet2: Wallet
  let issuedCurrencyClient: IssuedCurrencyClient
  before(async function () {
    wallet = await XRPTestUtils.randomWalletFromFaucet()
    wallet2 = await XRPTestUtils.randomWalletFromFaucet()
    issuedCurrencyClient = new IssuedCurrencyClient(
      grpcNetworkClient,
      webSocketNetworkClient,
      XrplNetwork.Test,
    )
  })

  after(function (done) {
    webSocketNetworkClient.close()
    done()
  })

  it('subscribeToAccount/unsubscribeFromAccount - valid request', async function (): Promise<void> {
    this.timeout(timeoutMs)

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
    this.timeout(timeoutMs)

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
    this.timeout(timeoutMs)

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
    this.timeout(timeoutMs)

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
    this.timeout(timeoutMs)

    const issuedCurrencyClient = IssuedCurrencyClient.issuedCurrencyClientWithEndpoint(
      rippledGrpcUrl,
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
    this.timeout(timeoutMs)

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
    this.timeout(timeoutMs)

    // GIVEN a test address that is malformed.
    const address = 'badAddress'

    // WHEN getAccountOffers is called for that address THEN an error is thrown.
    const response = await webSocketNetworkClient.getAccountOffers(address)

    assert.equal(response.status, ResponseStatus.error)
    assert.equal(response.type, 'response')

    const errorResponse = response as WebSocketFailureResponse

    assert.equal(errorResponse.error, RippledErrorMessages.accountNotFound)
  })

  it('findRipplePath - success, mandatory fields', async function (): Promise<void> {
    this.timeout(timeoutMs)

    const sourceAddress = XrpUtils.decodeXAddress(wallet.getAddress())!.address
    const destinationAddress = XrpUtils.decodeXAddress(wallet2.getAddress())!
      .address

    const destinationAmount: IssuedCurrency = {
      currency: 'CNY',
      issuer: 'razqQKzJRdB4UxFPWf5NEpEG3WMkmwgcXA',
      value: '50',
    }

    // GIVEN two valid test addresses
    // WHEN findRipplePath is called between those addresses
    const response = await webSocketNetworkClient.findRipplePath(
      sourceAddress,
      destinationAddress,
      destinationAmount,
    )

    // THEN the request is successfully submitted and received
    assert.equal(response.status, 'success')
    assert.equal(response.type, 'response')

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const result = (response as RipplePathFindSuccessfulResponse).result

    assert.equal(result.destination_account, destinationAddress)
    assert.deepEqual(result.destination_amount, destinationAmount)
    assert.equal(result.source_account, sourceAddress)
    assert.include(result.destination_currencies, 'XRP')
  })

  it('findRipplePath - failure, both sendMax and sourceCurrencies', async function (): Promise<void> {
    this.timeout(timeoutMs)

    const sourceAddress = XrpUtils.decodeXAddress(wallet.getAddress())!.address
    const destinationAddress = XrpUtils.decodeXAddress(wallet2.getAddress())!
      .address

    const destinationAmount: IssuedCurrency = {
      currency: 'CNY',
      issuer: 'razqQKzJRdB4UxFPWf5NEpEG3WMkmwgcXA',
      value: '50',
    }
    const sendMaxAmount = '100'

    const sourceCurrency: SourceCurrency = { currency: 'USD' }

    // GIVEN two valid test addresses
    // WHEN findRipplePath is called between those addresses THEN an error is thrown.
    try {
      await webSocketNetworkClient.findRipplePath(
        sourceAddress,
        destinationAddress,
        destinationAmount,
        sendMaxAmount,
        [sourceCurrency],
      )
      assert.fail('Method call should fail')
    } catch (e) {
      if (!(e instanceof XrpError)) {
        assert.fail('wrong error')
      }
    }
  })

  it('findRipplePath - successful direct path', async function (): Promise<void> {
    this.timeout(timeoutMs)

    const sourceAddress = XrpUtils.decodeXAddress(wallet.getAddress())!.address
    const destinationAddress = XrpUtils.decodeXAddress(wallet2.getAddress())!
      .address

    // GIVEN two valid test addresses with a trust line between them
    const trustLineLimit = '200'
    const trustLineCurrency = 'FOO'
    await issuedCurrencyClient.createTrustLine(
      wallet2,
      wallet.getAddress(),
      trustLineCurrency,
      trustLineLimit,
    )

    const destinationAmount: IssuedCurrency = {
      issuer: destinationAddress,
      currency: trustLineCurrency,
      value: '50',
    }

    // WHEN findRipplePath is called between those addresses
    const response = await webSocketNetworkClient.findRipplePath(
      sourceAddress,
      destinationAddress,
      destinationAmount,
    )

    // THEN the request is successfully submitted and received
    assert.equal(response.status, 'success')
    assert.equal(response.type, 'response')

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const result = (response as RipplePathFindSuccessfulResponse).result

    assert.equal(result.destination_account, destinationAddress)
    assert.deepEqual(
      result.destination_amount as IssuedCurrency,
      destinationAmount,
    )
    assert.equal(result.source_account, sourceAddress)
    assert.include(result.destination_currencies, trustLineCurrency)
    assert(result.alternatives.length >= 1)
  })

  it('findRipplePath - successful path through issuers own offer', async function (): Promise<void> {
    this.timeout(timeoutMs)
    const issuerWallet = await XRPTestUtils.randomWalletFromFaucet()

    const issuerClassicAddress = XrpUtils.decodeXAddress(
      issuerWallet.getAddress(),
    )!.address
    const sourceAddress = XrpUtils.decodeXAddress(wallet.getAddress())!.address
    const destinationAddress = XrpUtils.decodeXAddress(wallet2.getAddress())!
      .address

    // GIVEN two valid test addresses, an issuing address, a trust line from one test address (wallet2) to the issuer
    // and an offer on the dex to exchange XRP for some this issuer's issued currency.
    const trustLineLimit = '1000'
    const trustLineCurrency = 'FOO'

    await issuedCurrencyClient.enableRippling(issuerWallet)

    await issuedCurrencyClient.createTrustLine(
      wallet2,
      issuerWallet.getAddress(),
      trustLineCurrency,
      trustLineLimit,
    )

    // Create an offer to accept XRP in exchange for FOO
    const takerGetsAmount: IssuedCurrency = {
      currency: trustLineCurrency,
      issuer: issuerClassicAddress,
      value: '200',
    }

    const takerPaysAmount = '200000000' // 200 XRP, 1:1 exchange rate
    await issuedCurrencyClient.createOffer(
      issuerWallet,
      takerGetsAmount,
      takerPaysAmount,
    )

    // WHEN findRipplePath is called between the two non-issuing addresses, offering to spend XRP and deliver FOO
    const destinationAmount: IssuedCurrency = {
      issuer: issuerClassicAddress,
      currency: trustLineCurrency,
      value: '50',
    }

    const sourceCurrency: SourceCurrency = {
      currency: 'XRP',
    }

    const sourceCurrencies = [sourceCurrency]

    const response = await webSocketNetworkClient.findRipplePath(
      sourceAddress,
      destinationAddress,
      destinationAmount,
      undefined,
      sourceCurrencies,
    )

    // THEN the request is successfully submitted and received
    assert.equal(response.status, 'success')
    assert.equal(response.type, 'response')

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const result = (response as RipplePathFindSuccessfulResponse).result

    assert.equal(result.destination_account, destinationAddress)
    assert.deepEqual(result.destination_amount, destinationAmount)
    assert.equal(result.source_account, sourceAddress)
    assert.include(result.destination_currencies, 'FOO')
    assert(result.alternatives.length >= 1)
  })

  it('findRipplePath - successful path through third-party offer', async function (): Promise<void> {
    this.timeout(timeoutMs)
    const issuerWallet = await XRPTestUtils.randomWalletFromFaucet()
    const offerCreatorWallet = await XRPTestUtils.randomWalletFromFaucet()

    const issuerClassicAddress = XrpUtils.decodeXAddress(
      issuerWallet.getAddress(),
    )!.address
    const sourceAddress = XrpUtils.decodeXAddress(wallet.getAddress())!.address
    const destinationAddress = XrpUtils.decodeXAddress(wallet2.getAddress())!
      .address

    // GIVEN two valid test addresses, an issuing address, a trust line from one test address (wallet2) to the issuer
    // and an offer on the dex to exchange XRP for some this issuer's issued currency.
    const trustLineLimit = '1000'
    const trustLineCurrency = 'FOO'

    await issuedCurrencyClient.enableRippling(issuerWallet)

    await issuedCurrencyClient.createTrustLine(
      offerCreatorWallet,
      issuerWallet.getAddress(),
      trustLineCurrency,
      trustLineLimit,
    )

    await issuedCurrencyClient.createTrustLine(
      wallet2,
      issuerWallet.getAddress(),
      trustLineCurrency,
      trustLineLimit,
    )

    // Fund an address with some issued currency, who can then create an offer.
    await issuedCurrencyClient.createIssuedCurrency(
      issuerWallet,
      offerCreatorWallet.getAddress(),
      trustLineCurrency,
      '500',
    )

    // Create an offer to accept XRP in exchange for FOO
    const takerGetsAmount: IssuedCurrency = {
      currency: trustLineCurrency,
      issuer: issuerClassicAddress,
      value: '200',
    }

    const takerPaysAmount = '200000000' // 200 XRP, 1:1 exchange rate
    await issuedCurrencyClient.createOffer(
      offerCreatorWallet,
      takerGetsAmount,
      takerPaysAmount,
    )

    // WHEN findRipplePath is called between the two non-issuing addresses, offering to spend XRP and deliver FOO
    const destinationAmount: IssuedCurrency = {
      issuer: issuerClassicAddress,
      currency: trustLineCurrency,
      value: '50',
    }

    const sourceCurrency: SourceCurrency = {
      currency: 'XRP',
    }

    const sourceCurrencies = [sourceCurrency]

    const response = await webSocketNetworkClient.findRipplePath(
      sourceAddress,
      destinationAddress,
      destinationAmount,
      undefined,
      sourceCurrencies,
    )

    // THEN the request is successfully submitted and received
    assert.equal(response.status, 'success')
    assert.equal(response.type, 'response')

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const result = (response as RipplePathFindSuccessfulResponse).result

    assert.equal(result.destination_account, destinationAddress)
    assert.deepEqual(result.destination_amount, destinationAmount)
    assert.equal(result.source_account, sourceAddress)
    assert.include(result.destination_currencies, 'FOO')
    assert(result.alternatives.length >= 1)
  })

  it('findRipplePath - special sendMax case', async function (): Promise<void> {
    this.timeout(timeoutMs)

    const sourceAddress = XrpUtils.decodeXAddress(wallet.getAddress())!.address
    const destinationAddress = XrpUtils.decodeXAddress(wallet2.getAddress())!
      .address

    const destinationAmount = '-1'
    const sendMaxAmount: IssuedCurrency = {
      issuer: 'razqQKzJRdB4UxFPWf5NEpEG3WMkmwgcXA',
      currency: 'CNY',
      value: '50',
    }

    // GIVEN two valid test addresses
    // WHEN findRipplePath is called between those addresses
    const response = await webSocketNetworkClient.findRipplePath(
      sourceAddress,
      destinationAddress,
      destinationAmount,
      sendMaxAmount,
    )

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
