/* eslint-disable @typescript-eslint/no-non-null-assertion */
import bigInt from 'big-integer'

import { Utils, Wallet } from 'xpring-common-js'
import { TransactionStatus as TransactionStatusResponse } from '../../src/generated/node/legacy/transaction_status_pb'

import LegacyDefaultXpringClient, {
  LegacyXpringClientErrorMessages,
} from '../../src/legacy/legacy-default-xpring-client'
import {
  FakeLegacyNetworkClient,
  FakeLegacyNetworkClientResponses,
} from './fakes/fake-legacy-network-client'
import TransactionStatus from '../../src/transaction-status'

const fakeSucceedingNetworkClient = new FakeLegacyNetworkClient()
const fakeErroringNetworkClient = new FakeLegacyNetworkClient(
  FakeLegacyNetworkClientResponses.defaultErrorResponses,
)

const testAddress = 'X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH'

const transactionStatusCodeSuccess = 'tesSUCCESS'
const transactionStatusCodeFailure = 'tecFAILURE'

const fakeTransactionHash = 'DEADBEEF'

describe('Legacy Default Xpring Client', () => {
  it('Get Account Balance - successful response', async () => {
    // GIVEN a LegacyDefaultXpringClient.
    const xpringClient = new LegacyDefaultXpringClient(
      fakeSucceedingNetworkClient,
    )

    // WHEN the balance for an account is requested.
    const balance = await xpringClient.getBalance(testAddress)

    // THEN the balance is returned.
    expect(balance).toBeDefined()
    expect(balance).not.toBeNull()
  })

  it('Get Account Balance - classic address', (done) => {
    // GIVEN a XpringClient and a classic address
    const xpringClient = new LegacyDefaultXpringClient(
      fakeSucceedingNetworkClient,
    )
    const classicAddress = 'rsegqrgSP8XmhCYwL9enkZ9BNDNawfPZnn'

    // WHEN the balance for an account is requested THEN an error to use X-Addresses is thrown.
    xpringClient.getBalance(classicAddress).catch((error) => {
      expect(error).toBeInstanceOf(Error)
      expect(error.message).toEqual(
        LegacyXpringClientErrorMessages.xAddressRequired,
      )
      done()
    })
  })

  it('Get Account Balance - error', (done) => {
    // GIVEN a XpringClient which wraps an erroring network client.
    const xpringClient = new LegacyDefaultXpringClient(
      fakeErroringNetworkClient,
    )

    // WHEN a balance is requested THEN an error is propagated.
    xpringClient.getBalance(testAddress).catch((error) => {
      expect(error).toBeInstanceOf(Error)
      expect(error).toEqual(FakeLegacyNetworkClientResponses.defaultError)
      done()
    })
  })

  it('Get Account Balance - malformed response, no balance', (done) => {
    // GIVEN a XpringClient which wraps a network client with a malformed response.
    const accountInfoResponse = FakeLegacyNetworkClientResponses.defaultAccountInfoResponse()
    accountInfoResponse.setBalance(undefined)
    const fakeNetworkClientResponses = new FakeLegacyNetworkClientResponses(
      accountInfoResponse,
    )
    const fakeNetworkClient = new FakeLegacyNetworkClient(
      fakeNetworkClientResponses,
    )
    const xpringClient = new LegacyDefaultXpringClient(fakeNetworkClient)

    // WHEN a balance is requested THEN an error is propagated.
    xpringClient.getBalance(testAddress).catch((error) => {
      expect(error).toBeInstanceOf(Error)
      expect(error.message).toEqual(
        LegacyXpringClientErrorMessages.malformedResponse,
      )
      done()
    })
  })

  it('Send XRP Transaction - success with BigInteger', async () => {
    // GIVEN a XpringClient, a wallet, and a BigInteger denomonated amount.
    const xpringClient = new LegacyDefaultXpringClient(
      fakeSucceedingNetworkClient,
    )
    const { wallet } = Wallet.generateRandomWallet()!
    const destinationAddress = 'X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH'
    const amount = bigInt('10')

    // WHEN the account makes a transaction.
    const transactionHash = await xpringClient.send(
      amount,
      destinationAddress,
      wallet,
    )

    // THEN the transaction hash exists and is the expected hash
    const expectedTransactionBlob = FakeLegacyNetworkClientResponses.defaultSubmitSignedTransactionResponse().getTransactionBlob()
    const expectedTransactionHash = Utils.transactionBlobToTransactionHash(
      expectedTransactionBlob,
    )

    expect(transactionHash).toBeDefined()
    expect(transactionHash).not.toBeNull()
    expect(transactionHash).toEqual(expectedTransactionHash!)
  })

  it('Send XRP Transaction - success with number', async () => {
    // GIVEN a XpringClient, a wallet, and a number denominated amount.
    const xpringClient = new LegacyDefaultXpringClient(
      fakeSucceedingNetworkClient,
    )
    const { wallet } = Wallet.generateRandomWallet()!
    const destinationAddress = 'X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH'
    const amount = 10

    // WHEN the account makes a transaction.
    const transactionHash = await xpringClient.send(
      amount,
      destinationAddress,
      wallet,
    )

    // THEN the transaction hash exists and is the expected hash
    const expectedTransactionBlob = FakeLegacyNetworkClientResponses.defaultSubmitSignedTransactionResponse().getTransactionBlob()
    const expectedTransactionHash = Utils.transactionBlobToTransactionHash(
      expectedTransactionBlob,
    )

    expect(transactionHash).toBeDefined()
    expect(transactionHash).not.toBeNull()
    expect(transactionHash).toEqual(expectedTransactionHash!)
  })

  it('Send XRP Transaction - success with string', async () => {
    // GIVEN a XpringClient, a wallet, and a numeric string denominated amount.
    const xpringClient = new LegacyDefaultXpringClient(
      fakeSucceedingNetworkClient,
    )
    const { wallet } = Wallet.generateRandomWallet()!
    const destinationAddress = 'X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH'
    const amount = '10'

    // WHEN the account makes a transaction.
    const transactionHash = await xpringClient.send(
      amount,
      destinationAddress,
      wallet,
    )

    // THEN the transaction hash exists and is the expected hash
    const expectedTransactionBlob = FakeLegacyNetworkClientResponses.defaultSubmitSignedTransactionResponse().getTransactionBlob()
    const expectedTransactionHash = Utils.transactionBlobToTransactionHash(
      expectedTransactionBlob,
    )

    expect(transactionHash).toBeDefined()
    expect(transactionHash).not.toBeNull()
    expect(transactionHash).toEqual(expectedTransactionHash!)
  })

  it('Send XRP Transaction - failure with invalid string', (done) => {
    // GIVEN a XpringClient, a wallet and an amount that is invalid.
    const xpringClient = new LegacyDefaultXpringClient(
      fakeSucceedingNetworkClient,
    )
    const { wallet } = Wallet.generateRandomWallet()!
    const destinationAddress = 'X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH'
    const amount = 'not_a_number'

    // WHEN the account makes a transaction THEN an error is propagated.
    xpringClient.send(amount, destinationAddress, wallet).catch((error) => {
      expect(error).toBeInstanceOf(Error)
      done()
    })
  })

  it('Send XRP Transaction - get fee failure', (done) => {
    // GIVEN a XpringClient which will fail to retrieve a fee.
    const feeFailureResponses = new FakeLegacyNetworkClientResponses(
      FakeLegacyNetworkClientResponses.defaultAccountInfoResponse(),
      FakeLegacyNetworkClientResponses.defaultError,
      FakeLegacyNetworkClientResponses.defaultSubmitSignedTransactionResponse(),
    )
    const feeFailingNetworkClient = new FakeLegacyNetworkClient(
      feeFailureResponses,
    )
    const xpringClient = new LegacyDefaultXpringClient(feeFailingNetworkClient)
    const { wallet } = Wallet.generateRandomWallet()!
    const destinationAddress = 'X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH'
    const amount = bigInt('10')

    // WHEN a payment is attempted THEN an error is propagated.
    xpringClient.send(amount, destinationAddress, wallet).catch((error) => {
      expect(error).toBeInstanceOf(Error)
      expect(error.message).toEqual(
        FakeLegacyNetworkClientResponses.defaultError.message,
      )
      done()
    })
  })

  it('Send XRP Transaction - failure with classic address', (done) => {
    // GIVEN a XpringClient, a wallet, and a classic address as the destination.
    const xpringClient = new LegacyDefaultXpringClient(
      fakeSucceedingNetworkClient,
    )
    const { wallet } = Wallet.generateRandomWallet()!
    const destinationAddress = 'rsegqrgSP8XmhCYwL9enkZ9BNDNawfPZnn'
    const amount = bigInt('10')

    // WHEN the account makes a transaction THEN an error is thrown.
    xpringClient.send(amount, destinationAddress, wallet).catch((error) => {
      expect(error).toBeInstanceOf(Error)
      expect(error.message).toEqual(
        LegacyXpringClientErrorMessages.xAddressRequired,
      )
      done()
    })
  })

  it('Send XRP Transaction - get account info failure', (done) => {
    // GIVEN a XpringClient which will fail to retrieve account info.
    const feeFailureResponses = new FakeLegacyNetworkClientResponses(
      FakeLegacyNetworkClientResponses.defaultError,
      FakeLegacyNetworkClientResponses.defaultFeeResponse(),
      FakeLegacyNetworkClientResponses.defaultSubmitSignedTransactionResponse(),
    )
    const feeFailingNetworkClient = new FakeLegacyNetworkClient(
      feeFailureResponses,
    )
    const xpringClient = new LegacyDefaultXpringClient(feeFailingNetworkClient)
    const { wallet } = Wallet.generateRandomWallet()!
    const destinationAddress = 'X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH'
    const amount = bigInt('10')

    // WHEN a payment is attempted THEN an error is propagated.
    xpringClient.send(amount, destinationAddress, wallet).catch((error) => {
      expect(error).toBeInstanceOf(Error)
      expect(error.message).toEqual(
        FakeLegacyNetworkClientResponses.defaultError.message,
      )
      done()
    })
  })

  it('Send XRP Transaction - get latest ledger sequence failure', (done) => {
    // GIVEN a XpringClient which will fail to retrieve account info.
    const feeFailureResponses = new FakeLegacyNetworkClientResponses(
      FakeLegacyNetworkClientResponses.defaultAccountInfoResponse(),
      FakeLegacyNetworkClientResponses.defaultFeeResponse(),
      FakeLegacyNetworkClientResponses.defaultSubmitSignedTransactionResponse(),
      FakeLegacyNetworkClientResponses.defaultError,
    )
    const feeFailingNetworkClient = new FakeLegacyNetworkClient(
      feeFailureResponses,
    )
    const xpringClient = new LegacyDefaultXpringClient(feeFailingNetworkClient)
    const { wallet } = Wallet.generateRandomWallet()!
    const destinationAddress = 'X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH'
    const amount = bigInt('10')

    // WHEN a payment is attempted THEN an error is propagated.
    xpringClient.send(amount, destinationAddress, wallet).catch((error) => {
      expect(error).toBeInstanceOf(Error)
      expect(error.message).toEqual(
        FakeLegacyNetworkClientResponses.defaultError.message,
      )
      done()
    })
  })

  it('Send XRP Transaction - submission failure', (done) => {
    // GIVEN a XpringClient which will to submit a transaction.
    const feeFailureResponses = new FakeLegacyNetworkClientResponses(
      FakeLegacyNetworkClientResponses.defaultAccountInfoResponse(),
      FakeLegacyNetworkClientResponses.defaultFeeResponse(),
      FakeLegacyNetworkClientResponses.defaultError,
    )
    const feeFailingNetworkClient = new FakeLegacyNetworkClient(
      feeFailureResponses,
    )
    const xpringClient = new LegacyDefaultXpringClient(feeFailingNetworkClient)
    const { wallet } = Wallet.generateRandomWallet()!
    const destinationAddress = 'X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH'
    const amount = bigInt('10')

    // WHEN a payment is attempted THEN an error is propagated.
    xpringClient.send(amount, destinationAddress, wallet).catch((error) => {
      expect(error).toBeInstanceOf(Error)
      expect(error.message).toEqual(
        FakeLegacyNetworkClientResponses.defaultError.message,
      )
      done()
    })
  })

  it('Get Transaction Status - Unvalidated Transaction and Failure Code', async () => {
    // GIVEN a XpringClient which will return an unvalidated transaction with a failure code.
    const transactionStatusResponse = new TransactionStatusResponse()
    transactionStatusResponse.setValidated(false)
    transactionStatusResponse.setTransactionStatusCode(
      transactionStatusCodeFailure,
    )
    const transactionStatusResponses = new FakeLegacyNetworkClientResponses(
      FakeLegacyNetworkClientResponses.defaultAccountInfoResponse(),
      FakeLegacyNetworkClientResponses.defaultFeeResponse(),
      FakeLegacyNetworkClientResponses.defaultSubmitSignedTransactionResponse(),
      FakeLegacyNetworkClientResponses.defaultLedgerSequenceResponse(),
      transactionStatusResponse,
    )
    const fakeNetworkClient = new FakeLegacyNetworkClient(
      transactionStatusResponses,
    )
    const xpringClient = new LegacyDefaultXpringClient(fakeNetworkClient)

    // WHEN the transaction status is retrieved.
    const transactionStatus = await xpringClient.getTransactionStatus(
      fakeTransactionHash,
    )

    // THEN the status is pending.
    expect(transactionStatus).toEqual(TransactionStatus.Pending)
  })

  it('Get Transaction Status - Unvalidated Transaction and Success Code', async () => {
    // GIVEN a XpringClient which will return an unvalidated transaction with a success code.
    const transactionStatusResponse = new TransactionStatusResponse()
    transactionStatusResponse.setValidated(false)
    transactionStatusResponse.setTransactionStatusCode(
      transactionStatusCodeSuccess,
    )
    const transactionStatusResponses = new FakeLegacyNetworkClientResponses(
      FakeLegacyNetworkClientResponses.defaultAccountInfoResponse(),
      FakeLegacyNetworkClientResponses.defaultFeeResponse(),
      FakeLegacyNetworkClientResponses.defaultSubmitSignedTransactionResponse(),
      FakeLegacyNetworkClientResponses.defaultLedgerSequenceResponse(),
      transactionStatusResponse,
    )
    const fakeNetworkClient = new FakeLegacyNetworkClient(
      transactionStatusResponses,
    )
    const xpringClient = new LegacyDefaultXpringClient(fakeNetworkClient)

    // WHEN the transaction status is retrieved.
    const transactionStatus = await xpringClient.getTransactionStatus(
      fakeTransactionHash,
    )

    // THEN the status is pending.
    expect(transactionStatus).toEqual(TransactionStatus.Pending)
  })

  it('Get Transaction Status - Validated Transaction and Failure Code', async () => {
    // GIVEN a XpringClient which will return an validated transaction with a failure code.
    const transactionStatusResponse = new TransactionStatusResponse()
    transactionStatusResponse.setValidated(true)
    transactionStatusResponse.setTransactionStatusCode(
      transactionStatusCodeFailure,
    )
    const transactionStatusResponses = new FakeLegacyNetworkClientResponses(
      FakeLegacyNetworkClientResponses.defaultAccountInfoResponse(),
      FakeLegacyNetworkClientResponses.defaultFeeResponse(),
      FakeLegacyNetworkClientResponses.defaultSubmitSignedTransactionResponse(),
      FakeLegacyNetworkClientResponses.defaultLedgerSequenceResponse(),
      transactionStatusResponse,
    )
    const fakeNetworkClient = new FakeLegacyNetworkClient(
      transactionStatusResponses,
    )
    const xpringClient = new LegacyDefaultXpringClient(fakeNetworkClient)

    // WHEN the transaction status is retrieved.
    const transactionStatus = await xpringClient.getTransactionStatus(
      fakeTransactionHash,
    )

    // THEN the status is failed.
    expect(transactionStatus).toEqual(TransactionStatus.Failed)
  })

  it('Get Transaction Status - Validated Transaction and Success Code', async () => {
    // GIVEN a XpringClient which will return an validated transaction with a success code.
    const transactionStatusResponse = new TransactionStatusResponse()
    transactionStatusResponse.setValidated(true)
    transactionStatusResponse.setTransactionStatusCode(
      transactionStatusCodeSuccess,
    )
    const transactionStatusResponses = new FakeLegacyNetworkClientResponses(
      FakeLegacyNetworkClientResponses.defaultAccountInfoResponse(),
      FakeLegacyNetworkClientResponses.defaultFeeResponse(),
      FakeLegacyNetworkClientResponses.defaultSubmitSignedTransactionResponse(),
      FakeLegacyNetworkClientResponses.defaultLedgerSequenceResponse(),
      transactionStatusResponse,
    )
    const fakeNetworkClient = new FakeLegacyNetworkClient(
      transactionStatusResponses,
    )
    const xpringClient = new LegacyDefaultXpringClient(fakeNetworkClient)

    // WHEN the transaction status is retrieved.
    const transactionStatus = await xpringClient.getTransactionStatus(
      fakeTransactionHash,
    )

    // THEN the status is succeeded.
    expect(transactionStatus).toEqual(TransactionStatus.Succeeded)
  })

  it('Get Transaction Status - Node Error', (done) => {
    // GIVEN a XpringClient which will error when a transaction status is requested.
    const transactionStatusResponses = new FakeLegacyNetworkClientResponses(
      FakeLegacyNetworkClientResponses.defaultAccountInfoResponse(),
      FakeLegacyNetworkClientResponses.defaultFeeResponse(),
      FakeLegacyNetworkClientResponses.defaultSubmitSignedTransactionResponse(),
      FakeLegacyNetworkClientResponses.defaultLedgerSequenceResponse(),
      FakeLegacyNetworkClientResponses.defaultError,
    )
    const fakeNetworkClient = new FakeLegacyNetworkClient(
      transactionStatusResponses,
    )
    const xpringClient = new LegacyDefaultXpringClient(fakeNetworkClient)

    // WHEN the transaction status is retrieved THEN an error is thrown.
    xpringClient.getTransactionStatus(fakeTransactionHash).catch((error) => {
      expect(error).toBeInstanceOf(Error)
      expect(error.message).toEqual(
        FakeLegacyNetworkClientResponses.defaultError.message,
      )
      done()
    })
  })
})
