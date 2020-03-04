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
  '24E31668208A3165E6C702CDA66425808EAD670EABCBFA6C4403FFA93500D486'

// A XpringClient that makes requests. Uses the legacy protocol buffer implementation.
const legacyGRPCURLNode = 'grpc.xpring.tech:80'
const legacyXpringClientNode = new XpringClient(legacyGRPCURLNode)

// A XpringClient that makes requests. Uses the legacy protocol buffer implementation and sends the requests to an HTTP envoy emulating how the browser would behave
const legacyGRPCURLWeb = 'https://grpchttp.xpring.io'
const legacyXpringClientWeb = new XpringClient(legacyGRPCURLWeb, false, true)

// A XpringClient that makes requests. Uses rippled's gRPC implementation.
const rippledURL = '3.14.64.116:50051'
const xpringClient = new XpringClient(rippledURL, true)

// Some amount of XRP to send.
const amount = bigInt('1')

describe('Xpring JS Integration Tests', function(): void {
  it('Get Account Balance - Legacy Node Shim', async function(): Promise<void> {
    this.timeout(timeoutMs)

    const balance = await legacyXpringClientNode.getBalance(recipientAddress)
    assert.exists(balance)
  })

  it('Get Account Balance - Legacy Web Shim', async function(): Promise<void> {
    this.timeout(timeoutMs)

    const balance = await legacyXpringClientWeb.getBalance(recipientAddress)
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

    const transactionStatus = await legacyXpringClientNode.getTransactionStatus(
      transactionHash,
    )
    assert.deepEqual(transactionStatus, TransactionStatus.Succeeded)
  })

  it('Get Transaction Status - Legacy Web Shim', async function(): Promise<
    void
  > {
    this.timeout(timeoutMs)

    const transactionStatus = await legacyXpringClientWeb.getTransactionStatus(
      transactionHash,
    )
    assert.deepEqual(transactionStatus, TransactionStatus.Succeeded)
  })

  it('Get Transaction Status - rippled', async function(): Promise<void> {
    this.timeout(timeoutMs)

    const transactionStatus = await xpringClient.getTransactionStatus(
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

  it('Send XRP - Legacy Web Shim', async function(): Promise<void> {
    this.timeout(timeoutMs)

    const result = await legacyXpringClientWeb.send(
      amount,
      recipientAddress,
      wallet,
    )
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

  it('Check if Account Exists - Legacy Web Shim', async function(): Promise<
    void
  > {
    this.timeout(timeoutMs)

    const doesExist = await legacyXpringClientWeb.accountExists(
      recipientAddress,
    )
    assert.equal(doesExist, true)
  })

  it('Check if Account Exists - rippled', async function(): Promise<void> {
    this.timeout(timeoutMs)

    const doesExist = await xpringClient.accountExists(recipientAddress)
    assert.equal(doesExist, true)
  })
})
