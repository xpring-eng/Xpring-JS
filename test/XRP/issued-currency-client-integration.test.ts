import { assert } from 'chai'
import { XrplNetwork, XrpUtils } from 'xpring-common-js'
import TransactionStatus from '../../src/XRP/shared/transaction-status'
import IssuedCurrencyClient from '../../src/XRP/issued-currency-client'
import GrpcNetworkClient from '../../src/XRP/network-clients/grpc-xrp-network-client'

import XRPTestUtils from './helpers/xrp-test-utils'
import { LedgerSpecifier } from '../../src/XRP/Generated/node/org/xrpl/rpc/v1/ledger_pb'
import { XrpError } from '../../src/XRP'
import { AccountRootFlag } from '../../src/XRP/shared'

// A timeout for these tests.
// eslint-disable-next-line @typescript-eslint/no-magic-numbers -- 1 minute in milliseconds
const timeoutMs = 60 * 1000

// An IssuedCurrencyClient that makes requests. Uses rippled's gRPC implementation.
const rippledUrl = 'test.xrp.xpring.io:50051'
const issuedCurrencyClient = IssuedCurrencyClient.issuedCurrencyClientWithEndpoint(
  rippledUrl,
  XrplNetwork.Test,
)

describe('IssuedCurrencyClient Integration Tests', function (): void {
  // Retry integration tests on failure.
  this.retries(3)

  // A Wallet with some balance on Testnet.
  let wallet
  before(async function () {
    wallet = await XRPTestUtils.randomWalletFromFaucet()
  })

  it('requireAuthorizedTrustlines - rippled', async function (): Promise<void> {
    this.timeout(timeoutMs)
    // GIVEN an existing testnet account
    // WHEN requireAuthorizedTrustlines is called
    const result = await issuedCurrencyClient.requireAuthorizedTrustlines(
      wallet,
    )

    // THEN the transaction was successfully submitted and the correct flag was set on the account.
    const transactionHash = result.hash
    const transactionStatus = result.status

    // get the account data and check the flag bitmap
    const networkClient = new GrpcNetworkClient(rippledUrl)
    const account = networkClient.AccountAddress()
    const classicAddress = XrpUtils.decodeXAddress(wallet.getAddress())
    account.setAddress(classicAddress!.address)

    const request = networkClient.GetAccountInfoRequest()
    request.setAccount(account)

    const ledger = new LedgerSpecifier()
    ledger.setShortcut(LedgerSpecifier.Shortcut.SHORTCUT_VALIDATED)
    request.setLedger(ledger)

    const accountInfo = await networkClient.getAccountInfo(request)
    if (!accountInfo) {
      throw XrpError.malformedResponse
    }

    const accountData = accountInfo.getAccountData()
    if (!accountData) {
      throw XrpError.malformedResponse
    }

    const flags = accountData.getFlags()?.getValue()

    assert.exists(transactionHash)
    assert.equal(transactionStatus, TransactionStatus.Succeeded)
    assert.isTrue(
      AccountRootFlag.checkFlag(AccountRootFlag.LSF_REQUIRE_AUTH, flags!),
    )
  })

  it('requireAuthorizedTrustlines/allowUnauthorizedTrustlines - rippled', async function (): Promise<
    void
  > {
    this.timeout(timeoutMs)
    // GIVEN an existing testnet account
    await issuedCurrencyClient.requireAuthorizedTrustlines(wallet)
    // WHEN allowUnauthorizedTrustlines is called
    const result = await issuedCurrencyClient.allowUnauthorizedTrustlines(
      wallet,
    )

    // THEN the transaction was successfully submitted and the correct flag was set on the account.
    const transactionHash = result.hash
    const transactionStatus = result.status

    // get the account data and check the flag bitmap
    const networkClient = new GrpcNetworkClient(rippledUrl)
    const account = networkClient.AccountAddress()
    const classicAddress = XrpUtils.decodeXAddress(wallet.getAddress())
    account.setAddress(classicAddress!.address)

    const request = networkClient.GetAccountInfoRequest()
    request.setAccount(account)

    const ledger = new LedgerSpecifier()
    ledger.setShortcut(LedgerSpecifier.Shortcut.SHORTCUT_VALIDATED)
    request.setLedger(ledger)

    const accountInfo = await networkClient.getAccountInfo(request)
    if (!accountInfo) {
      throw XrpError.malformedResponse
    }

    const accountData = accountInfo.getAccountData()
    if (!accountData) {
      throw XrpError.malformedResponse
    }

    const flags = accountData.getFlags()?.getValue()

    assert.exists(transactionHash)
    assert.equal(transactionStatus, TransactionStatus.Succeeded)
    assert.isTrue(AccountRootFlag.checkFlag(AccountRootFlag.NO_FLAGS, flags!))
  })
})
