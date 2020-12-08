import { assert } from 'chai'
import { XrplNetwork } from 'xpring-common-js'
import IssuedCurrencyClient from '../../src/XRP/issued-currency-client'

import XRPTestUtils from './helpers/xrp-test-utils'
import {
  TransactionResult,
  TransactionStatus,
  XrpError,
  XrpUtils,
} from '../../src/XRP/shared'
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

describe('Issued Currency Payment Integration Tests', function (): void {
  // Retry integration tests on failure.
  this.retries(3)

  const currencyNameFOO = 'FOO'
  const currencyNameBAR = 'BAR'
  const trustLineLimit = '10000'

  let issuerWalletFOO
  let issuerWalletBAR
  let customerWallet1
  let customerWallet2
  let issuerFOOClassicAddress
  let issuerBARClassicAddress

  before(async function () {
    this.timeout(timeoutMs * 2)
    const walletPromise1 = XRPTestUtils.randomWalletFromFaucet().then(
      (wallet) => {
        issuerWalletFOO = wallet
      },
    )
    const walletPromise2 = XRPTestUtils.randomWalletFromFaucet().then(
      (wallet) => {
        issuerWalletBAR = wallet
      },
    )
    const walletPromise3 = XRPTestUtils.randomWalletFromFaucet().then(
      (wallet) => {
        customerWallet1 = wallet
      },
    )
    const walletPromise4 = XRPTestUtils.randomWalletFromFaucet().then(
      (wallet) => {
        customerWallet2 = wallet
      },
    )

    await Promise.all([
      walletPromise1,
      walletPromise2,
      walletPromise3,
      walletPromise4,
    ])

    await issuedCurrencyClient.enableRippling(issuerWalletFOO)
    await issuedCurrencyClient.enableRippling(issuerWalletBAR)

    issuerFOOClassicAddress = XrpUtils.decodeXAddress(
      issuerWalletFOO.getAddress()!,
    )!.address
    issuerBARClassicAddress = XrpUtils.decodeXAddress(
      issuerWalletBAR.getAddress()!,
    )!.address

    // both customers trust issuer of FOO
    await issuedCurrencyClient.createTrustLine(
      issuerWalletFOO.getAddress(),
      currencyNameFOO,
      trustLineLimit,
      customerWallet1,
    )

    await issuedCurrencyClient.createTrustLine(
      issuerWalletFOO.getAddress(),
      currencyNameFOO,
      trustLineLimit,
      customerWallet2,
    )

    // only customer2 trusts issuer of BAR
    await issuedCurrencyClient.createTrustLine(
      issuerWalletBAR.getAddress(),
      currencyNameBAR,
      trustLineLimit,
      customerWallet2,
    )
  })

  after(function (done) {
    issuedCurrencyClient.webSocketNetworkClient.close()
    done()
  })

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
      trustLineCurrency,
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
      trustLineCurrency,
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

  it('sendIssuedCurrencyPayment - failure to send from non-issuing account to customer account without rippling enabled on issuer', async function (): Promise<
    void
  > {
    this.timeout(timeoutMs)
    // GIVEN an operational address with some issued currency, and an issuing address that has not enabled rippling
    const issuerWalletNoRippling = await XRPTestUtils.randomWalletFromFaucet()
    const operationalWallet = await XRPTestUtils.randomWalletFromFaucet()

    // establish trust line between operational and issuing
    const trustLineLimit = '1000'
    const trustLineCurrency = 'BAZ'
    await issuedCurrencyClient.createTrustLine(
      issuerWalletNoRippling.getAddress(),
      trustLineCurrency,
      trustLineLimit,
      operationalWallet,
    )

    // fund operational with issued currency
    await issuedCurrencyClient.createIssuedCurrency(
      issuerWalletNoRippling,
      operationalWallet.getAddress(),
      trustLineCurrency,
      '500',
    )

    // Must create trust line from customer account to issuing account such that rippling *could* happen through issuing account
    // Even though it won't because the issuing account hasn't enabled rippling - just isolating what's being tested.
    await issuedCurrencyClient.createTrustLine(
      issuerWalletNoRippling.getAddress(),
      trustLineCurrency,
      trustLineLimit,
      customerWallet1,
    )

    // WHEN an issued currency payment is made to another funded account
    const issuedCurrency: IssuedCurrency = {
      currency: trustLineCurrency,
      issuer: issuerWalletNoRippling.getAddress(),
      value: '100',
    }
    const transactionResult = await issuedCurrencyClient.sendIssuedCurrencyPayment(
      operationalWallet,
      customerWallet1.getAddress(),
      issuedCurrency,
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

  it('sendIssuedCurrencyPayment - success sending issued currency from non-issuing account to another account', async function (): Promise<
    void
  > {
    this.timeout(timeoutMs)
    // GIVEN an operational address with some issued currency, and an issuing address that has enabled rippling but set no transfer fees,
    // and a customer account who also has a trust line to the issuer.
    // fund operational with issued currency
    await issuedCurrencyClient.createIssuedCurrency(
      issuerWalletFOO,
      customerWallet1.getAddress(),
      currencyNameFOO,
      '500',
    )

    // WHEN an issued currency payment is made to another funded account
    const issuedCurrency: IssuedCurrency = {
      currency: currencyNameFOO,
      issuer: issuerWalletFOO.getAddress(),
      value: '100',
    }
    const transactionResult = await issuedCurrencyClient.sendIssuedCurrencyPayment(
      customerWallet1,
      customerWallet2.getAddress(),
      issuedCurrency,
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

  it('sendIssuedCurrencyPayment - sending issued currency with applicable transfer fees, combined cases', async function (): Promise<
    void
  > {
    this.timeout(timeoutMs * 2)
    // GIVEN an operational address with some issued currency, and an issuing address that has enabled rippling and established a transfer fee
    const issuerWalletWithTransferFee = await XRPTestUtils.randomWalletFromFaucet()

    await issuedCurrencyClient.enableRippling(issuerWalletWithTransferFee)
    await issuedCurrencyClient.setTransferFee(
      issuerWalletWithTransferFee,
      1005000000,
    )

    // establish trust line from operational to issuing
    const trustLineLimit = '1000'
    await issuedCurrencyClient.createTrustLine(
      issuerWalletWithTransferFee.getAddress(),
      currencyNameFOO,
      trustLineLimit,
      customerWallet1,
    )

    // fund operational with some FOO from this issuer
    await issuedCurrencyClient.createIssuedCurrency(
      issuerWalletWithTransferFee,
      customerWallet1.getAddress(),
      currencyNameFOO,
      '500',
    )

    // Must create trust line from customer account to issuing account such that rippling can happen through issuing account
    await issuedCurrencyClient.createTrustLine(
      issuerWalletWithTransferFee.getAddress(),
      currencyNameFOO,
      trustLineLimit,
      customerWallet2,
    )

    // WHEN an issued currency payment is made to another funded account, without the transferFee argument supplied
    const issuedCurrency: IssuedCurrency = {
      currency: currencyNameFOO,
      issuer: issuerWalletWithTransferFee.getAddress(),
      value: '100',
    }

    let transactionResult = await issuedCurrencyClient.sendIssuedCurrencyPayment(
      customerWallet1,
      customerWallet2.getAddress(),
      issuedCurrency,
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
    transactionResult = await issuedCurrencyClient.sendIssuedCurrencyPayment(
      customerWallet1,
      customerWallet2.getAddress(),
      issuedCurrency,
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

  it('redeemIssuedCurrency', async function (): Promise<void> {
    this.timeout(timeoutMs)
    // GIVEN a customer account with some issued currency, and an issuing address
    // fund the customer wallet directly with some FOO
    await issuedCurrencyClient.createIssuedCurrency(
      issuerWalletFOO,
      customerWallet1.getAddress(),
      currencyNameFOO,
      '500',
    )

    // WHEN an issued currency payment is made back to the issuer
    const issuedCurrency: IssuedCurrency = {
      currency: currencyNameFOO,
      issuer: issuerWalletFOO.getAddress(),
      value: '100',
    }
    const transactionResult = await issuedCurrencyClient.redeemIssuedCurrency(
      customerWallet1,
      issuedCurrency,
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

  it('sendCrossCurrencyPayment - success, XRP -> Issued Currency with default path', async function (): Promise<
    void
  > {
    this.timeout(timeoutMs)
    // GIVEN a customer account with some issued currency, an issuing address that has enabled rippling, and an offer to exchange
    // XRP for FOO

    // create an offer by Issuer of FOO to exchange XRP for FOO:
    const takerGetsAmount: IssuedCurrency = {
      currency: currencyNameFOO,
      issuer: issuerFOOClassicAddress,
      value: '100',
    }
    const takerPaysAmount = '100000000' // drops of XRP = 100 XRP, 1:1 exchange rate

    await issuedCurrencyClient.createOffer(
      issuerWalletFOO,
      takerGetsAmount,
      takerPaysAmount,
    )

    // WHEN a cross currency payment is made that sends XRP and delivers FOO.
    const sourceAmount = '100000000' // spend up to 100 XRP
    const deliverAmount = {
      currency: currencyNameFOO,
      issuer: issuerFOOClassicAddress,
      value: '80',
    }

    const transactionResult = await issuedCurrencyClient.sendCrossCurrencyPayment(
      customerWallet2,
      customerWallet1.getAddress(),
      sourceAmount,
      deliverAmount,
    )

    // THEN the cross currency payment succeeds.
    assert.deepEqual(
      transactionResult,
      TransactionResult.createFinalTransactionResult(
        transactionResult.hash,
        TransactionStatus.Succeeded,
        true,
      ),
    )
  })

  it('sendCrossCurrencyPayment - success, Issued Currency -> Issued Currency with no default path', async function (): Promise<
    void
  > {
    this.timeout(timeoutMs * 2)
    // GIVEN two different issued currencies by two different issuers, and order books for each currency to exchange with XRP,
    // a payer who wants to pay in FOO, and a payee who wants to receive BAR

    // create a trustline to FOO issuer and then an offer by third party to take FOO and provide XRP:
    const offererWallet = await XRPTestUtils.randomWalletFromFaucet()

    await issuedCurrencyClient.createTrustLine(
      issuerWalletFOO.getAddress(),
      currencyNameFOO,
      trustLineLimit,
      offererWallet,
    )

    const takerGetsXRP = '100000000' // 100 XRP
    const takerPaysFOO: IssuedCurrency = {
      currency: currencyNameFOO,
      issuer: issuerFOOClassicAddress,
      value: '100',
    }

    await issuedCurrencyClient.createOffer(
      offererWallet,
      takerGetsXRP,
      takerPaysFOO,
    )

    // create offer by issuer of BAR to accept XRP in exchange for BAR
    const takerGetsBAR: IssuedCurrency = {
      currency: currencyNameBAR,
      issuer: issuerBARClassicAddress,
      value: '100',
    }
    const takerPaysXRP = '100000000' // 100 XRP

    await issuedCurrencyClient.createOffer(
      issuerWalletBAR,
      takerGetsBAR,
      takerPaysXRP,
    )

    // fund sending customer with some FOO
    await issuedCurrencyClient.createIssuedCurrency(
      issuerWalletFOO,
      customerWallet1.getAddress(),
      currencyNameFOO,
      '500',
    )

    // WHEN a cross currency payment is made that sends FOO and delivers BAR.
    const sourceAmount: IssuedCurrency = {
      currency: currencyNameFOO,
      issuer: issuerFOOClassicAddress,
      value: '80',
    }
    const deliverAmount = {
      currency: currencyNameBAR,
      issuer: issuerBARClassicAddress,
      value: '80',
    }

    const transactionResult = await issuedCurrencyClient.sendCrossCurrencyPayment(
      customerWallet1,
      customerWallet2.getAddress(),
      sourceAmount,
      deliverAmount,
    )

    // THEN the cross currency payment succeeds.
    assert.deepEqual(
      transactionResult,
      TransactionResult.createFinalTransactionResult(
        transactionResult.hash,
        TransactionStatus.Succeeded,
        true,
      ),
    )
  })

  it('sendCrossCurrencyPayment - combined cases: failure then success, Issued Currency -> XRP', async function (): Promise<
    void
  > {
    this.timeout(timeoutMs)
    // GIVEN a customer account trying to spend BAZ, an issuing address for BAZ that has enabled rippling,
    // a recipient looking to be paid in XRP, but no offers for exchange.
    const freshIssuerWallet = await XRPTestUtils.randomWalletFromFaucet()
    await issuedCurrencyClient.enableRippling(freshIssuerWallet)
    const freshIssuerClassicAddress = XrpUtils.decodeXAddress(
      freshIssuerWallet.getAddress(),
    )!.address

    // fund customer with some BAZ
    const currencyNameBAZ = 'BAZ'

    await issuedCurrencyClient.createTrustLine(
      freshIssuerWallet.getAddress(),
      currencyNameBAZ,
      trustLineLimit,
      customerWallet1,
    )
    await issuedCurrencyClient.createIssuedCurrency(
      freshIssuerWallet,
      customerWallet1.getAddress(),
      currencyNameBAZ,
      '500',
    )

    // WHEN a cross currency payment is made that tries to send BAZ and deliver XRP.
    let sourceAmount = {
      currency: currencyNameBAZ,
      issuer: freshIssuerClassicAddress,
      value: '80',
    }
    let deliverAmount = '100000000'

    // THEN the cross currency payment fails with an error indicating that no paths exist.
    try {
      await issuedCurrencyClient.sendCrossCurrencyPayment(
        customerWallet1,
        customerWallet2.getAddress(),
        sourceAmount,
        deliverAmount,
      )
    } catch (error) {
      assert(error instanceof XrpError)
      assert(
        error.message == 'No paths exist to execute cross-currency payment.',
      )
    }

    // BUT THEN GIVEN a customer account with some issued BAZ, an issuing address that has enabled rippling, a recipient interested
    // in being paid in XRP, and a third party offer to exchange the two
    await issuedCurrencyClient.createTrustLine(
      freshIssuerWallet.getAddress(),
      currencyNameBAZ,
      trustLineLimit,
      customerWallet2,
    )

    // create offer by third party to take BAZ in exchange for XRP
    const takerGetsXRP = '100000000' // 100 XRP
    const takerPaysBAZ: IssuedCurrency = {
      currency: currencyNameBAZ,
      issuer: freshIssuerClassicAddress,
      value: '100',
    }

    await issuedCurrencyClient.createOffer(
      customerWallet2,
      takerGetsXRP,
      takerPaysBAZ,
    )

    // WHEN a cross currency payment is made that sends BAZ and delivers XRP.
    sourceAmount = {
      currency: currencyNameBAZ,
      issuer: freshIssuerClassicAddress,
      value: '80',
    }
    deliverAmount = '80000000' // deliver 80 XRP

    const transactionResult = await issuedCurrencyClient.sendCrossCurrencyPayment(
      customerWallet1,
      customerWallet1.getAddress(),
      sourceAmount,
      deliverAmount,
    )

    // THEN the cross currency payment succeeds.
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
