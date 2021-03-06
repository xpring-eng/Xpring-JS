import {
  AccountSet,
  AccountDelete,
  CheckCancel,
  CheckCash,
  CheckCreate,
  DepositPreauth,
  EscrowCancel,
  EscrowCreate,
  EscrowFinish,
  OfferCancel,
  OfferCreate,
  PaymentChannelClaim,
  PaymentChannelCreate,
  PaymentChannelFund,
  SetRegularKey,
  SignerListSet,
  TrustSet,
} from '../../../src/XRP/Generated/web/org/xrpl/rpc/v1/transaction_pb'
/* eslint-disable @typescript-eslint/no-magic-numbers --
 * ESLint flags the numbers in the Uint8Array as magic numbers,
 * but this is a fakes file for testing, so it's fine.
 */
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
  Fulfillment,
  TakerGets,
  TakerPays,
  Channel,
  Balance,
  PaymentChannelSignature,
  PublicKey,
  SettleDelay,
  RegularKey,
  SignerQuorum,
  SignerEntry,
  Account,
  SignerWeight,
  LimitAmount,
  QualityIn,
  QualityOut,
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
const testInvalidSetFlag = 5
const testTransferRate = 1234567890
const testInvalidLowTransferRate = 11
const testInvalidHighTransferRate = 9876543210
const testTickSize = 7
const testInvalidTickSize = 27

// AccountDelete values
const testDestination = 'rPEPPER7kfTD9w2To4CQk6UCfuHM9c6GDY'
const testDestinationTag = 13
const testInvalidDestination = 'badDestination'

// CheckCancel values
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
const testFinishAfterEarly = 533341558
const testCondition =
  'A0258020E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855810100'

// EscrowFinish values
const testFulfillment = 'A0028000'

// PaymentChannelClaim values
const testChannel =
  'C1AE6DDDEEC05CF2978C0BAD6FE302948E9533691DC749DCDD3B9E5992CA6198'
const testPaymentChannelSignature =
  '30440220718D264EF05CAED7C781FF6DE298DCAC68D002562C9BF3A07C1E721B420C0DAB02203A5A4779EF4D2CCC7BC3EF886676D803A9981B928D3B8ACA483B80ECA3CD7B9B'
const testPaymentChannelPublicKey =
  '32D2471DB72B27E3310F355BB33E339BF26F8392D5A93D3BC0FC3B566612DA0F0A'

// PaymentChannelCreate values
const testSettleDelay = 86400
const testPublicKey =
  '32D2471DB72B27E3310F355BB33E339BF26F8392D5A93D3BC0FC3B566612DA0F0A'

// SetRegularKey values
const testRegularKey = 'rAR8rR8sUkBoCZFawhkWzY4Y5YoyuznwD'

// SignerListSet values
const testDestination2 = 'rPuNV4oA6f3SrKA4pLEpdVZW6QLvn3UJxK'
const testSignerQuorum = 3
const testSignerWeight = 1
const testSignerQuorumDelete = 0

// TrustSet values
const testQualityIn = 5
const testQualityOut = 2

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
testEscrowCreateProtoMandatoryOnly.setFinishAfter(testFinishAfterProto)

// EscrowFinish protos
const testFulfillmentProto = new Fulfillment()
testFulfillmentProto.setValue(testFulfillment)

const testEscrowFinishProtoAllFields = new EscrowFinish()
testEscrowFinishProtoAllFields.setOwner(testOwnerProto)
testEscrowFinishProtoAllFields.setOfferSequence(testOfferSequenceProto)
testEscrowFinishProtoAllFields.setCondition(testConditionProto)
testEscrowFinishProtoAllFields.setFulfillment(testFulfillmentProto)

const testEscrowFinishProtoMandatoryOnly = new EscrowFinish()
testEscrowFinishProtoMandatoryOnly.setOwner(testOwnerProto)
testEscrowFinishProtoMandatoryOnly.setOfferSequence(testOfferSequenceProto)

// OfferCancel proto
const testOfferCancelProto = new OfferCancel()
testOfferCancelProto.setOfferSequence(testOfferSequenceProto)

// OfferCreate protos
const testTakerGetsProto = new TakerGets()
testTakerGetsProto.setValue(testCurrencyAmountProtoDrops)

const testTakerPaysProto = new TakerPays()
testTakerPaysProto.setValue(testCurrencyAmountProtoDrops)

const testOfferCreateProtoAllFields = new OfferCreate()
testOfferCreateProtoAllFields.setExpiration(testExpirationProto)
testOfferCreateProtoAllFields.setOfferSequence(testOfferSequenceProto)
testOfferCreateProtoAllFields.setTakerGets(testTakerGetsProto)
testOfferCreateProtoAllFields.setTakerPays(testTakerPaysProto)

const testOfferCreateProtoMandatoryOnly = new OfferCreate()
testOfferCreateProtoMandatoryOnly.setTakerGets(testTakerGetsProto)
testOfferCreateProtoMandatoryOnly.setTakerPays(testTakerPaysProto)

// PaymentChannelClaim protos
const testChannelProto = new Channel()
testChannelProto.setValue(testChannel)

const testBalanceProto = new Balance()
testBalanceProto.setValue(testCurrencyAmountProtoDrops)

const testPaymentChannelSignatureProto = new PaymentChannelSignature()
testPaymentChannelSignatureProto.setValue(testPaymentChannelSignature)

const testPaymentChannelPublicKeyProto = new PublicKey()
testPaymentChannelPublicKeyProto.setValue(testPaymentChannelPublicKey)

const testPaymentChannelClaimProtoAllFields = new PaymentChannelClaim()
testPaymentChannelClaimProtoAllFields.setChannel(testChannelProto)
testPaymentChannelClaimProtoAllFields.setBalance(testBalanceProto)
testPaymentChannelClaimProtoAllFields.setAmount(testAmountProto)
testPaymentChannelClaimProtoAllFields.setPaymentChannelSignature(
  testPaymentChannelSignatureProto,
)
testPaymentChannelClaimProtoAllFields.setPublicKey(
  testPaymentChannelPublicKeyProto,
)

const testPaymentChannelClaimProtoMandatoryOnly = new PaymentChannelClaim()
testPaymentChannelClaimProtoMandatoryOnly.setChannel(testChannelProto)

// PaymentChannelCreate protos
const testSettleDelayProto = new SettleDelay()
testSettleDelayProto.setValue(testSettleDelay)

const testPublicKeyProto = new PublicKey()
testPublicKeyProto.setValue(testPublicKey)

const testPaymentChannelCreateProtoAllFields = new PaymentChannelCreate()
testPaymentChannelCreateProtoAllFields.setAmount(testAmountProto)
testPaymentChannelCreateProtoAllFields.setDestination(testDestinationProto)
testPaymentChannelCreateProtoAllFields.setSettleDelay(testSettleDelayProto)
testPaymentChannelCreateProtoAllFields.setPublicKey(testPublicKeyProto)
testPaymentChannelCreateProtoAllFields.setCancelAfter(testCancelAfterProto)
testPaymentChannelCreateProtoAllFields.setDestinationTag(
  testDestinationTagProto,
)

const testPaymentChannelCreateProtoMandatoryOnly = new PaymentChannelCreate()
testPaymentChannelCreateProtoMandatoryOnly.setAmount(testAmountProto)
testPaymentChannelCreateProtoMandatoryOnly.setDestination(testDestinationProto)
testPaymentChannelCreateProtoMandatoryOnly.setSettleDelay(testSettleDelayProto)
testPaymentChannelCreateProtoMandatoryOnly.setPublicKey(testPublicKeyProto)

// PaymentChannelFund protos
const testPaymentChannelFundProtoAllFields = new PaymentChannelFund()
testPaymentChannelFundProtoAllFields.setChannel(testChannelProto)
testPaymentChannelFundProtoAllFields.setAmount(testAmountProto)
testPaymentChannelFundProtoAllFields.setExpiration(testExpirationProto)

const testPaymentChannelFundProtoMandatoryOnly = new PaymentChannelFund()
testPaymentChannelFundProtoMandatoryOnly.setChannel(testChannelProto)
testPaymentChannelFundProtoMandatoryOnly.setAmount(testAmountProto)

// SetRegularKey protos
const testAccountAddressProtoRegularKey = new AccountAddress()
testAccountAddressProtoRegularKey.setAddress(testRegularKey)

const testRegularKeyProto = new RegularKey()
testRegularKeyProto.setValue(testAccountAddressProtoRegularKey)

const testSetRegularKeyProtoWithKey = new SetRegularKey()
testSetRegularKeyProtoWithKey.setRegularKey(testRegularKeyProto)

const testSetRegularKeyProtoNoKey = new SetRegularKey()

// SignerListSet
const testSignerQuorumProto = new SignerQuorum()
testSignerQuorumProto.setValue(testSignerQuorum)

const testSignerQuorumProtoDelete = new SignerQuorum()
testSignerQuorumProtoDelete.setValue(testSignerQuorumDelete)

const testAccountAddressProto2 = new AccountAddress()
testAccountAddressProto2.setAddress(testDestination2)

const testAccountProto = new Account()
testAccountProto.setValue(testAccountAddressProto)

const testAccountProto2 = new Account()
testAccountProto2.setValue(testAccountAddressProto2)

const testSignerWeightProto = new SignerWeight()
testSignerWeightProto.setValue(testSignerWeight)

const testSignerEntry1 = new SignerEntry()
testSignerEntry1.setAccount(testAccountProto)
testSignerEntry1.setSignerWeight(testSignerWeightProto)

const testSignerEntry2 = new SignerEntry()
testSignerEntry2.setAccount(testAccountProto2)
testSignerEntry2.setSignerWeight(testSignerWeightProto)

const testSignerEntryList: Array<SignerEntry> = [
  testSignerEntry1,
  testSignerEntry2,
]

const testSignerListSetProto = new SignerListSet()
testSignerListSetProto.setSignerQuorum(testSignerQuorumProto)
testSignerListSetProto.setSignerEntriesList(testSignerEntryList)

const testSignerListSetProtoDelete = new SignerListSet()
testSignerListSetProtoDelete.setSignerQuorum(testSignerQuorumProtoDelete)
testSignerListSetProtoDelete.setSignerEntriesList([] as SignerEntry[])

// TrustSet protos
const testLimitAmountProto = new LimitAmount()
testLimitAmountProto.setValue(testCurrencyAmountProtoIssuedCurrency)

const testQualityInProto = new QualityIn()
testQualityInProto.setValue(testQualityIn)

const testQualityOutProto = new QualityOut()
testQualityOutProto.setValue(testQualityOut)

const testTrustSetProtoAllFields = new TrustSet()
testTrustSetProtoAllFields.setLimitAmount(testLimitAmountProto)
testTrustSetProtoAllFields.setQualityIn(testQualityInProto)
testTrustSetProtoAllFields.setQualityOut(testQualityOutProto)

const testTrustSetProtoMandatoryOnly = new TrustSet()
testTrustSetProtoMandatoryOnly.setLimitAmount(testLimitAmountProto)

// Invalid Protobuf Objects ========================================================================

// Invalid AccountSet proto (bad domain)
const testInvalidDomainProto = new Domain()
testInvalidDomainProto.setValue(testDomain.toUpperCase())

const testInvalidAccountSetProtoBadDomain = new AccountSet()
testInvalidAccountSetProtoBadDomain.setDomain(testInvalidDomainProto)

// Invalid AccountSet proto (invalid transferRate (too low))
const testInvalidLowTransferRateProto = new TransferRate()
testInvalidLowTransferRateProto.setValue(testInvalidLowTransferRate)

const testInvalidAccountSetProtoBadLowTransferRate = new AccountSet()
testInvalidAccountSetProtoBadLowTransferRate.setTransferRate(
  testInvalidLowTransferRateProto,
)

// Invalid AccountSet proto (invalid transferRate (too high))
const testInvalidHighTransferRateProto = new TransferRate()
testInvalidHighTransferRateProto.setValue(testInvalidHighTransferRate)

const testInvalidAccountSetProtoBadHighTransferRate = new AccountSet()
testInvalidAccountSetProtoBadHighTransferRate.setTransferRate(
  testInvalidHighTransferRateProto,
)

// Invalid AccountSet proto (invalid tickSize)
const testInvalidTickSizeProto = new TickSize()
testInvalidTickSizeProto.setValue(testInvalidTickSize)

const testInvalidAccountSetProtoBadTickSize = new AccountSet()
testInvalidAccountSetProtoBadTickSize.setTickSize(testInvalidTickSizeProto)

// Invalid AccountSet proto (clearFlag == setFlag)
const testInvalidSetFlagProto = new SetFlag()
testInvalidSetFlagProto.setValue(testInvalidSetFlag)

const testInvalidAccountSetProtoSameSetClearFlag = new AccountSet()
testInvalidAccountSetProtoSameSetClearFlag.setClearFlag(testClearFlagProto)
testInvalidAccountSetProtoSameSetClearFlag.setSetFlag(testInvalidSetFlagProto)

// Invalid AccountDelete proto (bad destination)
const testInvalidAccountAddressProto = new AccountAddress()
testInvalidAccountAddressProto.setAddress(testInvalidDestination)

const testInvalidDestinationProto = new Destination()
testInvalidDestinationProto.setValue(testInvalidAccountAddressProto)

const testInvalidAccountDeleteProto = new AccountDelete()
testInvalidAccountDeleteProto.setDestination(testInvalidDestinationProto)

// Invalid CheckCancel proto (missing checkId)
const testInvalidCheckCancelProto = new CheckCancel()

// Invalid CheckCash proto (missing checkId)
const testInvalidCheckCashProtoNoCheckId = new CheckCash()
testInvalidCheckCashProtoNoCheckId.setAmount(testAmountProto)

// Invalid CheckCash proto (missing both deliverMin and amount)
const testInvalidCheckCashProtoNoAmountDeliverMin = new CheckCash()
testInvalidCheckCashProtoNoAmountDeliverMin.setCheckId(testCheckIdProto)

// Invalid CheckCreate proto (missing destination)
const testInvalidCheckCreateProto = new CheckCreate()
testInvalidCheckCreateProto.setSendMax(testSendMaxProto)

// Invalid CheckCreate proto (bad destination)
const testInvalidCheckCreateProtoBadDestination = new CheckCreate()
testInvalidCheckCreateProtoBadDestination.setDestination(
  testInvalidDestinationProto,
)
testInvalidCheckCreateProtoBadDestination.setSendMax(testSendMaxProto)

// Invalid CheckCreate proto (missing SendMax)
const testInvalidCheckCreateProtoNoSendMax = new CheckCreate()
testInvalidCheckCreateProtoNoSendMax.setDestination(testDestinationProto)

// Invalid DepositPreauth proto (neither authorize nor unauthorize)
const testInvalidDepositPreauthProtoNoAuthUnauth = new DepositPreauth()

// Invalid DepositPreauth proto (bad authorize)
const testInvalidAuthorizeProto = new Authorize()
testInvalidAuthorizeProto.setValue(testInvalidAccountAddressProto)

const testInvalidUnauthorizeProto = new Unauthorize()
testInvalidUnauthorizeProto.setValue(testInvalidAccountAddressProto)

const testInvalidDepositPreauthProtoSetBadAuthorize = new DepositPreauth()
testInvalidDepositPreauthProtoSetBadAuthorize.setAuthorize(
  testInvalidAuthorizeProto,
)

// Invalid DepositPreauth proto (bad unauthorize)
const testInvalidDepositPreauthProtoSetBadUnauthorize = new DepositPreauth()
testInvalidDepositPreauthProtoSetBadUnauthorize.setUnauthorize(
  testInvalidUnauthorizeProto,
)

// Invalid EscrowCancel proto (missing owner)
const testInvalidEscrowCancelProtoNoOwner = new EscrowCancel()
testInvalidEscrowCancelProtoNoOwner.setOfferSequence(testOfferSequenceProto)

// Invalid EscrowCancel proto (bad owner)
const testInvalidOwnerProto = new Owner()
testInvalidOwnerProto.setValue(testInvalidAccountAddressProto)

const testInvalidEscrowCancelProtoBadOwner = new EscrowCancel()
testInvalidEscrowCancelProtoBadOwner.setOwner(testInvalidOwnerProto)
testInvalidEscrowCancelProtoBadOwner.setOfferSequence(testOfferSequenceProto)

// Invalid EscrowCancel proto (no offerSequence)
const testInvalidEscrowCancelProtoNoOfferSequence = new EscrowCancel()
testInvalidEscrowCancelProtoNoOfferSequence.setOwner(testOwnerProto)

// Invalid EscrowCreate proto (missing destination)
const testInvalidEscrowCreateProtoNoDestination = new EscrowCreate()
testInvalidEscrowCreateProtoNoDestination.setAmount(testAmountProto)
testInvalidEscrowCreateProtoNoDestination.setFinishAfter(testFinishAfterProto)

// Invalid EscrowCreate proto (bad destination)
const testInvalidEscrowCreateProtoBadDestination = new EscrowCreate()
testInvalidEscrowCreateProtoBadDestination.setAmount(testAmountProto)
testInvalidEscrowCreateProtoBadDestination.setDestination(
  testInvalidDestinationProto,
)
testInvalidEscrowCreateProtoBadDestination.setFinishAfter(testFinishAfterProto)

// Invalid EscrowCreate proto (no amount)
const testInvalidEscrowCreateProtoNoAmount = new EscrowCreate()
testInvalidEscrowCreateProtoNoAmount.setDestination(testDestinationProto)
testInvalidEscrowCreateProtoNoAmount.setFinishAfter(testFinishAfterProto)

// Invalid EscrowCreate proto (no XRP)
const testAmountProtoIssuedCurrency = new Amount()
testAmountProtoIssuedCurrency.setValue(testCurrencyAmountProtoIssuedCurrency)

const testInvalidEscrowCreateProtoNoXRP = new EscrowCreate()
testInvalidEscrowCreateProtoNoXRP.setDestination(testDestinationProto)
testInvalidEscrowCreateProtoNoXRP.setAmount(testAmountProtoIssuedCurrency)
testInvalidEscrowCreateProtoNoXRP.setFinishAfter(testFinishAfterProto)

// Invalid EscrowCreate proto (no cancelAfter or finishAfter)
const testInvalidEscrowCreateProtoNoCancelFinish = new EscrowCreate()
testInvalidEscrowCreateProtoNoCancelFinish.setDestination(testDestinationProto)
testInvalidEscrowCreateProtoNoCancelFinish.setAmount(testAmountProto)
testInvalidEscrowCreateProtoNoCancelFinish.setCondition(testConditionProto)

// Invalid EscrowCreate proto (finishAfter not before cancelAfter)
const testFinishAfterProtoEarly = new FinishAfter()
testFinishAfterProtoEarly.setValue(testFinishAfterEarly)

const testInvalidEscrowCreateProtoBadCancelFinish = new EscrowCreate()
testInvalidEscrowCreateProtoBadCancelFinish.setDestination(testDestinationProto)
testInvalidEscrowCreateProtoBadCancelFinish.setAmount(testAmountProto)
testInvalidEscrowCreateProtoBadCancelFinish.setCondition(testConditionProto)
testInvalidEscrowCreateProtoBadCancelFinish.setCancelAfter(testCancelAfterProto)
testInvalidEscrowCreateProtoBadCancelFinish.setFinishAfter(
  testFinishAfterProtoEarly,
)

// Invalid EscrowCreate proto (no finishAfter or condition)
const testInvalidEscrowCreateProtoNoFinishCondition = new EscrowCreate()
testInvalidEscrowCreateProtoNoFinishCondition.setDestination(
  testDestinationProto,
)
testInvalidEscrowCreateProtoNoFinishCondition.setAmount(testAmountProto)
testInvalidEscrowCreateProtoNoFinishCondition.setCancelAfter(
  testCancelAfterProto,
)

// Invalid EscrowFinish proto (missing owner)
const testInvalidEscrowFinishProtoNoOwner = new EscrowFinish()
testInvalidEscrowFinishProtoNoOwner.setOfferSequence(testOfferSequenceProto)

// Invalid EscrowFinish proto (bad owner)
const testInvalidEscrowFinishProtoBadOwner = new EscrowFinish()
testInvalidEscrowFinishProtoBadOwner.setOwner(testInvalidOwnerProto)
testInvalidEscrowFinishProtoBadOwner.setOfferSequence(testOfferSequenceProto)

// Invalid EscrowFinish proto (missing offerSequence)
const testInvalidEscrowFinishProtoNoOfferSequence = new EscrowFinish()
testInvalidEscrowFinishProtoNoOfferSequence.setOwner(testOwnerProto)

// Invalid OfferCancel proto (missing offerSequence)
const testInvalidOfferCancelProto = new OfferCancel()

// Invalid OfferCreate proto (missing takerGets)
const testInvalidOfferCreateProtoNoTakerGets = new OfferCreate()
testInvalidOfferCreateProtoNoTakerGets.setTakerPays(testTakerPaysProto)

// Invalid OfferCreate proto (missing takerPays)
const testInvalidOfferCreateProtoNoTakerPays = new OfferCreate()
testInvalidOfferCreateProtoNoTakerPays.setTakerGets(testTakerGetsProto)

// Invalid PaymentChannelClaim proto (missing channel)
const testInvalidPaymentChannelClaimProtoNoChannel = new PaymentChannelClaim()

// Invalid PaymentChannelClaim proto (missing publicKey with signature)
const testInvalidPaymentChannelClaimProtoSignatureNoPublicKey = new PaymentChannelClaim()
testInvalidPaymentChannelClaimProtoSignatureNoPublicKey.setChannel(
  testChannelProto,
)
testInvalidPaymentChannelClaimProtoSignatureNoPublicKey.setBalance(
  testBalanceProto,
)
testInvalidPaymentChannelClaimProtoSignatureNoPublicKey.setAmount(
  testAmountProto,
)
testInvalidPaymentChannelClaimProtoSignatureNoPublicKey.setPaymentChannelSignature(
  testPaymentChannelSignatureProto,
)

// Invalid PaymentChannelCreate proto (missing amount)
const testInvalidPaymentChannelCreateProtoNoAmount = new PaymentChannelCreate()
testInvalidPaymentChannelCreateProtoNoAmount.setDestination(
  testDestinationProto,
)
testInvalidPaymentChannelCreateProtoNoAmount.setSettleDelay(
  testSettleDelayProto,
)
testInvalidPaymentChannelCreateProtoNoAmount.setPublicKey(testPublicKeyProto)

// Invalid PaymentChannelCreate proto (missing destination)
const testInvalidPaymentChannelCreateProtoNoDestination = new PaymentChannelCreate()
testInvalidPaymentChannelCreateProtoNoDestination.setAmount(testAmountProto)
testInvalidPaymentChannelCreateProtoNoDestination.setSettleDelay(
  testSettleDelayProto,
)
testInvalidPaymentChannelCreateProtoNoDestination.setPublicKey(
  testPublicKeyProto,
)

// Invalid PaymentChannelCreate proto (bad destination)
const testInvalidPaymentChannelCreateProtoBadDestination = new PaymentChannelCreate()
testInvalidPaymentChannelCreateProtoBadDestination.setAmount(testAmountProto)
testInvalidPaymentChannelCreateProtoBadDestination.setDestination(
  testInvalidDestinationProto,
)
testInvalidPaymentChannelCreateProtoBadDestination.setSettleDelay(
  testSettleDelayProto,
)
testInvalidPaymentChannelCreateProtoBadDestination.setPublicKey(
  testPublicKeyProto,
)

// Invalid PaymentChannelCreate proto (missing settleDelay)
const testInvalidPaymentChannelCreateProtoNoSettleDelay = new PaymentChannelCreate()
testInvalidPaymentChannelCreateProtoNoSettleDelay.setAmount(testAmountProto)
testInvalidPaymentChannelCreateProtoNoSettleDelay.setDestination(
  testDestinationProto,
)
testInvalidPaymentChannelCreateProtoNoSettleDelay.setPublicKey(
  testPublicKeyProto,
)

// Invalid PaymentChannelCreate proto (missing publicKey)
const testInvalidPaymentChannelCreateProtoNoPublicKey = new PaymentChannelCreate()
testInvalidPaymentChannelCreateProtoNoPublicKey.setAmount(testAmountProto)
testInvalidPaymentChannelCreateProtoNoPublicKey.setDestination(
  testDestinationProto,
)
testInvalidPaymentChannelCreateProtoNoPublicKey.setSettleDelay(
  testSettleDelayProto,
)

// Invalid PaymentChannelFund proto (missing amount)
const testInvalidPaymentChannelFundProtoNoAmount = new PaymentChannelFund()
testInvalidPaymentChannelFundProtoNoAmount.setChannel(testChannelProto)

// Invalid PaymentChannelFund proto (missing channel)
const testInvalidPaymentChannelFundProtoNoChannel = new PaymentChannelFund()
testInvalidPaymentChannelFundProtoNoChannel.setAmount(testAmountProto)

// Invalid SignerListSet proto (missing SignerQuorum)
const testInvalidSignerListSetProtoNoSignerQuorum = new SignerListSet()
testInvalidSignerListSetProtoNoSignerQuorum.setSignerEntriesList(
  testSignerEntryList,
)

// Invalid SignerListSet proto (missing SignerEntries)
const testInvalidSignerListSetProtoNoSignerEntries = new SignerListSet()
testInvalidSignerListSetProtoNoSignerEntries.setSignerQuorum(
  testSignerQuorumProto,
)

// Invalid SignerListSet proto (too many elements in SignerEntries)
const testInvalidSignerEntryListProtoTooManyElements: Array<SignerEntry> = [
  testSignerEntry1,
  testSignerEntry2,
  testSignerEntry1,
  testSignerEntry2,
  testSignerEntry1,
  testSignerEntry2,
  testSignerEntry1,
  testSignerEntry2,
  testSignerEntry1,
  testSignerEntry2,
]

const testInvalidSignerListSetProtoTooManySignerEntries = new SignerListSet()
testInvalidSignerListSetProtoTooManySignerEntries.setSignerQuorum(
  testSignerQuorumProto,
)
testInvalidSignerListSetProtoTooManySignerEntries.setSignerEntriesList(
  testInvalidSignerEntryListProtoTooManyElements,
)

// Invalid SignerListSet proto (too many elements in SignerEntries)
const testInvalidSignerEntryListRepeatAddresses: Array<SignerEntry> = [
  testSignerEntry1,
  testSignerEntry2,
  testSignerEntry1,
  testSignerEntry2,
]

const testInvalidSignerListSetProtoRepeatAddresses = new SignerListSet()
testInvalidSignerListSetProtoRepeatAddresses.setSignerQuorum(
  testSignerQuorumProto,
)
testInvalidSignerListSetProtoRepeatAddresses.setSignerEntriesList(
  testInvalidSignerEntryListRepeatAddresses,
)

// Invalid TrustSet proto (missing limitAmount)
const testInvalidTrustSetProto = new TrustSet()
testInvalidTrustSetProto.setQualityIn(testQualityInProto)
testInvalidTrustSetProto.setQualityOut(testQualityOutProto)

// Invalid TrustSet proto (limitAmount uses XRP)
const testInvalidLimitAmountProto = new LimitAmount()
testInvalidLimitAmountProto.setValue(testCurrencyAmountProtoDrops)

const testInvalidTrustSetProtoXRP = new TrustSet()
testInvalidTrustSetProtoXRP.setLimitAmount(testInvalidLimitAmountProto)

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
  testEscrowFinishProtoAllFields,
  testEscrowFinishProtoMandatoryOnly,
  testOfferCancelProto,
  testOfferCreateProtoAllFields,
  testOfferCreateProtoMandatoryOnly,
  testPaymentChannelClaimProtoAllFields,
  testPaymentChannelClaimProtoMandatoryOnly,
  testPaymentChannelCreateProtoAllFields,
  testPaymentChannelCreateProtoMandatoryOnly,
  testPaymentChannelFundProtoAllFields,
  testPaymentChannelFundProtoMandatoryOnly,
  testSetRegularKeyProtoWithKey,
  testSetRegularKeyProtoNoKey,
  testSignerEntry1,
  testSignerEntry2,
  testSignerListSetProto,
  testSignerListSetProtoDelete,
  testTrustSetProtoAllFields,
  testTrustSetProtoMandatoryOnly,
  testInvalidAccountSetProtoBadDomain,
  testInvalidAccountSetProtoBadLowTransferRate,
  testInvalidAccountSetProtoBadHighTransferRate,
  testInvalidAccountSetProtoBadTickSize,
  testInvalidAccountSetProtoSameSetClearFlag,
  testInvalidAccountDeleteProto,
  testInvalidCheckCancelProto,
  testInvalidCheckCashProtoNoCheckId,
  testInvalidCheckCashProtoNoAmountDeliverMin,
  testInvalidCheckCreateProto,
  testInvalidCheckCreateProtoBadDestination,
  testInvalidCheckCreateProtoNoSendMax,
  testInvalidDepositPreauthProtoNoAuthUnauth,
  testInvalidDepositPreauthProtoSetBadAuthorize,
  testInvalidDepositPreauthProtoSetBadUnauthorize,
  testInvalidEscrowCancelProtoNoOwner,
  testInvalidEscrowCancelProtoBadOwner,
  testInvalidEscrowCancelProtoNoOfferSequence,
  testInvalidEscrowCreateProtoNoDestination,
  testInvalidEscrowCreateProtoBadDestination,
  testInvalidEscrowCreateProtoNoAmount,
  testInvalidEscrowCreateProtoBadCancelFinish,
  testInvalidEscrowCreateProtoNoCancelFinish,
  testInvalidEscrowCreateProtoNoFinishCondition,
  testInvalidEscrowCreateProtoNoXRP,
  testInvalidEscrowFinishProtoNoOwner,
  testInvalidEscrowFinishProtoBadOwner,
  testInvalidEscrowFinishProtoNoOfferSequence,
  testInvalidOfferCancelProto,
  testInvalidOfferCreateProtoNoTakerGets,
  testInvalidOfferCreateProtoNoTakerPays,
  testInvalidPaymentChannelClaimProtoNoChannel,
  testInvalidPaymentChannelClaimProtoSignatureNoPublicKey,
  testInvalidPaymentChannelCreateProtoNoAmount,
  testInvalidPaymentChannelCreateProtoNoDestination,
  testInvalidPaymentChannelCreateProtoBadDestination,
  testInvalidPaymentChannelCreateProtoNoSettleDelay,
  testInvalidPaymentChannelCreateProtoNoPublicKey,
  testInvalidPaymentChannelFundProtoNoAmount,
  testInvalidPaymentChannelFundProtoNoChannel,
  testInvalidSignerListSetProtoNoSignerQuorum,
  testInvalidSignerListSetProtoNoSignerEntries,
  testInvalidSignerListSetProtoTooManySignerEntries,
  testInvalidSignerListSetProtoRepeatAddresses,
  testInvalidTrustSetProto,
  testInvalidTrustSetProtoXRP,
}
