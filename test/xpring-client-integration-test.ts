import { Wallet } from 'xpring-common-js'
import { assert } from 'chai'
import bigInt from 'big-integer'
import XpringClient from '../src/xpring-client'
import TransactionStatus from '../src/transaction-status'

// A timeout for these tests.
const timeoutMs = 60 * 1000 // 1 minute

// An address on TestNet that has a balance.
const recipientAddress = 'X7cBcY4bdTTzk3LHmrKAK6GyrirkXfLHGFxzke5zTmYMfw4'

// A wallet with some balance on TestNet.
const wallet = Wallet.generateWalletFromSeed('snYP7oArxKepd3GPDcrjMsJYiJeJB')!

// A hash of a successfully validated transaction.
const transactionHash =
  '6D9B6CDA7F6752548800C4FC14A037B8DAC2EF47E61028793768766EAB7FC81B'

// A XpringClient that makes requests. Uses the legacy protocol buffer implementation.
const legacyGRPCURLNode = 'grpc.xpring.tech:80'
const legacyXpringClientNode = new XpringClient(legacyGRPCURLNode)

// A XpringClient that makes requests. Uses the legacy protocol buffer implementation and sends the requests to an HTTP envoy emulating how the browser would behave
const grpcWebURL = 'https://envoy.test.xrp.xpring.io'
const xpringWebClient = new XpringClient(grpcWebURL, false, true)

// A XpringClient that makes requests. Uses rippled's gRPC implementation.
const rippledURL = 'test.xrp.xpring.io:50051'
const xpringClient = new XpringClient(rippledURL, true)

// Some amount of XRP to send.
const amount = bigInt('1')

describe('Xpring JS XpringClient Integration Tests', function(): void {
  it('Get Account Balance - Legacy Node Shim', async function(): Promise<void> {
    this.timeout(timeoutMs)

    const balance = await legacyXpringClientNode.getBalance(recipientAddress)
    assert.exists(balance)
  })

  it('Get Account Balance - Web Shim', async function(): Promise<void> {
    this.timeout(timeoutMs)

    const balance = await xpringWebClient.getBalance(recipientAddress)
    assert.exists(balance)
  })

  it('Get Account Balance - rippled', async function(): Promise<void> {
    this.timeout(timeoutMs)

    const balance = await xpringClient.getBalance(recipientAddress)
    assert.exists(balance)
  })

  it('Get Transaction Status - Legacy Node Shim', async function(): Promise<
    void
  > {
    this.timeout(timeoutMs)

    const transactionStatus = await legacyXpringClientNode.getPaymentStatus(
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

    const transactionStatus = await xpringClient.getPaymentStatus(
      transactionHash,
    )
    assert.deepEqual(transactionStatus, TransactionStatus.Succeeded)
  })

  it('Send XRP - Legacy Node Shim', async function(): Promise<void> {
    this.timeout(timeoutMs)

    const result = await legacyXpringClientNode.send(
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

    const result = await xpringClient.send(amount, recipientAddress, wallet)
    assert.exists(result)
  })

  it('Check if Account Exists - Legacy Node Shim', async function(): Promise<
    void
  > {
    this.timeout(timeoutMs)

    const doesExist = await legacyXpringClientNode.accountExists(
      recipientAddress,
    )
    assert.equal(doesExist, true)
  })

  it('Check if Account Exists - Web Shim', async function(): Promise<void> {
    this.timeout(timeoutMs)

    const doesExist = await xpringWebClient.accountExists(recipientAddress)
    assert.equal(doesExist, true)
  })

  it('Check if Account Exists - rippled', async function(): Promise<void> {
    this.timeout(timeoutMs)

    const doesExist = await xpringClient.accountExists(recipientAddress)
    assert.equal(doesExist, true)
  })
})
