import { assert } from 'chai'

import { Utils, WalletFactory, XrplNetwork } from 'xpring-common-js'
import IssuedCurrencyClient from '../../src/XRP/issued-currency-client'
import {
  FakeXRPNetworkClient,
  FakeXRPNetworkClientResponses,
} from './fakes/fake-xrp-network-client'
import 'mocha'
import TrustLine from '../../src/XRP/shared/trustline'
import { XrpError, XrpErrorType } from '../../src/XRP'
import {
  FakeWebSocketNetworkClient,
  FakeWebSocketNetworkClientResponses,
} from './fakes/fake-web-socket-network-client'
import {
  AccountLinesResponse,
  WebSocketResponse,
  GatewayBalancesResponse,
  RippledMethod,
  AccountLinesSuccessfulResponse,
  GatewayBalancesSuccessfulResponse,
  ResponseStatus,
} from '../../src/XRP/shared/rippled-web-socket-schema'
import GatewayBalances, {
  gatewayBalancesFromResponse,
} from '../../src/XRP/shared/gateway-balances'
import IssuedCurrency from '../../src/XRP/shared/issued-currency'

const fakeSucceedingGrpcClient = new FakeXRPNetworkClient()

const fakeSucceedingWebSocketClient = new FakeWebSocketNetworkClient()

const testAddress = 'X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH'
const testClassicAddress = 'rNvEhC9xXxvwn8wt5sZ9ByXL22dHs4pAr1'

const walletFactory = new WalletFactory(XrplNetwork.Test)

describe('Issued Currency Client', function (): void {
  before(async function () {
    this.wallet = (await walletFactory.generateRandomWallet())!.wallet
  })

  it('getTrustLines - successful response', async function (): Promise<void> {
    // GIVEN an IssuedCurrencyClient.
    const issuedCurrencyClient = new IssuedCurrencyClient(
      fakeSucceedingGrpcClient,
      fakeSucceedingWebSocketClient,
      XrplNetwork.Test,
    )

    // WHEN getTrustLines is called
    const trustLines = await issuedCurrencyClient.getTrustLines(testAddress)
    const expectedTrustLines: Array<TrustLine> = []
    const trustlinesResponse: AccountLinesResponse = await fakeSucceedingWebSocketClient.getAccountLines(
      testAddress,
    )
    const trustlinesSuccessfulResponse = trustlinesResponse as AccountLinesSuccessfulResponse
    if (trustlinesSuccessfulResponse.result.lines === undefined) {
      throw XrpError.malformedResponse
    }
    for (const trustLineResponse of trustlinesSuccessfulResponse.result.lines) {
      const trustLine = new TrustLine(trustLineResponse)
      expectedTrustLines.push(trustLine)
    }

    // THEN the result is as expected
    assert.deepEqual(trustLines, expectedTrustLines)
  })

  it('getTrustLines - invalid account', async function (): Promise<void> {
    // GIVEN an IssuedCurrencyClient
    const issuedCurrencyClient = new IssuedCurrencyClient(
      fakeSucceedingGrpcClient,
      fakeSucceedingWebSocketClient,
      XrplNetwork.Test,
    )

    // WHEN getTrustLines is called with an invalid address THEN an error is propagated.
    const address = 'malformedAddress'
    try {
      await issuedCurrencyClient.getTrustLines(address)
    } catch (error) {
      assert.typeOf(error, 'Error')
      assert.equal(error, XrpError.xAddressRequired)
    }
  })

  it('getTrustLines - invalid peerAccount', async function (): Promise<void> {
    // GIVEN an IssuedCurrencyClient
    const issuedCurrencyClient = new IssuedCurrencyClient(
      fakeSucceedingGrpcClient,
      fakeSucceedingWebSocketClient,
      XrplNetwork.Test,
    )

    // WHEN getTrustLines is called with an invalid peerAccount address THEN an error is thrown.
    const peerAddress = 'malformedAddress'
    try {
      await issuedCurrencyClient.getTrustLines(testAddress, peerAddress)
    } catch (error) {
      assert.typeOf(error, 'Error')
      assert.equal(error, XrpError.xAddressRequired)
    }
  })

  it('getTrustLines - account not found error response', async function (): Promise<void> {
    // GIVEN an IssuedCurrencyClient with faked networking that will return an error response for getAccountLines
    const accountNotFoundResponse: AccountLinesResponse = {
      error: 'actNotFound',
      error_code: 19,
      error_message: 'Account not found.',
      id: 'account_lines_r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59',
      request: {
        account: 'r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59',
        command: RippledMethod.accountLines,
        id: 'account_lines_r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59',
        ledger_index: 'validated',
      },
      status: ResponseStatus.error,
      type: 'response',
    }
    const fakeErroringWebSocketClientResponses = new FakeWebSocketNetworkClientResponses(
      FakeWebSocketNetworkClientResponses.defaultSubscribeResponse(),
      accountNotFoundResponse,
    )
    const fakeErroringWebSocketClient = new FakeWebSocketNetworkClient(
      fakeErroringWebSocketClientResponses,
    )
    const issuedCurrencyClient = new IssuedCurrencyClient(
      fakeSucceedingGrpcClient,
      fakeErroringWebSocketClient,
      XrplNetwork.Test,
    )
    // WHEN getTrustLines is called THEN an error is thrown.
    try {
      await issuedCurrencyClient.getTrustLines(testAddress)
    } catch (error) {
      assert.typeOf(error, 'Error')
    }
  })

  it('getTrustLines - invalid params error response', async function (): Promise<void> {
    // GIVEN an IssuedCurrencyClient with faked networking that will return an error response for getAccountLines
    const invalidParamsResponse: AccountLinesResponse = {
      error: 'invalidParams',
      error_code: 31,
      error_message: "Missing field 'account'.",
      id: 'account_lines_r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59',
      request: {
        account: 'r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59',
        command: RippledMethod.accountLines,
        id: 'account_lines_r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59',
        ledger_index: 'validated',
      },
      status: ResponseStatus.error,
      type: 'response',
    }
    const fakeErroringWebSocketClientResponses = new FakeWebSocketNetworkClientResponses(
      FakeWebSocketNetworkClientResponses.defaultSubscribeResponse(),
      invalidParamsResponse,
    )
    const fakeErroringWebSocketClient = new FakeWebSocketNetworkClient(
      fakeErroringWebSocketClientResponses,
    )
    const issuedCurrencyClient = new IssuedCurrencyClient(
      fakeSucceedingGrpcClient,
      fakeErroringWebSocketClient,
      XrplNetwork.Test,
    )
    // WHEN getTrustLines is called THEN an error is thrown.
    try {
      await issuedCurrencyClient.getTrustLines(testAddress)
    } catch (error) {
      assert.typeOf(error, 'Error')
    }
  })

  it('requireAuthorizedTrustlines - successful response', async function (): Promise<void> {
    // GIVEN an IssuedCurrencyClient with mocked networking that will return a successful hash for submitTransaction
    const issuedCurrencyClient = new IssuedCurrencyClient(
      fakeSucceedingGrpcClient,
      fakeSucceedingWebSocketClient,
      XrplNetwork.Test,
    )

    // WHEN requireAuthorizedTrustlines is called
    const result = await issuedCurrencyClient.requireAuthorizedTrustlines(
      this.wallet,
    )
    const transactionHash = result.hash

    // THEN a transaction hash exists and is the expected hash
    const expectedTransactionHash = Utils.toHex(
      FakeXRPNetworkClientResponses.defaultSubmitTransactionResponse().getHash_asU8(),
    )

    assert.exists(transactionHash)
    assert.strictEqual(transactionHash, expectedTransactionHash)
  })

  it('requireAuthorizedTrustlines - submission failure', function (): void {
    // GIVEN an IssuedCurrencyClient which will fail to submit a transaction.
    const failureResponses = new FakeXRPNetworkClientResponses(
      FakeXRPNetworkClientResponses.defaultAccountInfoResponse(),
      FakeXRPNetworkClientResponses.defaultFeeResponse(),
      FakeXRPNetworkClientResponses.defaultError,
    )
    const failingNetworkClient = new FakeXRPNetworkClient(failureResponses)
    const issuedCurrencyClient = new IssuedCurrencyClient(
      failingNetworkClient,
      fakeSucceedingWebSocketClient,
      XrplNetwork.Test,
    )

    // WHEN requireAuthorizedTrustlines is attempted THEN an error is propagated.
    issuedCurrencyClient
      .requireAuthorizedTrustlines(this.wallet)
      .catch((error) => {
        assert.deepEqual(error, FakeXRPNetworkClientResponses.defaultError)
      })
  })

  it('allowUnauthorizedTrustlines - successful response', async function (): Promise<void> {
    // GIVEN an IssuedCurrencyClient with mocked networking that will return a successful hash for submitTransaction
    const issuedCurrencyClient = new IssuedCurrencyClient(
      fakeSucceedingGrpcClient,
      fakeSucceedingWebSocketClient,
      XrplNetwork.Test,
    )

    // WHEN allowUnauthorizedTrustlines is called
    const result = await issuedCurrencyClient.allowUnauthorizedTrustlines(
      this.wallet,
    )
    const transactionHash = result.hash

    // THEN a transaction hash exists and is the expected hash
    const expectedTransactionHash = Utils.toHex(
      FakeXRPNetworkClientResponses.defaultSubmitTransactionResponse().getHash_asU8(),
    )

    assert.exists(transactionHash)
    assert.strictEqual(transactionHash, expectedTransactionHash)
  })

  it('allowUnauthorizedTrustlines - submission failure', function (): void {
    // GIVEN an IssuedCurrencyClient which will fail to submit a transaction.
    const failureResponses = new FakeXRPNetworkClientResponses(
      FakeXRPNetworkClientResponses.defaultAccountInfoResponse(),
      FakeXRPNetworkClientResponses.defaultFeeResponse(),
      FakeXRPNetworkClientResponses.defaultError,
    )
    const failingNetworkClient = new FakeXRPNetworkClient(failureResponses)
    const issuedCurrencyClient = new IssuedCurrencyClient(
      failingNetworkClient,
      fakeSucceedingWebSocketClient,
      XrplNetwork.Test,
    )

    // WHEN allowUnauthorizedTrustlines is attempted THEN an error is propagated.
    issuedCurrencyClient
      .requireAuthorizedTrustlines(this.wallet)
      .catch((error) => {
        assert.deepEqual(error, FakeXRPNetworkClientResponses.defaultError)
      })
  })

  it('enableRippling - successful response', async function (): Promise<void> {
    // GIVEN an IssuedCurrencyClient with mocked networking that will return a successful hash for submitTransaction
    const issuedCurrencyClient = new IssuedCurrencyClient(
      fakeSucceedingGrpcClient,
      fakeSucceedingWebSocketClient,
      XrplNetwork.Test,
    )

    // WHEN enableRippling is called
    const result = await issuedCurrencyClient.enableRippling(this.wallet)
    const transactionHash = result.hash

    // THEN a transaction hash exists and is the expected hash
    const expectedTransactionHash = Utils.toHex(
      FakeXRPNetworkClientResponses.defaultSubmitTransactionResponse().getHash_asU8(),
    )

    assert.exists(transactionHash)
    assert.strictEqual(transactionHash, expectedTransactionHash)
  })

  it('enableRippling - submission failure', function (): void {
    // GIVEN an IssuedCurrencyClient which will fail to submit a transaction.
    const failureResponses = new FakeXRPNetworkClientResponses(
      FakeXRPNetworkClientResponses.defaultAccountInfoResponse(),
      FakeXRPNetworkClientResponses.defaultFeeResponse(),
      FakeXRPNetworkClientResponses.defaultError,
    )
    const failingNetworkClient = new FakeXRPNetworkClient(failureResponses)
    const issuedCurrencyClient = new IssuedCurrencyClient(
      failingNetworkClient,
      fakeSucceedingWebSocketClient,
      XrplNetwork.Test,
    )

    // WHEN enableRippling is attempted THEN an error is propagated.
    issuedCurrencyClient.enableRippling(this.wallet).catch((error) => {
      assert.deepEqual(error, FakeXRPNetworkClientResponses.defaultError)
    })
  })

  it('disallowIncomingXrp - successful response', async function (): Promise<void> {
    // GIVEN an IssuedCurrencyClient with mocked networking that will return a successful hash for submitTransaction
    const issuedCurrencyClient = new IssuedCurrencyClient(
      fakeSucceedingGrpcClient,
      fakeSucceedingWebSocketClient,
      XrplNetwork.Test,
    )

    // WHEN disallowIncomingXrp is called
    const result = await issuedCurrencyClient.disallowIncomingXrp(this.wallet)
    const transactionHash = result.hash

    // THEN a transaction hash exists and is the expected hash
    const expectedTransactionHash = Utils.toHex(
      FakeXRPNetworkClientResponses.defaultSubmitTransactionResponse().getHash_asU8(),
    )

    assert.exists(transactionHash)
    assert.strictEqual(transactionHash, expectedTransactionHash)
  })

  it('disallowIncomingXrp - submission failure', function (): void {
    // GIVEN an IssuedCurrencyClient which will fail to submit a transaction.
    const failureResponses = new FakeXRPNetworkClientResponses(
      FakeXRPNetworkClientResponses.defaultAccountInfoResponse(),
      FakeXRPNetworkClientResponses.defaultFeeResponse(),
      FakeXRPNetworkClientResponses.defaultError,
    )
    const failingNetworkClient = new FakeXRPNetworkClient(failureResponses)
    const issuedCurrencyClient = new IssuedCurrencyClient(
      failingNetworkClient,
      fakeSucceedingWebSocketClient,
      XrplNetwork.Test,
    )

    // WHEN disallowIncomingXrp is attempted THEN an error is propagated.
    issuedCurrencyClient.disallowIncomingXrp(this.wallet).catch((error) => {
      assert.deepEqual(error, FakeXRPNetworkClientResponses.defaultError)
    })
  })

  it('allowIncomingXrp - successful response', async function (): Promise<void> {
    // GIVEN an IssuedCurrencyClient with mocked networking that will return a successful hash for submitTransaction
    const issuedCurrencyClient = new IssuedCurrencyClient(
      fakeSucceedingGrpcClient,
      fakeSucceedingWebSocketClient,
      XrplNetwork.Test,
    )

    // WHEN allowIncomingXrp is called
    const result = await issuedCurrencyClient.allowIncomingXrp(this.wallet)
    const transactionHash = result.hash

    // THEN a transaction hash exists and is the expected hash
    const expectedTransactionHash = Utils.toHex(
      FakeXRPNetworkClientResponses.defaultSubmitTransactionResponse().getHash_asU8(),
    )

    assert.exists(transactionHash)
    assert.strictEqual(transactionHash, expectedTransactionHash)
  })

  it('allowIncomingXrp - submission failure', function (): void {
    // GIVEN an IssuedCurrencyClient which will fail to submit a transaction.
    const failureResponses = new FakeXRPNetworkClientResponses(
      FakeXRPNetworkClientResponses.defaultAccountInfoResponse(),
      FakeXRPNetworkClientResponses.defaultFeeResponse(),
      FakeXRPNetworkClientResponses.defaultError,
    )
    const failingNetworkClient = new FakeXRPNetworkClient(failureResponses)
    const issuedCurrencyClient = new IssuedCurrencyClient(
      failingNetworkClient,
      fakeSucceedingWebSocketClient,
      XrplNetwork.Test,
    )

    // WHEN allowIncomingXrp is attempted THEN an error is propagated.
    issuedCurrencyClient.allowIncomingXrp(this.wallet).catch((error) => {
      assert.deepEqual(error, FakeXRPNetworkClientResponses.defaultError)
    })
  })

  it('getGatewayBalances - successful response', async function (): Promise<void> {
    // GIVEN an IssuedCurrencyClient with faked networking that will return successful responses.
    const issuedCurrencyClient = new IssuedCurrencyClient(
      fakeSucceedingGrpcClient,
      fakeSucceedingWebSocketClient,
      XrplNetwork.Test,
    )

    // WHEN getBalances is called
    const gatewayBalances = await issuedCurrencyClient.getGatewayBalances(
      testAddress,
    )
    const expectedGatewayBalances: GatewayBalances = gatewayBalancesFromResponse(
      (await fakeSucceedingWebSocketClient.getGatewayBalances(
        testAddress,
      )) as GatewayBalancesSuccessfulResponse,
    )

    // THEN the result is as expected
    assert.deepEqual(gatewayBalances, expectedGatewayBalances)
  })

  it('getGatewayBalances - invalid account', async function (): Promise<void> {
    // GIVEN an IssuedCurrencyClient
    const issuedCurrencyClient = new IssuedCurrencyClient(
      fakeSucceedingGrpcClient,
      fakeSucceedingWebSocketClient,
      XrplNetwork.Test,
    )

    // WHEN getGatewayBalances is called with a classic address (no X-address) THEN an error is propagated.
    const classicAddress = 'rhhh49pFH96roGyuC4E5P4CHaNjS1k8gzM'
    try {
      await issuedCurrencyClient.getGatewayBalances(classicAddress)
    } catch (error) {
      assert.typeOf(error, 'Error')
      assert.equal(error, XrpError.xAddressRequired)
    }
  })

  it('getGatewayBalances - invalid addressToExclude, single address', async function (): Promise<void> {
    // GIVEN an IssuedCurrencyClient
    const issuedCurrencyClient = new IssuedCurrencyClient(
      fakeSucceedingGrpcClient,
      fakeSucceedingWebSocketClient,
      XrplNetwork.Test,
    )

    // WHEN getGatewayBalances is called with a classic addressToExclude (no X-address) THEN an error is propagated.
    const classicAddress = 'rhhh49pFH96roGyuC4E5P4CHaNjS1k8gzM'
    try {
      await issuedCurrencyClient.getGatewayBalances(testAddress, [
        classicAddress,
      ])
    } catch (error) {
      assert.typeOf(error, 'Error')
      assert.equal(error, XrpError.xAddressRequired)
    }
  })

  it('getGatewayBalances - invalid addressToExclude, multiple addresses', async function (): Promise<void> {
    // GIVEN an IssuedCurrencyClient
    const issuedCurrencyClient = new IssuedCurrencyClient(
      fakeSucceedingGrpcClient,
      fakeSucceedingWebSocketClient,
      XrplNetwork.Test,
    )

    // WHEN getGatewayBalances is called with classic addresses to exclude (no X-address) THEN an error is propagated.
    const classicAddress1 = 'rhhh49pFH96roGyuC4E5P4CHaNjS1k8gzM'
    const classicAddress2 = 'r4DymtkgUAh2wqRxVfdd3Xtswzim6eC6c5'
    try {
      await issuedCurrencyClient.getGatewayBalances(testAddress, [
        classicAddress1,
        classicAddress2,
      ])
    } catch (error) {
      assert.typeOf(error, 'Error')
      assert.equal(error, XrpError.xAddressRequired)
    }
  })

  it('getGatewayBalances - account not found error response', async function (): Promise<void> {
    // GIVEN an IssuedCurrencyClient with faked networking that will return an error response for getGatewayBalances
    const accountNotFoundResponse: GatewayBalancesResponse = {
      error: 'actNotFound',
      error_code: 19,
      error_message: 'Account not found.',
      id: 'gateway_balances_X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH',
      request: {
        account: 'X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH',
        command: RippledMethod.gatewayBalances,
        hotwallet: [
          'rKm4uWpg9tfwbVSeATv4KxDe6mpE9yPkgJ',
          'ra7JkEzrgeKHdzKgo4EUUVBnxggY4z37kt',
        ],
        id: 'gateway_balances_X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH',
        ledger_index: 'validated',
        strict: true,
      },
      status: ResponseStatus.error,
      type: 'response',
    }
    const fakeErroringWebSocketClientResponses = new FakeWebSocketNetworkClientResponses(
      FakeWebSocketNetworkClientResponses.defaultSubscribeResponse(),
      FakeWebSocketNetworkClientResponses.defaultGetAccountLinesResponse(),
      accountNotFoundResponse,
    )
    const fakeErroringWebSocketClient = new FakeWebSocketNetworkClient(
      fakeErroringWebSocketClientResponses,
    )
    const issuedCurrencyClient = new IssuedCurrencyClient(
      fakeSucceedingGrpcClient,
      fakeErroringWebSocketClient,
      XrplNetwork.Test,
    )
    // WHEN getGatewayBalances is called THEN an error is propagated.
    try {
      await issuedCurrencyClient.getGatewayBalances(testAddress)
    } catch (error) {
      assert.typeOf(error, 'Error')
      assert.equal(error, XrpError.accountNotFound)
    }
  })

  it('requireDestinationTags - successful response', async function (): Promise<void> {
    // GIVEN an IssuedCurrencyClient with mocked networking that will return a successful hash for submitTransaction
    const issuedCurrencyClient = new IssuedCurrencyClient(
      fakeSucceedingGrpcClient,
      fakeSucceedingWebSocketClient,
      XrplNetwork.Test,
    )
    // WHEN requireDestinationTags is called
    const result = await issuedCurrencyClient.requireDestinationTags(
      this.wallet,
    )
    const transactionHash = result.hash

    // THEN a transaction hash exists and is the expected hash
    const expectedTransactionHash = Utils.toHex(
      FakeXRPNetworkClientResponses.defaultSubmitTransactionResponse().getHash_asU8(),
    )

    assert.exists(transactionHash)
    assert.strictEqual(transactionHash, expectedTransactionHash)
  })

  it('requireDestinationTags - submission failure', function (): void {
    // GIVEN an IssuedCurrencyClient which will fail to submit a transaction.
    const failureResponses = new FakeXRPNetworkClientResponses(
      FakeXRPNetworkClientResponses.defaultAccountInfoResponse(),
      FakeXRPNetworkClientResponses.defaultFeeResponse(),
      FakeXRPNetworkClientResponses.defaultError,
    )
    const failingNetworkClient = new FakeXRPNetworkClient(failureResponses)
    const issuedCurrencyClient = new IssuedCurrencyClient(
      failingNetworkClient,
      fakeSucceedingWebSocketClient,
      XrplNetwork.Test,
    )

    // WHEN requireDestinationTags is attempted THEN an error is propagated.
    issuedCurrencyClient.requireDestinationTags(this.wallet).catch((error) => {
      assert.deepEqual(error, FakeXRPNetworkClientResponses.defaultError)
    })
  })

  it('allowNoDestinationTag - successful response', async function (): Promise<void> {
    // GIVEN an IssuedCurrencyClient with mocked networking that will return a successful hash for submitTransaction
    const issuedCurrencyClient = new IssuedCurrencyClient(
      fakeSucceedingGrpcClient,
      fakeSucceedingWebSocketClient,
      XrplNetwork.Test,
    )

    // WHEN allowNoDestinationTag is called
    const result = await issuedCurrencyClient.allowNoDestinationTag(this.wallet)
    const transactionHash = result.hash

    // THEN a transaction hash exists and is the expected hash
    const expectedTransactionHash = Utils.toHex(
      FakeXRPNetworkClientResponses.defaultSubmitTransactionResponse().getHash_asU8(),
    )

    assert.exists(transactionHash)
    assert.strictEqual(transactionHash, expectedTransactionHash)
  })

  it('allowNoDestinationTag - submission failure', function (): void {
    // GIVEN an IssuedCurrencyClient which will fail to submit a transaction.
    const failureResponses = new FakeXRPNetworkClientResponses(
      FakeXRPNetworkClientResponses.defaultAccountInfoResponse(),
      FakeXRPNetworkClientResponses.defaultFeeResponse(),
      FakeXRPNetworkClientResponses.defaultError,
    )
    const failingNetworkClient = new FakeXRPNetworkClient(failureResponses)
    const issuedCurrencyClient = new IssuedCurrencyClient(
      failingNetworkClient,
      fakeSucceedingWebSocketClient,
      XrplNetwork.Test,
    )

    // WHEN allowNoDestinationTag is attempted THEN an error is propagated.
    issuedCurrencyClient.allowNoDestinationTag(this.wallet).catch((error) => {
      assert.deepEqual(error, FakeXRPNetworkClientResponses.defaultError)
    })
  })

  it('getTransferFee - successful response', async function (): Promise<void> {
    // GIVEN an IssuedCurrencyClient with mocked networking that will successfully return information from a `getAccountInfo` call
    const issuedCurrencyClient = new IssuedCurrencyClient(
      fakeSucceedingGrpcClient,
      fakeSucceedingWebSocketClient,
      XrplNetwork.Test,
    )

    const expectedTransferFee = 1000000012

    // WHEN getTransferFee is called
    const transferFee = await issuedCurrencyClient.getTransferFee(
      this.wallet.getAddress(),
    )

    // THEN the expected transfer rate value is returned.
    assert.exists(transferFee)
    assert.equal(transferFee, expectedTransferFee)
  })

  it('getTransferFee - bad address', function (): void {
    // GIVEN an IssuedCurrencyClient with mocked networking that will succeed
    const issuedCurrencyClient = new IssuedCurrencyClient(
      fakeSucceedingGrpcClient,
      fakeSucceedingWebSocketClient,
      XrplNetwork.Test,
    )

    const badAddress = 'badAddress'

    // WHEN getTransferFee is attempted THEN an error is propagated.
    issuedCurrencyClient.getTransferFee(badAddress).catch((error) => {
      assert.deepEqual(error, XrpError.xAddressRequired)
    })
  })

  it('getTransferFee - submission failure', function (): void {
    // GIVEN an IssuedCurrencyClient with mocked networking that will fail to make a `getAccountInfo` request
    const failureResponses = new FakeXRPNetworkClientResponses(
      FakeXRPNetworkClientResponses.defaultAccountInfoResponse(),
      FakeXRPNetworkClientResponses.defaultFeeResponse(),
      FakeXRPNetworkClientResponses.defaultError,
    )
    const failingNetworkClient = new FakeXRPNetworkClient(failureResponses)
    const issuedCurrencyClient = new IssuedCurrencyClient(
      failingNetworkClient,
      fakeSucceedingWebSocketClient,
      XrplNetwork.Test,
    )

    // WHEN getTransferFee is attempted THEN an error is propagated.
    issuedCurrencyClient
      .getTransferFee(this.wallet.getAddress())
      .catch((error) => {
        assert.deepEqual(error, FakeXRPNetworkClientResponses.defaultError)
      })
  })

  it('setTransferFee - successful response', async function (): Promise<void> {
    // GIVEN an IssuedCurrencyClient with mocked networking that will return a successful hash for submitTransaction
    const issuedCurrencyClient = new IssuedCurrencyClient(
      fakeSucceedingGrpcClient,
      fakeSucceedingWebSocketClient,
      XrplNetwork.Test,
    )

    const transferFee = 1000000012

    // WHEN setTransferFee is called
    const result = await issuedCurrencyClient.setTransferFee(
      this.wallet,
      transferFee,
    )
    const transactionHash = result.hash

    // THEN a transaction hash exists and is the expected hash
    const expectedTransactionHash = Utils.toHex(
      FakeXRPNetworkClientResponses.defaultSubmitTransactionResponse().getHash_asU8(),
    )

    assert.exists(transactionHash)
    assert.strictEqual(transactionHash, expectedTransactionHash)
  })

  it('setTransferFee - submission failure', function (): void {
    // GIVEN an IssuedCurrencyClient which will fail to submit a transaction.
    const failureResponses = new FakeXRPNetworkClientResponses(
      FakeXRPNetworkClientResponses.defaultAccountInfoResponse(),
      FakeXRPNetworkClientResponses.defaultFeeResponse(),
      FakeXRPNetworkClientResponses.defaultError,
    )
    const failingNetworkClient = new FakeXRPNetworkClient(failureResponses)
    const issuedCurrencyClient = new IssuedCurrencyClient(
      failingNetworkClient,
      fakeSucceedingWebSocketClient,
      XrplNetwork.Test,
    )

    const transferFee = 1000000012

    // WHEN setTransferFee is attempted THEN an error is propagated.
    issuedCurrencyClient
      .setTransferFee(this.wallet, transferFee)
      .catch((error) => {
        assert.deepEqual(error, FakeXRPNetworkClientResponses.defaultError)
      })
  })

  it('enableGlobalFreeze - successful response', async function (): Promise<void> {
    // GIVEN an IssuedCurrencyClient with mocked networking that will return a successful hash for submitTransaction
    const issuedCurrencyClient = new IssuedCurrencyClient(
      fakeSucceedingGrpcClient,
      fakeSucceedingWebSocketClient,
      XrplNetwork.Test,
    )

    // WHEN enableGlobalFreeze is called
    const result = await issuedCurrencyClient.enableGlobalFreeze(this.wallet)
    const transactionHash = result.hash

    // THEN a transaction hash exists and is the expected hash
    const expectedTransactionHash = Utils.toHex(
      FakeXRPNetworkClientResponses.defaultSubmitTransactionResponse().getHash_asU8(),
    )

    assert.exists(transactionHash)
    assert.strictEqual(transactionHash, expectedTransactionHash)
  })

  it('enableGlobalFreeze - submission failure', function (): void {
    // GIVEN an IssuedCurrencyClient which will fail to submit a transaction.
    const failureResponses = new FakeXRPNetworkClientResponses(
      FakeXRPNetworkClientResponses.defaultAccountInfoResponse(),
      FakeXRPNetworkClientResponses.defaultFeeResponse(),
      FakeXRPNetworkClientResponses.defaultError,
    )
    const failingNetworkClient = new FakeXRPNetworkClient(failureResponses)
    const issuedCurrencyClient = new IssuedCurrencyClient(
      failingNetworkClient,
      fakeSucceedingWebSocketClient,
      XrplNetwork.Test,
    )

    // WHEN enableGlobalFreeze is attempted THEN an error is propagated.
    issuedCurrencyClient.enableGlobalFreeze(this.wallet).catch((error) => {
      assert.deepEqual(error, FakeXRPNetworkClientResponses.defaultError)
    })
  })

  it('disableGlobalFreeze - successful response', async function (): Promise<void> {
    // GIVEN an IssuedCurrencyClient with mocked networking that will return a successful hash for submitTransaction
    const issuedCurrencyClient = new IssuedCurrencyClient(
      fakeSucceedingGrpcClient,
      fakeSucceedingWebSocketClient,
      XrplNetwork.Test,
    )

    // WHEN disableGlobalFreeze is called
    const result = await issuedCurrencyClient.disableGlobalFreeze(this.wallet)
    const transactionHash = result.hash

    // THEN a transaction hash exists and is the expected hash
    const expectedTransactionHash = Utils.toHex(
      FakeXRPNetworkClientResponses.defaultSubmitTransactionResponse().getHash_asU8(),
    )

    assert.exists(transactionHash)
    assert.strictEqual(transactionHash, expectedTransactionHash)
  })

  it('disableGlobalFreeze - submission failure', function (): void {
    // GIVEN an IssuedCurrencyClient which will fail to submit a transaction.
    const failureResponses = new FakeXRPNetworkClientResponses(
      FakeXRPNetworkClientResponses.defaultAccountInfoResponse(),
      FakeXRPNetworkClientResponses.defaultFeeResponse(),
      FakeXRPNetworkClientResponses.defaultError,
    )
    const failingNetworkClient = new FakeXRPNetworkClient(failureResponses)
    const issuedCurrencyClient = new IssuedCurrencyClient(
      failingNetworkClient,
      fakeSucceedingWebSocketClient,
      XrplNetwork.Test,
    )

    // WHEN disableGlobalFreeze is attempted THEN an error is propagated.
    issuedCurrencyClient.disableGlobalFreeze(this.wallet).catch((error) => {
      assert.deepEqual(error, FakeXRPNetworkClientResponses.defaultError)
    })
  })

  it('enableNoFreeze - successful response', async function (): Promise<void> {
    // GIVEN an IssuedCurrencyClient with mocked networking that will return a successful hash for submitTransaction
    const issuedCurrencyClient = new IssuedCurrencyClient(
      fakeSucceedingGrpcClient,
      fakeSucceedingWebSocketClient,
      XrplNetwork.Test,
    )

    // WHEN enableNoFreeze is called
    const result = await issuedCurrencyClient.enableNoFreeze(this.wallet)
    const transactionHash = result.hash

    // THEN a transaction hash exists and is the expected hash
    const expectedTransactionHash = Utils.toHex(
      FakeXRPNetworkClientResponses.defaultSubmitTransactionResponse().getHash_asU8(),
    )

    assert.exists(transactionHash)
    assert.strictEqual(transactionHash, expectedTransactionHash)
  })

  it('enableNoFreeze - submission failure', function (): void {
    // GIVEN an IssuedCurrencyClient which will fail to submit a transaction.
    const failureResponses = new FakeXRPNetworkClientResponses(
      FakeXRPNetworkClientResponses.defaultAccountInfoResponse(),
      FakeXRPNetworkClientResponses.defaultFeeResponse(),
      FakeXRPNetworkClientResponses.defaultError,
    )
    const failingNetworkClient = new FakeXRPNetworkClient(failureResponses)
    const issuedCurrencyClient = new IssuedCurrencyClient(
      failingNetworkClient,
      fakeSucceedingWebSocketClient,
      XrplNetwork.Test,
    )

    // WHEN enableNoFreeze is attempted THEN an error is propagated.
    issuedCurrencyClient.enableNoFreeze(this.wallet).catch((error) => {
      assert.deepEqual(error, FakeXRPNetworkClientResponses.defaultError)
    })
  })

  it('issuedCurrencyPayment - success', async function (): Promise<void> {
    // GIVEN an IssuedCurrencyClient with mocked networking that will return a successful hash for submitTransaction
    const issuedCurrencyClient = new IssuedCurrencyClient(
      fakeSucceedingGrpcClient,
      fakeSucceedingWebSocketClient,
      XrplNetwork.Test,
    )

    const issuedCurrency: IssuedCurrency = {
      currency: 'FOO',
      issuer: testAddress,
      value: '100',
    }

    // WHEN issuedCurrencyPayment is called
    const transactionResult = await issuedCurrencyClient.issuedCurrencyPayment(
      this.wallet,
      testAddress,
      issuedCurrency,
      0.5,
    )

    // THEN the result is a transaction result with the expected hash
    const expectedTransactionHash = Utils.toHex(
      FakeXRPNetworkClientResponses.defaultSubmitTransactionResponse().getHash_asU8(),
    )

    assert.exists(transactionResult)
    assert.equal(transactionResult.hash, expectedTransactionHash)
  })

  it('issuedCurrencyPayment - submission failure', async function (): Promise<void> {
    // GIVEN an IssuedCurrencyClient which will fail to submit a transaction.
    const failureResponses = new FakeXRPNetworkClientResponses(
      FakeXRPNetworkClientResponses.defaultAccountInfoResponse(),
      FakeXRPNetworkClientResponses.defaultFeeResponse(),
      FakeXRPNetworkClientResponses.defaultError,
    )
    const failingNetworkClient = new FakeXRPNetworkClient(failureResponses)
    const issuedCurrencyClient = new IssuedCurrencyClient(
      failingNetworkClient,
      fakeSucceedingWebSocketClient,
      XrplNetwork.Test,
    )

    const issuedCurrency: IssuedCurrency = {
      currency: 'FOO',
      issuer: testAddress,
      value: '100',
    }

    // WHEN issuedCurrencyPayment is called THEN an error is propagated.
    try {
      await issuedCurrencyClient.issuedCurrencyPayment(
        this.wallet,
        testAddress,
        issuedCurrency,
        0.5,
      )
    } catch (error) {
      assert.equal(error, FakeXRPNetworkClientResponses.defaultError)
    }
  })

  it('issuedCurrencyPayment - classic destination address', async function (): Promise<void> {
    // GIVEN an IssuedCurrencyClient with mocked networking that will return a successful hash for submitTransaction
    const issuedCurrencyClient = new IssuedCurrencyClient(
      fakeSucceedingGrpcClient,
      fakeSucceedingWebSocketClient,
      XrplNetwork.Test,
    )

    const issuedCurrency: IssuedCurrency = {
      currency: 'FOO',
      issuer: testAddress,
      value: '100',
    }

    // WHEN issuedCurrencyPayment is called with a classic address argument for destination THEN an error is thrown.
    try {
      await issuedCurrencyClient.issuedCurrencyPayment(
        this.wallet,
        testClassicAddress,
        issuedCurrency,
        0.5,
      )
    } catch (error) {
      assert.equal(error.errorType, XrpErrorType.XAddressRequired)
    }
  })

  it('issuedCurrencyPayment - classic issuer address', async function (): Promise<void> {
    // GIVEN an IssuedCurrencyClient with mocked networking that will return a successful hash for submitTransaction
    const issuedCurrencyClient = new IssuedCurrencyClient(
      fakeSucceedingGrpcClient,
      fakeSucceedingWebSocketClient,
      XrplNetwork.Test,
    )

    const issuedCurrency: IssuedCurrency = {
      currency: 'FOO',
      issuer: testClassicAddress,
      value: '100',
    }

    // WHEN issuedCurrencyPayment is called with a classic address argument for issuer THEN an error is thrown.
    try {
      await issuedCurrencyClient.issuedCurrencyPayment(
        this.wallet,
        testAddress,
        issuedCurrency,
        0.5,
      )
    } catch (error) {
      assert.equal(error.errorType, XrpErrorType.XAddressRequired)
    }
  })

  it('sendIssuedCurrencyPayment - errors with matching sender and issuer', async function (): Promise<void> {
    // GIVEN an IssuedCurrencyClient with mocked networking that will return a successful hash for submitTransaction
    const issuedCurrencyClient = new IssuedCurrencyClient(
      fakeSucceedingGrpcClient,
      fakeSucceedingWebSocketClient,
      XrplNetwork.Test,
    )

    const issuedCurrency: IssuedCurrency = {
      currency: 'FOO',
      issuer: this.wallet.getAddress(),
      value: '100',
    }

    // WHEN sendIssuedCurrencyPayment is called with matching sender and issuer addresses, THEN an error is thrown.
    try {
      await issuedCurrencyClient.sendIssuedCurrencyPayment(
        this.wallet,
        testAddress,
        issuedCurrency,
        0.5,
      )
    } catch (error) {
      assert.equal(error.errorType, XrpErrorType.InvalidInput)
    }
  })

  it('sendIssuedCurrencyPayment - errors with matching destination and issuer', async function (): Promise<void> {
    // GIVEN an IssuedCurrencyClient with mocked networking that will return a successful hash for submitTransaction
    const issuedCurrencyClient = new IssuedCurrencyClient(
      fakeSucceedingGrpcClient,
      fakeSucceedingWebSocketClient,
      XrplNetwork.Test,
    )

    const issuedCurrency: IssuedCurrency = {
      currency: 'FOO',
      issuer: testAddress,
      value: '100',
    }

    // WHEN sendIssuedCurrencyPayment is called with matching sender and issuer addresses, THEN an error is thrown.
    try {
      await issuedCurrencyClient.sendIssuedCurrencyPayment(
        this.wallet,
        testAddress,
        issuedCurrency,
        0.5,
      )
    } catch (error) {
      assert.equal(error.errorType, XrpErrorType.InvalidInput)
    }
  })

  it('monitorAccountTransactions - successful response', async function (): Promise<void> {
    // GIVEN an IssuedCurrencyClient.
    const issuedCurrencyClient = new IssuedCurrencyClient(
      fakeSucceedingGrpcClient,
      fakeSucceedingWebSocketClient,
      XrplNetwork.Test,
    )

    const callback = (_data: WebSocketResponse) => {
      return
    }

    // WHEN monitorAccountTransactions is called
    const monitorResponse = await issuedCurrencyClient.monitorAccountTransactions(
      testAddress,
      callback,
    )

    // THEN the result is as expected
    assert.isTrue(monitorResponse)
  })

  it('monitorAccountTransactions - submission failure', function (): void {
    // GIVEN an IssuedCurrencyClient which will fail to submit a transaction.
    const failureResponses = new FakeWebSocketNetworkClientResponses(
      FakeWebSocketNetworkClientResponses.defaultError,
    )

    const callback = (_data: WebSocketResponse) => {
      return
    }

    const failingWebSocketClient = new FakeWebSocketNetworkClient(
      failureResponses,
    )
    const issuedCurrencyClient = new IssuedCurrencyClient(
      fakeSucceedingGrpcClient,
      failingWebSocketClient,
      XrplNetwork.Test,
    )

    // WHEN monitorAccountTransactions is attempted THEN an error is propagated.
    issuedCurrencyClient
      .monitorAccountTransactions(testAddress, callback)
      .catch((error) => {
        assert.deepEqual(
          error,
          FakeWebSocketNetworkClientResponses.defaultError,
        )
      })
  })

  it('stopMonitoringAccountTransactions - successful response', async function (): Promise<void> {
    // GIVEN an IssuedCurrencyClient.
    const issuedCurrencyClient = new IssuedCurrencyClient(
      fakeSucceedingGrpcClient,
      fakeSucceedingWebSocketClient,
      XrplNetwork.Test,
    )

    // WHEN stopMonitoringAccountTransactions is called
    const monitorResponse = await issuedCurrencyClient.stopMonitoringAccountTransactions(
      testAddress,
    )

    // THEN the result is as expected
    assert.isTrue(monitorResponse)
  })

  it('stopMonitoringAccountTransactions - submission failure', function (): void {
    // GIVEN an IssuedCurrencyClient which will fail to submit a transaction.
    const failureResponses = new FakeWebSocketNetworkClientResponses(
      FakeWebSocketNetworkClientResponses.defaultError,
    )
    const failingWebSocketClient = new FakeWebSocketNetworkClient(
      failureResponses,
    )
    const issuedCurrencyClient = new IssuedCurrencyClient(
      fakeSucceedingGrpcClient,
      failingWebSocketClient,
      XrplNetwork.Test,
    )

    // WHEN stopMonitoringAccountTransactions is attempted THEN an error is propagated.
    issuedCurrencyClient
      .stopMonitoringAccountTransactions(testAddress)
      .catch((error) => {
        assert.deepEqual(
          error,
          FakeWebSocketNetworkClientResponses.defaultError,
        )
      })
  })

  it('calculateSendMaxValue - negative transferFee throws', function (): void {
    const issuedCurrencyClient = new IssuedCurrencyClient(
      fakeSucceedingGrpcClient,
      fakeSucceedingWebSocketClient,
      XrplNetwork.Test,
    )

    const amount = '1000'
    const transferFee = -0.05

    try {
      issuedCurrencyClient.calculateSendMaxValue(amount, transferFee)
    } catch (error) {
      assert.typeOf(error, 'Error')
      assert.equal(error.errorType, XrpErrorType.InvalidInput)
    }
  })

  it('calculateSendMaxValue - zero transferFee equals amount', function (): void {
    const issuedCurrencyClient = new IssuedCurrencyClient(
      fakeSucceedingGrpcClient,
      fakeSucceedingWebSocketClient,
      XrplNetwork.Test,
    )

    const amount = '1000'
    const transferFee = 0

    const calculatedSendMaxValue = issuedCurrencyClient.calculateSendMaxValue(
      amount,
      transferFee,
    )
    const expectedSendMaxValue = amount

    assert.equal(calculatedSendMaxValue, expectedSendMaxValue)
  })

  it('calculateSendMaxValue - simple value, no scientific notation', function (): void {
    const issuedCurrencyClient = new IssuedCurrencyClient(
      fakeSucceedingGrpcClient,
      fakeSucceedingWebSocketClient,
      XrplNetwork.Test,
    )

    const amount = '1000'
    const transferFee = 5

    const calculatedSendMaxValue = issuedCurrencyClient.calculateSendMaxValue(
      amount,
      transferFee,
    )
    const expectedSendMaxValue = '1050'

    assert.equal(calculatedSendMaxValue, expectedSendMaxValue)
  })

  it('calculateSendMaxValue - large value, precision overflow', function (): void {
    const issuedCurrencyClient = new IssuedCurrencyClient(
      fakeSucceedingGrpcClient,
      fakeSucceedingWebSocketClient,
      XrplNetwork.Test,
    )

    const amount = '1234567890123456'
    const transferFee = 5.43

    const calculatedSendMaxValue = issuedCurrencyClient.calculateSendMaxValue(
      amount,
      transferFee,
    )
    // Without rounding, expected value is: 1.3016049265571596608e15, 20 digits of precision (calculated on Wolfram Alpha)
    const expectedSendMaxValue = '1.30160492655716e15'

    assert.equal(calculatedSendMaxValue, expectedSendMaxValue)
  })

  it('calculateSendMaxValue - small value, precision overflow', function (): void {
    const issuedCurrencyClient = new IssuedCurrencyClient(
      fakeSucceedingGrpcClient,
      fakeSucceedingWebSocketClient,
      XrplNetwork.Test,
    )

    const amount = '0.00001234567890123456'
    const transferFee = 3.1

    const calculatedSendMaxValue = issuedCurrencyClient.calculateSendMaxValue(
      amount,
      transferFee,
    )

    // Without rounding, expected value is: 1.272839494717283e-5, 16 digits of precision (calculated on Wolfram Alpha)
    const expectedSendMaxValue = '1.27283949471729e-5'

    assert.equal(calculatedSendMaxValue, expectedSendMaxValue)
  })

  it('createOffer - success', async function (): Promise<void> {
    // GIVEN an IssuedCurrencyClient with mocked networking that will return a successful hash for submitTransaction
    const issuedCurrencyClient = new IssuedCurrencyClient(
      fakeSucceedingGrpcClient,
      fakeSucceedingWebSocketClient,
      XrplNetwork.Test,
    )

    // WHEN createOffer is called
    const takerGetsIssuedCurrency: IssuedCurrency = {
      issuer: testClassicAddress,
      currency: 'FAK',
      value: '100',
    }
    const takerPaysXrp = '50'
    const offerSequenceNumber = 1
    const expiration = 1946684800

    const transactionResult = await issuedCurrencyClient.createOffer(
      this.wallet,
      takerGetsIssuedCurrency,
      takerPaysXrp,
      offerSequenceNumber,
      expiration,
    )

    // THEN a transaction hash exists and is the expected hash
    const expectedTransactionHash = Utils.toHex(
      FakeXRPNetworkClientResponses.defaultSubmitTransactionResponse().getHash_asU8(),
    )
    assert.exists(transactionResult.hash)
    assert.strictEqual(transactionResult.hash, expectedTransactionHash)
  })

  it('createOffer - submission failure', async function (): Promise<void> {
    // GIVEN an IssuedCurrencyClient which will fail to submit a transaction.
    const failureResponses = new FakeXRPNetworkClientResponses(
      FakeXRPNetworkClientResponses.defaultAccountInfoResponse(),
      FakeXRPNetworkClientResponses.defaultFeeResponse(),
      FakeXRPNetworkClientResponses.defaultError,
    )
    const failingNetworkClient = new FakeXRPNetworkClient(failureResponses)
    const issuedCurrencyClient = new IssuedCurrencyClient(
      failingNetworkClient,
      fakeSucceedingWebSocketClient,
      XrplNetwork.Test,
    )

    // WHEN createOffer is called THEN an error is propagated.
    const takerGetsIssuedCurrency: IssuedCurrency = {
      issuer: testClassicAddress,
      currency: 'FAK',
      value: '100',
    }
    const takerPaysXrp = '50'
    const offerSequenceNumber = 1
    const expiration = 1946684800

    try {
      await issuedCurrencyClient.createOffer(
        this.wallet,
        takerGetsIssuedCurrency,
        takerPaysXrp,
        offerSequenceNumber,
        expiration,
      )
    } catch (error) {
      assert.equal(error, FakeXRPNetworkClientResponses.defaultError)
    }
  })

  it('cancelOffer - success', async function (): Promise<void> {
    // GIVEN an IssuedCurrencyClient with mocked networking that will return a successful hash for submitTransaction
    const issuedCurrencyClient = new IssuedCurrencyClient(
      fakeSucceedingGrpcClient,
      fakeSucceedingWebSocketClient,
      XrplNetwork.Test,
    )

    // WHEN cancelOffer is called
    const offerSequenceNumber = 1

    const transactionResult = await issuedCurrencyClient.cancelOffer(
      this.wallet,
      offerSequenceNumber,
    )

    // THEN a transaction hash exists and is the expected hash
    const expectedTransactionHash = Utils.toHex(
      FakeXRPNetworkClientResponses.defaultSubmitTransactionResponse().getHash_asU8(),
    )
    assert.exists(transactionResult.hash)
    assert.strictEqual(transactionResult.hash, expectedTransactionHash)
  })

  it('cancelOffer - submission failure', async function (): Promise<void> {
    // GIVEN an IssuedCurrencyClient which will fail to submit a transaction.
    const failureResponses = new FakeXRPNetworkClientResponses(
      FakeXRPNetworkClientResponses.defaultAccountInfoResponse(),
      FakeXRPNetworkClientResponses.defaultFeeResponse(),
      FakeXRPNetworkClientResponses.defaultError,
    )
    const failingNetworkClient = new FakeXRPNetworkClient(failureResponses)
    const issuedCurrencyClient = new IssuedCurrencyClient(
      failingNetworkClient,
      fakeSucceedingWebSocketClient,
      XrplNetwork.Test,
    )

    // WHEN cancelOffer is called THEN an error is propagated.
    const offerSequenceNumber = 1

    try {
      await issuedCurrencyClient.cancelOffer(this.wallet, offerSequenceNumber)
    } catch (error) {
      assert.equal(error, FakeXRPNetworkClientResponses.defaultError)
    }
  })
})
