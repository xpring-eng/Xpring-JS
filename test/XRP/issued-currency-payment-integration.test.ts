import { assert } from 'chai'
import { XrplNetwork } from 'xpring-common-js'
import IssuedCurrencyClient from '../../src/XRP/issued-currency-client'

import XRPTestUtils from './helpers/xrp-test-utils'
import { TransactionResult, TransactionStatus } from '../../src/XRP/shared'

// A timeout for these tests.
// eslint-disable-next-line @typescript-eslint/no-magic-numbers -- 1 minute in milliseconds
const timeoutMs = 60 * 1000

// An IssuedCurrencyClient that makes requests.
const rippledGrpcUrl = 'test.xrp.xpring.io:50051'
const rippledJsonUrl = 'http://test.xrp.xpring.io:51234'
const issuedCurrencyClient = IssuedCurrencyClient.issuedCurrencyClientWithEndpoint(
  rippledGrpcUrl,
  rippledJsonUrl,
  XrplNetwork.Test,
)

// TODO: (acorso) add test for attempting to send an issued currency payment to a user that has a trustline established with the issuer, but has not been authorized AND issuer has enabledAuthorizedTrustlines (should fail)
//  ^^ this is really under the category of testing that authorizedTrustLines is working?
// TODO: (acorso) confirm that the presence of a SendMax when not necessary also doesn't cause any problems (i.e. include the argument)
describe('Issued Currency Payment Integration Tests', function (): void {
  // Retry integration tests on failure.
  this.retries(3)

  it('createIssuedCurrency, combined cases', async function (): Promise<void> {
    this.timeout(timeoutMs)
    // GIVEN two existing, funded testnet accounts serving as an issuing address and operational address, respectively
    const issuerWallet = await XRPTestUtils.randomWalletFromFaucet()
    const operationalWallet = await XRPTestUtils.randomWalletFromFaucet()

    // WHEN there does not yet exist a trust line between the accounts, and the issuer attempts to create some issued currency
    let transactionResult = await issuedCurrencyClient.createIssuedCurrency(
      issuerWallet,
      operationalWallet.getAddress(),
      'USD',
      '200',
    )

    // THEN the transaction fails with ClaimedCostOnly_PathDry.
    assert.deepEqual(
      transactionResult,
      TransactionResult.createFinalTransactionResult(
        transactionResult.hash,
        TransactionStatus.ClaimedCostOnly_PathDry,
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

    // WHEN the issuer attempts to create an amount of issued currency above the trust line limit
    transactionResult = await issuedCurrencyClient.createIssuedCurrency(
      issuerWallet,
      operationalWallet.getAddress(),
      'USD',
      '200',
    )

    // THEN the transaction fails with ClaimedCostOnly_PathPartial
    assert.deepEqual(
      transactionResult,
      TransactionResult.createFinalTransactionResult(
        transactionResult.hash,
        TransactionStatus.ClaimedCostOnly_PathPartial,
        true,
      ),
    )

    // but, WHEN the issuer attempts to create an amount of issued currency at or below the trust line limit
    transactionResult = await issuedCurrencyClient.createIssuedCurrency(
      issuerWallet,
      operationalWallet.getAddress(),
      'USD',
      '100',
    )

    // THEN the transaction finally succeeds.
    assert.deepEqual(
      transactionResult,
      TransactionResult.createFinalTransactionResult(
        transactionResult.hash,
        TransactionStatus.Succeeded,
        true,
      ),
    )
  })

  it('issuedCurrencyPayment - failure to send from non-issuing account to customer account without rippling enabled on issuer', async function (): Promise<
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
    await issuedCurrencyClient.issuedCurrencyPayment(
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
    const transactionResult = await issuedCurrencyClient.issuedCurrencyPayment(
      operationalWallet,
      customerWallet.getAddress(),
      'FOO',
      issuerWallet.getAddress(),
      '100',
    )

    // THEN the payment fails with CalimedCostOnly_PathDry
    assert.deepEqual(
      transactionResult,
      TransactionResult.createFinalTransactionResult(
        transactionResult.hash,
        TransactionStatus.ClaimedCostOnly_PathDry,
        true,
      ),
    )
  })

  it('issuedCurrencyPayment - success sending issued currency from non-issuing account to another account', async function (): Promise<
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
    await issuedCurrencyClient.issuedCurrencyPayment(
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
    const transactionResult = await issuedCurrencyClient.issuedCurrencyPayment(
      operationalWallet,
      customerWallet.getAddress(),
      'FOO',
      issuerWallet.getAddress(),
      '100',
    )

    // THEN the transaction succeeds.
    assert.deepEqual(
      transactionResult,
      TransactionResult.createFinalTransactionResult(
        transactionResult.hash,
        TransactionStatus.Succeeded,
        true,
      ),
    )
  })

  it('issuedCurrencyPayment - failure sending unowned issued currency from non-issuing account to another account', async function (): Promise<
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
    await issuedCurrencyClient.issuedCurrencyPayment(
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
    const transactionResult = await issuedCurrencyClient.issuedCurrencyPayment(
      operationalWallet,
      customerWallet.getAddress(),
      'BAR',
      issuerWallet.getAddress(),
      '100',
    )

    // THEN the transaction fails with ClaimedCostOnly_PathDry
    assert.deepEqual(
      transactionResult,
      TransactionResult.createFinalTransactionResult(
        transactionResult.hash,
        TransactionStatus.ClaimedCostOnly_PathDry,
        true,
      ),
    )
  })

  it('issuedCurrencyPayment - sending issued currency with applicable transfer fees, combined cases', async function (): Promise<
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
    await issuedCurrencyClient.issuedCurrencyPayment(
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
    let transactionResult = await issuedCurrencyClient.issuedCurrencyPayment(
      operationalWallet,
      customerWallet.getAddress(),
      'FOO',
      issuerWallet.getAddress(),
      '100',
    )

    // THEN the transaction fails with ClaimedCostOnly_PathPartial.
    assert.deepEqual(
      transactionResult,
      TransactionResult.createFinalTransactionResult(
        transactionResult.hash,
        TransactionStatus.ClaimedCostOnly_PathPartial,
        true,
      ),
    )

    // but, WHEN an issued currency payment is made to another funded account with the correct transferFee supplied
    transactionResult = await issuedCurrencyClient.issuedCurrencyPayment(
      operationalWallet,
      customerWallet.getAddress(),
      'FOO',
      issuerWallet.getAddress(),
      '100',
      0.5,
    )

    // THEN the transaction succeeds.
    assert.deepEqual(
      transactionResult,
      TransactionResult.createFinalTransactionResult(
        transactionResult.hash,
        TransactionStatus.Succeeded,
        true,
      ),
    )
  })

  it('issuedCurrencyPayment - redeem issued currency to issuer', async function (): Promise<
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
    await issuedCurrencyClient.issuedCurrencyPayment(
      issuerWallet,
      customerWallet.getAddress(),
      'FOO',
      issuerWallet.getAddress(),
      '500',
    )

    // WHEN an issued currency payment is made back to the issuer
    const transactionResult = await issuedCurrencyClient.issuedCurrencyPayment(
      customerWallet,
      issuerWallet.getAddress(),
      'FOO',
      issuerWallet.getAddress(),
      '100',
    )

    // THEN the payment succeeds.
    assert.deepEqual(
      transactionResult,
      TransactionResult.createFinalTransactionResult(
        transactionResult.hash,
        TransactionStatus.Succeeded,
        true,
      ),
    )
  })
})
