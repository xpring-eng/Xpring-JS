/* eslint-disable @typescript-eslint/no-non-null-assertion */
import bigInt from 'big-integer'
import { Utils, Wallet } from 'xpring-common-js'
import DefaultXpringClient, {
  XpringClientErrorMessages,
} from '../src/default-xpring-client'
import {
  FakeNetworkClient,
  FakeNetworkClientResponses,
} from './fakes/fake-network-client'
import { GetTxResponse } from '../src/generated/node/rpc/v1/tx_pb'
import { Meta, TransactionResult } from '../src/generated/node/rpc/v1/meta_pb'
import TransactionStatus from '../src/transaction-status'

const testAddress = 'X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH'

const transactionStatusCodeSuccess = 'tesSUCCESS'
const transactionStatusCodeFailure = 'tecFAILURE'

const fakeTransactionHash = 'DEADBEEF'

const fakeSucceedingNetworkClient = new FakeNetworkClient()
const fakeErroringNetworkClient = new FakeNetworkClient(
  FakeNetworkClientResponses.defaultErrorResponses,
)

/**
 * Convenience function which allows construction of `getTxResponse` objects.
 *
 * @param validated Whether the txResponse is validated.
 * @param resultCode The result code.
 */
function makeGetTxResponse(
  validated: boolean,
  resultCode: string,
): GetTxResponse {
  const transactionResult = new TransactionResult()
  transactionResult.setResult(resultCode)

  const meta = new Meta()
  meta.setTransactionResult(transactionResult)

  const getTxResponse = new GetTxResponse()
  getTxResponse.setMeta(meta)
  getTxResponse.setValidated(validated)

  return getTxResponse
}

describe('Default Xpring Client', (): void => {
  it('Get Account Balance - successful response', async (): Promise<void> => {
    // GIVEN a DefaultXpringClient.
    const xpringClient = new DefaultXpringClient(fakeSucceedingNetworkClient)

    // WHEN the balance for an account is requested.
    const balance = await xpringClient.getBalance(testAddress)

    // THEN the balance is returned.
    expect(balance).toBeDefined()
    expect(balance).not.toBeNull()
  })

  it('Get Account Balance - classic address', async (): Promise<void> => {
    // GIVEN a XpringClient and a classic address
    const xpringClient = new DefaultXpringClient(fakeSucceedingNetworkClient)
    const classicAddress = 'rsegqrgSP8XmhCYwL9enkZ9BNDNawfPZnn'

    // WHEN the balance for an account is requested THEN an error to use X-Addresses is thrown.
    await expectAsync(xpringClient.getBalance(classicAddress)).toBeRejectedWith(
      new Error(XpringClientErrorMessages.xAddressRequired),
    )
  })

  it('Get Account Balance - error', async (): Promise<void> => {
    // GIVEN a XpringClient which wraps an erroring network client.
    const xpringClient = new DefaultXpringClient(fakeErroringNetworkClient)

    // WHEN a balance is requested THEN an error is propagated.
    await expectAsync(xpringClient.getBalance(testAddress)).toBeRejectedWith(
      FakeNetworkClientResponses.defaultError,
    )
  })

  it('Get Account Balance - malformed response, no balance', async (): Promise<
    void
  > => {
    // GIVEN a XpringClient which wraps a network client with a malformed response.
    const accountInfoResponse = FakeNetworkClientResponses.defaultAccountInfoResponse()
    accountInfoResponse.getAccountData()!.setBalance(undefined)
    const fakeNetworkClientResponses = new FakeNetworkClientResponses(
      accountInfoResponse,
    )
    const fakeNetworkClient = new FakeNetworkClient(fakeNetworkClientResponses)
    const xpringClient = new DefaultXpringClient(fakeNetworkClient)

    // WHEN a balance is requested THEN an error is propagated.
    await expectAsync(xpringClient.getBalance(testAddress)).toBeRejectedWith(
      new Error(XpringClientErrorMessages.malformedResponse),
    )
  })

  it('Get Transaction Status - Unvalidated Transaction and Failure Code', async (): Promise<
    void
  > => {
    // GIVEN a XpringClient which will return an unvalidated transaction with a failure code.
    const transactionStatusResponse = makeGetTxResponse(
      false,
      transactionStatusCodeFailure,
    )
    const transactionStatusResponses = new FakeNetworkClientResponses(
      FakeNetworkClientResponses.defaultAccountInfoResponse(),
      FakeNetworkClientResponses.defaultFeeResponse(),
      FakeNetworkClientResponses.defaultSubmitTransactionResponse(),
      transactionStatusResponse,
    )
    const fakeNetworkClient = new FakeNetworkClient(transactionStatusResponses)
    const xpringClient = new DefaultXpringClient(fakeNetworkClient)

    // WHEN the transaction status is retrieved.
    const transactionStatus = await xpringClient.getTransactionStatus(
      fakeTransactionHash,
    )

    // THEN the status is pending.
    expect(transactionStatus).toEqual(TransactionStatus.Pending)
  })

  it('Get Transaction Status - Unvalidated Transaction and Success Code', async (): Promise<
    void
  > => {
    // GIVEN a XpringClient which will return an unvalidated transaction with a success code.
    const transactionStatusResponse = makeGetTxResponse(
      false,
      transactionStatusCodeSuccess,
    )
    const transactionStatusResponses = new FakeNetworkClientResponses(
      FakeNetworkClientResponses.defaultAccountInfoResponse(),
      FakeNetworkClientResponses.defaultFeeResponse(),
      FakeNetworkClientResponses.defaultSubmitTransactionResponse(),
      transactionStatusResponse,
    )
    const fakeNetworkClient = new FakeNetworkClient(transactionStatusResponses)
    const xpringClient = new DefaultXpringClient(fakeNetworkClient)

    // WHEN the transaction status is retrieved.
    const transactionStatus = await xpringClient.getTransactionStatus(
      fakeTransactionHash,
    )

    // THEN the status is pending.
    expect(transactionStatus).toEqual(TransactionStatus.Pending)
  })

  it('Get Transaction Status - Validated Transaction and Failure Code', async (): Promise<
    void
  > => {
    // GIVEN a XpringClient which will return an validated transaction with a failure code.
    const transactionStatusResponse = makeGetTxResponse(
      true,
      transactionStatusCodeFailure,
    )
    const transactionStatusResponses = new FakeNetworkClientResponses(
      FakeNetworkClientResponses.defaultAccountInfoResponse(),
      FakeNetworkClientResponses.defaultFeeResponse(),
      FakeNetworkClientResponses.defaultSubmitTransactionResponse(),
      transactionStatusResponse,
    )
    const fakeNetworkClient = new FakeNetworkClient(transactionStatusResponses)
    const xpringClient = new DefaultXpringClient(fakeNetworkClient)

    // WHEN the transaction status is retrieved.
    const transactionStatus = await xpringClient.getTransactionStatus(
      fakeTransactionHash,
    )

    // THEN the status is failed.
    expect(transactionStatus).toEqual(TransactionStatus.Failed)
  })

  it('Get Transaction Status - Validated Transaction and Success Code', async (): Promise<
    void
  > => {
    // GIVEN a XpringClient which will return an validated transaction with a success code.
    const transactionStatusResponse = makeGetTxResponse(
      true,
      transactionStatusCodeSuccess,
    )
    const transactionStatusResponses = new FakeNetworkClientResponses(
      FakeNetworkClientResponses.defaultAccountInfoResponse(),
      FakeNetworkClientResponses.defaultFeeResponse(),
      FakeNetworkClientResponses.defaultSubmitTransactionResponse(),
      transactionStatusResponse,
    )
    const fakeNetworkClient = new FakeNetworkClient(transactionStatusResponses)
    const xpringClient = new DefaultXpringClient(fakeNetworkClient)

    // WHEN the transaction status is retrieved.
    const transactionStatus = await xpringClient.getTransactionStatus(
      fakeTransactionHash,
    )

    // THEN the status is succeeded.
    expect(transactionStatus).toEqual(TransactionStatus.Succeeded)
  })

  it('Get Transaction Status - Node Error', async (): Promise<void> => {
    // GIVEN a XpringClient which will error when a transaction status is requested.
    const transactionStatusResponses = new FakeNetworkClientResponses(
      FakeNetworkClientResponses.defaultAccountInfoResponse(),
      FakeNetworkClientResponses.defaultFeeResponse(),
      FakeNetworkClientResponses.defaultSubmitTransactionResponse(),
      FakeNetworkClientResponses.defaultError,
    )
    const fakeNetworkClient = new FakeNetworkClient(transactionStatusResponses)
    const xpringClient = new DefaultXpringClient(fakeNetworkClient)

    // WHEN the transaction status is retrieved THEN an error is thrown.
    await expectAsync(
      xpringClient.getTransactionStatus(fakeTransactionHash),
    ).toBeRejectedWith(FakeNetworkClientResponses.defaultError)
  })

  it('Send XRP Transaction - success with BigInteger', async () => {
    // GIVEN a XpringClient, a wallet, and a BigInteger denomonated amount.
    const xpringClient = new DefaultXpringClient(fakeSucceedingNetworkClient)
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
    const expectedTransactionHash = Utils.toHex(
      FakeNetworkClientResponses.defaultSubmitTransactionResponse().getHash_asU8(),
    )
    expect(transactionHash).toBeDefined()
    expect(transactionHash).not.toBeNull()
    expect(transactionHash).toEqual(expectedTransactionHash)
  })

  it('Send XRP Transaction - success with number', async () => {
    // GIVEN a XpringClient, a wallet, and a number denominated amount.
    const xpringClient = new DefaultXpringClient(fakeSucceedingNetworkClient)
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
    const expectedTransactionHash = Utils.toHex(
      FakeNetworkClientResponses.defaultSubmitTransactionResponse().getHash_asU8(),
    )

    expect(transactionHash).toBeDefined()
    expect(transactionHash).not.toBeNull()
    expect(transactionHash).toEqual(expectedTransactionHash)
  })

  it('Send XRP Transaction - success with string', async () => {
    // GIVEN a XpringClient, a wallet, and a numeric string denominated amount.
    const xpringClient = new DefaultXpringClient(fakeSucceedingNetworkClient)
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
    const expectedTransactionHash = Utils.toHex(
      FakeNetworkClientResponses.defaultSubmitTransactionResponse().getHash_asU8(),
    )

    expect(transactionHash).toBeDefined()
    expect(transactionHash).not.toBeNull()
    expect(transactionHash).toEqual(expectedTransactionHash)
  })

  it('Send XRP Transaction - failure with invalid string', async () => {
    // GIVEN a XpringClient, a wallet and an amount that is invalid.
    const xpringClient = new DefaultXpringClient(fakeSucceedingNetworkClient)
    const { wallet } = Wallet.generateRandomWallet()!
    const destinationAddress = 'X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH'
    const amount = 'not_a_number'

    // WHEN the account makes a transaction THEN an error is propagated.
    await expectAsync(
      xpringClient.send(amount, destinationAddress, wallet),
    ).toBeRejected()
  })

  it('Send XRP Transaction - get fee failure', async () => {
    // GIVEN a XpringClient which will fail to retrieve a fee.
    const feeFailureResponses = new FakeNetworkClientResponses(
      FakeNetworkClientResponses.defaultAccountInfoResponse(),
      FakeNetworkClientResponses.defaultError,
      FakeNetworkClientResponses.defaultSubmitTransactionResponse(),
    )
    const feeFailingNetworkClient = new FakeNetworkClient(feeFailureResponses)
    const xpringClient = new DefaultXpringClient(feeFailingNetworkClient)
    const { wallet } = Wallet.generateRandomWallet()!
    const destinationAddress = 'X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH'
    const amount = bigInt('10')

    // WHEN a payment is attempted THEN an error is propagated.
    await expectAsync(
      xpringClient.send(amount, destinationAddress, wallet),
    ).toBeRejectedWith(FakeNetworkClientResponses.defaultError)
  })

  it('Send XRP Transaction - failure with classic address', async () => {
    // GIVEN a XpringClient, a wallet, and a classic address as the destination.
    const xpringClient = new DefaultXpringClient(fakeSucceedingNetworkClient)
    const { wallet } = Wallet.generateRandomWallet()!
    const destinationAddress = 'rsegqrgSP8XmhCYwL9enkZ9BNDNawfPZnn'
    const amount = bigInt('10')

    // WHEN the account makes a transaction THEN an error is thrown.
    await expectAsync(
      xpringClient.send(amount, destinationAddress, wallet),
    ).toBeRejectedWith(new Error(XpringClientErrorMessages.xAddressRequired))
  })

  it('Send XRP Transaction - get account info failure', async () => {
    // GIVEN a XpringClient which will fail to retrieve account info.
    const feeFailureResponses = new FakeNetworkClientResponses(
      FakeNetworkClientResponses.defaultError,
      FakeNetworkClientResponses.defaultFeeResponse(),
      FakeNetworkClientResponses.defaultSubmitTransactionResponse(),
    )
    const feeFailingNetworkClient = new FakeNetworkClient(feeFailureResponses)
    const xpringClient = new DefaultXpringClient(feeFailingNetworkClient)
    const { wallet } = Wallet.generateRandomWallet()!
    const destinationAddress = 'X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH'
    const amount = bigInt('10')

    // WHEN a payment is attempted THEN an error is propagated.
    await expectAsync(
      xpringClient.send(amount, destinationAddress, wallet),
    ).toBeRejectedWith(FakeNetworkClientResponses.defaultError)
  })

  it('Send XRP Transaction - submission failure', async () => {
    // GIVEN a XpringClient which will to submit a transaction.
    const feeFailureResponses = new FakeNetworkClientResponses(
      FakeNetworkClientResponses.defaultAccountInfoResponse(),
      FakeNetworkClientResponses.defaultFeeResponse(),
      FakeNetworkClientResponses.defaultError,
    )
    const feeFailingNetworkClient = new FakeNetworkClient(feeFailureResponses)
    const xpringClient = new DefaultXpringClient(feeFailingNetworkClient)
    const { wallet } = Wallet.generateRandomWallet()!
    const destinationAddress = 'X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH'
    const amount = bigInt('10')

    // WHEN a payment is attempted THEN an error is propagated.
    await expectAsync(
      xpringClient.send(amount, destinationAddress, wallet),
    ).toBeRejectedWith(FakeNetworkClientResponses.defaultError)
  })
})
