import { assert } from 'chai'
import { Wallet, XrplNetwork, XrpUtils } from 'xpring-common-js'
import WebSocketNetworkClient from '../../src/XRP/network-clients/web-socket-network-client'
import GrpcNetworkClient from '../../src/XRP/network-clients/grpc-xrp-network-client'
import {
  ResponseStatus,
  TransactionResponse,
  RipplePathFindSuccessfulResponse,
  IssuedCurrency,
  SourceCurrency,
} from '../../src/XRP/shared/rippled-web-socket-schema'
import XrpError from '../../src/XRP/shared/xrp-error'
import XrpClient from '../../src/XRP/xrp-client'
import IssuedCurrencyClient from '../../src/XRP/issued-currency-client'

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

const grpcNetworkClient = new GrpcNetworkClient(rippledGrpcUrl)

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

describe('WebSocket Tests', function (): void {
  // Retry integration tests on failure.
  //this.retries(3)

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

  it('findRipplePath - success, mandatory fields', async function (): Promise<
    void
  > {
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

  it('findRipplePath - successful direct path', async function (): Promise<
    void
  > {
    this.timeout(timeoutMs)

    const sourceAddress = XrpUtils.decodeXAddress(wallet.getAddress())!.address
    const destinationAddress = XrpUtils.decodeXAddress(wallet2.getAddress())!
      .address

    // GIVEN two valid test addresses with a trust line between them
    const trustLineLimit = '200'
    const trustLineCurrency = 'FOO'
    await issuedCurrencyClient.createTrustLine(
      wallet.getAddress(),
      trustLineCurrency,
      trustLineLimit,
      wallet2,
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

  it('findRipplePath - successful path through issuers own offer', async function (): Promise<
    void
  > {
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
      issuerWallet.getAddress(),
      trustLineCurrency,
      trustLineLimit,
      wallet2,
    )

    // Create an offer to accept XRP in exchange for FOO
    const takerGetsAmount: IssuedCurrency = {
      currency: trustLineCurrency,
      issuer: issuerClassicAddress,
      value: '200',
    }

    const takerPaysAmount = '200000000' // 200 XRP, 1:1 exchange rate
    const offerCreateResult = await issuedCurrencyClient.createOffer(
      issuerWallet,
      takerGetsAmount,
      takerPaysAmount,
    )
    console.log('result of creating offer: ')
    console.log(offerCreateResult)

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

    console.log(response)
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

  it('findRipplePath - successful path through third-party offer', async function (): Promise<
    void
  > {
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
      issuerWallet.getAddress(),
      trustLineCurrency,
      trustLineLimit,
      offerCreatorWallet,
    )

    await issuedCurrencyClient.createTrustLine(
      issuerWallet.getAddress(),
      trustLineCurrency,
      trustLineLimit,
      wallet2,
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
    const offerCreateResult = await issuedCurrencyClient.createOffer(
      offerCreatorWallet,
      takerGetsAmount,
      takerPaysAmount,
    )
    console.log('result of creating offer: ')
    console.log(offerCreateResult)

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

    console.log(response)
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
