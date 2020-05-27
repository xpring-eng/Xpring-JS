import { assert } from 'chai'
import bigInt from 'big-integer'
import { FakeWallet } from 'xpring-common-js'
import FakeXRPClient from '../XRP/fakes/fake-xrp-client'
import FakeXRPPayIDClient from '../PayID/fakes/fake-xrp-pay-id-client'
import { testXRPTransaction } from '../XRP/fakes/fake-xrp-protobufs'
import TransactionStatus from '../../src/XRP/transaction-status'
import XpringClient from '../../src/Xpring/xpring-client'
import RawTransactionStatus from '../../src/XRP/raw-transaction-status'
import { XRPLNetwork } from '../../src'
import XpringError from '../../src/Xpring/xpring-error'

/* Default values for the fake XRP Client. These values must be provided but are not varied in testing. */
const fakeBalance = bigInt(10)
const fakePaymentStatus = TransactionStatus.Succeeded
const fakeTransactionHash = 'deadbeefdeadbeefdeadbeef'
const fakeLastLedgerSequenceValue = 10
const fakeAccountExistsResult = true
const fakeRawTransactionStatus = new RawTransactionStatus(
  true,
  'tesSUCCESS',
  10,
  true,
)
const fakePaymentHistoryValue = []
const fakeGetPaymentValue = testXRPTransaction

/** An amount to send. */
const amount = 10

/** A fake wallet. */
const wallet = new FakeWallet('0123456789abcdef')

/** An Pay ID to resolve. */
const payID = '$xpring.money/georgewashington'

/** Errors to throw */
const payIDError = new Error('Error from PayID')
const xrpError = new Error('Error from XRP')

describe('Xpring Client', function (): void {
  it('send - success', async function (): Promise<void> {
    // GIVEN a XpringClient composed of a fake PayIDClient and a fake XRPClient which will both succeed.
    const expectedTransactionHash = fakeTransactionHash
    const xrpClient = new FakeXRPClient(
      fakeBalance,
      fakePaymentStatus,
      expectedTransactionHash,
      fakeLastLedgerSequenceValue,
      fakeRawTransactionStatus,
      fakeAccountExistsResult,
      fakePaymentHistoryValue,
      fakeGetPaymentValue,
    )

    const resolvedXRPAddress = 'r123'
    const payIDClient = new FakeXRPPayIDClient(resolvedXRPAddress)

    const xpringClient = new XpringClient(payIDClient, xrpClient)

    // WHEN XRP is sent to the Pay ID.
    const transactionHash = await xpringClient.send(amount, payID, wallet)

    // THEN the returned hash is correct and no error was thrown.
    assert.equal(transactionHash, expectedTransactionHash)
  })

  it('send - failure in PayID', function (done): void {
    // GIVEN a XpringClient composed of a PayIDClient which will throw an error.
    const expectedTransactionHash = 'deadbeefdeadbeefdeadbeef'
    const xrpClient = new FakeXRPClient(
      fakeBalance,
      fakePaymentStatus,
      expectedTransactionHash,
      fakeLastLedgerSequenceValue,
      fakeRawTransactionStatus,
      fakeAccountExistsResult,
      fakePaymentHistoryValue,
      fakeGetPaymentValue,
    )

    const payIDClient = new FakeXRPPayIDClient(payIDError)

    const xpringClient = new XpringClient(payIDClient, xrpClient)

    // WHEN XRP is sent to the Pay ID.
    xpringClient.send(amount, payID, wallet).catch((error) => {
      // THEN an the error thrown is from PayID.
      assert.equal(error, payIDError)
      done()
    })
  })

  it('send - failure in XRP', function (done): void {
    // GIVEN a XpringClient composed of an XRPClient which will throw an error.
    const xrpClient = new FakeXRPClient(
      fakeBalance,
      fakePaymentStatus,
      xrpError,
      fakeLastLedgerSequenceValue,
      fakeRawTransactionStatus,
      fakeAccountExistsResult,
      fakePaymentHistoryValue,
      fakeGetPaymentValue,
    )

    const resolvedXRPAddress = 'r123'
    const payIDClient = new FakeXRPPayIDClient(resolvedXRPAddress)

    const xpringClient = new XpringClient(payIDClient, xrpClient)

    // WHEN XRP is sent to the Pay ID.
    xpringClient.send(amount, payID, wallet).catch((error) => {
      // THEN an the error thrown is from XRP.
      assert.equal(error, xrpError)
      done()
    })
  })

  it('send - failure in both', function (done): void {
    // GIVEN a XpringClient composed of an XRPClient and a PayID client which both throw errors.
    const xrpClient = new FakeXRPClient(
      fakeBalance,
      fakePaymentStatus,
      xrpError,
      fakeLastLedgerSequenceValue,
      fakeRawTransactionStatus,
      fakeAccountExistsResult,
      fakePaymentHistoryValue,
      fakeGetPaymentValue,
    )

    const payIDClient = new FakeXRPPayIDClient(payIDError)

    const xpringClient = new XpringClient(payIDClient, xrpClient)

    // WHEN XRP is sent to the Pay ID.
    xpringClient.send(amount, payID, wallet).catch((error) => {
      // THEN an the error thrown is from PayID.
      assert.equal(error, payIDError)
      done()
    })
  })

  it('Constructor - XpringError thrown for mismatched networks', function (): void {
    // GIVEN a PayIDClient and an XRPClient on different networks.
    const xrpClient = new FakeXRPClient(
      fakeBalance,
      fakePaymentStatus,
      fakeTransactionHash,
      fakeLastLedgerSequenceValue,
      fakeRawTransactionStatus,
      fakeAccountExistsResult,
      fakePaymentHistoryValue,
      fakeGetPaymentValue,
      XRPLNetwork.Test,
    )
    const payIDClient = new FakeXRPPayIDClient(payIDError, XRPLNetwork.Main)

    // WHEN a XpringClient is constructed THEN a mismatched network XpringError is thrown.
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const xpringClient = new XpringClient(payIDClient, xrpClient)
      assert.fail(
        `Should not have been able to construct an instance of XpringClient but instead created: ${xpringClient}`,
      )
    } catch (error) {
      assert.deepEqual(error, XpringError.mismatchedNetworks)
    }
  })
})
