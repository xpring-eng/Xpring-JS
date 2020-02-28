import { Wallet } from 'xpring-common-js'
import { assert } from 'chai'
import bigInt from 'big-integer'
import XRPClient from '../src/xrp-client'
import TransactionStatus from '../src/transaction-status'

// A timeout for these tests.
const timeoutMs = 60 * 1000 // 1 minute

// An address on TestNet that has a balance.
const recipientAddress = 'X7cBcY4bdTTzk3LHmrKAK6GyrirkXfLHGFxzke5zTmYMfw4'

// A wallet with some balance on TestNet.
const wallet = Wallet.generateWalletFromSeed('snYP7oArxKepd3GPDcrjMsJYiJeJB')!

// A hash of a successfully validated transaction.
const transactionHash =
  '4E732C5748DE722C7598CEB76350FCD6269ACBE5D641A5BCF0721150EF6E2C9F'

// An XRPClient that makes requests. Uses the legacy protocol buffer implementation.
const legacyGRPCURLNode = 'grpc.xpring.tech:80'
const legacyXRPClientNode = new XRPClient(legacyGRPCURLNode)

// An XRPClient that makes requests. Uses the legacy protocol buffer implementation and sends the requests to an HTTP envoy emulating how the browser would behave
const legacyGRPCURLWeb = 'https://grpchttp.xpring.io'
const legacyXRPClientWeb = new XRPClient(legacyGRPCURLWeb, false, true)

// An XRPClient that makes requests. Uses rippled's gRPC implementation.
const rippledURL = '3.14.64.116:50051'
const xrpClient = new XRPClient(rippledURL, true)

// Some amount of XRP to send.
const amount = bigInt('1')

describe('Xpring JS XRPClient Integration Tests', function(): void {
  it('Get Account Balance - Legacy Node Shim', async function(): Promise<void> {
    this.timeout(timeoutMs)

    const balance = await legacyXRPClientNode.getBalance(recipientAddress)
    assert.exists(balance)
  })

  it('Get Account Balance - Legacy Web Shim', async function(): Promise<void> {
    this.timeout(timeoutMs)

    const balance = await legacyXRPClientWeb.getBalance(recipientAddress)
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

    const transactionStatus = await legacyXRPClientNode.getTransactionStatus(
      transactionHash,
    )
    assert.deepEqual(transactionStatus, TransactionStatus.Succeeded)
  })

  it('Get Transaction Status - Legacy Web Shim', async function(): Promise<
    void
  > {
    this.timeout(timeoutMs)

    const transactionStatus = await legacyXRPClientWeb.getTransactionStatus(
      transactionHash,
    )
    assert.deepEqual(transactionStatus, TransactionStatus.Succeeded)
  })

  it('Get Transaction Status - rippled', async function(): Promise<void> {
    this.timeout(timeoutMs)

    const transactionStatus = await xrpClient.getTransactionStatus(
      transactionHash,
    )
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

  it('Send XRP - Legacy Web Shim', async function(): Promise<void> {
    this.timeout(timeoutMs)

    const result = await legacyXRPClientWeb.send(
      amount,
      recipientAddress,
      wallet,
    )
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

  it('Check if Account Exists - Legacy Web Shim', async function(): Promise<
    void
  > {
    this.timeout(timeoutMs)

    const doesExist = await legacyXRPClientWeb.accountExists(recipientAddress)
    assert.equal(doesExist, true)
  })

  it('Check if Account Exists - rippled', async function(): Promise<void> {
    this.timeout(timeoutMs)

    const doesExist = await xrpClient.accountExists(recipientAddress)
    assert.equal(doesExist, true)
  })
})
