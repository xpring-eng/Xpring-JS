import { Wallet } from 'xpring-common-js'
import { assert } from 'chai'
import bigInt from 'big-integer'
import XRPClient from '../../src/XRP/xrp-client'
import TransactionStatus from '../../src/XRP/transaction-status'

// A timeout for these tests.
const timeoutMs = 60 * 1000 // 1 minute

// An address on TestNet that has a balance.
const recipientAddress = 'X7cBcY4bdTTzk3LHmrKAK6GyrirkXfLHGFxzke5zTmYMfw4'

// A wallet with some balance on TestNet.
const wallet = Wallet.generateWalletFromSeed('snYP7oArxKepd3GPDcrjMsJYiJeJB')!

// A hash of a successfully validated payment transaction.
const transactionHash =
  'DAA9F31628C952A48DAE71829E91847BF4EF23C0FABDD7218E41836D1E68EEBD'

// An XRPClient that makes requests. Uses the legacy protocol buffer implementation.
const legacyGRPCURLNode = 'grpc.xpring.tech:80'
const legacyXRPClientNode = new XRPClient(legacyGRPCURLNode, false)

// An XRPClient that makes requests. Uses the legacy protocol buffer implementation and sends the requests to an HTTP envoy emulating how the browser would behave
const grpcWebURL = 'https://envoy.test.xrp.xpring.io'
const xpringWebClient = new XRPClient(grpcWebURL, true, true)

// An XRPClient that makes requests. Uses rippled's gRPC implementation.
const rippledURL = 'test.xrp.xpring.io:50051'
const xrpClient = new XRPClient(rippledURL, true)

// Some amount of XRP to send.
const amount = bigInt('1')

describe('Xpring JS XRPClient Integration Tests', function(): void {
  it('Get Account Balance - Legacy Node Shim', async function(): Promise<void> {
    this.timeout(timeoutMs)

    const balance = await legacyXRPClientNode.getBalance(recipientAddress)
    assert.exists(balance)
  })

  it('Get Account Balance - Web Shim', async function(): Promise<void> {
    this.timeout(timeoutMs)

    const balance = await xpringWebClient.getBalance(recipientAddress)
    assert.exists(balance)
  })

  it('Get Account Balance - rippled', async function(): Promise<void> {
    this.timeout(timeoutMs)

    const balance = await xrpClient.getBalance(recipientAddress)
    assert.exists(balance)
  })

  it('Get Transaction Status - Legacy Node Shim', async function(): Promise<
    void
  > {
    this.timeout(timeoutMs)

    const transactionStatus = await legacyXRPClientNode.getPaymentStatus(
      transactionHash,
    )
    assert.deepEqual(transactionStatus, TransactionStatus.Succeeded)
  })

  it('Get Transaction Status - Web Shim', async function(): Promise<void> {
    this.timeout(timeoutMs)

    const transactionStatus = await xpringWebClient.getPaymentStatus(
      transactionHash,
    )
    assert.deepEqual(transactionStatus, TransactionStatus.Succeeded)
  })

  it('Get Transaction Status - rippled', async function(): Promise<void> {
    this.timeout(timeoutMs)

    const transactionStatus = await xrpClient.getPaymentStatus(transactionHash)
    assert.deepEqual(transactionStatus, TransactionStatus.Succeeded)
  })

  it('Send XRP - Legacy Node Shim', async function(): Promise<void> {
    this.timeout(timeoutMs)

    const result = await legacyXRPClientNode.send(
      amount,
      recipientAddress,
      wallet,
    )
    assert.exists(result)
  })

  it('Send XRP - Web Shim', async function(): Promise<void> {
    this.timeout(timeoutMs)

    const result = await xpringWebClient.send(amount, recipientAddress, wallet)
    assert.exists(result)
  })

  it('Send XRP - rippled', async function(): Promise<void> {
    this.timeout(timeoutMs)

    const result = await xrpClient.send(amount, recipientAddress, wallet)
    assert.exists(result)
  })

  it('Check if Account Exists - Legacy Node Shim', async function(): Promise<
    void
  > {
    this.timeout(timeoutMs)

    const doesExist = await legacyXRPClientNode.accountExists(recipientAddress)
    assert.equal(doesExist, true)
  })

  it('Check if Account Exists - Web Shim', async function(): Promise<void> {
    this.timeout(timeoutMs)

    const doesExist = await xpringWebClient.accountExists(recipientAddress)
    assert.equal(doesExist, true)
  })

  it('Check if Account Exists - rippled', async function(): Promise<void> {
    this.timeout(timeoutMs)

    const doesExist = await xrpClient.accountExists(recipientAddress)
    assert.equal(doesExist, true)
  })

  it('Payment History - rippled', async function(): Promise<void> {
    this.timeout(timeoutMs)

    const payments = await xrpClient.paymentHistory(recipientAddress)

    assert.exists(payments && payments.length > 0)
  })
})
