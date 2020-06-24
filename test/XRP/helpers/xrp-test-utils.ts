import { GetAccountTransactionHistoryResponse } from '../../../src/XRP/Generated/web/org/xrpl/rpc/v1/get_account_transaction_history_pb'
import XrpTransaction from '../../../src/XRP/model/xrp-transaction'
import XrplNetwork from '../../../src/Common/xrpl-network'
import XrpMemo from '../../../src/XRP/model/xrp-memo'

/**
 * Convenience class for utility functions used in test cases for XRPClient infrastructure.
 */
export default class XRPTestUtils {
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
      if (paymentXrpTransaction) {
        paymentXrpTransactions.push(paymentXrpTransaction)
      }
    }
    return paymentXrpTransactions
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
