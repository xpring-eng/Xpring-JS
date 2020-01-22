import { Wallet } from 'xpring-common-js'
import { assert } from 'chai'
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
  '9A88C8548E03958FD97AF44AE5A8668896D195A70CF3FF3CB8E57096AA717135'

// The XpringClient that makes requests
const grpcURL = 'grpc.xpring.tech:80'
const xpringClient = new XpringClient(grpcURL)

// Some amount of XRP to send.
const amount = BigInt('1')

describe('Xpring JS Integration Tests', function(): void {
  it('Get Account Balance', async function() {
    this.timeout(timeoutMs)

    const balance = await xpringClient.getBalance(recipientAddress)
    assert.exists(balance)
  })

  it('Get Transaction Status', async function() {
    this.timeout(timeoutMs)

    const transactionStatus = await xpringClient.getTransactionStatus(
      transactionHash,
    )
    assert.deepEqual(transactionStatus, TransactionStatus.Succeeded)
  })

  it('Send XRP', async function() {
    this.timeout(timeoutMs)

    const result = await xpringClient.send(amount, recipientAddress, wallet)
    assert.exists(result)
  })
})
