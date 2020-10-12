import { assert } from 'chai'
import { Wallet, WalletFactory, XrplNetwork } from 'xpring-common-js'
import { XrpClient, XrpError } from '../../src/XRP'
import IssuedCurrencyClient from '../../src/XRP/issued-currency-client'

import XRPTestUtils from './helpers/xrp-test-utils'
import { AccountRootFlag, TransactionStatus } from '../../src/XRP/shared'

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
  let wallet: Wallet
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
    await XRPTestUtils.verifyFlagModification(
      wallet,
      rippledGrpcUrl,
      result,
      AccountRootFlag.LSF_REQUIRE_AUTH,
    )
  })

  it('allowUnauthorizedTrustlines - rippled', async function (): Promise<void> {
    this.timeout(timeoutMs)
    // GIVEN an existing testnet account that has enabled Require Authorized Trust Lines
    await issuedCurrencyClient.requireAuthorizedTrustlines(wallet)

    // WHEN allowUnauthorizedTrustlines is called
    const result = await issuedCurrencyClient.allowUnauthorizedTrustlines(
      wallet,
    )

    // THEN the transaction was successfully submitted and the correct flag was unset on the account.
    await XRPTestUtils.verifyFlagModification(
      wallet,
      rippledGrpcUrl,
      result,
      AccountRootFlag.LSF_REQUIRE_AUTH,
      false,
    )
  })

  it('enableRippling - rippled', async function (): Promise<void> {
    this.timeout(timeoutMs)
    // GIVEN an existing testnet account
    // WHEN enableRippling is called
    const result = await issuedCurrencyClient.enableRippling(wallet)

    // THEN the transaction was successfully submitted and the correct flag was set on the account.
    await XRPTestUtils.verifyFlagModification(
      wallet,
      rippledGrpcUrl,
      result,
      AccountRootFlag.LSF_DEFAULT_RIPPLE,
    )
  })

  it('disallowIncomingXrp - rippled', async function (): Promise<void> {
    this.timeout(timeoutMs)
    // GIVEN an existing testnet account
    // WHEN disallowIncomingXrp is called
    const result = await issuedCurrencyClient.disallowIncomingXrp(wallet)

    // THEN the transaction was successfully submitted and the correct flag was set on the account.
    await XRPTestUtils.verifyFlagModification(
      wallet,
      rippledGrpcUrl,
      result,
      AccountRootFlag.LSF_DISALLOW_XRP,
    )
  })

  // TODO: Once required IOU functionality exists in SDK, add integration tests that successfully establish an unauthorized trustline to this account.

  it('allowIncomingXrp - rippled', async function (): Promise<void> {
    this.timeout(timeoutMs)
    // GIVEN an existing testnet account
    // WHEN disallowIncomingXrp is called, followed by allowIncomingXrp
    await issuedCurrencyClient.disallowIncomingXrp(wallet)
    const result = await issuedCurrencyClient.allowIncomingXrp(wallet)

    // THEN the transaction was successfully submitted and the flag should not be set on the account.
    await XRPTestUtils.verifyFlagModification(
      wallet,
      rippledGrpcUrl,
      result,
      AccountRootFlag.LSF_DISALLOW_XRP,
      false,
    )
  })

  it('requireDestinationTags - rippled', async function (): Promise<void> {
    this.timeout(timeoutMs)
    // GIVEN an existing testnet account
    // WHEN requireDestinationTags is called
    const result = await issuedCurrencyClient.requireDestinationTags(wallet)

    // THEN the transaction was successfully submitted and the correct flag was set on the account.
    await XRPTestUtils.verifyFlagModification(
      wallet,
      rippledGrpcUrl,
      result,
      AccountRootFlag.LSF_REQUIRE_DEST_TAG,
    )
  })

  it('allowNoDestinationTag - rippled', async function (): Promise<void> {
    this.timeout(timeoutMs)
    // GIVEN an existing testnet account
    // WHEN requireDestinationTags is called, followed by allowNoDestinationTag
    await issuedCurrencyClient.requireDestinationTags(wallet)
    const result = await issuedCurrencyClient.allowNoDestinationTag(wallet)

    // THEN both transactions were successfully submitted and there should be no flag set on the account.
    await XRPTestUtils.verifyFlagModification(
      wallet,
      rippledGrpcUrl,
      result,
      AccountRootFlag.LSF_REQUIRE_DEST_TAG,
      false,
    )
  })

  it('requireDestinationTags/allowNoDestinationTag - transaction without destination tags', async function (): Promise<
    void
  > {
    this.timeout(timeoutMs)
    // GIVEN an existing testnet account with requireDestinationTags set
    await issuedCurrencyClient.requireDestinationTags(wallet)
    const wallet2 = await XRPTestUtils.randomWalletFromFaucet()

    // WHEN a transaction is sent to the account without a destination tag
    const xrpClient = new XrpClient(rippledGrpcUrl, XrplNetwork.Test)
    const xrpAmount = '100'
    const transactionHash = await xrpClient.send(
      xrpAmount,
      wallet.getAddress(),
      wallet2,
    )
    const transactionStatus = await xrpClient.getPaymentStatus(transactionHash)

    // THEN the transaction fails.
    assert.exists(transactionHash)
    assert.equal(transactionStatus, TransactionStatus.Failed)

    // GIVEN an existing testnet account with requireDestinationTags unset
    await issuedCurrencyClient.allowNoDestinationTag(wallet)

    // WHEN a transaction is sent to the account without a destination tag
    const transactionHash2 = await xrpClient.send(
      xrpAmount,
      wallet.getAddress(),
      wallet2,
    )
    const transactionStatus2 = await xrpClient.getPaymentStatus(
      transactionHash2,
    )

    // THEN the transaction succeeds.
    assert.exists(transactionHash2)
    assert.equal(transactionStatus2, TransactionStatus.Succeeded)
  })
})
