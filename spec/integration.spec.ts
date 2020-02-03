/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Wallet } from 'xpring-common-js'
import bigInt from 'big-integer'
import XpringClient from '../src/xpring-client'
import TransactionStatus from '../src/transaction-status'

// An address on TestNet that has a balance.
const recipientAddress = 'X7cBcY4bdTTzk3LHmrKAK6GyrirkXfLHGFxzke5zTmYMfw4'

// A wallet with some balance on TestNet.
const wallet = Wallet.generateWalletFromSeed('snYP7oArxKepd3GPDcrjMsJYiJeJB')!

// A hash of a successfully validated transaction.
const transactionHash =
  '4E732C5748DE722C7598CEB76350FCD6269ACBE5D641A5BCF0721150EF6E2C9F'

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

describe('Xpring JS Integration Tests', (): void => {
  let originalTimeout: number
  beforeEach(() => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000
  })

  it('Get Account Balance - Legacy Node Shim', async (): Promise<void> => {
    const balance = await legacyXpringClientNode.getBalance(recipientAddress)
    expect(balance).toBeDefined()
    expect(balance).not.toBeNull()
  })

  it('Get Account Balance - Legacy Web Shim', async (): Promise<void> => {
    const balance = await legacyXpringClientWeb.getBalance(recipientAddress)
    expect(balance).toBeDefined()
    expect(balance).not.toBeNull()
  })

  it('Get Account Balance - rippled', async (): Promise<void> => {
    const balance = await xpringClient.getBalance(recipientAddress)
    expect(balance).toBeDefined()
    expect(balance).not.toBeNull()
  })

  it('Get Transaction Status - Legacy Node Shim', async (): Promise<void> => {
    const transactionStatus = await legacyXpringClientNode.getTransactionStatus(
      transactionHash,
    )
    expect(transactionStatus).toEqual(TransactionStatus.Succeeded)
  })

  it('Get Transaction Status - Legacy Web Shim', async (): Promise<void> => {
    const transactionStatus = await legacyXpringClientWeb.getTransactionStatus(
      transactionHash,
    )
    expect(transactionStatus).toEqual(TransactionStatus.Succeeded)
  })

  it('Get Transaction Status - rippled', async (): Promise<void> => {
    const transactionStatus = await xpringClient.getTransactionStatus(
      transactionHash,
    )
    expect(transactionStatus).toEqual(TransactionStatus.Succeeded)
  })

  it('Send XRP - Legacy Node Shim', async (): Promise<void> => {
    const result = await legacyXpringClientNode.send(
      amount,
      recipientAddress,
      wallet,
    )
    expect(result).toBeDefined()
    expect(result).not.toBeNull()
  })

  it('Send XRP - Legacy Web Shim', async (): Promise<void> => {
    const result = await legacyXpringClientWeb.send(
      amount,
      recipientAddress,
      wallet,
    )
    expect(result).toBeDefined()
    expect(result).not.toBeNull()
  })

  it('Send XRP - rippled', async (): Promise<void> => {
    const result = await xpringClient.send(amount, recipientAddress, wallet)
    expect(result).toBeDefined()
    expect(result).not.toBeNull()
  })

  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout
  })
})
