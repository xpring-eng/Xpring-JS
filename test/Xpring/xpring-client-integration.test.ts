import { assert } from 'chai'
import { Wallet } from 'xpring-common-js'
import XpringClient from '../../src/Xpring/xpring-client'
import { XRPPayIDClient } from '../../src/PayID/xrp-pay-id-client'
import XRPClient from '../../src/XRP/xrp-client'
import { XRPLNetwork } from '../../src/Common/xrpl-network'
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
const timeoutMs = 60 * 1000 // 1 minute

// The network to conduct tests on.
const network = XRPLNetwork.Test

// A wallet with some balance on TestNet.
const wallet = Wallet.generateWalletFromSeed('snYP7oArxKepd3GPDcrjMsJYiJeJB')!

// A PayIdClient under test.
const payIdClient = new XRPPayIDClient(network)

// An XRPClient under test.
const rippledURL = 'test.xrp.xpring.io:50051'
const xrpClient = new XRPClient(rippledURL, XRPLNetwork.Test)

// A XpringClient under test.
const xpringClient = new XpringClient(payIdClient, xrpClient)

describe('Xpring Integration Tests', function (): void {
  it('Send XRP TestNet', async function (): Promise<void> {
    this.timeout(timeoutMs)

    // GIVEN a Pay ID that will resolve.
    const payId = 'alice$dev.payid.xpring.money'

    // WHEN XRP is sent to the Pay ID.
    const transactionHash = await xpringClient.send(10, payId, wallet)

    // THEN a transaction hash is returned.
    assert.exists(transactionHash)
  })

  it('Send XRP TestNet with memos', async function (): Promise<void> {
    this.timeout(timeoutMs)

    // GIVEN a Pay ID that will resolve and some memos.
    const payID = 'alice$dev.payid.xpring.money'
    const memos = [
      iForgotToPickUpCarlMemo,
      noDataMemo,
      noFormatMemo,
      noTypeMemo,
    ]

    // WHEN XRP is sent to the Pay ID, including a memo.
    const transactionHash = await xpringClient.sendWithDetails({
      amount: 10,
      destination: payID,
      sender: wallet,
      memos,
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
