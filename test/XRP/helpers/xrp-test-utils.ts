import { GetAccountTransactionHistoryResponse } from '../../../src/XRP/Generated/web/org/xrpl/rpc/v1/get_account_transaction_history_pb'
import XRPTransaction from '../../../src/XRP/model/xrp-transaction'

/**
 * Convenience class for utility functions used in test cases for XRPClient infrastructure.
 */
export default class XRPTestUtils {
  /**
   * Converts a GetAccountTransactionHistoryResponse protocol buffer object into an array of XRPTransaction objects,
   * filtered only for PAYMENT type transactions.
   *
   * @param transactionHistoryResponse protocol buffer object containing an array of Transaction protocol buffer objects
   */
  static transactionHistoryToPaymentsList(
    transactionHistoryResponse: GetAccountTransactionHistoryResponse,
  ): Array<XRPTransaction> {
    const paymentXRPTransactions: Array<XRPTransaction> = []
    const transactions = transactionHistoryResponse.getTransactionsList()
    for (let i = 0; i < transactions.length; i += 1) {
      const paymentXRPTransaction = XRPTransaction.from(transactions[i])
      if (paymentXRPTransaction) {
        paymentXRPTransactions.push(paymentXRPTransaction)
      }
    }
    return paymentXRPTransactions
  }
}
