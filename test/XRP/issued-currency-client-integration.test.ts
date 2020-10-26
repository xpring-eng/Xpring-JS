import { assert } from 'chai'
import { Wallet, WalletFactory, XrplNetwork, XrpUtils } from 'xpring-common-js'
import { XrpClient, XrpError } from '../../src/XRP'
import IssuedCurrencyClient from '../../src/XRP/issued-currency-client'

import XRPTestUtils from './helpers/xrp-test-utils'
import {
  AccountRootFlag,
  TransactionResult,
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
    this.timeout(timeoutMs)
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

  // TODO: (acorso) can any addresses be created in `before` and reused?  Can any test cases be combined?
  it('sendIssuedCurrency - issuing issued currency, combined cases', async function (): Promise<
    void
  > {
    this.timeout(timeoutMs)
    // GIVEN two existing, funded testnet accounts serving as an issuing address and operational address, respectively
    const issuerWallet = await XRPTestUtils.randomWalletFromFaucet()
    const operationalWallet = await XRPTestUtils.randomWalletFromFaucet()

    // WHEN there does not yet exist a trust line between the accounts, and the issuer attempts to issue an issued currency
    let transactionResult = await issuedCurrencyClient.sendIssuedCurrency(
      issuerWallet,
      operationalWallet.getAddress(),
      'USD',
      issuerWallet.getAddress(),
      '200',
    )

    // THEN the transaction fails with claimed cost only.
    // TODO: (acorso) What is the actual status code? -- do we need to update this once the enum is expanded?
    assert.deepEqual(
      transactionResult,
      TransactionResult.getFinalTransactionResult(
        transactionResult.hash,
        TransactionStatus.ClaimedCostOnly,
        true,
      ),
    )

    // next, GIVEN a trust line created from the operational address to the issuer address, but with a limit that is too low
    const trustLineLimit = '100'
    const trustLineCurrency = 'USD'

    await issuedCurrencyClient.createTrustLine(
      issuerWallet.getAddress(),
      trustLineCurrency,
      trustLineLimit,
      operationalWallet,
    )

    // WHEN the issuer attempts to issue an amount of issued currency above the trust line limit
    transactionResult = await issuedCurrencyClient.sendIssuedCurrency(
      issuerWallet,
      operationalWallet.getAddress(),
      'USD',
      issuerWallet.getAddress(),
      '200',
    )

    // THEN the transaction fails with claimed cost only
    // TODO: (acorso) actual status code?
    assert.deepEqual(
      transactionResult,
      TransactionResult.getFinalTransactionResult(
        transactionResult.hash,
        TransactionStatus.ClaimedCostOnly,
        true,
      ),
    )

    // but, WHEN the issuer attempts to issue an amount of issued currency at or below the trust line limit
    transactionResult = await issuedCurrencyClient.sendIssuedCurrency(
      issuerWallet,
      operationalWallet.getAddress(),
      'USD',
      issuerWallet.getAddress(),
      '100',
    )

    // THEN the transaction finally succeeds.
    assert.deepEqual(
      transactionResult,
      TransactionResult.getFinalTransactionResult(
        transactionResult.hash,
        TransactionStatus.Succeeded,
        true,
      ),
    )
  })

  it('sendIssuedCurrency - failure to send from non-issuing account to customer account without rippling enabled on issuer', async function (): Promise<
    void
  > {
    this.timeout(timeoutMs)
    // GIVEN an operational address with some issued currency, and an issuing address that has not enabled rippling
    const issuerWallet = await XRPTestUtils.randomWalletFromFaucet()
    const operationalWallet = await XRPTestUtils.randomWalletFromFaucet()
    const customerWallet = await XRPTestUtils.randomWalletFromFaucet()

    // establish trust line between operational and issuing
    const trustLineLimit = '1000'
    const trustLineCurrency = 'FOO'
    await issuedCurrencyClient.createTrustLine(
      issuerWallet.getAddress(),
      trustLineCurrency,
      trustLineLimit,
      operationalWallet,
    )

    // fund operational with issued currency
    await issuedCurrencyClient.sendIssuedCurrency(
      issuerWallet,
      operationalWallet.getAddress(),
      'FOO',
      issuerWallet.getAddress(),
      '500',
    )

    // Must create trust line from customer account to issuing account such that rippling *could* happen through issuing account
    // Even though it won't because the issuing account hasn't enabled rippling - just isolating what's being tested.
    await issuedCurrencyClient.createTrustLine(
      issuerWallet.getAddress(),
      trustLineCurrency,
      trustLineLimit,
      customerWallet,
    )

    // WHEN an issued currency payment is made to another funded account
    const transactionResult = await issuedCurrencyClient.sendIssuedCurrency(
      operationalWallet,
      customerWallet.getAddress(),
      'FOO',
      issuerWallet.getAddress(),
      '100',
    )

    // TODO: the actual error code here is tecPATH_DRY... that seems like important information, let's figure out how to incorporate this
    // THEN the payment fails with a TransactionStatus.ClaimedCostOnly status
    assert.deepEqual(
      transactionResult,
      TransactionResult.getFinalTransactionResult(
        transactionResult.hash,
        TransactionStatus.ClaimedCostOnly,
        true,
      ),
    )
  })

  it('sendIssuedCurrency - success sending issued currency from non-issuing account to another account', async function (): Promise<
    void
  > {
    this.timeout(timeoutMs)
    // GIVEN an operational address with some issued currency, and an issuing address that has enabled rippling
    const issuerWallet = await XRPTestUtils.randomWalletFromFaucet()
    const operationalWallet = await XRPTestUtils.randomWalletFromFaucet()
    const customerWallet = await XRPTestUtils.randomWalletFromFaucet()

    // enable rippling
    await issuedCurrencyClient.enableRippling(issuerWallet)

    // establish a trust line from operational to issuing
    const trustLineLimit = '1000'
    const trustLineCurrency = 'FOO'
    await issuedCurrencyClient.createTrustLine(
      issuerWallet.getAddress(),
      trustLineCurrency,
      trustLineLimit,
      operationalWallet,
    )

    // fund operational with issued currency
    await issuedCurrencyClient.sendIssuedCurrency(
      issuerWallet,
      operationalWallet.getAddress(),
      'FOO',
      issuerWallet.getAddress(),
      '500',
    )

    // Must create trust line from customer account to issuing account such that rippling can happen through issuing account
    await issuedCurrencyClient.createTrustLine(
      issuerWallet.getAddress(),
      trustLineCurrency,
      trustLineLimit,
      customerWallet,
    )

    // WHEN an issued currency payment is made to another funded account
    const transactionResult = await issuedCurrencyClient.sendIssuedCurrency(
      operationalWallet,
      customerWallet.getAddress(),
      'FOO',
      issuerWallet.getAddress(),
      '100',
    )

    // THEN the transaction succeeds.
    assert.deepEqual(
      transactionResult,
      TransactionResult.getFinalTransactionResult(
        transactionResult.hash,
        TransactionStatus.Succeeded,
        true,
      ),
    )
  })

  it('sendIssuedCurrency - failure sending unowned issued currency from non-issuing account to another account', async function (): Promise<
    void
  > {
    this.timeout(timeoutMs)
    // GIVEN an operational address with some issued currency, and an issuing address that has enabled rippling
    const issuerWallet = await XRPTestUtils.randomWalletFromFaucet()
    const operationalWallet = await XRPTestUtils.randomWalletFromFaucet()
    const customerWallet = await XRPTestUtils.randomWalletFromFaucet()

    await issuedCurrencyClient.enableRippling(issuerWallet)

    // establish trust line from operational to issuing
    const trustLineLimit = '1000'
    const trustLineCurrency = 'FOO'
    await issuedCurrencyClient.createTrustLine(
      issuerWallet.getAddress(),
      trustLineCurrency,
      trustLineLimit,
      operationalWallet,
    )

    // fund opertional with some FOO
    await issuedCurrencyClient.sendIssuedCurrency(
      issuerWallet,
      operationalWallet.getAddress(),
      'FOO',
      issuerWallet.getAddress(),
      '500',
    )

    // Must create trust line from customer account to issuing account such that rippling can happen through issuing account
    await issuedCurrencyClient.createTrustLine(
      issuerWallet.getAddress(),
      trustLineCurrency,
      trustLineLimit,
      customerWallet,
    )

    // WHEN an issued currency payment of BAR is made to another funded account
    const transactionResult = await issuedCurrencyClient.sendIssuedCurrency(
      operationalWallet,
      customerWallet.getAddress(),
      'BAR',
      issuerWallet.getAddress(),
      '100',
    )

    // THEN the transaction fails with claimed cost only.
    // NOTE: This is also a tecPATH_DRY error code from rippled
    assert.deepEqual(
      transactionResult,
      TransactionResult.getFinalTransactionResult(
        transactionResult.hash,
        TransactionStatus.ClaimedCostOnly,
        true,
      ),
    )
  })

  it('sendIssuedCurrency - sending issued currency with applicable transfer fees, combined cases', async function (): Promise<
    void
  > {
    this.timeout(timeoutMs * 2)
    // GIVEN an operational address with some issued currency, and an issuing address that has enabled rippling and established a transfer fee
    const issuerWallet = await XRPTestUtils.randomWalletFromFaucet()
    const operationalWallet = await XRPTestUtils.randomWalletFromFaucet()
    const customerWallet = await XRPTestUtils.randomWalletFromFaucet()

    await issuedCurrencyClient.enableRippling(issuerWallet)
    await issuedCurrencyClient.setTransferFee(1005000000, issuerWallet)

    // establish trust line from operational to issuing
    const trustLineLimit = '1000'
    const trustLineCurrency = 'FOO'
    await issuedCurrencyClient.createTrustLine(
      issuerWallet.getAddress(),
      trustLineCurrency,
      trustLineLimit,
      operationalWallet,
    )

    // fund operational with some FOO
    await issuedCurrencyClient.sendIssuedCurrency(
      issuerWallet,
      operationalWallet.getAddress(),
      'FOO',
      issuerWallet.getAddress(),
      '500',
    )

    // Must create trust line from customer account to issuing account such that rippling can happen through issuing account
    await issuedCurrencyClient.createTrustLine(
      issuerWallet.getAddress(),
      trustLineCurrency,
      trustLineLimit,
      customerWallet,
    )

    // WHEN an issued currency payment is made to another funded account, without the transferFee argument supplied
    let transactionResult = await issuedCurrencyClient.sendIssuedCurrency(
      operationalWallet,
      customerWallet.getAddress(),
      'FOO',
      issuerWallet.getAddress(),
      '100',
    )

    // THEN the transaction fails.
    // TODO: the actual status code from rippled here is tecPATH_PARTIAL - consider adding additional TransactionStatus case.
    // https://xrpl.org/tec-codes.html
    assert.deepEqual(
      transactionResult,
      TransactionResult.getFinalTransactionResult(
        transactionResult.hash,
        TransactionStatus.ClaimedCostOnly,
        true,
      ),
    )

    // but, WHEN an issued currency payment is made to another funded account with the correct transferFee supplied
    transactionResult = await issuedCurrencyClient.sendIssuedCurrency(
      operationalWallet,
      customerWallet.getAddress(),
      'FOO',
      issuerWallet.getAddress(),
      '100',
      0.5,
    )

    console.log('Result of sending transaction WITH sendmax')
    console.log(transactionResult)

    // THEN the transaction succeeds.
    assert.deepEqual(
      transactionResult,
      TransactionResult.getFinalTransactionResult(
        transactionResult.hash,
        TransactionStatus.Succeeded,
        true,
      ),
    )
  })

  it('sendIssuedCurrency - redeem issued currency to issuer', async function (): Promise<
    void
  > {
    this.timeout(timeoutMs)
    // GIVEN an operational address with some issued currency, and an issuing address that has not enabled rippling
    const issuerWallet = await XRPTestUtils.randomWalletFromFaucet()
    const customerWallet = await XRPTestUtils.randomWalletFromFaucet()

    // establish trust line from operational to issuing
    const trustLineLimit = '1000'
    const trustLineCurrency = 'FOO'
    await issuedCurrencyClient.createTrustLine(
      issuerWallet.getAddress(),
      trustLineCurrency,
      trustLineLimit,
      customerWallet,
    )

    // fund a customer wallet directly with some FOO
    await issuedCurrencyClient.sendIssuedCurrency(
      issuerWallet,
      customerWallet.getAddress(),
      'FOO',
      issuerWallet.getAddress(),
      '500',
    )

    // WHEN an issued currency payment is made back to the issuer
    const transactionResult = await issuedCurrencyClient.sendIssuedCurrency(
      customerWallet,
      issuerWallet.getAddress(),
      'FOO',
      issuerWallet.getAddress(),
      '100',
    )

    // THEN the payment succeeds.
    assert.deepEqual(
      transactionResult,
      TransactionResult.getFinalTransactionResult(
        transactionResult.hash,
        TransactionStatus.Succeeded,
        true,
      ),
    )
  })

  // TODO: (acorso) add test for attempting to send an issued currency payment to a user that has a trustline established with the issuer, but has not been authorized AND issuer has enabledAuthorizedTrustlines (should fail)
  //  ^^ this is really under the category of testing that authorizedTrustLines is working?
  // TODO: (acorso) confirm that the presence of a SendMax when not necessary also doesn't cause any problems (i.e. include the argument)
})
