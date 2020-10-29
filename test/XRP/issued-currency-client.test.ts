import { assert } from 'chai'

import { Utils, WalletFactory, XrplNetwork } from 'xpring-common-js'
import IssuedCurrencyClient from '../../src/XRP/issued-currency-client'
import {
  FakeXRPNetworkClient,
  FakeXRPNetworkClientResponses,
} from './fakes/fake-xrp-network-client'
import 'mocha'
import TrustLine from '../../src/XRP/shared/trustline'
import { XrpError } from '../../src/XRP'
import {
  FakeWebSocketNetworkClient,
  FakeWebSocketNetworkClientResponses,
} from './fakes/fake-web-socket-network-client'
import {
  WebSocketAccountLinesResponse,
  WebSocketAccountLinesSuccessfulResponse,
  WebSocketResponse,
  WebSocketGatewayBalancesResponse,
  WebSocketGatewayBalancesSuccessfulResponse,
} from '../../src/XRP/shared/rippled-web-socket-schema'
import GatewayBalances, {
  gatewayBalancesFromResponse,
} from '../../src/XRP/shared/gateway-balances'

const fakeSucceedingGrpcClient = new FakeXRPNetworkClient()

const fakeSucceedingWebSocketClient = new FakeWebSocketNetworkClient()

const testAddress = 'X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH'

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
    const trustlinesResponse: WebSocketAccountLinesResponse = await fakeSucceedingWebSocketClient.getAccountLines(
      testAddress,
    )
    const trustlinesSuccessfulResponse = trustlinesResponse as WebSocketAccountLinesSuccessfulResponse
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

  it('getTrustLines - account not found error response', async function (): Promise<
    void
  > {
    // GIVEN an IssuedCurrencyClient with faked networking that will return an error response for getAccountLines
    const accountNotFoundResponse: WebSocketAccountLinesResponse = {
      error: 'actNotFound',
      error_code: 19,
      error_message: 'Account not found.',
      id: 'account_lines_r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59',
      request: {
        account: 'r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59',
        command: 'account_lines',
        id: 'account_lines_r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59',
        ledger_index: 'validated',
      },
      status: 'error',
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

  it('getTrustLines - invalid params error response', async function (): Promise<
    void
  > {
    // GIVEN an IssuedCurrencyClient with faked networking that will return an error response for getAccountLines
    const invalidParamsResponse: WebSocketAccountLinesResponse = {
      error: 'invalidParams',
      error_code: 31,
      error_message: "Missing field 'account'.",
      id: 'account_lines_r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59',
      request: {
        account: 'r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59',
        command: 'account_lines',
        id: 'account_lines_r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59',
        ledger_index: 'validated',
      },
      status: 'error',
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

  it('requireAuthorizedTrustlines - successful response', async function (): Promise<
    void
  > {
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

  it('allowUnauthorizedTrustlines - successful response', async function (): Promise<
    void
  > {
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

  it('disallowIncomingXrp - successful response', async function (): Promise<
    void
  > {
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

  it('allowIncomingXrp - successful response', async function (): Promise<
    void
  > {
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

  it('getGatewayBalances - successful response', async function (): Promise<
    void
  > {
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
      )) as WebSocketGatewayBalancesSuccessfulResponse,
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

  it('getGatewayBalances - invalid addressToExclude, single address', async function (): Promise<
    void
  > {
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

  it('getGatewayBalances - invalid addressToExclude, multiple addresses', async function (): Promise<
    void
  > {
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

  it('getGatewayBalances - account not found error response', async function (): Promise<
    void
  > {
    // GIVEN an IssuedCurrencyClient with faked networking that will return an error response for getGatewayBalances
    const accountNotFoundResponse: WebSocketGatewayBalancesResponse = {
      error: 'actNotFound',
      error_code: 19,
      error_message: 'Account not found.',
      id: 'gateway_balances_X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH',
      request: {
        account: 'X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH',
        command: 'gateway_balances',
        hotwallet: [
          'rKm4uWpg9tfwbVSeATv4KxDe6mpE9yPkgJ',
          'ra7JkEzrgeKHdzKgo4EUUVBnxggY4z37kt',
        ],
        id: 'gateway_balances_X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH',
        ledger_index: 'validated',
        strict: true,
      },
      status: 'error',
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

  it('requireDestinationTags - successful response', async function (): Promise<
    void
  > {
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

  it('allowNoDestinationTag - successful response', async function (): Promise<
    void
  > {
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
      transferFee,
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
      .setTransferFee(transferFee, this.wallet)
      .catch((error) => {
        assert.deepEqual(error, FakeXRPNetworkClientResponses.defaultError)
      })
  })

  it('enableGlobalFreeze - successful response', async function (): Promise<
    void
  > {
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

  it('disableGlobalFreeze - successful response', async function (): Promise<
    void
  > {
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

  it('monitorIncomingPayments - successful response', async function (): Promise<
    void
  > {
    // GIVEN an IssuedCurrencyClient.
    const issuedCurrencyClient = new IssuedCurrencyClient(
      fakeSucceedingGrpcClient,
      fakeSucceedingWebSocketClient,
      XrplNetwork.Test,
    )

    const callback = (_data: WebSocketResponse) => {
      return
    }

    // WHEN monitorIncomingPayments is called
    const monitorResponse = await issuedCurrencyClient.monitorIncomingPayments(
      testAddress,
      callback,
    )
    const expectedMonitorResponse = {
      id: 'monitor_transactions_' + testAddress,
      result: {},
      status: 'success',
      type: 'response',
    }

    // THEN the result is as expected
    assert.deepEqual(monitorResponse, expectedMonitorResponse)
  })

  it('monitorIncomingPayments - submission failure', function (): void {
    // GIVEN an IssuedCurrencyClient which will fail to submit a transaction.
    const failureResponses = new FakeWebSocketNetworkClientResponses(
      FakeWebSocketNetworkClientResponses.defaultError,
    )

    const callback = (_data: WebSocketResponse) => {
      return
    }

    const failingNetworkClient = new FakeWebSocketNetworkClient(
      failureResponses,
    )
    const issuedCurrencyClient = new IssuedCurrencyClient(
      fakeSucceedingGrpcClient,
      failingNetworkClient,
      XrplNetwork.Test,
    )

    // WHEN monitorIncomingPayments is attempted THEN an error is propagated.
    issuedCurrencyClient
      .monitorIncomingPayments(testAddress, callback)
      .catch((error) => {
        assert.deepEqual(
          error,
          FakeWebSocketNetworkClientResponses.defaultError,
        )
      })
  })
})
