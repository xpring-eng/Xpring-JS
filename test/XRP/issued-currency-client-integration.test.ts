import { assert } from 'chai'
import { Wallet, WalletFactory, XrplNetwork, XrpUtils } from 'xpring-common-js'
import { XrpClient, XrpError } from '../../src/XRP'
import IssuedCurrencyClient from '../../src/XRP/issued-currency-client'

import XRPTestUtils from './helpers/xrp-test-utils'
import {
  AccountRootFlag,
  TransactionStatus,
  XrpErrorType,
} from '../../src/XRP/shared'

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

  // TODO: (amiecorso) implement an integration test that includes the peerAccount param when we have control over establishing
  // specific trustlines.  Can't otherwise verify correctness.

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

  it('requireAuthorizedTrustlines/allowUnauthorizedTrustlines - rippled', async function (): Promise<
    void
  > {
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

    // GIVEN an existing testnet account with Require Authorization enabled
    // WHEN allowUnauthorizedTrustlines is called
    const result2 = await issuedCurrencyClient.allowUnauthorizedTrustlines(
      wallet,
    )

    // THEN the transaction was successfully submitted and the correct flag was unset on the account.
    await XRPTestUtils.verifyFlagModification(
      wallet,
      rippledGrpcUrl,
      result2,
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

  it('disallowIncomingXrp/allowIncomingXrp - rippled', async function (): Promise<
    void
  > {
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

    // GIVEN an existing testnet account with Disallow XRP enabled
    // WHEN allowIncomingXrp is called
    const result2 = await issuedCurrencyClient.allowIncomingXrp(wallet)

    // THEN the transaction was successfully submitted and the flag should not be set on the account.
    await XRPTestUtils.verifyFlagModification(
      wallet,
      rippledGrpcUrl,
      result2,
      AccountRootFlag.LSF_DISALLOW_XRP,
      false,
    )
  })

  // TODO: Once required IOU functionality exists in SDK, add integration tests that successfully establish an unauthorized trustline to this account.

  it('requireDestinationTags/allowNoDestinationTag - rippled', async function (): Promise<
    void
  > {
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

    // GIVEN an existing testnet account with Require Destination Tags enabled
    // WHEN allowNoDestinationTag is called
    const result2 = await issuedCurrencyClient.allowNoDestinationTag(wallet)

    // THEN both transactions were successfully submitted and there should be no flag set on the account.
    await XRPTestUtils.verifyFlagModification(
      wallet,
      rippledGrpcUrl,
      result2,
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

  it('setTransferFee - rippled', async function (): Promise<void> {
    this.timeout(timeoutMs)
    // GIVEN an existing testnet account
    // WHEN setTransferFee is called
    const expectedTransferFee = 1000000123
    const result = await issuedCurrencyClient.setTransferFee(
      expectedTransferFee,
      wallet,
    )

    const transactionHash = result.hash
    const transactionStatus = result.status

    const accountData = await XRPTestUtils.getAccountData(
      wallet,
      rippledGrpcUrl,
    )
    const transferRate = accountData.getTransferRate()?.getValue()

    // THEN the transaction was successfully submitted and the correct transfer rate was set on the account.
    assert.exists(transactionHash)
    assert.equal(transactionStatus, TransactionStatus.Succeeded)
    assert.equal(transferRate, expectedTransferFee)
  })

  it('setTransferFee - bad transferRate values', async function (): Promise<
    void
  > {
    this.timeout(timeoutMs)

    const lowTransferFee = 12345
    const highTransferFee = 3000001234

    // GIVEN an existing testnet account
    // WHEN setTransferFee is called on a too-low transfer fee
    const result = await issuedCurrencyClient.setTransferFee(
      lowTransferFee,
      wallet,
    )

    const transactionHash = result.hash
    const transactionStatus = result.status

    // THEN the transaction fails.
    assert.exists(transactionHash)
    assert.equal(transactionStatus, TransactionStatus.MalformedTransaction)

    // GIVEN an existing testnet account
    // WHEN setTransferFee is called on a too-high transfer fee
    const result2 = await issuedCurrencyClient.setTransferFee(
      highTransferFee,
      wallet,
    )

    const transactionHash2 = result2.hash
    const transactionStatus2 = result2.status

    // THEN the transaction fails.
    assert.exists(transactionHash2)
    assert.equal(transactionStatus2, TransactionStatus.MalformedTransaction)
  })

  it('enableGlobalFreeze/disableGlobalFreeze - rippled', async function (): Promise<
    void
  > {
    this.timeout(timeoutMs)
    // GIVEN an existing testnet account
    // WHEN enableGlobalFreeze is called
    const result = await issuedCurrencyClient.enableGlobalFreeze(wallet)

    // THEN the transaction was successfully submitted and the correct flag was set on the account.
    await XRPTestUtils.verifyFlagModification(
      wallet,
      rippledGrpcUrl,
      result,
      AccountRootFlag.LSF_GLOBAL_FREEZE,
    )

    // GIVEN an existing testnet account with Global Freeze enabled
    // WHEN disableGlobalFreeze is called
    const result2 = await issuedCurrencyClient.disableGlobalFreeze(wallet)

    // THEN both transactions were successfully submitted and there should be no flag set on the account.
    await XRPTestUtils.verifyFlagModification(
      wallet,
      rippledGrpcUrl,
      result2,
      AccountRootFlag.LSF_GLOBAL_FREEZE,
      false,
    )
  })

  it('enableNoFreeze - rippled', async function (): Promise<void> {
    this.timeout(timeoutMs)
    // GIVEN an existing testnet account
    // WHEN enableNoFreeze is called
    const result = await issuedCurrencyClient.enableNoFreeze(wallet)

    // THEN the transaction was successfully submitted and the correct flag was set on the account.
    await XRPTestUtils.verifyFlagModification(
      wallet,
      rippledGrpcUrl,
      result,
      AccountRootFlag.LSF_NO_FREEZE,
    )
  })

  it('createTrustLine - creating a trustline with XRP', async function (): Promise<
    void
  > {
    this.timeout(timeoutMs)
    const issuer = await XRPTestUtils.randomWalletFromFaucet()
    // GIVEN an existing testnet account and an issuer's wallet
    // WHEN a trust line is created with the issuer with a value of 0
    try {
      await issuedCurrencyClient.createTrustLine(
        issuer.getAddress(),
        'XRP',
        '0',
        wallet,
      )
    } catch (error) {
      // THEN an error is thrown.
      assert.equal(error.errorType, XrpErrorType.InvalidInput)
    }
  })

  it('createTrustLine - adding a trustline with 0 value', async function (): Promise<
    void
  > {
    this.timeout(timeoutMs)
    const issuer = await XRPTestUtils.randomWalletFromFaucet()
    // GIVEN an existing testnet account and an issuer's wallet
    // WHEN a trust line is created with the issuer with a value of 0
    await issuedCurrencyClient.createTrustLine(
      issuer.getAddress(),
      'USD',
      '0',
      wallet,
    )

    const trustLines = await issuedCurrencyClient.getTrustLines(
      wallet.getAddress(),
    )

    // THEN no trustlines were created.
    assert.isArray(trustLines)
    assert.isEmpty(trustLines)
  })

  it('createTrustLine - adding a trustline with non-zero value', async function (): Promise<
    void
  > {
    this.timeout(timeoutMs)
    const issuer = await XRPTestUtils.randomWalletFromFaucet()

    const trustLineLimit = '1'
    const trustLineCurrency = 'USD'

    // GIVEN an existing testnet account and an issuer's wallet
    // WHEN a trustline is created with the issuer with a positive value
    await issuedCurrencyClient.createTrustLine(
      issuer.getAddress(),
      trustLineCurrency,
      trustLineLimit,
      wallet,
    )

    const trustLines = await issuedCurrencyClient.getTrustLines(
      wallet.getAddress(),
    )

    const [createdTrustLine] = trustLines
    const classicAddress = XrpUtils.decodeXAddress(issuer.getAddress())!

    // THEN a trust line was created with the issuing account.
    assert.equal(createdTrustLine.account, classicAddress.address)
    assert.equal(createdTrustLine.limit, trustLineLimit)
    assert.equal(createdTrustLine.currency, trustLineCurrency)
  })

  it('authorizeTrustLine - valid account', async function (): Promise<void> {
    this.timeout(timeoutMs)
    const issuer = await XRPTestUtils.randomWalletFromFaucet()
    const accountToTrust = await XRPTestUtils.randomWalletFromFaucet()

    // GIVEN an existing testnet account requiring authorized trust lines
    // and another account
    await issuedCurrencyClient.requireAuthorizedTrustlines(issuer)

    const trustLineCurrency = 'USD'
    // WHEN a trust line is authorized with another account
    await issuedCurrencyClient.authorizeTrustLine(
      accountToTrust.getAddress(),
      'USD',
      issuer,
    )

    const trustLines = await issuedCurrencyClient.getTrustLines(
      issuer.getAddress(),
    )

    const [createdTrustLine] = trustLines
    const classicAddress = XrpUtils.decodeXAddress(accountToTrust.getAddress())!

    // THEN an authorized trust line is created between the wallet and the other account.
    assert.equal(createdTrustLine.account, classicAddress.address)
    assert.equal(createdTrustLine.limit, '0')
    assert.equal(createdTrustLine.currency, trustLineCurrency)
    assert.isTrue(createdTrustLine.authorized)
  })
})
