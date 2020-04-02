import {
  Currency,
  CurrencyAmount,
  IssuedCurrencyAmount,
  XRPDropsAmount,
} from '../../../src/XRP/Generated/web/org/xrpl/rpc/v1/amount_pb'
import {
  Amount,
  Destination,
  Account,
  SigningPublicKey,
  TransactionSignature,
  Sequence,
} from '../../../src/XRP/Generated/web/org/xrpl/rpc/v1/common_pb'
import {
  Payment,
  Transaction,
  CheckCash,
} from '../../../src/XRP/Generated/web/org/xrpl/rpc/v1/transaction_pb'
import { AccountAddress } from '../../../src/XRP/Generated/web/org/xrpl/rpc/v1/account_pb'
import { GetAccountTransactionHistoryResponse } from '../../../src/XRP/Generated/web/org/xrpl/rpc/v1/get_account_transaction_history_pb'
import XRPTransaction from '../../../src/XRP/model/xrp-transaction'
import { GetTransactionResponse } from '../../../src/XRP/Generated/web/org/xrpl/rpc/v1/get_transaction_pb'

// primitive test values
const testCurrencyName = 'currencyName'
const testCurrencyCode = new Uint8Array([1, 2, 3])
const testIssuedCurrencyValue = '100'
const testInvalidIssuedCurrencyValue = 'xrp' // non-numeric
const testAddress = 'XVfC9CTCJh6GN2x8bnrw3LtdbqiVCUFyQVMzRrMGUZpokKH'
const testDestination = 'XV5sbjUmgPpvXv4ixFWZ5ptAYZ6PD28Sq49uo34VyjnmK5H'
const testPublicKey = new Uint8Array([1, 2, 3])
const testTransactionSignature = new Uint8Array([4, 5, 6])
const testSequence = 1
const testFee = '3'

// VALID OBJECTS ===============================================

// Currency proto
const currencyProto: Currency = new Currency()
currencyProto.setCode(testCurrencyCode)
currencyProto.setName(testCurrencyName)

// AccountAddresses proto
const accountAddressProto = new AccountAddress()
accountAddressProto.setAddress(testAddress)

// IssuedCurrencyAmount proto
const issuedCurrencyProto = new IssuedCurrencyAmount()
issuedCurrencyProto.setCurrency(currencyProto)
issuedCurrencyProto.setIssuer(accountAddressProto)
issuedCurrencyProto.setValue(testIssuedCurrencyValue)

// Account proto
const transactionAccountProto = new Account()
transactionAccountProto.setValue(accountAddressProto)

// XRPDropsAmount proto
const transactionFeeProto = new XRPDropsAmount()
transactionFeeProto.setDrops(testFee)

// Sequence proto
const transactionSequenceProto = new Sequence()
transactionSequenceProto.setValue(testSequence)

// SigningPublicKey proto
const transactionSigningPublicKeyProto = new SigningPublicKey()
transactionSigningPublicKeyProto.setValue(testPublicKey)

// TransactionSignature proto
const transactionTransactionSignatureProto = new TransactionSignature()
transactionTransactionSignatureProto.setValue(testTransactionSignature)

// CurrencyAmount proto
const paymentCurrencyAmountProto = new CurrencyAmount()
paymentCurrencyAmountProto.setIssuedCurrencyAmount(issuedCurrencyProto)

// Amount proto
const paymentAmountProto = new Amount()
paymentAmountProto.setValue(paymentCurrencyAmountProto)

// AccountAddress proto
const destinationAccountAddressProto = new AccountAddress()
destinationAccountAddressProto.setAddress(testDestination)

// Destination proto
const paymentDestinationProto = new Destination()
paymentDestinationProto.setValue(destinationAccountAddressProto)

// Payment proto
const transactionPaymentProto = new Payment()
transactionPaymentProto.setAmount(paymentAmountProto)
transactionPaymentProto.setDestination(paymentDestinationProto)

// Transaction proto (PAYMENT) (only mandatory common fields set)
const testPaymentTransaction = new Transaction()
testPaymentTransaction.setAccount(transactionAccountProto)
testPaymentTransaction.setFee(transactionFeeProto)
testPaymentTransaction.setSequence(transactionSequenceProto)
testPaymentTransaction.setSigningPublicKey(transactionSigningPublicKeyProto)
testPaymentTransaction.setTransactionSignature(
  transactionTransactionSignatureProto,
)
testPaymentTransaction.setPayment(transactionPaymentProto)

// TransactionResponse proto
const getTransactionResponseProto = new GetTransactionResponse()
getTransactionResponseProto.setTransaction(testPaymentTransaction)

// Transaction proto (CHECKCASH) (only mandatory common fields set, currently unsupported)
const checkCashProto = new CheckCash()

const testCheckCashTransaction = new Transaction()
testCheckCashTransaction.setAccount(transactionAccountProto)
testCheckCashTransaction.setFee(transactionFeeProto)
testCheckCashTransaction.setSequence(transactionSequenceProto)
testCheckCashTransaction.setSigningPublicKey(transactionSigningPublicKeyProto)
testCheckCashTransaction.setTransactionSignature(
  transactionTransactionSignatureProto,
)
testCheckCashTransaction.setCheckCash(checkCashProto)

// GetAccountTransactionHistoryResponse proto
const testGetAccountTransactionHistoryResponse = new GetAccountTransactionHistoryResponse()
const transactionResponseList = [
  getTransactionResponseProto,
  getTransactionResponseProto,
]
testGetAccountTransactionHistoryResponse.setTransactionsList(
  transactionResponseList,
)

// INVALID OBJECTS =============================================

// Invalid IssuedCurrencyAmount proto
const invalidIssuedCurrencyProto = new IssuedCurrencyAmount()
invalidIssuedCurrencyProto.setCurrency(currencyProto)
invalidIssuedCurrencyProto.setIssuer(accountAddressProto)
invalidIssuedCurrencyProto.setValue(testInvalidIssuedCurrencyValue)

// Invalid CurrencyAmount proto
const invalidCurrencyAmountProto = new CurrencyAmount()
invalidCurrencyAmountProto.setIssuedCurrencyAmount(invalidIssuedCurrencyProto)

// Invalid Amount proto
const invalidAmountProto = new Amount()
invalidAmountProto.setValue(invalidCurrencyAmountProto)

// Invalid Payment proto
const invalidPaymentProto = new Payment()
invalidPaymentProto.setAmount(invalidAmountProto) // invalid via bad buried IssuedCurrencyAmount
invalidPaymentProto.setDestination(paymentDestinationProto)

// Invalid Transaction proto (PAYMENT, malformed) (only mandatory common fields set)
const testInvalidPaymentTransaction = new Transaction()
testInvalidPaymentTransaction.setAccount(transactionAccountProto)
testInvalidPaymentTransaction.setFee(transactionFeeProto)
testInvalidPaymentTransaction.setSequence(transactionSequenceProto)
testInvalidPaymentTransaction.setSigningPublicKey(
  transactionSigningPublicKeyProto,
)
testInvalidPaymentTransaction.setTransactionSignature(
  transactionTransactionSignatureProto,
)
testInvalidPaymentTransaction.setPayment(invalidPaymentProto)

// Invalid TransactionResponse proto
const invalidGetTransactionResponseProto = new GetTransactionResponse()
invalidGetTransactionResponseProto.setTransaction(testInvalidPaymentTransaction)

// Invalid GetAccountTransactionHistoryResponse proto
const testInvalidGetAccountTransactionHistoryResponse = new GetAccountTransactionHistoryResponse()
const invalidTransactionResponseList = [
  invalidGetTransactionResponseProto, // one bad transaction (malformed Payment)
  getTransactionResponseProto,
]
testInvalidGetAccountTransactionHistoryResponse.setTransactionsList(
  invalidTransactionResponseList,
)

// XRP OBJECTS ===================================================

// test XRPTransaction
const testXRPTransaction = XRPTransaction.from(testPaymentTransaction)!!

export {
  testPaymentTransaction,
  testInvalidPaymentTransaction,
  testCheckCashTransaction,
  testXRPTransaction,
  testGetAccountTransactionHistoryResponse,
  testInvalidGetAccountTransactionHistoryResponse,
}
