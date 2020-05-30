import { AccountSet } from '../../../src/XRP/Generated/web/org/xrpl/rpc/v1/transaction_pb'
import {
  ClearFlag,
  Domain,
  EmailHash,
  MessageKey,
  SetFlag,
  TransferRate,
  TickSize,
} from '../../../src/XRP/Generated/web/org/xrpl/rpc/v1/common_pb'

// Primitive test values ===============================================================

// AccountSet
const testClearFlag = 5
const testDomain = 'testdomain'
const testEmailHash = new Uint8Array([8, 9, 10])
const testMessageKey = new Uint8Array([11, 12, 13])
const testSetFlag = 4
const testTransferRate = 1234567890
const testTickSize = 7

// Protobuf objects ======================================================================

// AccountSet protos

// Establish sub-protos
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

export { testAccountSetProtoAllFields, testAccountSetProtoOneFieldSet }
