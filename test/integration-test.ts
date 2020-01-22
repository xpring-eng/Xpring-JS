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

// A XpringClient that makes requests. Uses the legacy protocol buffer implementation.
const legacyGRPCURL = 'grpc.xpring.tech:80'
const legacyXpringClient = new XpringClient(legacyGRPCURL)

// A XpringClient that makes requests. Uses rippled's gRPC implementation.
const rippledURL = '10.30.97.98:50051'
const xpringClient = new XpringClient(rippledURL)

// Some amount of XRP to send.
const amount = BigInt('1')

describe('Xpring JS Integration Tests', function(): void {
  it('Get Account Balance - Legacy Shim', async function(): Promise<void> {
    this.timeout(timeoutMs)

    const balance = await legacyXpringClient.getBalance(recipientAddress)
    assert.exists(balance)
  })

  // it("Get Account Balance - rippled", async function(): Promise<void> {
  //   this.timeout(timeoutMs);

  //   const balance = await xpringClient.getBalance(recipientAddress);
  //   assert.exists(balance);
  // });

  it('Get Transaction Status - Legacy Shim', async function(): Promise<void> {
    this.timeout(timeoutMs)

    const transactionStatus = await legacyXpringClient.getTransactionStatus(
      transactionHash,
    )
    assert.deepEqual(transactionStatus, TransactionStatus.Succeeded)
  })

  // it("Get Transaction Status - rippled", async function(): Promise<void> {
  //   this.timeout(timeoutMs);

  //   const transactionStatus = await xpringClient.getTransactionStatus(
  //     transactionHash
  //   );
  //   assert.deepEqual(transactionStatus, TransactionStatus.Succeeded);
  // });

  it('Send XRP - Legacy Shim', async function(): Promise<void> {
    this.timeout(timeoutMs)

    const result = await legacyXpringClient.send(
      amount,
      recipientAddress,
      wallet,
    )
    assert.exists(result)
  })
})
