import { assert } from 'chai'
import { Wallet } from 'xpring-common-js'
import XpringClient from '../../src/Xpring/xpring-client'
import XRPPayIDClient from '../../src/PayID/xrp-pay-id-client'
import XRPClient from '../../src/XRP/xrp-client'
import XRPLNetwork from '../../src/Common/xrpl-network'

// A timeout for these tests.
const timeoutMs = 60 * 1000 // 1 minute

// The network to conduct tests on.
const network = XRPLNetwork.Test

// A wallet with some balance on TestNet.
const wallet = Wallet.generateWalletFromSeed('snYP7oArxKepd3GPDcrjMsJYiJeJB')!

// A PayIDClient under test.
const payIDClient = new XRPPayIDClient(network)

// An XRPClient under test.
const rippledURL = 'test.xrp.xpring.io:50051'
const xrpClient = new XRPClient(rippledURL, XRPLNetwork.Test)

// A XpringClient under test.
const xpringClient = new XpringClient(payIDClient, xrpClient)

describe('Xpring Integration Tests', function (): void {
  it('Send XRP TestNet', async function (): Promise<void> {
    this.timeout(timeoutMs)

    // GIVEN a Pay ID that will resolve.
    const payID = '$dev.payid.xpring.money/hbergren'

    // WHEN XRP is sent to the Pay ID.
    const transactionHash = await xpringClient.send(10, payID, wallet)

    // THEN a transaction hash is returned.
    assert.exists(transactionHash)
  })
})
