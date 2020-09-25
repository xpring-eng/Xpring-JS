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
const testTransferRate = 1234567890
const testTickSize = 7

// AccountDelete values
const testDestination = 'rPEPPER7kfTD9w2To4CQk6UCfuHM9c6GDY'
const testDestinationTag = 13

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
const testSignerQuorum = 3
const testSignerWeight = 1

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

const testAccountProto = new Account()
testAccountProto.setValue(testAccountAddressProto)

const testSignerWeightProto = new SignerWeight()
testSignerWeightProto.setValue(testSignerWeight)

const testSignerEntry1 = new SignerEntry()
testSignerEntry1.setAccount(testAccountProto)
testSignerEntry1.setSignerWeight(testSignerWeightProto)

const testSignerEntry2 = new SignerEntry()
testSignerEntry2.setAccount(testAccountProto)
testSignerEntry2.setSignerWeight(testSignerWeightProto)

const testSignerEntryList: Array<SignerEntry> = [
  testSignerEntry1,
  testSignerEntry2,
]

const testSignerListSetProto = new SignerListSet()
testSignerListSetProto.setSignerQuorum(testSignerQuorumProto)
testSignerListSetProto.setSignerEntriesList(testSignerEntryList)

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

// Invalid EscrowFinish proto (missing owner)
const testInvalidEscrowFinishProto = new EscrowFinish()
testInvalidEscrowFinishProto.setOfferSequence(testOfferSequenceProto)

// Invalid OfferCancel proto (missing offerSequence)
const testInvalidOfferCancelProto = new OfferCancel()

// Invalid OfferCreate proto (missing takerGets)
const testInvalidOfferCreateProtoNoTakerGets = new OfferCreate()
testInvalidOfferCreateProtoNoTakerGets.setTakerPays(testTakerPaysProto)

// Invalid OfferCreate proto (missing takerGets)
const testInvalidOfferCreateProtoNoTakerPays = new OfferCreate()
testInvalidOfferCreateProtoNoTakerPays.setTakerGets(testTakerGetsProto)

// Invalid PaymentChannelClaim proto (missing channel)
const testInvalidPaymentChannelClaimProto = new PaymentChannelClaim()

// Invalid PaymentChannelCreate proto (missing destination)
const testInvalidPaymentChannelCreateProto = new PaymentChannelCreate()
testInvalidPaymentChannelCreateProto.setAmount(testAmountProto)

// Invalid PaymentChannelFund proto (missing amount)
const testInvalidPaymentChannelFundProto = new PaymentChannelFund()
testInvalidPaymentChannelFundProto.setChannel(testChannelProto)

// Invalid SignerListSet proto (missing SignerEntries)
const testInvalidSignerListSetProto = new SignerListSet()
testInvalidSignerListSetProto.setSignerEntriesList(testSignerEntryList)

// Invalid TrustSet proto (missing limitAmount)
const testInvalidTrustSetProto = new TrustSet()
testInvalidTrustSetProto.setQualityIn(testQualityInProto)
testInvalidTrustSetProto.setQualityOut(testQualityOutProto)

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
  testTrustSetProtoAllFields,
  testTrustSetProtoMandatoryOnly,
  testInvalidCheckCancelProto,
  testInvalidCheckCashProto,
  testInvalidCheckCreateProto,
  testInvalidEscrowCancelProto,
  testInvalidEscrowCreateProto,
  testInvalidEscrowFinishProto,
  testInvalidOfferCancelProto,
  testInvalidOfferCreateProtoNoTakerGets,
  testInvalidOfferCreateProtoNoTakerPays,
  testInvalidPaymentChannelClaimProto,
  testInvalidPaymentChannelCreateProto,
  testInvalidPaymentChannelFundProto,
  testInvalidSignerListSetProto,
  testInvalidTrustSetProto,
}
