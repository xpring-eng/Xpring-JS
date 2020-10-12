import { assert } from 'chai'
import { WalletFactory, XrplNetwork, XrpUtils } from 'xpring-common-js'
import { XrpError } from '../../src/XRP'
import IssuedCurrencyClient from '../../src/XRP/issued-currency-client'
import TransactionStatus from '../../src/XRP/shared/transaction-status'
import GrpcNetworkClient from '../../src/XRP/network-clients/grpc-xrp-network-client'

import XRPTestUtils from './helpers/xrp-test-utils'
import { LedgerSpecifier } from '../../src/XRP/Generated/node/org/xrpl/rpc/v1/ledger_pb'
import { AccountRootFlag } from '../../src/XRP/shared'

// A timeout for these tests.
// eslint-disable-next-line @typescript-eslint/no-magic-numbers -- 1 minute in milliseconds
const timeoutMs = 60 * 1000

// An address on TestNet that has a balance.
const testAddressWithTrustLines =
  'X7CSDUqZmWR7ggg9K2rTKDmEN53DH1x1j9MHK2foabFzapf'

// An IssuedCurrencyClient that makes requests.
const rippledGrpcUrl = 'test.xrp.xpring.io:50051'
const rippledJsonUrl = 'http://test.xrp.xpring.io:51234'
const issuedCurrencyClient = IssuedCurrencyClient.issuedCurrencyClientWithEndpoint(
  rippledGrpcUrl,
  rippledJsonUrl,
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

  it('getTrustLines - valid request', async function (): Promise<void> {
    this.timeout(timeoutMs)
    // TODO: When SDK functionality is expanded, improve this integration test by first CREATING a trust line between two accounts,
    // which will avoid the need for maintenance after a testnet reset.

    // GIVEN a test address that has at least one trust line on testnet
    // WHEN getTrustLines is called for that address
    const trustLines = await issuedCurrencyClient.getTrustLines(
      testAddressWithTrustLines,
    )

    // THEN there is a successful non-empty result
    assert.exists(trustLines)
    // TODO improve the specificity of this test once necessary methods have been implemented on IssuedCurrencyClient
    assert.isTrue(trustLines.length > 0)
  })

  it('getTrustLines - account not found', async function (): Promise<void> {
    this.timeout(timeoutMs)
    // GIVEN a valid address that doesn't actually exist on the ledger
    const walletFactory = new WalletFactory(XrplNetwork.Test)
    const address = (await walletFactory.generateRandomWallet())!.wallet.getAddress()

    // WHEN getTrustLines is called for that address THEN an error is propagated.
    issuedCurrencyClient.getTrustLines(address).catch((error) => {
      assert.typeOf(error, 'Error')
      assert.equal(error, XrpError.accountNotFound)
    })
  })

  it('getTrustLines - account with no trust lines', async function (): Promise<
    void
  > {
    this.timeout(timeoutMs)

    // GIVEN a valid, funded address that doesn't have any trustlines
    const address = 'XVgfuVNA3AdYotM4ymXciybXLpHUEVzuVmRE1KSLCemREG9'
    // TODO: generate fresh funded account each time, once testnet faucet stops rejecting your certificate
    //const wallet = await XRPTestUtils.randomWalletFromFaucet()
    //onst address = wallet.getAddress()

    // WHEN getTrustLines is called for that addres
    const trustLines = await issuedCurrencyClient.getTrustLines(address)

    // THEN the result is an empty array.
    assert.isArray(trustLines)
    assert.isEmpty(trustLines)
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
    const networkClient = new GrpcNetworkClient(rippledGrpcUrl)
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
    // GIVEN an existing testnet account that has enabled Require Authorized Trust Lines
    await issuedCurrencyClient.requireAuthorizedTrustlines(wallet)

    // WHEN allowUnauthorizedTrustlines is called
    const result = await issuedCurrencyClient.allowUnauthorizedTrustlines(
      wallet,
    )

    // THEN the transaction was successfully submitted and the correct flag was set on the account.
    const transactionHash = result.hash
    const transactionStatus = result.status

    // get the account data and check the flag bitmap
    const networkClient = new GrpcNetworkClient(rippledGrpcUrl)
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
    assert.isFalse(
      AccountRootFlag.checkFlag(AccountRootFlag.LSF_REQUIRE_AUTH, flags!),
    )
  })

  // TODO: Once required IOU functionality exists in SDK, add integration tests that successfully establish an unauthorized trustline to this account.

  it('enableRippling - rippled', async function (): Promise<void> {
    this.timeout(timeoutMs)
    // GIVEN an existing testnet account
    // WHEN enableRippling is called
    const result = await issuedCurrencyClient.enableRippling(wallet)

    // THEN the transaction was successfully submitted and the correct flag was set on the account.
    const transactionHash = result.hash
    const transactionStatus = result.status

    // get the account data and check the flag bitmap
    const networkClient = new GrpcNetworkClient(rippledGrpcUrl)
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
      AccountRootFlag.checkFlag(AccountRootFlag.LSF_DEFAULT_RIPPLE, flags!),
    )
  })
})
