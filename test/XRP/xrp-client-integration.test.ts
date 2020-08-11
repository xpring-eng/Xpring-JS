import bigInt from 'big-integer'
import { assert } from 'chai'
import { XrplNetwork } from 'xpring-common-js'

import TransactionStatus from '../../src/XRP/transaction-status'
import XrpClient from '../../src/XRP/xrp-client'
import XRPTestUtils, {
  expectedNoDataMemo,
  expectedNoFormatMemo,
  expectedNoTypeMemo,
  iForgotToPickUpCarlMemo,
  noDataMemo,
  noFormatMemo,
  noTypeMemo,
} from './helpers/xrp-test-utils'

// A timeout for these tests.
// eslint-disable-next-line @typescript-eslint/no-magic-numbers -- 1 minute in milliseconds
const timeoutMs = 60 * 1000

// An address on TestNet that has a balance.
const recipientAddress = 'X7cBcY4bdTTzk3LHmrKAK6GyrirkXfLHGFxzke5zTmYMfw4'

// An XrpClient that makes requests. Ssends the requests to an HTTP envoy emulating how the browser would behave.
const grpcWebUrl = 'https://envoy.test.xrp.xpring.io'
const xrpWebClient = new XrpClient(grpcWebUrl, XrplNetwork.Test, true)

// An XrpClient that makes requests. Uses rippled's gRPC implementation.
const rippledUrl = 'test.xrp.xpring.io:50051'
const xrpClient = new XrpClient(rippledUrl, XrplNetwork.Test)

// Some amount of XRP to send.
const amount = bigInt('1')

describe('XrpClient Integration Tests', function (): void {
  // Retry integration tests on failure.
  this.retries(3)

  // A Wallet with some balance on Testnet.
  let wallet
  before(async function () {
    wallet = await XRPTestUtils.randomWalletFromFaucet()
  })

  it('Get Transaction Status - Web Shim', async function (): Promise<void> {
    this.timeout(timeoutMs)

    const transactionHash = await xrpWebClient.send(
      amount,
      recipientAddress,
      wallet,
    )
    const transactionStatus = await xrpWebClient.getPaymentStatus(
      transactionHash,
    )
    assert.deepEqual(transactionStatus, TransactionStatus.Succeeded)
  })

  it('Get Transaction Status - rippled', async function (): Promise<void> {
    this.timeout(timeoutMs)

    const transactionHash = await xrpClient.send(
      amount,
      recipientAddress,
      wallet,
    )
    const transactionStatus = await xrpClient.getPaymentStatus(transactionHash)
    assert.deepEqual(transactionStatus, TransactionStatus.Succeeded)
  })

  it('Send XRP - Web Shim', async function (): Promise<void> {
    this.timeout(timeoutMs)

    const result = await xrpWebClient.send(amount, recipientAddress, wallet)
    assert.exists(result)
  })

  it('Send XRP with memo - Web Shim', async function (): Promise<void> {
    this.timeout(timeoutMs)

    const memoList = [
      iForgotToPickUpCarlMemo,
      noDataMemo,
      noFormatMemo,
      noTypeMemo,
    ]
    const result = await xrpWebClient.sendWithDetails({
      amount,
      destination: recipientAddress,
      sender: wallet,
      memoList,
    })
    assert.exists(result)

    const transaction = await xrpClient.getPayment(result)

    assert.deepEqual(transaction?.memos, [
      iForgotToPickUpCarlMemo,
      expectedNoDataMemo,
      expectedNoFormatMemo,
      expectedNoTypeMemo,
    ])
  })

  it('Send XRP - rippled', async function (): Promise<void> {
    this.timeout(timeoutMs)

    const result = await xrpClient.send(amount, recipientAddress, wallet)
    assert.exists(result)
  })

  it('Send XRP with memo - rippled', async function (): Promise<void> {
    this.timeout(timeoutMs)
    const memoList = [
      iForgotToPickUpCarlMemo,
      noDataMemo,
      noFormatMemo,
      noTypeMemo,
    ]
    const result = await xrpClient.sendWithDetails({
      amount,
      destination: recipientAddress,
      sender: wallet,
      memoList,
    })
    assert.exists(result)

    const transaction = await xrpClient.getPayment(result)

    assert.deepEqual(transaction?.memos, [
      iForgotToPickUpCarlMemo,
      expectedNoDataMemo,
      expectedNoFormatMemo,
      expectedNoTypeMemo,
    ])
  })

  it('Check if Account Exists - true - Web Shim', async function (): Promise<
    void
  > {
    this.timeout(timeoutMs)

    const doesExist = await xrpWebClient.accountExists(recipientAddress)
    assert.equal(doesExist, true)
  })

  it('Check if Account Exists - true - rippled', async function (): Promise<
    void
  > {
    this.timeout(timeoutMs)

    const doesExist = await xrpClient.accountExists(recipientAddress)

    assert.equal(doesExist, true)
  })

  it('Check if Account Exists - false - rippled', async function (): Promise<
    void
  > {
    this.timeout(timeoutMs)

    // This is a valid address, but it should NOT show up on Testnet, so should resolve to false
    const coinbaseMainnet = 'XVYUQ3SdUcVnaTNVanDYo1NamrUukPUPeoGMnmvkEExbtrj'
    const doesExist = await xrpClient.accountExists(coinbaseMainnet)
    assert.equal(doesExist, false)
  })

  it('Payment History - rippled', async function (): Promise<void> {
    this.timeout(timeoutMs)

    const payments = await xrpClient.paymentHistory(recipientAddress)

    assert.isTrue(payments.length > 0)
  })

  it('Get Transaction - rippled', async function (): Promise<void> {
    this.timeout(timeoutMs)

    const transactionHash = await xrpClient.send(
      amount,
      recipientAddress,
      wallet,
    )

    const transaction = await xrpClient.getPayment(transactionHash)

    assert.exists(transaction)
  })
})
