import { assert } from 'chai'
import { GetAccountTransactionHistoryResponse } from '../../../src/XRP/Generated/web/org/xrpl/rpc/v1/get_account_transaction_history_pb'
import { LedgerSpecifier } from '../../../src/XRP/Generated/node/org/xrpl/rpc/v1/ledger_pb'
import XrpTransaction from '../../../src/XRP/protobuf-wrappers/xrp-transaction'
import { WalletFactory, Wallet, XrplNetwork } from 'xpring-common-js'
import TransactionStatus from '../../../src/XRP/shared/transaction-status'
import { XrpUtils, XrpError, XrpErrorType } from '../../../src/XRP'
import XrpMemo from '../../../src/XRP/protobuf-wrappers/xrp-memo'
import { AccountRootFlag, TransactionResult } from '../../../src/XRP/shared'
import GrpcNetworkClient from '../../../src/XRP/network-clients/grpc-xrp-network-client'
import bigInt from 'big-integer'
import XrpClient from '../../../src/XRP/xrp-client'
import axios from 'axios'

/**
 * Convenience class for utility functions used in test cases for XrpClient infrastructure.
 */
export default class XRPTestUtils {
  static sleep = async (milliseconds: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, milliseconds))

  /**
   * Converts a GetAccountTransactionHistoryResponse protocol buffer object into an array of XrpTransaction objects,
   * filtered only for PAYMENT type transactions.
   *
   * @param transactionHistoryResponse protocol buffer object containing an array of Transaction protocol buffer objects
   */
  static transactionHistoryToPaymentsList(
    transactionHistoryResponse: GetAccountTransactionHistoryResponse,
  ): Array<XrpTransaction> {
    const paymentXrpTransactions: Array<XrpTransaction> = []
    const transactions = transactionHistoryResponse.getTransactionsList()
    for (let i = 0; i < transactions.length; i += 1) {
      const paymentXrpTransaction = XrpTransaction.from(
        transactions[i],
        XrplNetwork.Test,
      )
      paymentXrpTransactions.push(paymentXrpTransaction)
    }
    return paymentXrpTransactions
  }

  /**
   * Generates a random wallet and funds it using the XRPL Testnet faucet.
   */
  static async randomWalletFromFaucet(): Promise<Wallet> {
    const timeoutInSeconds = 40

    const walletFactory = new WalletFactory(XrplNetwork.Test)
    const wallet = (await walletFactory.generateRandomWallet())!.wallet
    if (!wallet) {
      throw new XrpError(
        XrpErrorType.Unknown,
        'Could not generate a random wallet.',
      )
    }
    const address = wallet.getAddress()

    const classicAddress = XrpUtils.decodeXAddress(address)?.address
    if (!classicAddress) {
      throw new XrpError(
        XrpErrorType.InvalidInput,
        `Could not decode XAddress ${address}.`,
      )
    }

    const rippledUrl = 'test.xrp.xpring.io:50051'
    const xrpClient = new XrpClient(rippledUrl, XrplNetwork.Test)

    // Balance prior to asking for more funds
    let startingBalance
    try {
      startingBalance = bigInt(await xrpClient.getBalance(address))
    } catch {
      startingBalance = bigInt('0')
    }
    // Ask the faucet to send funds to the given address
    const faucetURL = 'https://faucet.altnet.rippletest.net/accounts'
    await axios.post(faucetURL, { destination: classicAddress })

    // Wait for the faucet to fund our account or until timeout
    // Waits one second checks if balance has changed
    // If balance doesn't change it will attempt again until timeoutInSeconds
    for (
      let balanceCheckCounter = 0;
      balanceCheckCounter < timeoutInSeconds;
      balanceCheckCounter++
    ) {
      // Wait 1 second
      await this.sleep(1000)

      // Request our current balance
      let currentBalance
      try {
        currentBalance = bigInt(await xrpClient.getBalance(address))
      } catch {
        currentBalance = bigInt('0')
      }
      // If our current balance has changed then return
      if (startingBalance.notEquals(currentBalance)) {
        return wallet
      }

      // In the future if we had a tx hash from the faucet
      // We should check the status of the tx which would be more accurate
    }

    // Balance did not update
    throw new Error(
      `Unable to fund address with faucet after waiting ${timeoutInSeconds} seconds`,
    )
  }

  static async verifyFlagModification(
    wallet: Wallet,
    rippledGrpcUrl: string,
    result: TransactionResult,
    accountRootFlag: number,
    checkTrue = true,
  ): Promise<void> {
    // THEN the transaction was successfully submitted and the correct flag was set on the account.
    const transactionHash = result.hash
    const transactionStatus = result.status

    // get the account data and check the flag bitmap
    const networkClient = new GrpcNetworkClient(rippledGrpcUrl)
    const account = networkClient.AccountAddress()
    const classicAddress = XrpUtils.decodeXAddress(wallet.getAddress())
    account.setAddress(classicAddress!.address)

    const request = networkClient.GetAccountInfoRequest()
    request.setAccount(account)

    const ledger = new LedgerSpecifier()
    ledger.setShortcut(LedgerSpecifier.Shortcut.SHORTCUT_VALIDATED)
    request.setLedger(ledger)

    const accountInfo = await networkClient.getAccountInfo(request)
    if (!accountInfo) {
      throw XrpError.malformedResponse
    }

    const accountData = accountInfo.getAccountData()
    if (!accountData) {
      throw XrpError.malformedResponse
    }

    const flags = accountData.getFlags()?.getValue()

    assert.exists(transactionHash)
    assert.equal(transactionStatus, TransactionStatus.Succeeded)
    if (checkTrue) {
      assert.isTrue(AccountRootFlag.checkFlag(accountRootFlag, flags!))
    } else {
      assert.isFalse(AccountRootFlag.checkFlag(accountRootFlag, flags!))
    }
  }
}

export const iForgotToPickUpCarlMemo = XrpMemo.fromMemoFields(
  { value: 'I forgot to pick up Carl...' },
  { value: 'jaypeg' },
  { value: 'meme' },
)

export const noDataMemo = XrpMemo.fromMemoFields(
  undefined,
  { value: 'jaypeg' },
  { value: 'meme' },
)

/**
 * Exists because ledger will stored value as blank.
 */
export const expectedNoDataMemo = XrpMemo.fromMemoFields(
  { value: '' },
  { value: 'jaypeg' },
  { value: 'meme' },
)

export const noFormatMemo = XrpMemo.fromMemoFields(
  { value: 'I forgot to pick up Carl...' },
  undefined,
  { value: 'meme' },
)

/**
 * Exists because ledger will stored value as blank.
 */
export const expectedNoFormatMemo = XrpMemo.fromMemoFields(
  { value: 'I forgot to pick up Carl...' },
  { value: '' },
  { value: 'meme' },
)

export const noTypeMemo = XrpMemo.fromMemoFields(
  { value: 'I forgot to pick up Carl...' },
  { value: 'jaypeg' },
)

/**
 * Exists because ledger will stored value as blank.
 */
export const expectedNoTypeMemo = XrpMemo.fromMemoFields(
  { value: 'I forgot to pick up Carl...' },
  { value: 'jaypeg' },
  { value: '' },
)
