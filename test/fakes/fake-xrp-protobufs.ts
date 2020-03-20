import {
  Currency,
  CurrencyAmount,
  IssuedCurrencyAmount,
  XRPDropsAmount,
} from '../../src/generated/web/org/xrpl/rpc/v1/amount_pb'
import {
  Amount,
  Destination,
  Account,
  SigningPublicKey,
  TransactionSignature,
  Sequence,
} from '../../src/generated/web/org/xrpl/rpc/v1/common_pb'
import {
  Payment,
  Transaction,
} from '../../src/generated/web/org/xrpl/rpc/v1/transaction_pb'
import { AccountAddress } from '../../src/generated/web/org/xrpl/rpc/v1/account_pb'
import { GetAccountTransactionHistoryResponse } from '../../src/generated/web/org/xrpl/rpc/v1/get_account_transaction_history_pb'
import XRPTransaction from '../../src/XRP/xrp-transaction'
import { GetTransactionResponse } from '../../src/generated/web/org/xrpl/rpc/v1/get_transaction_pb'

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

// Invalid IssuedCurrencyAmount proto
const invalidIssuedCurrencyProto = new IssuedCurrencyAmount()
invalidIssuedCurrencyProto.setCurrency(currencyProto)
invalidIssuedCurrencyProto.setIssuer(accountAddressProto)
invalidIssuedCurrencyProto.setValue(testInvalidIssuedCurrencyValue)

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

// Transaction proto (only mandatory common fields set)
const testTransaction = new Transaction()
testTransaction.setAccount(transactionAccountProto)
testTransaction.setFee(transactionFeeProto)
testTransaction.setSequence(transactionSequenceProto)
testTransaction.setSigningPublicKey(transactionSigningPublicKeyProto)
testTransaction.setTransactionSignature(transactionTransactionSignatureProto)
testTransaction.setPayment(transactionPaymentProto)

const getTransactionResponseProto = new GetTransactionResponse()
getTransactionResponseProto.setTransaction(testTransaction)

// GetAccountTransactionHistoryResponse proto
const testGetAccountTransactionHistoryResponse = new GetAccountTransactionHistoryResponse()
const transactionResponseList = [
  getTransactionResponseProto,
  getTransactionResponseProto,
]
testGetAccountTransactionHistoryResponse.setTransactionsList(
  transactionResponseList,
)

// test XRPTransaction
const testXRPTransaction = XRPTransaction.from(testTransaction)

export {
  testTransaction,
  testXRPTransaction,
  testGetAccountTransactionHistoryResponse,
}
