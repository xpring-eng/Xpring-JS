import { Wallet } from 'xpring-common-js'
import { assert } from 'chai'
import bigInt from 'big-integer'
import XRPClient from '../../src/XRP/xrp-client'
import TransactionStatus from '../../src/XRP/transaction-status'
import { XRPLNetwork } from '../../src'
import DefaultXRPClient, {
  TransactionSearchResult,
} from '../../src/XRP/default-xrp-client'

// A timeout for these tests.
const timeoutMs = 60 * 1000 // 1 minute

// An address on TestNet that has a balance.
const recipientAddress = 'X7cBcY4bdTTzk3LHmrKAK6GyrirkXfLHGFxzke5zTmYMfw4'

// A wallet with some balance on TestNet.
const wallet = Wallet.generateWalletFromSeed('snYP7oArxKepd3GPDcrjMsJYiJeJB')!

// An XRPClient that makes requests. Ssends the requests to an HTTP envoy emulating how the browser would behave.
const grpcWebURL = 'https://envoy.test.xrp.xpring.io'
const xrpWebClient = new XRPClient(grpcWebURL, XRPLNetwork.Test, true)

// An XRPClient that makes requests. Uses rippled's gRPC implementation.
const rippledURL = 'test.xrp.xpring.io:50051'
const xrpClient = new XRPClient(rippledURL, XRPLNetwork.Test)

// Lets us access a raw client.
// TODO(keefertaylor): We should be able to test without exposing this.
const defaultClient = DefaultXRPClient.defaultXRPClientWithEndpoint(rippledURL)

// Some amount of XRP to send.
const amount = bigInt('1')

describe('Xpring JS XRPClient Integration Tests', function (): void {
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

  it('Send XRP - rippled', async function (): Promise<void> {
    this.timeout(timeoutMs)

    const result = await xrpClient.send(amount, recipientAddress, wallet)
    assert.exists(result)
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

    const coinbaseMainnet = 'XVYUQ3SdUcVnaTNVanDYo1NamrUukPUPeoGMnmvkEExbtrj' // valid address but should NOT show up on testnet
    const doesExist = await xrpClient.accountExists(coinbaseMainnet)
    assert.equal(doesExist, false)
  })

  it('Payment History - rippled', async function (): Promise<void> {
    this.timeout(timeoutMs)

    const payments = await xrpClient.paymentHistory(recipientAddress)

    assert.exists(payments && payments.length > 0)
  })

  // TODO(keefertaylor): Write unit tests.

  it('Transaction Found', async function (): Promise<void> {
    this.timeout(timeoutMs)

    // GIVEN the current ledger index and a transaction that is sent reliably
    // NOTE: this method is erroneously named, should be called 'getCurrentOpenLedgerSequence'
    const currentLedger = await defaultClient.getLastValidatedLedgerSequence()
    const transactionHash = await xrpClient.send(
      amount,
      recipientAddress,
      wallet,
    )

    // WHEN the transaction is searched for in the given range
    const transactionSearchResult = await defaultClient.transactionExistsInRange(
      transactionHash,
      currentLedger,
      currentLedger + 10,
    )

    // THEN the search results in the transaction being found.
    assert.equal(transactionSearchResult, TransactionSearchResult.Found)
  })

  it('Transaction Not Found', async function (): Promise<void> {
    this.timeout(timeoutMs)

    // GIVEN A transaction that does not exist, and a range that is finished
    // Valid hash on mainnet, does **NOT** exist on TestNEt:
    // https://livenet.xrpl.org/transactions/EE7FBCA4E7EB1F426F7DF8AAD9E2F942DD990CF2B4D367433C13709BC6D654E9
    const transactionHash =
      'EE7FBCA4E7EB1F426F7DF8AAD9E2F942DD990CF2B4D367433C13709BC6D654E9'

    // Ledgers in this range are closed and validated on testnet
    const rangeMin = 7100206
    const rangeMax = 7100208

    // WHEN the transaction is searched for in the given range
    const transactionSearchResult = await defaultClient.transactionExistsInRange(
      transactionHash,
      rangeMin,
      rangeMax,
    )

    // THEN the search results in the transaction being conclusively not found.
    assert.equal(transactionSearchResult, TransactionSearchResult.NotFound)
  })

  it('Transaction Not Found But Range Incomplete', async function (): Promise<
    void
  > {
    this.timeout(timeoutMs)

    // GIVEN A transaction that does not exist, but a range that is not finished
    // Valid hash on mainnet, does **NOT** exist on TestNEt:
    // https://livenet.xrpl.org/transactions/EE7FBCA4E7EB1F426F7DF8AAD9E2F942DD990CF2B4D367433C13709BC6D654E9
    const transactionHash =
      'EE7FBCA4E7EB1F426F7DF8AAD9E2F942DD990CF2B4D367433C13709BC6D654E9'
    // NOTE: this method is erroneously named, should be called 'getCurrentOpenLedgerSequence'
    const rangeMin = await defaultClient.getLastValidatedLedgerSequence()
    const rangeMax = rangeMin + 1000 // No chance that 1000 ledgers will settle in time for us to conclude the transaction doesn't exist.

    // WHEN the transaction is searched for in the given range
    const transactionSearchResult = await defaultClient.transactionExistsInRange(
      transactionHash,
      rangeMin,
      rangeMax,
    )

    // THEN the search results in the transaction being inconclusively not found.
    assert.equal(
      transactionSearchResult,
      TransactionSearchResult.NotFoundButRangeNotComplete,
    )
  })
})
