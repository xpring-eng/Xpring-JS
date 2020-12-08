import { assert } from 'chai'
import { Wallet, WalletFactory, XrplNetwork, XrpUtils } from 'xpring-common-js'
import XrpError from '../../src/XRP/shared/xrp-error'
import IssuedCurrencyClient from '../../src/XRP/issued-currency-client'

import XRPTestUtils from './helpers/xrp-test-utils'
import {
  AccountRootFlag,
  TransactionStatus,
  XrpErrorType,
} from '../../src/XRP/shared'
import { TransactionResponse } from '../../src/XRP/shared/rippled-web-socket-schema'
import XrpClient from '../../src/XRP/xrp-client'
import IssuedCurrency from '../../src/XRP/shared/issued-currency'

// A timeout for these tests.
// eslint-disable-next-line @typescript-eslint/no-magic-numbers -- 1 minute in milliseconds
const timeoutMs = 60 * 1000

// An IssuedCurrencyClient that makes requests.
const rippledGrpcUrl = 'test.xrp.xpring.io:50051'
const rippledWebSocketUrl = 'wss://wss.test.xrp.xpring.io'
const issuedCurrencyClient = IssuedCurrencyClient.issuedCurrencyClientWithEndpoint(
  rippledGrpcUrl,
  rippledWebSocketUrl,
  console.log,
  XrplNetwork.Test,
)

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

describe('IssuedCurrencyClient Integration Tests', function (): void {
  // Retry integration tests on failure.
  this.retries(3)

  // Some testnet wallets with invariant properties.
  let walletMightHaveTrustLines: Wallet
  let walletNeverAnyTrustLines: Wallet
  let issuerWallet: Wallet
  let issuerWalletAuthTrustLines: Wallet

  before(async function () {
    this.timeout(timeoutMs)
    const walletPromise1 = XRPTestUtils.randomWalletFromFaucet().then(
      (wallet) => {
        walletMightHaveTrustLines = wallet
      },
    )
    const walletPromise2 = XRPTestUtils.randomWalletFromFaucet().then(
      (wallet) => {
        walletNeverAnyTrustLines = wallet
      },
    )
    const walletPromise3 = XRPTestUtils.randomWalletFromFaucet().then(
      (wallet) => {
        issuerWallet = wallet
      },
    )
    const walletPromise4 = XRPTestUtils.randomWalletFromFaucet().then(
      (wallet) => {
        issuerWalletAuthTrustLines = wallet
      },
    )
    await Promise.all([
      walletPromise1,
      walletPromise2,
      walletPromise3,
      walletPromise4,
    ])
  })

  after(function (done) {
    issuedCurrencyClient.webSocketNetworkClient.close()
    done()
  })

  it('getTrustLines - valid request', async function (): Promise<void> {
    this.timeout(timeoutMs)
    // GIVEN a testnet wallet that has created at least one trustline
    await issuedCurrencyClient.createTrustLine(
      issuerWallet.getAddress(),
      'FOO',
      '100',
      walletMightHaveTrustLines,
    )

    // WHEN getTrustLines is called for that address
    const trustLines = await issuedCurrencyClient.getTrustLines(
      walletMightHaveTrustLines.getAddress(),
    )

    // THEN there are trustlines in the response.
    assert.exists(trustLines)
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
    // WHEN getTrustLines is called for that addres
    const trustLines = await issuedCurrencyClient.getTrustLines(
      walletNeverAnyTrustLines.getAddress(),
    )

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
      walletNeverAnyTrustLines,
    )

    // THEN the transaction was successfully submitted and the correct flag was set on the account.
    await XRPTestUtils.verifyFlagModification(
      walletNeverAnyTrustLines,
      rippledGrpcUrl,
      result,
      AccountRootFlag.LSF_REQUIRE_AUTH,
    )

    // GIVEN an existing testnet account with Require Authorization enabled
    // WHEN allowUnauthorizedTrustlines is called
    const result2 = await issuedCurrencyClient.allowUnauthorizedTrustlines(
      walletNeverAnyTrustLines,
    )

    // THEN the transaction was successfully submitted and the correct flag was unset on the account.
    await XRPTestUtils.verifyFlagModification(
      walletNeverAnyTrustLines,
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
    const result = await issuedCurrencyClient.enableRippling(
      walletNeverAnyTrustLines,
    )

    // THEN the transaction was successfully submitted and the correct flag was set on the account.
    await XRPTestUtils.verifyFlagModification(
      walletNeverAnyTrustLines,
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
    const result = await issuedCurrencyClient.disallowIncomingXrp(
      walletNeverAnyTrustLines,
    )

    // THEN the transaction was successfully submitted and the correct flag was set on the account.
    await XRPTestUtils.verifyFlagModification(
      walletNeverAnyTrustLines,
      rippledGrpcUrl,
      result,
      AccountRootFlag.LSF_DISALLOW_XRP,
    )

    // GIVEN an existing testnet account with Disallow XRP enabled
    // WHEN allowIncomingXrp is called
    const result2 = await issuedCurrencyClient.allowIncomingXrp(
      walletNeverAnyTrustLines,
    )

    // THEN the transaction was successfully submitted and the flag should not be set on the account.
    await XRPTestUtils.verifyFlagModification(
      walletNeverAnyTrustLines,
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
    const result = await issuedCurrencyClient.requireDestinationTags(
      walletNeverAnyTrustLines,
    )

    // THEN the transaction was successfully submitted and the correct flag was set on the account.
    await XRPTestUtils.verifyFlagModification(
      walletNeverAnyTrustLines,
      rippledGrpcUrl,
      result,
      AccountRootFlag.LSF_REQUIRE_DEST_TAG,
    )

    // GIVEN an existing testnet account with Require Destination Tags enabled
    // WHEN allowNoDestinationTag is called
    const result2 = await issuedCurrencyClient.allowNoDestinationTag(
      walletNeverAnyTrustLines,
    )

    // THEN both transactions were successfully submitted and there should be no flag set on the account.
    await XRPTestUtils.verifyFlagModification(
      walletNeverAnyTrustLines,
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
    await issuedCurrencyClient.requireDestinationTags(walletNeverAnyTrustLines)

    // WHEN a transaction is sent to the account without a destination tag
    const xrpClient = new XrpClient(rippledGrpcUrl, XrplNetwork.Test)
    const xrpAmount = '100'
    const transactionResult = await xrpClient.sendXrp(
      xrpAmount,
      walletNeverAnyTrustLines.getAddress(),
      walletMightHaveTrustLines,
    )

    // THEN the transaction fails.
    assert.exists(transactionResult.hash)
    assert.equal(transactionResult.status, TransactionStatus.ClaimedCostOnly)

    // GIVEN an existing testnet account with requireDestinationTags unset
    await issuedCurrencyClient.allowNoDestinationTag(walletNeverAnyTrustLines)

    // WHEN a transaction is sent to the account without a destination tag
    const transactionResult2 = await xrpClient.sendXrp(
      xrpAmount,
      walletNeverAnyTrustLines.getAddress(),
      walletMightHaveTrustLines,
    )

    // THEN the transaction succeeds.
    assert.exists(transactionResult2.hash)
    assert.equal(transactionResult2.status, TransactionStatus.Succeeded)
  })

  // TODO: when SDK functionality is expanded, improve test specificity by creating trustlines/issued currencies first,
  // which will also avoid the need for maintenance after a testnet reset.

  // TODO: Implement an integration test for an account with balances/assets/obligations once functionality exists for first creating things.
  it('getGatewayBalances - account not found', async function (): Promise<
    void
  > {
    this.timeout(timeoutMs)
    // GIVEN a valid address that doesn't actually exist on the ledger
    const walletFactory = new WalletFactory(XrplNetwork.Test)
    const address = (await walletFactory.generateRandomWallet())!.wallet.getAddress()

    // WHEN getGatewayBalances is called for that address THEN an error is propagated.
    issuedCurrencyClient.getGatewayBalances(address).catch((error) => {
      assert.typeOf(error, 'Error')
      assert.equal(error, XrpError.accountNotFound)
    })
  })

  it('getGatewayBalances - account with no issued currencies', async function (): Promise<
    void
  > {
    // GIVEN a valid, funded address that has not issued any currencies
    const address = walletNeverAnyTrustLines.getAddress()

    // WHEN getGatewayBalances is called for that address
    const gatewayBalances = await issuedCurrencyClient.getGatewayBalances(
      address,
    )

    // THEN the result is as expected.
    assert.equal(gatewayBalances.account, address)
    assert.isUndefined(gatewayBalances.assets)
    assert.isUndefined(gatewayBalances.balances)
    assert.isUndefined(gatewayBalances.obligations)
  })

  it('getTransferFee/setTransferFee - rippled', async function (): Promise<
    void
  > {
    this.timeout(timeoutMs)
    // GIVEN an existing testnet account
    // WHEN setTransferFee is called
    const expectedTransferFee = 1000000123
    const result = await issuedCurrencyClient.setTransferFee(
      walletMightHaveTrustLines,
      expectedTransferFee,
    )

    const transactionHash = result.hash
    const transactionStatus = result.status

    const transferRate = await issuedCurrencyClient.getTransferFee(
      walletMightHaveTrustLines.getAddress(),
    )

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
      walletMightHaveTrustLines,
      lowTransferFee,
    )

    const transactionHash = result.hash
    const transactionStatus = result.status

    // THEN the transaction fails.
    assert.exists(transactionHash)
    assert.equal(transactionStatus, TransactionStatus.MalformedTransaction)

    // GIVEN an existing testnet account
    // WHEN setTransferFee is called on a too-high transfer fee
    const result2 = await issuedCurrencyClient.setTransferFee(
      walletMightHaveTrustLines,
      highTransferFee,
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
    const result = await issuedCurrencyClient.enableGlobalFreeze(
      walletMightHaveTrustLines,
    )

    // THEN the transaction was successfully submitted and the correct flag was set on the account.
    await XRPTestUtils.verifyFlagModification(
      walletMightHaveTrustLines,
      rippledGrpcUrl,
      result,
      AccountRootFlag.LSF_GLOBAL_FREEZE,
    )

    // GIVEN an existing testnet account with Global Freeze enabled
    // WHEN disableGlobalFreeze is called
    const result2 = await issuedCurrencyClient.disableGlobalFreeze(
      walletMightHaveTrustLines,
    )

    // THEN both transactions were successfully submitted and there should be no flag set on the account.
    await XRPTestUtils.verifyFlagModification(
      walletMightHaveTrustLines,
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
    const result = await issuedCurrencyClient.enableNoFreeze(
      walletNeverAnyTrustLines,
    )

    // THEN the transaction was successfully submitted and the correct flag was set on the account.
    await XRPTestUtils.verifyFlagModification(
      walletNeverAnyTrustLines,
      rippledGrpcUrl,
      result,
      AccountRootFlag.LSF_NO_FREEZE,
    )
  })

  it('createTrustLine - creating a trustline with XRP', async function (): Promise<
    void
  > {
    this.timeout(timeoutMs)
    // GIVEN an existing testnet account and an issuer's wallet
    // WHEN a trust line is created with the issuer with a value of 0
    try {
      await issuedCurrencyClient.createTrustLine(
        issuerWallet.getAddress(),
        'XRP',
        '0',
        walletMightHaveTrustLines,
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
    // GIVEN an existing testnet account and an issuer's wallet
    const freshWallet = await XRPTestUtils.randomWalletFromFaucet()

    // WHEN a trust line is created with the issuer with a value of 0
    await issuedCurrencyClient.createTrustLine(
      issuerWallet.getAddress(),
      'USD',
      '0',
      freshWallet,
    )

    const trustLines = await issuedCurrencyClient.getTrustLines(
      freshWallet.getAddress(),
    )

    // THEN no trustlines were created.
    assert.isArray(trustLines)
    assert.isEmpty(trustLines)
  })

  it('createTrustLine - adding a trustline with non-zero value', async function (): Promise<
    void
  > {
    this.timeout(timeoutMs)
    const freshWallet = await XRPTestUtils.randomWalletFromFaucet()
    const trustLineLimit = '1'
    const trustLineCurrency = 'USD'

    // GIVEN an existing testnet account and an issuer's wallet
    // WHEN a trustline is created with the issuer with a positive value
    await issuedCurrencyClient.createTrustLine(
      issuerWallet.getAddress(),
      trustLineCurrency,
      trustLineLimit,
      freshWallet,
    )

    const trustLines = await issuedCurrencyClient.getTrustLines(
      freshWallet.getAddress(),
    )

    const [createdTrustLine] = trustLines
    const classicAddress = XrpUtils.decodeXAddress(issuerWallet.getAddress())!

    // THEN a trust line was created with the issuing account.
    assert.equal(createdTrustLine.account, classicAddress.address)
    assert.equal(createdTrustLine.limit, trustLineLimit)
    assert.equal(createdTrustLine.currency, trustLineCurrency)
  })

  it('createTrustLine - adding a trustline with non-zero value and qualityIn + qualityOut', async function (): Promise<
    void
  > {
    this.timeout(timeoutMs)
    const trustLineLimit = '1'
    const trustLineCurrency = 'USD'
    const qualityInAmount = 20
    const qualityOutAmount = 100

    // GIVEN an existing testnet account and an issuer's wallet
    const freshWallet = await XRPTestUtils.randomWalletFromFaucet()

    // WHEN a trustline is created with the issuer with a positive value
    await issuedCurrencyClient.createTrustLine(
      issuerWallet.getAddress(),
      trustLineCurrency,
      trustLineLimit,
      freshWallet,
      qualityInAmount,
      qualityOutAmount,
    )

    const trustLines = await issuedCurrencyClient.getTrustLines(
      freshWallet.getAddress(),
    )

    const [createdTrustLine] = trustLines
    const classicAddress = XrpUtils.decodeXAddress(issuerWallet.getAddress())!

    // THEN a trust line was created with the issuing account.
    assert.equal(createdTrustLine.account, classicAddress.address)
    assert.equal(createdTrustLine.limit, trustLineLimit)
    assert.equal(createdTrustLine.currency, trustLineCurrency)
    assert.equal(createdTrustLine.qualityIn, qualityInAmount)
    assert.equal(createdTrustLine.qualityOut, qualityOutAmount)
  })

  it('authorizeTrustLine - valid account', async function (): Promise<void> {
    this.timeout(timeoutMs)
    // GIVEN an existing testnet account requiring authorized trust lines
    // and another account
    const accountToTrust = await XRPTestUtils.randomWalletFromFaucet()
    await issuedCurrencyClient.requireAuthorizedTrustlines(
      issuerWalletAuthTrustLines,
    )

    const trustLineCurrency = 'USD'
    // WHEN a trust line is authorized with another account
    await issuedCurrencyClient.authorizeTrustLine(
      accountToTrust.getAddress(),
      'USD',
      issuerWalletAuthTrustLines,
    )

    const trustLines = await issuedCurrencyClient.getTrustLines(
      issuerWalletAuthTrustLines.getAddress(),
    )

    const [createdTrustLine] = trustLines
    const classicAddress = XrpUtils.decodeXAddress(accountToTrust.getAddress())!

    // THEN an authorized trust line is created between the wallet and the other account.
    assert.equal(createdTrustLine.account, classicAddress.address)
    assert.equal(createdTrustLine.limit, '0')
    assert.equal(createdTrustLine.currency, trustLineCurrency)
    assert.isTrue(createdTrustLine.authorized)
  })

  it('freezeTrustLine', async function (): Promise<void> {
    this.timeout(timeoutMs)
    // GIVEN an existing issuer account who has a trustline with a counter-party
    const trustLineCurrency = 'NEW'
    await issuedCurrencyClient.authorizeTrustLine(
      walletMightHaveTrustLines.getAddress(),
      trustLineCurrency,
      issuerWalletAuthTrustLines,
    )

    // WHEN the issuer freezes the trustline
    await issuedCurrencyClient.freezeTrustLine(
      walletMightHaveTrustLines.getAddress(),
      trustLineCurrency,
      issuerWalletAuthTrustLines,
    )

    const trustLines = await issuedCurrencyClient.getTrustLines(
      issuerWalletAuthTrustLines.getAddress(),
    )

    const frozenTrustLine = trustLines.find(
      (trustLine) => trustLine.currency === trustLineCurrency,
    )!

    // THEN the trust line is frozen.
    assert.equal(frozenTrustLine.freeze, true)
    assert.equal(frozenTrustLine.limit, '0')
  })

  it('unfreezeTrustLine - unfreezes frozen account', async function (): Promise<
    void
  > {
    this.timeout(timeoutMs)
    // GIVEN an existing issuer account who has a frozen trust line with a counter-party
    const trustLineCurrency = 'FRZ'
    await issuedCurrencyClient.authorizeTrustLine(
      walletMightHaveTrustLines.getAddress(),
      trustLineCurrency,
      issuerWalletAuthTrustLines,
    )

    await issuedCurrencyClient.freezeTrustLine(
      walletMightHaveTrustLines.getAddress(),
      trustLineCurrency,
      issuerWalletAuthTrustLines,
    )

    // WHEN the issuer unfreezes the trustline
    await issuedCurrencyClient.unfreezeTrustLine(
      walletMightHaveTrustLines.getAddress(),
      trustLineCurrency,
      issuerWalletAuthTrustLines,
    )

    const trustLines = await issuedCurrencyClient.getTrustLines(
      issuerWalletAuthTrustLines.getAddress(),
    )

    const unfrozenTrustLine = trustLines.find(
      (trustLine) => trustLine.currency === trustLineCurrency,
    )!

    // THEN the trust line is not frozen.
    assert.equal(unfrozenTrustLine.freeze, false)
    assert.equal(unfrozenTrustLine.limit, '0')
  })

  it('disableRipplingForTrustLine/enableRipplingForTrustLine', async function (): Promise<
    void
  > {
    this.timeout(timeoutMs)
    // GIVEN an existing issuer account who has a trust line with a counter-party
    const trustLineCurrency = 'NRP'
    await issuedCurrencyClient.authorizeTrustLine(
      walletMightHaveTrustLines.getAddress(),
      trustLineCurrency,
      issuerWalletAuthTrustLines,
    )

    const trustLineAmount = '1'

    // WHEN the issuer sets no rippling on the trust line
    await issuedCurrencyClient.disableRipplingForTrustLine(
      walletMightHaveTrustLines.getAddress(),
      trustLineCurrency,
      trustLineAmount,
      issuerWalletAuthTrustLines,
    )

    let trustLines = await issuedCurrencyClient.getTrustLines(
      issuerWalletAuthTrustLines.getAddress(),
    )

    const noRippleTrustLine = trustLines.find(
      (trustLine) => trustLine.currency === trustLineCurrency,
    )!

    // THEN the trust line has noRipple enabled.
    assert.equal(noRippleTrustLine.noRipple, true)
    assert.equal(noRippleTrustLine.limit, trustLineAmount)

    // WHEN the issuer re-enables rippling on the trust line
    await issuedCurrencyClient.enableRipplingForTrustLine(
      walletMightHaveTrustLines.getAddress(),
      trustLineCurrency,
      trustLineAmount,
      issuerWalletAuthTrustLines,
    )

    trustLines = await issuedCurrencyClient.getTrustLines(
      issuerWalletAuthTrustLines.getAddress(),
    )

    const enabledRippleTrustLine = trustLines.find(
      (trustLine) => trustLine.currency === trustLineCurrency,
    )!

    // THEN the trust line has noRipple enabled.
    assert.equal(enabledRippleTrustLine.noRipple, false)
    assert.equal(enabledRippleTrustLine.limit, trustLineAmount)
  })

  it('monitorAccountTransactions/stopMonitoringAccountTransactions - valid request', async function (): Promise<
    void
  > {
    this.timeout(timeoutMs)

    const xAddress = walletNeverAnyTrustLines.getAddress()
    const classicAddress = XrpUtils.decodeXAddress(xAddress)
    const address = classicAddress!.address

    const xrpAmount = '100'

    let messageReceived = false
    const callback = (data: TransactionResponse) => {
      if (messageReceived) {
        assert.fail('Second message should not be received after unsubscribing')
      }
      messageReceived = true
      assert.equal(data.engine_result, 'tesSUCCESS')
      assert.equal(data.engine_result_code, 0)
      assert.equal(
        data.engine_result_message,
        'The transaction was applied. Only final in a validated ledger.',
      )
      assert.equal(data.meta.TransactionResult, 'tesSUCCESS')
      assert.equal(data.status, 'closed')
      assert.equal(data.type, 'transaction')
      assert.equal(data.validated, true)
      assert.equal(data.transaction.Amount, xrpAmount)
      assert.equal(data.transaction.Destination, address)
      assert.equal(data.transaction.TransactionType, 'Payment')
    }

    const waitUntilMessageReceived = async () => {
      while (!messageReceived) {
        await sleep(5)
      }
    }

    const xrpClient = new XrpClient(rippledGrpcUrl, XrplNetwork.Test)

    // GIVEN a valid test address
    // WHEN subscribeToAccount is called for that address
    const response = await issuedCurrencyClient.monitorAccountTransactions(
      xAddress,
      callback,
    )

    // THEN the subscribe request is successfully submitted and received
    assert.isTrue(response)

    // WHEN a payment is sent to that address
    await xrpClient.sendXrp(xrpAmount, xAddress, walletMightHaveTrustLines)

    await waitUntilMessageReceived()

    //THEN the payment is successfully received
    assert(messageReceived)

    // WHEN unsubscribe is called for that address
    const unsubscribeResponse = await issuedCurrencyClient.stopMonitoringAccountTransactions(
      xAddress,
    )

    // THEN the unsubscribe request is successfully submitted and received
    assert.isTrue(unsubscribeResponse)

    // WHEN a payment is sent to that address
    await xrpClient.sendXrp(xrpAmount, xAddress, walletMightHaveTrustLines)

    // THEN the payment is not received by the callback
    // (If a payment is received, fail will be called in the callback)
  })

  it('monitorAccountTransactions - bad address', async function (): Promise<
    void
  > {
    this.timeout(timeoutMs)

    const address = 'badAddress'
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const callback = () => {}

    // GIVEN a test address that is malformed.
    // WHEN monitorAccountTransactions is called for that address THEN an error is thrown.
    try {
      await issuedCurrencyClient.monitorAccountTransactions(address, callback)
    } catch (e) {
      if (!(e instanceof XrpError)) {
        assert.fail('wrong error')
      }
    }
  })

  it('stopMonitoringAccountTransactions - not-subscribed address', async function (): Promise<
    void
  > {
    this.timeout(timeoutMs)

    const xAddress = walletNeverAnyTrustLines.getAddress()
    const classicAddress = XrpUtils.decodeXAddress(xAddress)
    const address = classicAddress!.address

    // GIVEN a test address that is not subscribed to.
    // WHEN stopMonitoringAccountTransactions is called for that address THEN an error is thrown.
    try {
      await issuedCurrencyClient.stopMonitoringAccountTransactions(address)
      assert.fail('Method call should fail')
    } catch (e) {
      if (!(e instanceof XrpError)) {
        assert.fail('wrong error')
      }
    }
  })

  it('stopMonitoringAccountTransactions - bad address', async function (): Promise<
    void
  > {
    this.timeout(timeoutMs)

    // GIVEN a test address that is malformed.
    const address = 'badAddress'

    // WHEN stopMonitoringAccountTransactions is called for that address THEN an error is thrown.
    try {
      await issuedCurrencyClient.stopMonitoringAccountTransactions(address)
      assert.fail('Method call should fail')
    } catch (e) {
      if (!(e instanceof XrpError)) {
        assert.fail('wrong error')
      }
    }
  })

  it('createOffer - success, taker gets issued currency taker pays xrp', async function (): Promise<
    void
  > {
    this.timeout(timeoutMs)

    // GIVEN a funded issuer wallet
    const issuerClassicAddress = XrpUtils.decodeXAddress(
      issuerWallet.getAddress(),
    )
    if (!issuerClassicAddress) {
      throw XrpError.xAddressRequired
    }

    const takerGetsIssuedCurrency: IssuedCurrency = {
      issuer: issuerClassicAddress.address,
      currency: 'FAK',
      value: '100',
    }
    const takerPaysXrp = '50'

    const offerSequenceNumber = 1

    const rippleEpochStartTimeSeconds = 946684800
    const currentTimeUnixEpochSeconds = Date.now() / 1000 // 1000 ms/sec
    const currentTimeRippleEpochSeconds =
      currentTimeUnixEpochSeconds - rippleEpochStartTimeSeconds
    const expiration = currentTimeRippleEpochSeconds + 60 * 60 // roughly one hour in future

    // WHEN the issuer creates an offer to exchange XRP for their issued currency
    const transactionResult = await issuedCurrencyClient.createOffer(
      issuerWallet,
      takerGetsIssuedCurrency,
      takerPaysXrp,
      offerSequenceNumber,
      expiration,
    )

    // THEN the offer is successfully created.
    // TODO: confirm success using book_offers or account_offers API when implemented?
    assert.equal(transactionResult.status, TransactionStatus.Succeeded)
    assert.equal(transactionResult.validated, true)
    assert.equal(transactionResult.final, true)
  })

  it('createOffer - success, taker gets xrp taker pays issued currency', async function (): Promise<
    void
  > {
    this.timeout(timeoutMs)
    // GIVEN a wallet with XRP
    const issuerClassicAddress = XrpUtils.decodeXAddress(
      issuerWallet.getAddress(),
    )
    if (!issuerClassicAddress) {
      throw XrpError.xAddressRequired
    }

    const takerPaysIssuedCurrency: IssuedCurrency = {
      issuer: issuerClassicAddress.address,
      currency: 'FAK',
      value: '100',
    }
    const takerGetsXrp = '50'

    const offerSequenceNumber = 1

    const rippleEpochStartTimeSeconds = 946684800
    const currentTimeUnixEpochSeconds = Date.now() / 1000 // 1000 ms/sec
    const currentTimeRippleEpochSeconds =
      currentTimeUnixEpochSeconds - rippleEpochStartTimeSeconds
    const expiration = currentTimeRippleEpochSeconds + 60 * 60 // roughly one hour in future

    // WHEN the wallet creates an offer to exchange (receive) their own issued currency for their XRP (deliver)
    const transactionResult = await issuedCurrencyClient.createOffer(
      issuerWallet,
      takerGetsXrp,
      takerPaysIssuedCurrency,
      offerSequenceNumber,
      expiration,
    )

    // THEN the offer is successfully created.
    // TODO: confirm success using book_offers or account_offers API when implemented?
    assert.equal(transactionResult.status, TransactionStatus.Succeeded)
    assert.equal(transactionResult.validated, true)
    assert.equal(transactionResult.final, true)
  })

  it('createOffer - flags, success', async function (): Promise<void> {
    this.timeout(timeoutMs)
    // GIVEN a wallet with XRP
    const issuerClassicAddress = XrpUtils.decodeXAddress(
      issuerWallet.getAddress(),
    )
    if (!issuerClassicAddress) {
      throw XrpError.xAddressRequired
    }

    const takerPaysIssuedCurrency: IssuedCurrency = {
      issuer: issuerClassicAddress.address,
      currency: 'FAK',
      value: '100',
    }
    const takerGetsXrp = '50'

    const offerSequenceNumber = 1

    const rippleEpochStartTimeSeconds = 946684800
    const currentTimeUnixEpochSeconds = Date.now() / 1000 // 1000 ms/sec
    const currentTimeRippleEpochSeconds =
      currentTimeUnixEpochSeconds - rippleEpochStartTimeSeconds
    const expiration = currentTimeRippleEpochSeconds + 60 * 60 // roughly one hour in future

    // WHEN the wallet creates an offer to exchange (receive) their own issued currency for their XRP (deliver)
    const transactionResult = await issuedCurrencyClient.createOffer(
      issuerWallet,
      takerGetsXrp,
      takerPaysIssuedCurrency,
      offerSequenceNumber,
      expiration,
      true,
      true,
      false,
      true,
    )

    console.log(transactionResult)

    // THEN the offer is successfully created.
    // TODO: confirm success using book_offers or account_offers API when implemented?
    assert.equal(transactionResult.status, TransactionStatus.Succeeded)
    assert.equal(transactionResult.validated, true)
    assert.equal(transactionResult.final, true)
  })

  it('createOffer - tfImmediateOrCancel and tfFillOrKill, failure', async function (): Promise<
    void
  > {
    this.timeout(timeoutMs)
    // GIVEN a wallet with XRP
    const issuerClassicAddress = XrpUtils.decodeXAddress(
      issuerWallet.getAddress(),
    )
    if (!issuerClassicAddress) {
      throw XrpError.xAddressRequired
    }

    const takerPaysIssuedCurrency: IssuedCurrency = {
      issuer: issuerClassicAddress.address,
      currency: 'FAK',
      value: '100',
    }
    const takerGetsXrp = '50'

    const offerSequenceNumber = 1

    const rippleEpochStartTimeSeconds = 946684800
    const currentTimeUnixEpochSeconds = Date.now() / 1000 // 1000 ms/sec
    const currentTimeRippleEpochSeconds =
      currentTimeUnixEpochSeconds - rippleEpochStartTimeSeconds
    const expiration = currentTimeRippleEpochSeconds + 60 * 60 // roughly one hour in future

    // WHEN the wallet creates an offer to exchange (receive) their own issued currency for their XRP (deliver),
    // with mutually exclusive `immediateOrCancel` and `fillOrKill` flags both set,
    const transactionResult = await issuedCurrencyClient.createOffer(
      issuerWallet,
      takerGetsXrp,
      takerPaysIssuedCurrency,
      offerSequenceNumber,
      expiration,
      false,
      true,
      true,
      false,
    )

    // THEN the offer is not successfully created.
    assert.equal(
      transactionResult.status,
      TransactionStatus.MalformedTransaction,
    )
  })

  it('cancelOffer - success', async function (): Promise<void> {
    this.timeout(timeoutMs)

    const offerSequenceNumber = 1

    const transactionResult = await issuedCurrencyClient.cancelOffer(
      issuerWallet,
      offerSequenceNumber,
    )

    // TODO: verify this better? An OfferCancel transaction is considered successful even if there was no offer to cancel.
    // At least we know it's well-formed.
    assert.equal(transactionResult.status, TransactionStatus.Succeeded)
    assert.equal(transactionResult.validated, true)
    assert.equal(transactionResult.final, true)
  })
})
