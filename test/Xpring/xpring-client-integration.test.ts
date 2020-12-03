import { assert } from 'chai'
import { XrplNetwork } from 'xpring-common-js'

import XrpPayIdClient from '../../src/PayID/xrp-pay-id-client'
import XpringClient from '../../src/Xpring/xpring-client'
import XrpClient from '../../src/XRP/xrp-client'
import XRPTestUtils, {
  iForgotToPickUpCarlMemo,
  noDataMemo,
  noFormatMemo,
  noTypeMemo,
} from '../XRP/helpers/xrp-test-utils'
import { TEST_TIMEOUT_MS, RIPPLED_URL } from '../Common/constants'

// The network to conduct tests on.
const network = XrplNetwork.Test

// A PayIdClient under test.
const payIdClient = new XrpPayIdClient(network)

// An XrpClient under test.
const xrpClient = new XrpClient(RIPPLED_URL, XrplNetwork.Test)

// A XpringClient under test.
const xpringClient = new XpringClient(payIdClient, xrpClient)

describe('Xpring Integration Tests', function (): void {
  // A Wallet with some balance on Testnet.
  let wallet
  before(async function () {
    wallet = await XRPTestUtils.randomWalletFromFaucet()
  })

  it('Send XRP TestNet', async function (): Promise<void> {
    this.timeout(TEST_TIMEOUT_MS)

    // GIVEN an amount and a PayID that will resolve.
    const amount = 10
    const payId = 'alice$dev.payid.xpring.money'

    // WHEN XRP is sent to the PayID.
    const transactionHash = await xpringClient.send(amount, payId, wallet)

    // THEN a transaction hash is returned.
    assert.exists(transactionHash)
  })

  it('Send XRP TestNet with memos', async function (): Promise<void> {
    this.timeout(TEST_TIMEOUT_MS)

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
      noDataMemo,
      noFormatMemo,
      noTypeMemo,
    ])
  })
})
