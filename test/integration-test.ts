import { Wallet } from 'xpring-common-js'
import { assert } from 'chai'
import XpringClient from '../src/xpring-client'
import TransactionStatus from '../src/transaction-status'

// A timeout for these tests.
const timeoutMs = 60 * 1000 // 1 minute

// Addresses on DevNet and TestNets that have a balance.
const recipientAddressTestNet =
  'X7cBcY4bdTTzk3LHmrKAK6GyrirkXfLHGFxzke5zTmYMfw4'
const recipientAddressDevNet = 'XVMyXArJxgtJYLaWSXhyBft185CZwK8vrqXT2p6nkByha9G'

// A wallet with some balance on TestNet.
const walletTestNet = Wallet.generateWalletFromSeed(
  'snYP7oArxKepd3GPDcrjMsJYiJeJB',
)!

// Hashes on DevNet and TestNet that are validated.
const transactionHashTestNet =
  '9A88C8548E03958FD97AF44AE5A8668896D195A70CF3FF3CB8E57096AA717135'
const transactionHashDevNet =
  '9A88C8548E03958FD97AF44AE5A8668896D195A70CF3FF3CB8E57096AA717135'

// A XpringClient that makes requests. Uses the legacy protocol buffer implementation.
// Connects to TestNet.
const legacyGRPCURL = 'grpc.xpring.tech:80'
const legacyXpringClient = new XpringClient(legacyGRPCURL)

// A XpringClient that makes requests. Uses rippled's gRPC implementation.
// Connects to DevNet.
const rippledURL = '3.14.64.116:50051' // '34.83.125.234:50051'
const xpringClient = new XpringClient(rippledURL, true)

// Some amount of XRP to send.
const amount = BigInt('1')

describe('Xpring JS Integration Tests', function(): void {
  it('Get Account Balance - Legacy Shim', async function(): Promise<void> {
    this.timeout(timeoutMs)

    const balance = await legacyXpringClient.getBalance(recipientAddressTestNet)
    assert.exists(balance)
  })

  it('Get Account Balance - rippled', async function(): Promise<void> {
    this.timeout(timeoutMs)

    const balance = await xpringClient.getBalance(recipientAddressTestNet)
    assert.exists(balance)
  })

  it('Get Transaction Status - Legacy Shim', async function(): Promise<void> {
    this.timeout(timeoutMs)

    const transactionStatus = await legacyXpringClient.getTransactionStatus(
      transactionHashTestNet,
    )
    assert.deepEqual(transactionStatus, TransactionStatus.Succeeded)
  })

  it('Get Transaction Status - rippled', async function(): Promise<void> {
    this.timeout(timeoutMs)

    const transactionStatus = await xpringClient.getTransactionStatus(
      transactionHashDevNet,
    )
    assert.deepEqual(transactionStatus, TransactionStatus.Succeeded)
  })

  it('Send XRP - Legacy Shim', async function(): Promise<void> {
    this.timeout(timeoutMs)

    const result = await legacyXpringClient.send(
      amount,
      recipientAddressTestNet,
      walletTestNet,
    )
    assert.exists(result)
  })
})
