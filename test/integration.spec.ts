/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Wallet } from 'xpring-common-js'
import bigInt from 'big-integer'
import XpringClient from '../src/xpring-client'
import TransactionStatus from '../src/transaction-status'
import isNode from '../src/utils'

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
const legacyXpringClientWeb = new XpringClient(legacyGRPCURLWeb, false)

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
    if (isNode()) {
      const balance = await legacyXpringClientNode.getBalance(recipientAddress)
      expect(balance).toBeDefined()
      expect(balance).not.toBeNull()
    } else {
      // Legacy Node Shims fail hard and can't be tested on Browser
      expect()
    }
  })

  it('Get Account Balance - Legacy Web Shim', async (): Promise<void> => {
    if (isNode()) {
      await expectAsync(
        legacyXpringClientWeb.getBalance(recipientAddress),
      ).toBeRejected()
    } else {
      const balance = await legacyXpringClientWeb.getBalance(recipientAddress)
      expect(balance).toBeDefined()
      expect(balance).not.toBeNull()
    }
  })

  it('Get Account Balance - rippled', async (): Promise<void> => {
    if (isNode()) {
      const balance = await xpringClient.getBalance(recipientAddress)
      expect(balance).toBeDefined()
      expect(balance).not.toBeNull()
    } else {
      await expectAsync(
        xpringClient.getBalance(recipientAddress),
      ).toBeRejected()
    }
  })

  it('Get Transaction Status - Legacy Node Shim', async (): Promise<void> => {
    if (isNode()) {
      const transactionStatus = await legacyXpringClientNode.getTransactionStatus(
        transactionHash,
      )
      expect(transactionStatus).toEqual(TransactionStatus.Succeeded)
    } else {
      // Legacy Node Shims fail hard and can't be tested on Browser
      expect()
    }
  })

  it('Get Transaction Status - Legacy Web Shim', async (): Promise<void> => {
    if (isNode()) {
      await expectAsync(
        legacyXpringClientWeb.getTransactionStatus(transactionHash),
      ).toBeRejected()
    } else {
      const transactionStatus = await legacyXpringClientWeb.getTransactionStatus(
        transactionHash,
      )
      expect(transactionStatus).toEqual(TransactionStatus.Succeeded)
    }
  })

  it('Get Transaction Status - rippled', async (): Promise<void> => {
    if (isNode()) {
      const transactionStatus = await xpringClient.getTransactionStatus(
        transactionHash,
      )
      expect(transactionStatus).toEqual(TransactionStatus.Succeeded)
    } else {
      await expectAsync(
        xpringClient.getTransactionStatus(transactionHash),
      ).toBeRejected()
    }
  })

  it('Send XRP - Legacy Node Shim', async (): Promise<void> => {
    if (isNode()) {
      const result = await legacyXpringClientNode.send(
        amount,
        recipientAddress,
        wallet,
      )
      expect(result).toBeDefined()
      expect(result).not.toBeNull()
    } else {
      // Legacy Node Shims fail hard and can't be tested on Browser
      expect()
    }
  })

  it('Send XRP - Legacy Web Shim', async (): Promise<void> => {
    if (isNode()) {
      await expectAsync(
        legacyXpringClientWeb.send(amount, recipientAddress, wallet),
      ).toBeRejected()
    } else {
      const result = await legacyXpringClientWeb.send(
        amount,
        recipientAddress,
        wallet,
      )
      expect(result).toBeDefined()
      expect(result).not.toBeNull()
    }
  })

  it('Send XRP - rippled', async (): Promise<void> => {
    if (isNode()) {
      const result = await xpringClient.send(amount, recipientAddress, wallet)
      expect(result).toBeDefined()
      expect(result).not.toBeNull()
    } else {
      await expectAsync(
        xpringClient.send(amount, recipientAddress, wallet),
      ).toBeRejected()
    }
  })

  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout
  })
})
