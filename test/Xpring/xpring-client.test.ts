import bigInt from 'big-integer'
import { assert } from 'chai'
import { FakeWallet, XrplNetwork } from 'xpring-common-js'
import FakeXrpClient from '../XRP/fakes/fake-xrp-client'
import FakeXrpPayIdClient from '../PayID/fakes/fake-xrp-pay-id-client'
import { testXrpTransaction } from '../XRP/fakes/fake-xrp-protobufs'
import TransactionStatus from '../../src/XRP/shared/transaction-status'
import XpringClient from '../../src/Xpring/xpring-client'

import XpringError from '../../src/Xpring/xpring-error'
import TransactionResult from '../../src/XRP/shared/transaction-result'

/* Default values for the fake XRP Client. These values must be provided but are not varied in testing. */
/* eslint-disable @typescript-eslint/no-magic-numbers, @typescript-eslint/naming-convention --
 * The 'magic-numbers' rule isn't smart enough to know this isn't really a magic number, and is just being fed to a wrapper,
 * and we don't need to use our boolean variable prefix convention because we use a "fake" prefix for all of these variables.
 */
const fakeBalance = bigInt(10)
const fakePaymentStatus = TransactionStatus.Succeeded
const fakeTransactionHash = 'deadbeefdeadbeefdeadbeef'
const fakeAccountExistsResult = true
const fakePaymentHistoryValue = []
const fakeGetPaymentValue = testXrpTransaction
const fakedSuccessfulTransactionResult = TransactionResult.getFinalTransactionResult(
  fakeTransactionHash,
  TransactionStatus.Succeeded,
  true,
)

/* eslint-enable @typescript-eslint/no-magic-numbers, @typescript-eslint/naming-convention */

// An amount to send
const amount = 10

// A fake wallet
const wallet = new FakeWallet('0123456789abcdef')

// A PayID to resolve
const payID = 'georgewashington$xpring.money'

// Errors to throw
const payIDError = new Error('Error from PayID')
const xrpError = new Error('Error from XRP')

describe('Xpring Client', function (): void {
  it('send - success', async function (): Promise<void> {
    // GIVEN a XpringClient composed of a fake PayIDClient and a fake XrpClient which will both succeed.
    const expectedTransactionHash = fakeTransactionHash
    const xrpClient = new FakeXrpClient(
      fakeBalance,
      fakePaymentStatus,
      expectedTransactionHash,
      fakeAccountExistsResult,
      fakePaymentHistoryValue,
      fakeGetPaymentValue,
      fakedSuccessfulTransactionResult,
      fakedSuccessfulTransactionResult,
      fakedSuccessfulTransactionResult,
    )

    const resolvedXRPAddress = 'r123'
    const payIdClient = new FakeXrpPayIdClient(resolvedXRPAddress)

    const xpringClient = new XpringClient(payIdClient, xrpClient)

    // WHEN XRP is sent to the PayID.
    const transactionHash = await xpringClient.send(amount, payID, wallet)

    // THEN the returned hash is correct and no error was thrown.
    assert.equal(transactionHash, expectedTransactionHash)
  })

  it('send - failure in PayID', function (done): void {
    // GIVEN a XpringClient composed of a PayIDClient which will throw an error.
    const expectedTransactionHash = 'deadbeefdeadbeefdeadbeef'
    const xrpClient = new FakeXrpClient(
      fakeBalance,
      fakePaymentStatus,
      expectedTransactionHash,
      fakeAccountExistsResult,
      fakePaymentHistoryValue,
      fakeGetPaymentValue,
      fakedSuccessfulTransactionResult,
      fakedSuccessfulTransactionResult,
      fakedSuccessfulTransactionResult,
    )

    const payIDClient = new FakeXrpPayIdClient(payIDError)

    const xpringClient = new XpringClient(payIDClient, xrpClient)

    // WHEN XRP is sent to the PayID.
    xpringClient.send(amount, payID, wallet).catch((error) => {
      // THEN an the error thrown is from PayID.
      assert.equal(error, payIDError)
      done()
    })
  })

  it('send - failure in XRP', function (done): void {
    // GIVEN a XpringClient composed of an XrpClient which will throw an error.
    const xrpClient = new FakeXrpClient(
      fakeBalance,
      fakePaymentStatus,
      xrpError,
      fakeAccountExistsResult,
      fakePaymentHistoryValue,
      fakeGetPaymentValue,
      fakedSuccessfulTransactionResult,
      fakedSuccessfulTransactionResult,
      fakedSuccessfulTransactionResult,
    )

    const resolvedXRPAddress = 'r123'
    const payIDClient = new FakeXrpPayIdClient(resolvedXRPAddress)

    const xpringClient = new XpringClient(payIDClient, xrpClient)

    // WHEN XRP is sent to the PayID.
    xpringClient.send(amount, payID, wallet).catch((error) => {
      // THEN an the error thrown is from XRP.
      assert.equal(error, xrpError)
      done()
    })
  })

  it('send - failure in both', function (done): void {
    // GIVEN a XpringClient composed of an XrpClient and a PayID client which both throw errors.
    const xrpClient = new FakeXrpClient(
      fakeBalance,
      fakePaymentStatus,
      xrpError,
      fakeAccountExistsResult,
      fakePaymentHistoryValue,
      fakeGetPaymentValue,
      fakedSuccessfulTransactionResult,
      fakedSuccessfulTransactionResult,
      fakedSuccessfulTransactionResult,
    )

    const payIDClient = new FakeXrpPayIdClient(payIDError)

    const xpringClient = new XpringClient(payIDClient, xrpClient)

    // WHEN XRP is sent to the PayID.
    xpringClient.send(amount, payID, wallet).catch((error) => {
      // THEN an the error thrown is from PayID.
      assert.equal(error, payIDError)
      done()
    })
  })

  it('Constructor - XpringError thrown for mismatched networks', function (): void {
    // GIVEN a PayIDClient and an XrpClient on different networks.
    const xrpClient = new FakeXrpClient(
      fakeBalance,
      fakePaymentStatus,
      fakeTransactionHash,
      fakeAccountExistsResult,
      fakePaymentHistoryValue,
      fakeGetPaymentValue,
      fakedSuccessfulTransactionResult,
      fakedSuccessfulTransactionResult,
      fakedSuccessfulTransactionResult,
      XrplNetwork.Test,
    )
    const payIDClient = new FakeXrpPayIdClient(payIDError, XrplNetwork.Main)

    // WHEN a XpringClient is constructed THEN a mismatched network XpringError is thrown.
    try {
      const xpringClient = new XpringClient(payIDClient, xrpClient)
      assert.fail(
        `Should not have been able to construct an instance of XpringClient but instead created: ${JSON.stringify(
          xpringClient,
        )}`,
      )
    } catch (error) {
      assert.deepEqual(error, XpringError.mismatchedNetworks)
    }
  })
})
