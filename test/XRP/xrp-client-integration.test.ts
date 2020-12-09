import bigInt from 'big-integer'
import { assert } from 'chai'
import { XrplNetwork } from 'xpring-common-js'
import TransactionStatus from '../../src/XRP/shared/transaction-status'
import XrpClient from '../../src/XRP/xrp-client'

import XRPTestUtils, {
  iForgotToPickUpCarlMemo,
  noDataMemo,
  noFormatMemo,
  noTypeMemo,
} from './helpers/xrp-test-utils'
import { AccountRootFlag } from '../../src/XRP/shared'

// A timeout for these tests.
// eslint-disable-next-line @typescript-eslint/no-magic-numbers -- 1 minute in milliseconds
const timeoutMs = 60 * 1000

// An address on TestNet that has a balance.
const recipientAddress = 'X7cBcY4bdTTzk3LHmrKAK6GyrirkXfLHGFxzke5zTmYMfw4'

// An XrpClient that makes requests. Sends the requests to an HTTP envoy emulating how the browser would behave.
const grpcWebUrl = 'https://envoy.test.xrp.xpring.io'
const xrpWebClient = new XrpClient(grpcWebUrl, XrplNetwork.Test, true)

// An XrpClient that makes requests. Uses rippled's gRPC implementation.
const rippledUrl = 'test.xrp.xpring.io:50051'
const xrpClient = new XrpClient(rippledUrl, XrplNetwork.Test)

// Some amount of XRP to send.
const amount = bigInt('1')

describe('XrpClient Integration Tests', function (): void {
  // Retry integration tests on failure.
  this.retries(3)

  // A Wallet with some balance on Testnet.
  let wallet
  before(async function () {
    wallet = await XRPTestUtils.randomWalletFromFaucet()
  })

  it('Get Transaction Status - Web Shim', async function (): Promise<void> {
    this.timeout(timeoutMs)

    const transactionResult = await xrpWebClient.sendXrp(
      amount,
      recipientAddress,
      wallet,
    )
    assert.deepEqual(transactionResult.status, TransactionStatus.Succeeded)
  })

  it('Get Transaction Status - rippled', async function (): Promise<void> {
    this.timeout(timeoutMs)

    const transactionResult = await xrpClient.sendXrp(
      amount,
      recipientAddress,
      wallet,
    )
    assert.deepEqual(transactionResult.status, TransactionStatus.Succeeded)
  })

  it('Send XRP - Web Shim', async function (): Promise<void> {
    this.timeout(timeoutMs)

    const result = await xrpWebClient.sendXrp(amount, recipientAddress, wallet)
    assert.exists(result)
  })

  it('Send XRP with memo - Web Shim', async function (): Promise<void> {
    this.timeout(timeoutMs)

    const memoList = [
      iForgotToPickUpCarlMemo,
      noDataMemo,
      noFormatMemo,
      noTypeMemo,
    ]
    const transactionResult = await xrpWebClient.sendXrpWithDetails({
      amount,
      destination: recipientAddress,
      sender: wallet,
      memoList,
    })
    assert.exists(transactionResult)

    const transaction = await xrpClient.getPayment(transactionResult.hash)

    assert.deepEqual(transaction?.memos, [
      iForgotToPickUpCarlMemo,
      noDataMemo,
      noFormatMemo,
      noTypeMemo,
    ])
  })

  it('Send XRP - rippled', async function (): Promise<void> {
    this.timeout(timeoutMs)

    const result = await xrpClient.sendXrp(amount, recipientAddress, wallet)
    assert.exists(result)
  })

  it('Send XRP with memo - rippled', async function (): Promise<void> {
    this.timeout(timeoutMs)
    const memoList = [
      iForgotToPickUpCarlMemo,
      noDataMemo,
      noFormatMemo,
      noTypeMemo,
    ]
    const transactionResult = await xrpClient.sendXrpWithDetails({
      amount,
      destination: recipientAddress,
      sender: wallet,
      memoList,
    })
    assert.exists(transactionResult)

    const transaction = await xrpClient.getPayment(transactionResult.hash)

    assert.deepEqual(transaction?.memos, [
      iForgotToPickUpCarlMemo,
      noDataMemo,
      noFormatMemo,
      noTypeMemo,
    ])
  })

  it('Check if Account Exists - true - Web Shim', async function (): Promise<void> {
    this.timeout(timeoutMs)

    const doesExist = await xrpWebClient.accountExists(recipientAddress)
    assert.equal(doesExist, true)
  })

  it('Check if Account Exists - true - rippled', async function (): Promise<void> {
    this.timeout(timeoutMs)

    const doesExist = await xrpClient.accountExists(recipientAddress)

    assert.equal(doesExist, true)
  })

  it('Check if Account Exists - false - rippled', async function (): Promise<void> {
    this.timeout(timeoutMs)

    // This is a valid address, but it should NOT show up on Testnet, so should resolve to false
    const coinbaseMainnet = 'XVYUQ3SdUcVnaTNVanDYo1NamrUukPUPeoGMnmvkEExbtrj'
    const doesExist = await xrpClient.accountExists(coinbaseMainnet)
    assert.equal(doesExist, false)
  })

  it('Payment History - rippled', async function (): Promise<void> {
    this.timeout(timeoutMs)

    const payments = await xrpClient.paymentHistory(recipientAddress)

    assert.isTrue(payments.length > 0)
  })

  it('Get Transaction - rippled', async function (): Promise<void> {
    this.timeout(timeoutMs)

    const transactionResult = await xrpClient.sendXrp(
      amount,
      recipientAddress,
      wallet,
    )

    const transaction = await xrpClient.getPayment(transactionResult.hash)

    assert.exists(transaction)
  })

  it('Enable Deposit Auth - rippled', async function (): Promise<void> {
    this.timeout(timeoutMs)
    // GIVEN an existing testnet account
    // WHEN enableDepositAuth is called
    const result = await xrpClient.enableDepositAuth(wallet)

    // THEN the transaction was successfully submitted and the correct flag was set on the account.
    await XRPTestUtils.verifyFlagModification(
      wallet,
      rippledUrl,
      result,
      AccountRootFlag.LSF_DEPOSIT_AUTH,
    )
  })

  it('Enable Deposit Auth - sending by unauthorized account fails after enabled', async function (): Promise<void> {
    this.timeout(timeoutMs)
    // GIVEN an existing testnet account with DepositAuth enabled
    await xrpClient.enableDepositAuth(wallet)

    // WHEN an account that is not authorized sends XRP
    const sendingWallet = await XRPTestUtils.randomWalletFromFaucet()
    const transactionResult = await xrpClient.sendXrp(
      amount,
      wallet.getAddress(),
      sendingWallet,
    )

    // THEN the transaction fails.
    assert.deepEqual(
      transactionResult.status,
      TransactionStatus.ClaimedCostOnly,
    )
  })

  it('Authorize Sending Account - failure on authorizing self', async function (): Promise<void> {
    this.timeout(timeoutMs)
    // GIVEN an existing testnet account
    // WHEN authorizeSendingAccount is called with the account's own address
    const result = await xrpClient.authorizeSendingAccount(
      wallet.getAddress(),
      wallet,
    )

    // THEN the transaction fails due to a malformed transaction.
    const transactionHash = result.hash
    const transactionStatus = result.status

    assert.exists(transactionHash)
    assert.deepEqual(transactionStatus, TransactionStatus.MalformedTransaction)
  })

  it('Authorize Sending Account - failure on authorizing already authorized account', async function (): Promise<void> {
    this.timeout(timeoutMs)
    // GIVEN an existing testnet account that has authorized another account to send funds to it
    const sendingWallet = await XRPTestUtils.randomWalletFromFaucet()
    await xrpClient.enableDepositAuth(wallet)
    await xrpClient.authorizeSendingAccount(sendingWallet.getAddress(), wallet)

    // WHEN authorizeSendingAccount is called on the already authorized account
    const result = await xrpClient.authorizeSendingAccount(
      sendingWallet.getAddress(),
      wallet,
    )

    // THEN the transaction fails and the cost of the transaction is claimed by the network.
    const transactionHash = result.hash
    const transactionStatus = result.status

    assert.exists(transactionHash)
    assert.deepEqual(transactionStatus, TransactionStatus.ClaimedCostOnly)
  })

  it('Authorize Sending Account - can send funds after authorize', async function (): Promise<void> {
    this.timeout(timeoutMs)
    // GIVEN an existing testnet account that has authorized another account to send XRP to it
    const sendingWallet = await XRPTestUtils.randomWalletFromFaucet()

    await xrpClient.enableDepositAuth(wallet)

    await xrpClient.authorizeSendingAccount(sendingWallet.getAddress(), wallet)

    // WHEN the authorized account sends XRP
    const transactionResult = await xrpClient.sendXrp(
      amount,
      wallet.getAddress(),
      sendingWallet,
    )

    // THEN the transaction succeeds.
    assert.deepEqual(transactionResult.status, TransactionStatus.Succeeded)
  })

  it('Unauthorize Sending Account - failure on unauthorizing self', async function (): Promise<void> {
    this.timeout(timeoutMs)
    // GIVEN an existing testnet account
    // WHEN unauthorizeSendingAccount is called with the account's own address
    const result = await xrpClient.unauthorizeSendingAccount(
      wallet.getAddress(),
      wallet,
    )

    // THEN the transaction fails due to a malformed transaction.
    const transactionHash = result.hash
    const transactionStatus = result.status

    assert.exists(transactionHash)
    // Note that this is different from what the docs suggest: https://xrpl.org/depositpreauth.html
    // The code being returned in this case is actually a `tecNO_ENTRY`, which is what
    // should be returned if the account to unauthorize was never authorized in the first place.
    // This seems literally true, so we're resting for that.
    // Note, however, that authorizing self above does in fact return a TransactionStatus.MalformedTransaction.
    assert.equal(transactionStatus, TransactionStatus.ClaimedCostOnly)
  })

  it('Unauthorize Sending Account - failure on unauthorizing account that is not authorized', async function (): Promise<void> {
    this.timeout(timeoutMs)
    // GIVEN an existing testnet account that has not authorized any accounts
    await xrpClient.enableDepositAuth(wallet)

    // WHEN unauthorizeSendingAccount is called on an account that is not authorized
    const sendingWallet = await XRPTestUtils.randomWalletFromFaucet()
    const result = await xrpClient.unauthorizeSendingAccount(
      sendingWallet.getAddress(),
      wallet,
    )

    // THEN the transaction fails and the cost of the transaction is claimed by the network.
    const transactionHash = result.hash
    const transactionStatus = result.status

    assert.exists(transactionHash)
    assert.equal(transactionStatus, TransactionStatus.ClaimedCostOnly)
  })

  it('Unauthorize Sending Account - cannot send funds after an authorized account is unauthorized', async function (): Promise<void> {
    this.timeout(timeoutMs)
    // GIVEN an existing testnet account that has authorized another account to send XRP to it
    const sendingWallet = await XRPTestUtils.randomWalletFromFaucet()

    await xrpClient.enableDepositAuth(wallet)

    await xrpClient.authorizeSendingAccount(sendingWallet.getAddress(), wallet)

    // WHEN the sender's account is unauthorized and a payment is sent.
    await xrpClient.unauthorizeSendingAccount(
      sendingWallet.getAddress(),
      wallet,
    )

    const transactionResult = await xrpClient.sendXrp(
      amount,
      wallet.getAddress(),
      sendingWallet,
    )

    // THEN the transaction fails.
    assert.deepEqual(
      transactionResult.status,
      TransactionStatus.ClaimedCostOnly,
    )
  })
})
