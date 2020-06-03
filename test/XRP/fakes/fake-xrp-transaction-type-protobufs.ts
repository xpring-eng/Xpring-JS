import {
  AccountSet,
  AccountDelete,
  CheckCancel,
  CheckCash,
  CheckCreate,
  DepositPreauth,
  EscrowCancel,
  EscrowCreate,
} from '../../../src/XRP/Generated/web/org/xrpl/rpc/v1/transaction_pb'
import {
  ClearFlag,
  Domain,
  EmailHash,
  MessageKey,
  SetFlag,
  TransferRate,
  TickSize,
  Destination,
  DestinationTag,
  CheckID,
  Amount,
  DeliverMin,
  Expiration,
  SendMax,
  InvoiceID,
  Authorize,
  Unauthorize,
  Owner,
  OfferSequence,
  CancelAfter,
  FinishAfter,
  Condition,
} from '../../../src/XRP/Generated/web/org/xrpl/rpc/v1/common_pb'
import { AccountAddress } from '../../../src/XRP/Generated/web/org/xrpl/rpc/v1/account_pb'
import {
  testCurrencyAmountProtoDrops,
  testCurrencyAmountProtoIssuedCurrency,
} from './fake-xrp-protobufs'

// Primitive test values ===============================================================

// AccountSet values

const testClearFlag = 5
const testDomain = 'testdomain'
const testEmailHash = new Uint8Array([8, 9, 10])
const testMessageKey = new Uint8Array([11, 12, 13])
const testSetFlag = 4
const testTransferRate = 1234567890
const testTickSize = 7

// AccountDelete values
const testDestination = 'rPEPPER7kfTD9w2To4CQk6UCfuHM9c6GDY'
const testDestinationTag = 13

// CheckCancel, CheckCash values
const testCheckId =
  '49647F0D748DC3FE26BDACBC57F251AADEFFF391403EC9BF87C97F67E9977FB0'

// CheckCreate values
const testInvoiceId =
  '6F1DFD1D0FE8A32E40E1F2C05CF1C15545BAB56B617F9C6C2D63A6B704BEF59B'
const testExpiration = 570113521

// EscrowCancel values
const testOfferSequence = 23

// EscrowCreate values
const testCancelAfter = 533257958
const testFinishAfter = 533171558
const testCondition =
  'A0258020E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855810100'
// Protobuf objects ======================================================================

// AccountSet protos

const testClearFlagProto = new ClearFlag()
testClearFlagProto.setValue(testClearFlag)

const testDomainProto = new Domain()
testDomainProto.setValue(testDomain)

const testEmailHashProto = new EmailHash()
testEmailHashProto.setValue(testEmailHash)

const testMessageKeyProto = new MessageKey()
testMessageKeyProto.setValue(testMessageKey)

const testSetFlagProto = new SetFlag()
testSetFlagProto.setValue(testSetFlag)

const testTransferRateProto = new TransferRate()
testTransferRateProto.setValue(testTransferRate)

const testTickSizeProto = new TickSize()
testTickSizeProto.setValue(testTickSize)

const testAccountSetProtoAllFields = new AccountSet()
testAccountSetProtoAllFields.setClearFlag(testClearFlagProto)
testAccountSetProtoAllFields.setDomain(testDomainProto)
testAccountSetProtoAllFields.setEmailHash(testEmailHashProto)
testAccountSetProtoAllFields.setMessageKey(testMessageKeyProto)
testAccountSetProtoAllFields.setSetFlag(testSetFlagProto)
testAccountSetProtoAllFields.setTransferRate(testTransferRateProto)
testAccountSetProtoAllFields.setTickSize(testTickSizeProto)

const testAccountSetProtoOneFieldSet = new AccountSet()
testAccountSetProtoOneFieldSet.setClearFlag(testClearFlagProto)

// AccountDelete protos
const testAccountAddressProto = new AccountAddress()
testAccountAddressProto.setAddress(testDestination)

const testDestinationProto = new Destination()
testDestinationProto.setValue(testAccountAddressProto)

const testDestinationTagProto = new DestinationTag()
testDestinationTagProto.setValue(testDestinationTag)

const testAccountDeleteProto = new AccountDelete()
testAccountDeleteProto.setDestination(testDestinationProto)
testAccountDeleteProto.setDestinationTag(testDestinationTagProto)

const testAccountDeleteProtoNoTag = new AccountDelete()
testAccountDeleteProtoNoTag.setDestination(testDestinationProto)

// CheckCancel proto
const testCheckIdProto = new CheckID()
testCheckIdProto.setValue(testCheckId)

const testCheckCancelProto = new CheckCancel()
testCheckCancelProto.setCheckId(testCheckIdProto)

// CheckCash protos
const testAmountProto = new Amount()
testAmountProto.setValue(testCurrencyAmountProtoDrops)

const testCheckCashProtoWithAmount = new CheckCash()
testCheckCashProtoWithAmount.setCheckId(testCheckIdProto)
testCheckCashProtoWithAmount.setAmount(testAmountProto)

const testDeliverMinProto = new DeliverMin()
testDeliverMinProto.setValue(testCurrencyAmountProtoIssuedCurrency)

const testCheckCashProtoWithDeliverMin = new CheckCash()
testCheckCashProtoWithDeliverMin.setCheckId(testCheckIdProto)
testCheckCashProtoWithDeliverMin.setDeliverMin(testDeliverMinProto)

// CheckCreate protos
const testSendMaxProto = new SendMax()
testSendMaxProto.setValue(testCurrencyAmountProtoDrops)

const testExpirationProto = new Expiration()
testExpirationProto.setValue(testExpiration)

const testInvoiceIdProto = new InvoiceID()
testInvoiceIdProto.setValue(testInvoiceId)

const testCheckCreateProtoAllFields = new CheckCreate()
testCheckCreateProtoAllFields.setDestination(testDestinationProto)
testCheckCreateProtoAllFields.setSendMax(testSendMaxProto)
testCheckCreateProtoAllFields.setDestinationTag(testDestinationTagProto)
testCheckCreateProtoAllFields.setExpiration(testExpirationProto)
testCheckCreateProtoAllFields.setInvoiceId(testInvoiceIdProto)

const testCheckCreateProtoMandatoryFields = new CheckCreate()
testCheckCreateProtoMandatoryFields.setDestination(testDestinationProto)
testCheckCreateProtoMandatoryFields.setSendMax(testSendMaxProto)

// DepositPreauth protos
const testAuthorizeProto = new Authorize()
testAuthorizeProto.setValue(testAccountAddressProto)

const testUnauthorizeProto = new Unauthorize()
testUnauthorizeProto.setValue(testAccountAddressProto)

const testDepositPreauthProtoSetAuthorize = new DepositPreauth()
testDepositPreauthProtoSetAuthorize.setAuthorize(testAuthorizeProto)

const testDepositPreauthProtoSetUnauthorize = new DepositPreauth()
testDepositPreauthProtoSetUnauthorize.setUnauthorize(testUnauthorizeProto)

// EscrowCancel proto
const testOwnerProto = new Owner()
testOwnerProto.setValue(testAccountAddressProto)

const testOfferSequenceProto = new OfferSequence()
testOfferSequenceProto.setValue(testOfferSequence)

const testEscrowCancelProto = new EscrowCancel()
testEscrowCancelProto.setOwner(testOwnerProto)
testEscrowCancelProto.setOfferSequence(testOfferSequenceProto)

// EscrowCreate protos
const testCancelAfterProto = new CancelAfter()
testCancelAfterProto.setValue(testCancelAfter)

const testFinishAfterProto = new FinishAfter()
testFinishAfterProto.setValue(testFinishAfter)

const testConditionProto = new Condition()
testConditionProto.setValue(testCondition)

const testEscrowCreateProtoAllFields = new EscrowCreate()
testEscrowCreateProtoAllFields.setAmount(testAmountProto)
testEscrowCreateProtoAllFields.setDestination(testDestinationProto)
testEscrowCreateProtoAllFields.setCancelAfter(testCancelAfterProto)
testEscrowCreateProtoAllFields.setFinishAfter(testFinishAfterProto)
testEscrowCreateProtoAllFields.setCondition(testConditionProto)
testEscrowCreateProtoAllFields.setDestinationTag(testDestinationTagProto)

const testEscrowCreateProtoMandatoryOnly = new EscrowCreate()
testEscrowCreateProtoMandatoryOnly.setAmount(testAmountProto)
testEscrowCreateProtoMandatoryOnly.setDestination(testDestinationProto)

// Invalid Protobuf Objects ========================================================================

// Invalid CheckCancel proto (missing checkId)
const testInvalidCheckCancelProto = new CheckCancel()

// Invalid CheckCash proto (missing checkId)
const testInvalidCheckCashProto = new CheckCash()
testInvalidCheckCashProto.setAmount(testAmountProto)

// Invalid CheckCreate proto (missing destination)
const testInvalidCheckCreateProto = new CheckCreate()
testInvalidCheckCreateProto.setSendMax(testSendMaxProto)

// Invalid EscrowCancel proto (missing owner)
const testInvalidEscrowCancelProto = new EscrowCancel()
testInvalidEscrowCancelProto.setOfferSequence(testOfferSequenceProto)

// Invalid EscrowCreate proto (missing destination)
const testInvalidEscrowCreateProto = new EscrowCreate()
testInvalidEscrowCreateProto.setAmount(testAmountProto)

export {
  testAccountSetProtoAllFields,
  testAccountSetProtoOneFieldSet,
  testAccountDeleteProto,
  testAccountDeleteProtoNoTag,
  testCheckCancelProto,
  testCheckCashProtoWithAmount,
  testCheckCashProtoWithDeliverMin,
  testCheckCreateProtoAllFields,
  testCheckCreateProtoMandatoryFields,
  testDepositPreauthProtoSetAuthorize,
  testDepositPreauthProtoSetUnauthorize,
  testEscrowCancelProto,
  testEscrowCreateProtoAllFields,
  testEscrowCreateProtoMandatoryOnly,
  testInvalidCheckCancelProto,
  testInvalidCheckCashProto,
  testInvalidCheckCreateProto,
  testInvalidEscrowCancelProto,
  testInvalidEscrowCreateProto,
}
