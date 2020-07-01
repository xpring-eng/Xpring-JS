import {
  Currency,
  CurrencyAmount,
  IssuedCurrencyAmount,
  XRPDropsAmount,
} from '../../../src/XRP/Generated/web/org/xrpl/rpc/v1/amount_pb'
import {
  Amount,
  Date,
  Destination,
  Account,
  SigningPublicKey,
  TransactionSignature,
  Sequence,
  DestinationTag,
  DeliverMin,
  InvoiceID,
  SendMax,
  MemoData,
  MemoFormat,
  MemoType,
  AccountTransactionID,
  Flags,
  LastLedgerSequence,
  SourceTag,
  DeliveredAmount,
  SignerEntry,
  SignerWeight,
} from '../../../src/XRP/Generated/web/org/xrpl/rpc/v1/common_pb'
import {
  Payment,
  Transaction,
  CheckCash,
  Memo,
  Signer,
} from '../../../src/XRP/Generated/web/org/xrpl/rpc/v1/transaction_pb'
import { AccountAddress } from '../../../src/XRP/Generated/web/org/xrpl/rpc/v1/account_pb'
import { GetAccountTransactionHistoryResponse } from '../../../src/XRP/Generated/web/org/xrpl/rpc/v1/get_account_transaction_history_pb'
import XrpTransaction from '../../../src/XRP/model/xrp-transaction'
import { GetTransactionResponse } from '../../../src/XRP/Generated/web/org/xrpl/rpc/v1/get_transaction_pb'
import { Meta } from '../../../src/XRP/Generated/web/org/xrpl/rpc/v1/meta_pb'
import XrplNetwork from '../../../src/Common/xrpl-network'

// primitive test values
const testCurrencyName = 'currencyName'
const testCurrencyCode = new Uint8Array([1, 2, 3])
const testAddress = 'rsKouRxYLWGseFwXSAo57qXjcGiNqR55wr'
const testAddress2 = 'rPuNV4oA6f3SrKA4pLEpdVZW6QLvn3UJxK'
const testIssuedCurrencyValue = '100'
const testInvalidIssuedCurrencyValue = 'xrp' // non-numeric
const testPublicKey = new Uint8Array([1, 2, 3])
const testTransactionSignature = new Uint8Array([4, 5, 6])
const testSequence = 1
const testFee = '3'
const testDrops = '20'
const testDestinationTag = 2
const testInvoiceID = new Uint8Array([7, 8, 9])
const testMemoData = new Uint8Array([2, 4, 6])
const testMemoFormat = new Uint8Array([3, 6, 9])
const testMemoType = new Uint8Array([3, 2, 1])
const testAccountTransactionID = new Uint8Array([5, 6, 7])
const testFlags = 4
const testSourceTag = 6
const testLastLedgerSequence = 5
const testTransactionHash = new Uint8Array([3, 5, 7, 9])
// Set date to Ripple epoch, January 1, 2000 (00:00 UTC).
// Expected timestamp is in unix time, 946684800 after Unix epoch.
const testTimestamp = 0
const expectedTimestamp = 946684800
const testIsValidated = true
const testLedgerIndex = 1000
const testSignerWeight = 1

// VALID OBJECTS ===============================================

// Currency proto
const testCurrencyProto: Currency = new Currency()
testCurrencyProto.setCode(testCurrencyCode)
testCurrencyProto.setName(testCurrencyName)

// AccountAddress protos
const accountAddressProto = new AccountAddress()
accountAddressProto.setAddress(testAddress)

const testAccountAddressIssuer = new AccountAddress()
testAccountAddressIssuer.setAddress(testAddress2)

// PathElement protos
const testPathElementProto = new Payment.PathElement()
testPathElementProto.setCurrency(testCurrencyProto)
testPathElementProto.setAccount(accountAddressProto)
testPathElementProto.setIssuer(testAccountAddressIssuer)

const testEmptyPathElementProto = new Payment.PathElement()

// Path protos
const testEmptyPathProto = new Payment.Path()

const testPathProtoOneElement = new Payment.Path()
testPathProtoOneElement.addElements(testPathElementProto)

const testPathProtoThreeElements = new Payment.Path()
testPathProtoThreeElements.setElementsList([
  testPathElementProto,
  testPathElementProto,
  testPathElementProto,
])

// ... for Payment protos
const accountAddressProto456 = new AccountAddress()
accountAddressProto456.setAddress('r456')
const accountAddressProto789 = new AccountAddress()
accountAddressProto789.setAddress('r789')
const accountAddressProtoABC = new AccountAddress()
accountAddressProtoABC.setAddress('rabc')

const pathElementProto456 = new Payment.PathElement()
pathElementProto456.setAccount(accountAddressProto456)
const pathElementProto789 = new Payment.PathElement()
pathElementProto789.setAccount(accountAddressProto789)
const pathElementProtoABC = new Payment.PathElement()
pathElementProtoABC.setAccount(accountAddressProtoABC)

const pathProtoOneElement = new Payment.Path()
pathProtoOneElement.setElementsList([pathElementProto456])
const pathProtoTwoElements = new Payment.Path()
pathProtoTwoElements.setElementsList([pathElementProto789, pathElementProtoABC])

const paths = [pathProtoOneElement, pathProtoTwoElements]

// IssuedCurrencyAmount proto
const testIssuedCurrencyProto = new IssuedCurrencyAmount()
testIssuedCurrencyProto.setCurrency(testCurrencyProto)
testIssuedCurrencyProto.setIssuer(accountAddressProto)
testIssuedCurrencyProto.setValue(testIssuedCurrencyValue)

// Account proto
const transactionAccountProto = new Account()
transactionAccountProto.setValue(accountAddressProto)

// XRPDropsAmount protos
const xrpDropsProto = new XRPDropsAmount()
xrpDropsProto.setDrops(testDrops)

const transactionFeeProto = new XRPDropsAmount()
transactionFeeProto.setDrops(testFee)

// Sequence proto
const transactionSequenceProto = new Sequence()
transactionSequenceProto.setValue(testSequence)

// CurrencyAmount protos
const testCurrencyAmountProtoDrops = new CurrencyAmount()
testCurrencyAmountProtoDrops.setXrpAmount(xrpDropsProto)

const testCurrencyAmountProtoIssuedCurrency = new CurrencyAmount()
testCurrencyAmountProtoIssuedCurrency.setIssuedCurrencyAmount(
  testIssuedCurrencyProto,
)

// Amount proto
const paymentAmountProto = new Amount()
paymentAmountProto.setValue(testCurrencyAmountProtoIssuedCurrency)

// AccountAddress proto
const destinationAccountAddressProto = new AccountAddress()
destinationAccountAddressProto.setAddress(testAddress2)

// Destination proto
const paymentDestinationProto = new Destination()
paymentDestinationProto.setValue(destinationAccountAddressProto)

// DestinationTag proto
const destinationTagProto = new DestinationTag()
destinationTagProto.setValue(testDestinationTag)

// DeliverMin proto
const deliverMinProto = new DeliverMin()
deliverMinProto.setValue(testCurrencyAmountProtoDrops)

// InvoidID proto
const invoiceIDProto = new InvoiceID()
invoiceIDProto.setValue(testInvoiceID)

// SendMax proto
const sendMaxProto = new SendMax()
sendMaxProto.setValue(testCurrencyAmountProtoDrops)

// Payment protos
const testPaymentProtoAllFieldsSet = new Payment()
testPaymentProtoAllFieldsSet.setAmount(paymentAmountProto)
testPaymentProtoAllFieldsSet.setDestination(paymentDestinationProto)
testPaymentProtoAllFieldsSet.setDestinationTag(destinationTagProto)
testPaymentProtoAllFieldsSet.setDeliverMin(deliverMinProto)
testPaymentProtoAllFieldsSet.setInvoiceId(invoiceIDProto)
testPaymentProtoAllFieldsSet.setPathsList(paths)
testPaymentProtoAllFieldsSet.setSendMax(sendMaxProto)

const testPaymentProtoMandatoryFieldsOnly = new Payment()
testPaymentProtoMandatoryFieldsOnly.setAmount(paymentAmountProto)
testPaymentProtoMandatoryFieldsOnly.setDestination(paymentDestinationProto)

// Memo protos
const memoDataProto = new MemoData()
memoDataProto.setValue(testMemoData)
const memoFormatProto = new MemoFormat()
memoFormatProto.setValue(testMemoFormat)
const memoTypeProto = new MemoType()
memoTypeProto.setValue(testMemoType)

const testMemoProtoAllFields = new Memo()
testMemoProtoAllFields.setMemoData(memoDataProto)
testMemoProtoAllFields.setMemoFormat(memoFormatProto)
testMemoProtoAllFields.setMemoType(memoTypeProto)

const testEmptyMemoProto = new Memo()

// Account proto
const accountProto = new Account()
accountProto.setValue(accountAddressProto)

// SigningPublicKey proto
const signingPublicKeyProto = new SigningPublicKey()
signingPublicKeyProto.setValue(testPublicKey)

// TransactionSignature proto
const transactionSignatureProto = new TransactionSignature()
transactionSignatureProto.setValue(testTransactionSignature)

// Signer proto
const testSignerProto = new Signer()
testSignerProto.setAccount(accountProto)
testSignerProto.setSigningPublicKey(signingPublicKeyProto)
testSignerProto.setTransactionSignature(transactionSignatureProto)

// AccountTransactionID proto
const accountTransactionIDProto = new AccountTransactionID()
accountTransactionIDProto.setValue(testAccountTransactionID)

// Flags proto
const flagsProto = new Flags()
flagsProto.setValue(testFlags)

// LastLedgerSequence proto
const lastLedgerSequenceProto = new LastLedgerSequence()
lastLedgerSequenceProto.setValue(testLastLedgerSequence)

// SourceTag proto
const sourceTagProto = new SourceTag()
sourceTagProto.setValue(testSourceTag)

// Transaction protos
// (PAYMENT) (all fields set)
const testTransactionPaymentAllFields = new Transaction()
testTransactionPaymentAllFields.setAccount(accountProto)
testTransactionPaymentAllFields.setFee(transactionFeeProto)
testTransactionPaymentAllFields.setSequence(transactionSequenceProto)
testTransactionPaymentAllFields.setSigningPublicKey(signingPublicKeyProto)
testTransactionPaymentAllFields.setTransactionSignature(
  transactionSignatureProto,
)
testTransactionPaymentAllFields.setAccountTransactionId(
  accountTransactionIDProto,
)
testTransactionPaymentAllFields.setFlags(flagsProto)
testTransactionPaymentAllFields.setLastLedgerSequence(lastLedgerSequenceProto)
testTransactionPaymentAllFields.setMemosList([testMemoProtoAllFields])
testTransactionPaymentAllFields.setSignersList([testSignerProto])
testTransactionPaymentAllFields.setSourceTag(sourceTagProto)
testTransactionPaymentAllFields.setPayment(testPaymentProtoMandatoryFieldsOnly)

// (PAYMENT) (only mandatory common fields set)
const testTransactionPaymentMandatoryFields = new Transaction()
testTransactionPaymentMandatoryFields.setAccount(transactionAccountProto)
testTransactionPaymentMandatoryFields.setFee(transactionFeeProto)
testTransactionPaymentMandatoryFields.setSequence(transactionSequenceProto)
testTransactionPaymentMandatoryFields.setSigningPublicKey(signingPublicKeyProto)
testTransactionPaymentMandatoryFields.setTransactionSignature(
  transactionSignatureProto,
)
testTransactionPaymentMandatoryFields.setPayment(
  testPaymentProtoMandatoryFieldsOnly,
)

// (CHECKCASH) (only mandatory common fields set, currently unsupported)
const checkCashProto = new CheckCash()

const testCheckCashTransaction = new Transaction()
testCheckCashTransaction.setAccount(transactionAccountProto)
testCheckCashTransaction.setFee(transactionFeeProto)
testCheckCashTransaction.setSequence(transactionSequenceProto)
testCheckCashTransaction.setSigningPublicKey(signingPublicKeyProto)
testCheckCashTransaction.setTransactionSignature(transactionSignatureProto)
testCheckCashTransaction.setCheckCash(checkCashProto)

// Date proto
const dateProto = new Date()
dateProto.setValue(testTimestamp)

// DeliveredAmount proto
const deliveredAmountProto = new DeliveredAmount()
deliveredAmountProto.setValue(testCurrencyAmountProtoIssuedCurrency)

// Meta proto
const metaProto = new Meta()
metaProto.setDeliveredAmount(deliveredAmountProto)

// GetTransactionResponse protos
const testGetTransactionResponseProto = new GetTransactionResponse()
testGetTransactionResponseProto.setTransaction(testTransactionPaymentAllFields)
testGetTransactionResponseProto.setDate(dateProto)
testGetTransactionResponseProto.setHash(testTransactionHash)
testGetTransactionResponseProto.setMeta(metaProto)
testGetTransactionResponseProto.setValidated(testIsValidated)
testGetTransactionResponseProto.setLedgerIndex(testLedgerIndex)

const testGetTransactionResponseProtoMandatoryOnly = new GetTransactionResponse()
testGetTransactionResponseProtoMandatoryOnly.setTransaction(
  testTransactionPaymentMandatoryFields,
)
testGetTransactionResponseProtoMandatoryOnly.setHash(testTransactionHash)

// GetAccountTransactionHistoryResponse proto
const testGetAccountTransactionHistoryResponse = new GetAccountTransactionHistoryResponse()
const transactionResponseList = [
  testGetTransactionResponseProto,
  testGetTransactionResponseProto,
]
testGetAccountTransactionHistoryResponse.setTransactionsList(
  transactionResponseList,
)

// SignerEntry protos
const testAccountAddressProto = new AccountAddress()
testAccountAddressProto.setAddress(testAddress)

const testSignerEntryAccountProto = new Account()
testSignerEntryAccountProto.setValue(testAccountAddressProto)

const testSignerWeightProto = new SignerWeight()
testSignerWeightProto.setValue(testSignerWeight)

const testSignerEntryProto = new SignerEntry()
testSignerEntryProto.setAccount(testSignerEntryAccountProto)
testSignerEntryProto.setSignerWeight(testSignerWeightProto)

// INVALID OBJECTS =============================================

// Invalid IssuedCurrencyAmount proto
const testInvalidIssuedCurrencyProto = new IssuedCurrencyAmount()
testInvalidIssuedCurrencyProto.setCurrency(testCurrencyProto)
testInvalidIssuedCurrencyProto.setIssuer(accountAddressProto)
testInvalidIssuedCurrencyProto.setValue(testInvalidIssuedCurrencyValue)

// Invalid CurrencyAmount proto
const testInvalidCurrencyAmountProto = new CurrencyAmount()
testInvalidCurrencyAmountProto.setIssuedCurrencyAmount(
  testInvalidIssuedCurrencyProto,
)

// Invalid Amount proto
const invalidAmountProto = new Amount()
invalidAmountProto.setValue(testInvalidCurrencyAmountProto)

// Invalid DeliverMin proto
const invalidDeliverMinProto = new DeliverMin()
invalidDeliverMinProto.setValue(testInvalidCurrencyAmountProto)

// Invalid SendMax proto
const invalidSendMaxProto = new SendMax()
invalidSendMaxProto.setValue(testInvalidCurrencyAmountProto)

// Invalid Payment protos
const testInvalidPaymentProtoBadAmount = new Payment()
testInvalidPaymentProtoBadAmount.setAmount(invalidAmountProto) // invalid via bad buried IssuedCurrencyAmount
testInvalidPaymentProtoBadAmount.setDestination(paymentDestinationProto)

const testInvalidPaymentProtoBadDeliverMin = new Payment()
testInvalidPaymentProtoBadDeliverMin.setAmount(paymentAmountProto)
testInvalidPaymentProtoBadDeliverMin.setDestination(paymentDestinationProto)
testInvalidPaymentProtoBadDeliverMin.setDeliverMin(invalidDeliverMinProto)

const testInvalidPaymentProtoBadSendMax = new Payment()
testInvalidPaymentProtoBadSendMax.setAmount(paymentAmountProto)
testInvalidPaymentProtoBadSendMax.setDestination(paymentDestinationProto)
testInvalidPaymentProtoBadSendMax.setSendMax(invalidSendMaxProto)

// Invalid Transaction proto (PAYMENT, malformed) (only mandatory common fields set)
const testInvalidPaymentTransaction = new Transaction()
testInvalidPaymentTransaction.setAccount(transactionAccountProto)
testInvalidPaymentTransaction.setFee(transactionFeeProto)
testInvalidPaymentTransaction.setSequence(transactionSequenceProto)
testInvalidPaymentTransaction.setSigningPublicKey(signingPublicKeyProto)
testInvalidPaymentTransaction.setTransactionSignature(transactionSignatureProto)
testInvalidPaymentTransaction.setPayment(testInvalidPaymentProtoBadAmount)

// Invalid GetTransactionResponse protos
const testInvalidGetTransactionResponseProto = new GetTransactionResponse()
testInvalidGetTransactionResponseProto.setTransaction(
  testInvalidPaymentTransaction,
)
testInvalidGetTransactionResponseProto.setHash(testTransactionHash)

// ... unsupported transaction type
const testInvalidGetTransactionResponseProtoUnsupportedType = new GetTransactionResponse()
testInvalidGetTransactionResponseProtoUnsupportedType.setTransaction(
  testCheckCashTransaction,
)
testInvalidGetTransactionResponseProtoUnsupportedType.setHash(
  testTransactionHash,
)

// Invalid GetAccountTransactionHistoryResponse proto
const testInvalidGetAccountTransactionHistoryResponse = new GetAccountTransactionHistoryResponse()
const invalidTransactionResponseList = [
  testInvalidGetTransactionResponseProto, // one bad transaction (malformed Payment)
  testGetTransactionResponseProto,
]
testInvalidGetAccountTransactionHistoryResponse.setTransactionsList(
  invalidTransactionResponseList,
)

// XRP OBJECTS ===================================================

// test XrpTransaction
const testXrpTransaction = XrpTransaction.from(
  testGetTransactionResponseProto,
  XrplNetwork.Test,
)!

export {
  testCurrencyName,
  testCurrencyCode,
  testAddress,
  testAddress2,
  testIssuedCurrencyValue,
  testInvalidIssuedCurrencyValue,
  testPublicKey,
  testTransactionSignature,
  testSequence,
  testFee,
  testDrops,
  testDestinationTag,
  testInvoiceID,
  testMemoData,
  testMemoFormat,
  testMemoType,
  testAccountTransactionID,
  testFlags,
  testSourceTag,
  testLastLedgerSequence,
  testTransactionHash,
  testTimestamp,
  expectedTimestamp,
  testIsValidated,
  testLedgerIndex,
  testCurrencyProto,
  testPathElementProto,
  testEmptyPathElementProto,
  testEmptyPathProto,
  testPathProtoOneElement,
  testPathProtoThreeElements,
  testIssuedCurrencyProto,
  testCurrencyAmountProtoDrops,
  testCurrencyAmountProtoIssuedCurrency,
  testPaymentProtoAllFieldsSet,
  testPaymentProtoMandatoryFieldsOnly,
  testMemoProtoAllFields,
  testEmptyMemoProto,
  testSignerProto,
  testSignerEntryProto,
  testTransactionPaymentAllFields,
  testTransactionPaymentMandatoryFields,
  testGetTransactionResponseProto,
  testCheckCashTransaction,
  testXrpTransaction,
  testGetAccountTransactionHistoryResponse,
  testGetTransactionResponseProtoMandatoryOnly,
  testInvalidIssuedCurrencyProto,
  testInvalidCurrencyAmountProto,
  testInvalidPaymentProtoBadAmount,
  testInvalidPaymentProtoBadDeliverMin,
  testInvalidPaymentProtoBadSendMax,
  testInvalidPaymentTransaction,
  testInvalidGetTransactionResponseProto,
  testInvalidGetTransactionResponseProtoUnsupportedType,
  testInvalidGetAccountTransactionHistoryResponse,
}
