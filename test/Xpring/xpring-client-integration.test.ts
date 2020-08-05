import { assert } from 'chai'
import { Wallet, XrplNetwork } from 'xpring-common-js'

import XrpPayIdClient from '../../src/PayID/xrp-pay-id-client'
import XpringClient from '../../src/Xpring/xpring-client'
import XrpClient from '../../src/XRP/xrp-client'
import {
  expectedNoDataMemo,
  expectedNoFormatMemo,
  expectedNoTypeMemo,
  iForgotToPickUpCarlMemo,
  noDataMemo,
  noFormatMemo,
  noTypeMemo,
} from '../XRP/helpers/xrp-test-utils'

// A timeout for these tests.
// eslint-disable-next-line @typescript-eslint/no-magic-numbers -- 1 minute in milliseconds
const timeoutMs = 60 * 1000

// The network to conduct tests on.
const network = XrplNetwork.Test

// A wallet with some balance on TestNet.
const wallet = Wallet.generateWalletFromSeed('snYP7oArxKepd3GPDcrjMsJYiJeJB')!

// A PayIdClient under test.
const payIdClient = new XrpPayIdClient(network)

// An XrpClient under test.
const rippledUrl = 'test.xrp.xpring.io:50051'
const xrpClient = new XrpClient(rippledUrl, XrplNetwork.Test)

// A XpringClient under test.
const xpringClient = new XpringClient(payIdClient, xrpClient)

describe('Xpring Integration Tests', function (): void {
  it('Send XRP TestNet', async function (): Promise<void> {
    this.timeout(timeoutMs)

    // GIVEN an amount and a PayID that will resolve.
    const amount = 10
    const payId = 'alice$dev.payid.xpring.money'

    // WHEN XRP is sent to the PayID.
    const transactionHash = await xpringClient.send(amount, payId, wallet)

    // THEN a transaction hash is returned.
    assert.exists(transactionHash)
  })

  it('Send XRP TestNet with memos', async function (): Promise<void> {
    this.timeout(timeoutMs)

    // GIVEN an amount, a PayID that will resolve, and some memos.
    const amount = 10
    const payID = 'alice$dev.payid.xpring.money'
    const memoList = [
      iForgotToPickUpCarlMemo,
      noDataMemo,
      noFormatMemo,
      noTypeMemo,
    ]

    // WHEN XRP is sent to the PayID, including a memo.
    const transactionHash = await xpringClient.sendWithDetails({
      amount,
      destination: payID,
      sender: wallet,
      memoList,
    })

    // THEN a transaction hash is returned and the memos are present.
    assert.exists(transactionHash)

    const transaction = await xrpClient.getPayment(transactionHash)

    assert.deepEqual(transaction?.memos, [
      iForgotToPickUpCarlMemo,
      expectedNoDataMemo,
      expectedNoFormatMemo,
      expectedNoTypeMemo,
    ])
  })
})
