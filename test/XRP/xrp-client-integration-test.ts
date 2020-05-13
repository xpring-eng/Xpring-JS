import { Wallet } from 'xpring-common-js'
import chai, { assert } from 'chai'
import bigInt from 'big-integer'
import chaiAsPromised from 'chai-as-promised'
import XRPClient from '../../src/XRP/xrp-client'
import TransactionStatus from '../../src/XRP/transaction-status'
import { XRPLNetwork } from '../../src'
import DefaultXRPClient from '../../src/XRP/default-xrp-client'

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

chai.use(chaiAsPromised)

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

  it('Case 1 - Is Validated', async function (): Promise<void> {
    const validatedLedger =
      (await defaultClient.getLastValidatedLedgerSequence()) - 10

    assert.isTrue(
      await defaultClient.isLedgerSequenceValidated(
        'rPEPPER7kfTD9w2To4CQk6UCfuHM9c6GDY',
        validatedLedger,
      ),
    )
  })

  it('Case 2 - Is Open', async function (): Promise<void> {
    assert.isFalse(
      await defaultClient.isLedgerSequenceValidated(
        'rPEPPER7kfTD9w2To4CQk6UCfuHM9c6GDY',
        await defaultClient.getLastValidatedLedgerSequence(),
      ),
    )
  })

  it('Case 3 - Is Not Validated', async function (): Promise<void> {
    assert.isFalse(
      await defaultClient.isLedgerSequenceValidated(
        'rPEPPER7kfTD9w2To4CQk6UCfuHM9c6GDY',
        (await defaultClient.getLastValidatedLedgerSequence()) + 10,
      ),
    )
  })

  it('Case 4 - Bad Address', function (done) {
    defaultClient.isLedgerSequenceValidated('xrp', 7100205).catch((_e) => {
      done()
    })
  })
})
