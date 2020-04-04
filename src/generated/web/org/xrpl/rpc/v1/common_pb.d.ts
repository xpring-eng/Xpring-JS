import * as jspb from "google-protobuf"

import * as org_xrpl_rpc_v1_amount_pb from '../../../../org/xrpl/rpc/v1/amount_pb';
import * as org_xrpl_rpc_v1_account_pb from '../../../../org/xrpl/rpc/v1/account_pb';

export class CancelAfter extends jspb.Message {
  getValue(): number;
  setValue(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CancelAfter.AsObject;
  static toObject(includeInstance: boolean, msg: CancelAfter): CancelAfter.AsObject;
  static serializeBinaryToWriter(message: CancelAfter, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CancelAfter;
  static deserializeBinaryFromReader(message: CancelAfter, reader: jspb.BinaryReader): CancelAfter;
}

export namespace CancelAfter {
  export type AsObject = {
    value: number,
  }
}

export class ClearFlag extends jspb.Message {
  getValue(): number;
  setValue(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClearFlag.AsObject;
  static toObject(includeInstance: boolean, msg: ClearFlag): ClearFlag.AsObject;
  static serializeBinaryToWriter(message: ClearFlag, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClearFlag;
  static deserializeBinaryFromReader(message: ClearFlag, reader: jspb.BinaryReader): ClearFlag;
}

export namespace ClearFlag {
  export type AsObject = {
    value: number,
  }
}

export class CloseTime extends jspb.Message {
  getValue(): number;
  setValue(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CloseTime.AsObject;
  static toObject(includeInstance: boolean, msg: CloseTime): CloseTime.AsObject;
  static serializeBinaryToWriter(message: CloseTime, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CloseTime;
  static deserializeBinaryFromReader(message: CloseTime, reader: jspb.BinaryReader): CloseTime;
}

export namespace CloseTime {
  export type AsObject = {
    value: number,
  }
}

export class Date extends jspb.Message {
  getValue(): number;
  setValue(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Date.AsObject;
  static toObject(includeInstance: boolean, msg: Date): Date.AsObject;
  static serializeBinaryToWriter(message: Date, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Date;
  static deserializeBinaryFromReader(message: Date, reader: jspb.BinaryReader): Date;
}

export namespace Date {
  export type AsObject = {
    value: number,
  }
}

export class DestinationTag extends jspb.Message {
  getValue(): number;
  setValue(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DestinationTag.AsObject;
  static toObject(includeInstance: boolean, msg: DestinationTag): DestinationTag.AsObject;
  static serializeBinaryToWriter(message: DestinationTag, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DestinationTag;
  static deserializeBinaryFromReader(message: DestinationTag, reader: jspb.BinaryReader): DestinationTag;
}

export namespace DestinationTag {
  export type AsObject = {
    value: number,
  }
}

export class Expiration extends jspb.Message {
  getValue(): number;
  setValue(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Expiration.AsObject;
  static toObject(includeInstance: boolean, msg: Expiration): Expiration.AsObject;
  static serializeBinaryToWriter(message: Expiration, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Expiration;
  static deserializeBinaryFromReader(message: Expiration, reader: jspb.BinaryReader): Expiration;
}

export namespace Expiration {
  export type AsObject = {
    value: number,
  }
}

export class FinishAfter extends jspb.Message {
  getValue(): number;
  setValue(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FinishAfter.AsObject;
  static toObject(includeInstance: boolean, msg: FinishAfter): FinishAfter.AsObject;
  static serializeBinaryToWriter(message: FinishAfter, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FinishAfter;
  static deserializeBinaryFromReader(message: FinishAfter, reader: jspb.BinaryReader): FinishAfter;
}

export namespace FinishAfter {
  export type AsObject = {
    value: number,
  }
}

export class Flags extends jspb.Message {
  getValue(): number;
  setValue(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Flags.AsObject;
  static toObject(includeInstance: boolean, msg: Flags): Flags.AsObject;
  static serializeBinaryToWriter(message: Flags, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Flags;
  static deserializeBinaryFromReader(message: Flags, reader: jspb.BinaryReader): Flags;
}

export namespace Flags {
  export type AsObject = {
    value: number,
  }
}

export class HighQualityIn extends jspb.Message {
  getValue(): number;
  setValue(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HighQualityIn.AsObject;
  static toObject(includeInstance: boolean, msg: HighQualityIn): HighQualityIn.AsObject;
  static serializeBinaryToWriter(message: HighQualityIn, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): HighQualityIn;
  static deserializeBinaryFromReader(message: HighQualityIn, reader: jspb.BinaryReader): HighQualityIn;
}

export namespace HighQualityIn {
  export type AsObject = {
    value: number,
  }
}

export class HighQualityOut extends jspb.Message {
  getValue(): number;
  setValue(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HighQualityOut.AsObject;
  static toObject(includeInstance: boolean, msg: HighQualityOut): HighQualityOut.AsObject;
  static serializeBinaryToWriter(message: HighQualityOut, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): HighQualityOut;
  static deserializeBinaryFromReader(message: HighQualityOut, reader: jspb.BinaryReader): HighQualityOut;
}

export namespace HighQualityOut {
  export type AsObject = {
    value: number,
  }
}

export class LastLedgerSequence extends jspb.Message {
  getValue(): number;
  setValue(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LastLedgerSequence.AsObject;
  static toObject(includeInstance: boolean, msg: LastLedgerSequence): LastLedgerSequence.AsObject;
  static serializeBinaryToWriter(message: LastLedgerSequence, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LastLedgerSequence;
  static deserializeBinaryFromReader(message: LastLedgerSequence, reader: jspb.BinaryReader): LastLedgerSequence;
}

export namespace LastLedgerSequence {
  export type AsObject = {
    value: number,
  }
}

export class LowQualityIn extends jspb.Message {
  getValue(): number;
  setValue(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LowQualityIn.AsObject;
  static toObject(includeInstance: boolean, msg: LowQualityIn): LowQualityIn.AsObject;
  static serializeBinaryToWriter(message: LowQualityIn, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LowQualityIn;
  static deserializeBinaryFromReader(message: LowQualityIn, reader: jspb.BinaryReader): LowQualityIn;
}

export namespace LowQualityIn {
  export type AsObject = {
    value: number,
  }
}

export class LowQualityOut extends jspb.Message {
  getValue(): number;
  setValue(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LowQualityOut.AsObject;
  static toObject(includeInstance: boolean, msg: LowQualityOut): LowQualityOut.AsObject;
  static serializeBinaryToWriter(message: LowQualityOut, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LowQualityOut;
  static deserializeBinaryFromReader(message: LowQualityOut, reader: jspb.BinaryReader): LowQualityOut;
}

export namespace LowQualityOut {
  export type AsObject = {
    value: number,
  }
}

export class OfferSequence extends jspb.Message {
  getValue(): number;
  setValue(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): OfferSequence.AsObject;
  static toObject(includeInstance: boolean, msg: OfferSequence): OfferSequence.AsObject;
  static serializeBinaryToWriter(message: OfferSequence, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): OfferSequence;
  static deserializeBinaryFromReader(message: OfferSequence, reader: jspb.BinaryReader): OfferSequence;
}

export namespace OfferSequence {
  export type AsObject = {
    value: number,
  }
}

export class OwnerCount extends jspb.Message {
  getValue(): number;
  setValue(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): OwnerCount.AsObject;
  static toObject(includeInstance: boolean, msg: OwnerCount): OwnerCount.AsObject;
  static serializeBinaryToWriter(message: OwnerCount, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): OwnerCount;
  static deserializeBinaryFromReader(message: OwnerCount, reader: jspb.BinaryReader): OwnerCount;
}

export namespace OwnerCount {
  export type AsObject = {
    value: number,
  }
}

export class PreviousTransactionLedgerSequence extends jspb.Message {
  getValue(): number;
  setValue(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PreviousTransactionLedgerSequence.AsObject;
  static toObject(includeInstance: boolean, msg: PreviousTransactionLedgerSequence): PreviousTransactionLedgerSequence.AsObject;
  static serializeBinaryToWriter(message: PreviousTransactionLedgerSequence, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PreviousTransactionLedgerSequence;
  static deserializeBinaryFromReader(message: PreviousTransactionLedgerSequence, reader: jspb.BinaryReader): PreviousTransactionLedgerSequence;
}

export namespace PreviousTransactionLedgerSequence {
  export type AsObject = {
    value: number,
  }
}

export class QualityIn extends jspb.Message {
  getValue(): number;
  setValue(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QualityIn.AsObject;
  static toObject(includeInstance: boolean, msg: QualityIn): QualityIn.AsObject;
  static serializeBinaryToWriter(message: QualityIn, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QualityIn;
  static deserializeBinaryFromReader(message: QualityIn, reader: jspb.BinaryReader): QualityIn;
}

export namespace QualityIn {
  export type AsObject = {
    value: number,
  }
}

export class QualityOut extends jspb.Message {
  getValue(): number;
  setValue(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QualityOut.AsObject;
  static toObject(includeInstance: boolean, msg: QualityOut): QualityOut.AsObject;
  static serializeBinaryToWriter(message: QualityOut, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QualityOut;
  static deserializeBinaryFromReader(message: QualityOut, reader: jspb.BinaryReader): QualityOut;
}

export namespace QualityOut {
  export type AsObject = {
    value: number,
  }
}

export class ReferenceFeeUnits extends jspb.Message {
  getValue(): number;
  setValue(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ReferenceFeeUnits.AsObject;
  static toObject(includeInstance: boolean, msg: ReferenceFeeUnits): ReferenceFeeUnits.AsObject;
  static serializeBinaryToWriter(message: ReferenceFeeUnits, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ReferenceFeeUnits;
  static deserializeBinaryFromReader(message: ReferenceFeeUnits, reader: jspb.BinaryReader): ReferenceFeeUnits;
}

export namespace ReferenceFeeUnits {
  export type AsObject = {
    value: number,
  }
}

export class ReserveBase extends jspb.Message {
  getValue(): number;
  setValue(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ReserveBase.AsObject;
  static toObject(includeInstance: boolean, msg: ReserveBase): ReserveBase.AsObject;
  static serializeBinaryToWriter(message: ReserveBase, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ReserveBase;
  static deserializeBinaryFromReader(message: ReserveBase, reader: jspb.BinaryReader): ReserveBase;
}

export namespace ReserveBase {
  export type AsObject = {
    value: number,
  }
}

export class ReserveIncrement extends jspb.Message {
  getValue(): number;
  setValue(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ReserveIncrement.AsObject;
  static toObject(includeInstance: boolean, msg: ReserveIncrement): ReserveIncrement.AsObject;
  static serializeBinaryToWriter(message: ReserveIncrement, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ReserveIncrement;
  static deserializeBinaryFromReader(message: ReserveIncrement, reader: jspb.BinaryReader): ReserveIncrement;
}

export namespace ReserveIncrement {
  export type AsObject = {
    value: number,
  }
}

export class Sequence extends jspb.Message {
  getValue(): number;
  setValue(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Sequence.AsObject;
  static toObject(includeInstance: boolean, msg: Sequence): Sequence.AsObject;
  static serializeBinaryToWriter(message: Sequence, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Sequence;
  static deserializeBinaryFromReader(message: Sequence, reader: jspb.BinaryReader): Sequence;
}

export namespace Sequence {
  export type AsObject = {
    value: number,
  }
}

export class SetFlag extends jspb.Message {
  getValue(): number;
  setValue(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetFlag.AsObject;
  static toObject(includeInstance: boolean, msg: SetFlag): SetFlag.AsObject;
  static serializeBinaryToWriter(message: SetFlag, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetFlag;
  static deserializeBinaryFromReader(message: SetFlag, reader: jspb.BinaryReader): SetFlag;
}

export namespace SetFlag {
  export type AsObject = {
    value: number,
  }
}

export class SettleDelay extends jspb.Message {
  getValue(): number;
  setValue(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SettleDelay.AsObject;
  static toObject(includeInstance: boolean, msg: SettleDelay): SettleDelay.AsObject;
  static serializeBinaryToWriter(message: SettleDelay, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SettleDelay;
  static deserializeBinaryFromReader(message: SettleDelay, reader: jspb.BinaryReader): SettleDelay;
}

export namespace SettleDelay {
  export type AsObject = {
    value: number,
  }
}

export class SignerListID extends jspb.Message {
  getValue(): number;
  setValue(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SignerListID.AsObject;
  static toObject(includeInstance: boolean, msg: SignerListID): SignerListID.AsObject;
  static serializeBinaryToWriter(message: SignerListID, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SignerListID;
  static deserializeBinaryFromReader(message: SignerListID, reader: jspb.BinaryReader): SignerListID;
}

export namespace SignerListID {
  export type AsObject = {
    value: number,
  }
}

export class SignerQuorum extends jspb.Message {
  getValue(): number;
  setValue(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SignerQuorum.AsObject;
  static toObject(includeInstance: boolean, msg: SignerQuorum): SignerQuorum.AsObject;
  static serializeBinaryToWriter(message: SignerQuorum, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SignerQuorum;
  static deserializeBinaryFromReader(message: SignerQuorum, reader: jspb.BinaryReader): SignerQuorum;
}

export namespace SignerQuorum {
  export type AsObject = {
    value: number,
  }
}

export class SignerWeight extends jspb.Message {
  getValue(): number;
  setValue(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SignerWeight.AsObject;
  static toObject(includeInstance: boolean, msg: SignerWeight): SignerWeight.AsObject;
  static serializeBinaryToWriter(message: SignerWeight, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SignerWeight;
  static deserializeBinaryFromReader(message: SignerWeight, reader: jspb.BinaryReader): SignerWeight;
}

export namespace SignerWeight {
  export type AsObject = {
    value: number,
  }
}

export class SourceTag extends jspb.Message {
  getValue(): number;
  setValue(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SourceTag.AsObject;
  static toObject(includeInstance: boolean, msg: SourceTag): SourceTag.AsObject;
  static serializeBinaryToWriter(message: SourceTag, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SourceTag;
  static deserializeBinaryFromReader(message: SourceTag, reader: jspb.BinaryReader): SourceTag;
}

export namespace SourceTag {
  export type AsObject = {
    value: number,
  }
}

export class TickSize extends jspb.Message {
  getValue(): number;
  setValue(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TickSize.AsObject;
  static toObject(includeInstance: boolean, msg: TickSize): TickSize.AsObject;
  static serializeBinaryToWriter(message: TickSize, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TickSize;
  static deserializeBinaryFromReader(message: TickSize, reader: jspb.BinaryReader): TickSize;
}

export namespace TickSize {
  export type AsObject = {
    value: number,
  }
}

export class TransferRate extends jspb.Message {
  getValue(): number;
  setValue(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransferRate.AsObject;
  static toObject(includeInstance: boolean, msg: TransferRate): TransferRate.AsObject;
  static serializeBinaryToWriter(message: TransferRate, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransferRate;
  static deserializeBinaryFromReader(message: TransferRate, reader: jspb.BinaryReader): TransferRate;
}

export namespace TransferRate {
  export type AsObject = {
    value: number,
  }
}

export class BaseFee extends jspb.Message {
  getValue(): string;
  setValue(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BaseFee.AsObject;
  static toObject(includeInstance: boolean, msg: BaseFee): BaseFee.AsObject;
  static serializeBinaryToWriter(message: BaseFee, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BaseFee;
  static deserializeBinaryFromReader(message: BaseFee, reader: jspb.BinaryReader): BaseFee;
}

export namespace BaseFee {
  export type AsObject = {
    value: string,
  }
}

export class BookNode extends jspb.Message {
  getValue(): string;
  setValue(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BookNode.AsObject;
  static toObject(includeInstance: boolean, msg: BookNode): BookNode.AsObject;
  static serializeBinaryToWriter(message: BookNode, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BookNode;
  static deserializeBinaryFromReader(message: BookNode, reader: jspb.BinaryReader): BookNode;
}

export namespace BookNode {
  export type AsObject = {
    value: string,
  }
}

export class DestinationNode extends jspb.Message {
  getValue(): string;
  setValue(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DestinationNode.AsObject;
  static toObject(includeInstance: boolean, msg: DestinationNode): DestinationNode.AsObject;
  static serializeBinaryToWriter(message: DestinationNode, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DestinationNode;
  static deserializeBinaryFromReader(message: DestinationNode, reader: jspb.BinaryReader): DestinationNode;
}

export namespace DestinationNode {
  export type AsObject = {
    value: string,
  }
}

export class HighNode extends jspb.Message {
  getValue(): string;
  setValue(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HighNode.AsObject;
  static toObject(includeInstance: boolean, msg: HighNode): HighNode.AsObject;
  static serializeBinaryToWriter(message: HighNode, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): HighNode;
  static deserializeBinaryFromReader(message: HighNode, reader: jspb.BinaryReader): HighNode;
}

export namespace HighNode {
  export type AsObject = {
    value: string,
  }
}

export class IndexNext extends jspb.Message {
  getValue(): string;
  setValue(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): IndexNext.AsObject;
  static toObject(includeInstance: boolean, msg: IndexNext): IndexNext.AsObject;
  static serializeBinaryToWriter(message: IndexNext, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): IndexNext;
  static deserializeBinaryFromReader(message: IndexNext, reader: jspb.BinaryReader): IndexNext;
}

export namespace IndexNext {
  export type AsObject = {
    value: string,
  }
}

export class IndexPrevious extends jspb.Message {
  getValue(): string;
  setValue(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): IndexPrevious.AsObject;
  static toObject(includeInstance: boolean, msg: IndexPrevious): IndexPrevious.AsObject;
  static serializeBinaryToWriter(message: IndexPrevious, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): IndexPrevious;
  static deserializeBinaryFromReader(message: IndexPrevious, reader: jspb.BinaryReader): IndexPrevious;
}

export namespace IndexPrevious {
  export type AsObject = {
    value: string,
  }
}

export class LowNode extends jspb.Message {
  getValue(): string;
  setValue(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LowNode.AsObject;
  static toObject(includeInstance: boolean, msg: LowNode): LowNode.AsObject;
  static serializeBinaryToWriter(message: LowNode, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LowNode;
  static deserializeBinaryFromReader(message: LowNode, reader: jspb.BinaryReader): LowNode;
}

export namespace LowNode {
  export type AsObject = {
    value: string,
  }
}

export class OwnerNode extends jspb.Message {
  getValue(): string;
  setValue(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): OwnerNode.AsObject;
  static toObject(includeInstance: boolean, msg: OwnerNode): OwnerNode.AsObject;
  static serializeBinaryToWriter(message: OwnerNode, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): OwnerNode;
  static deserializeBinaryFromReader(message: OwnerNode, reader: jspb.BinaryReader): OwnerNode;
}

export namespace OwnerNode {
  export type AsObject = {
    value: string,
  }
}

export class EmailHash extends jspb.Message {
  getValue(): Uint8Array | string;
  getValue_asU8(): Uint8Array;
  getValue_asB64(): string;
  setValue(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EmailHash.AsObject;
  static toObject(includeInstance: boolean, msg: EmailHash): EmailHash.AsObject;
  static serializeBinaryToWriter(message: EmailHash, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EmailHash;
  static deserializeBinaryFromReader(message: EmailHash, reader: jspb.BinaryReader): EmailHash;
}

export namespace EmailHash {
  export type AsObject = {
    value: Uint8Array | string,
  }
}

export class TakerGetsIssuer extends jspb.Message {
  getValue(): Uint8Array | string;
  getValue_asU8(): Uint8Array;
  getValue_asB64(): string;
  setValue(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TakerGetsIssuer.AsObject;
  static toObject(includeInstance: boolean, msg: TakerGetsIssuer): TakerGetsIssuer.AsObject;
  static serializeBinaryToWriter(message: TakerGetsIssuer, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TakerGetsIssuer;
  static deserializeBinaryFromReader(message: TakerGetsIssuer, reader: jspb.BinaryReader): TakerGetsIssuer;
}

export namespace TakerGetsIssuer {
  export type AsObject = {
    value: Uint8Array | string,
  }
}

export class TakerPaysIssuer extends jspb.Message {
  getValue(): Uint8Array | string;
  getValue_asU8(): Uint8Array;
  getValue_asB64(): string;
  setValue(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TakerPaysIssuer.AsObject;
  static toObject(includeInstance: boolean, msg: TakerPaysIssuer): TakerPaysIssuer.AsObject;
  static serializeBinaryToWriter(message: TakerPaysIssuer, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TakerPaysIssuer;
  static deserializeBinaryFromReader(message: TakerPaysIssuer, reader: jspb.BinaryReader): TakerPaysIssuer;
}

export namespace TakerPaysIssuer {
  export type AsObject = {
    value: Uint8Array | string,
  }
}

export class AccountTransactionID extends jspb.Message {
  getValue(): Uint8Array | string;
  getValue_asU8(): Uint8Array;
  getValue_asB64(): string;
  setValue(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AccountTransactionID.AsObject;
  static toObject(includeInstance: boolean, msg: AccountTransactionID): AccountTransactionID.AsObject;
  static serializeBinaryToWriter(message: AccountTransactionID, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AccountTransactionID;
  static deserializeBinaryFromReader(message: AccountTransactionID, reader: jspb.BinaryReader): AccountTransactionID;
}

export namespace AccountTransactionID {
  export type AsObject = {
    value: Uint8Array | string,
  }
}

export class BookDirectory extends jspb.Message {
  getValue(): Uint8Array | string;
  getValue_asU8(): Uint8Array;
  getValue_asB64(): string;
  setValue(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BookDirectory.AsObject;
  static toObject(includeInstance: boolean, msg: BookDirectory): BookDirectory.AsObject;
  static serializeBinaryToWriter(message: BookDirectory, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BookDirectory;
  static deserializeBinaryFromReader(message: BookDirectory, reader: jspb.BinaryReader): BookDirectory;
}

export namespace BookDirectory {
  export type AsObject = {
    value: Uint8Array | string,
  }
}

export class Channel extends jspb.Message {
  getValue(): Uint8Array | string;
  getValue_asU8(): Uint8Array;
  getValue_asB64(): string;
  setValue(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Channel.AsObject;
  static toObject(includeInstance: boolean, msg: Channel): Channel.AsObject;
  static serializeBinaryToWriter(message: Channel, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Channel;
  static deserializeBinaryFromReader(message: Channel, reader: jspb.BinaryReader): Channel;
}

export namespace Channel {
  export type AsObject = {
    value: Uint8Array | string,
  }
}

export class CheckID extends jspb.Message {
  getValue(): Uint8Array | string;
  getValue_asU8(): Uint8Array;
  getValue_asB64(): string;
  setValue(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CheckID.AsObject;
  static toObject(includeInstance: boolean, msg: CheckID): CheckID.AsObject;
  static serializeBinaryToWriter(message: CheckID, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CheckID;
  static deserializeBinaryFromReader(message: CheckID, reader: jspb.BinaryReader): CheckID;
}

export namespace CheckID {
  export type AsObject = {
    value: Uint8Array | string,
  }
}

export class Hash extends jspb.Message {
  getValue(): Uint8Array | string;
  getValue_asU8(): Uint8Array;
  getValue_asB64(): string;
  setValue(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Hash.AsObject;
  static toObject(includeInstance: boolean, msg: Hash): Hash.AsObject;
  static serializeBinaryToWriter(message: Hash, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Hash;
  static deserializeBinaryFromReader(message: Hash, reader: jspb.BinaryReader): Hash;
}

export namespace Hash {
  export type AsObject = {
    value: Uint8Array | string,
  }
}

export class Index extends jspb.Message {
  getValue(): Uint8Array | string;
  getValue_asU8(): Uint8Array;
  getValue_asB64(): string;
  setValue(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Index.AsObject;
  static toObject(includeInstance: boolean, msg: Index): Index.AsObject;
  static serializeBinaryToWriter(message: Index, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Index;
  static deserializeBinaryFromReader(message: Index, reader: jspb.BinaryReader): Index;
}

export namespace Index {
  export type AsObject = {
    value: Uint8Array | string,
  }
}

export class InvoiceID extends jspb.Message {
  getValue(): Uint8Array | string;
  getValue_asU8(): Uint8Array;
  getValue_asB64(): string;
  setValue(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InvoiceID.AsObject;
  static toObject(includeInstance: boolean, msg: InvoiceID): InvoiceID.AsObject;
  static serializeBinaryToWriter(message: InvoiceID, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InvoiceID;
  static deserializeBinaryFromReader(message: InvoiceID, reader: jspb.BinaryReader): InvoiceID;
}

export namespace InvoiceID {
  export type AsObject = {
    value: Uint8Array | string,
  }
}

export class PreviousTransactionID extends jspb.Message {
  getValue(): Uint8Array | string;
  getValue_asU8(): Uint8Array;
  getValue_asB64(): string;
  setValue(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PreviousTransactionID.AsObject;
  static toObject(includeInstance: boolean, msg: PreviousTransactionID): PreviousTransactionID.AsObject;
  static serializeBinaryToWriter(message: PreviousTransactionID, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PreviousTransactionID;
  static deserializeBinaryFromReader(message: PreviousTransactionID, reader: jspb.BinaryReader): PreviousTransactionID;
}

export namespace PreviousTransactionID {
  export type AsObject = {
    value: Uint8Array | string,
  }
}

export class RootIndex extends jspb.Message {
  getValue(): Uint8Array | string;
  getValue_asU8(): Uint8Array;
  getValue_asB64(): string;
  setValue(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RootIndex.AsObject;
  static toObject(includeInstance: boolean, msg: RootIndex): RootIndex.AsObject;
  static serializeBinaryToWriter(message: RootIndex, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RootIndex;
  static deserializeBinaryFromReader(message: RootIndex, reader: jspb.BinaryReader): RootIndex;
}

export namespace RootIndex {
  export type AsObject = {
    value: Uint8Array | string,
  }
}

export class Condition extends jspb.Message {
  getValue(): Uint8Array | string;
  getValue_asU8(): Uint8Array;
  getValue_asB64(): string;
  setValue(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Condition.AsObject;
  static toObject(includeInstance: boolean, msg: Condition): Condition.AsObject;
  static serializeBinaryToWriter(message: Condition, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Condition;
  static deserializeBinaryFromReader(message: Condition, reader: jspb.BinaryReader): Condition;
}

export namespace Condition {
  export type AsObject = {
    value: Uint8Array | string,
  }
}

export class Fulfillment extends jspb.Message {
  getValue(): Uint8Array | string;
  getValue_asU8(): Uint8Array;
  getValue_asB64(): string;
  setValue(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Fulfillment.AsObject;
  static toObject(includeInstance: boolean, msg: Fulfillment): Fulfillment.AsObject;
  static serializeBinaryToWriter(message: Fulfillment, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Fulfillment;
  static deserializeBinaryFromReader(message: Fulfillment, reader: jspb.BinaryReader): Fulfillment;
}

export namespace Fulfillment {
  export type AsObject = {
    value: Uint8Array | string,
  }
}

export class MemoData extends jspb.Message {
  getValue(): Uint8Array | string;
  getValue_asU8(): Uint8Array;
  getValue_asB64(): string;
  setValue(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MemoData.AsObject;
  static toObject(includeInstance: boolean, msg: MemoData): MemoData.AsObject;
  static serializeBinaryToWriter(message: MemoData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MemoData;
  static deserializeBinaryFromReader(message: MemoData, reader: jspb.BinaryReader): MemoData;
}

export namespace MemoData {
  export type AsObject = {
    value: Uint8Array | string,
  }
}

export class MemoFormat extends jspb.Message {
  getValue(): Uint8Array | string;
  getValue_asU8(): Uint8Array;
  getValue_asB64(): string;
  setValue(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MemoFormat.AsObject;
  static toObject(includeInstance: boolean, msg: MemoFormat): MemoFormat.AsObject;
  static serializeBinaryToWriter(message: MemoFormat, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MemoFormat;
  static deserializeBinaryFromReader(message: MemoFormat, reader: jspb.BinaryReader): MemoFormat;
}

export namespace MemoFormat {
  export type AsObject = {
    value: Uint8Array | string,
  }
}

export class MemoType extends jspb.Message {
  getValue(): Uint8Array | string;
  getValue_asU8(): Uint8Array;
  getValue_asB64(): string;
  setValue(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MemoType.AsObject;
  static toObject(includeInstance: boolean, msg: MemoType): MemoType.AsObject;
  static serializeBinaryToWriter(message: MemoType, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MemoType;
  static deserializeBinaryFromReader(message: MemoType, reader: jspb.BinaryReader): MemoType;
}

export namespace MemoType {
  export type AsObject = {
    value: Uint8Array | string,
  }
}

export class MessageKey extends jspb.Message {
  getValue(): Uint8Array | string;
  getValue_asU8(): Uint8Array;
  getValue_asB64(): string;
  setValue(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MessageKey.AsObject;
  static toObject(includeInstance: boolean, msg: MessageKey): MessageKey.AsObject;
  static serializeBinaryToWriter(message: MessageKey, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MessageKey;
  static deserializeBinaryFromReader(message: MessageKey, reader: jspb.BinaryReader): MessageKey;
}

export namespace MessageKey {
  export type AsObject = {
    value: Uint8Array | string,
  }
}

export class PublicKey extends jspb.Message {
  getValue(): Uint8Array | string;
  getValue_asU8(): Uint8Array;
  getValue_asB64(): string;
  setValue(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PublicKey.AsObject;
  static toObject(includeInstance: boolean, msg: PublicKey): PublicKey.AsObject;
  static serializeBinaryToWriter(message: PublicKey, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PublicKey;
  static deserializeBinaryFromReader(message: PublicKey, reader: jspb.BinaryReader): PublicKey;
}

export namespace PublicKey {
  export type AsObject = {
    value: Uint8Array | string,
  }
}

export class PaymentChannelSignature extends jspb.Message {
  getValue(): Uint8Array | string;
  getValue_asU8(): Uint8Array;
  getValue_asB64(): string;
  setValue(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PaymentChannelSignature.AsObject;
  static toObject(includeInstance: boolean, msg: PaymentChannelSignature): PaymentChannelSignature.AsObject;
  static serializeBinaryToWriter(message: PaymentChannelSignature, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PaymentChannelSignature;
  static deserializeBinaryFromReader(message: PaymentChannelSignature, reader: jspb.BinaryReader): PaymentChannelSignature;
}

export namespace PaymentChannelSignature {
  export type AsObject = {
    value: Uint8Array | string,
  }
}

export class SigningPublicKey extends jspb.Message {
  getValue(): Uint8Array | string;
  getValue_asU8(): Uint8Array;
  getValue_asB64(): string;
  setValue(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SigningPublicKey.AsObject;
  static toObject(includeInstance: boolean, msg: SigningPublicKey): SigningPublicKey.AsObject;
  static serializeBinaryToWriter(message: SigningPublicKey, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SigningPublicKey;
  static deserializeBinaryFromReader(message: SigningPublicKey, reader: jspb.BinaryReader): SigningPublicKey;
}

export namespace SigningPublicKey {
  export type AsObject = {
    value: Uint8Array | string,
  }
}

export class TransactionSignature extends jspb.Message {
  getValue(): Uint8Array | string;
  getValue_asU8(): Uint8Array;
  getValue_asB64(): string;
  setValue(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransactionSignature.AsObject;
  static toObject(includeInstance: boolean, msg: TransactionSignature): TransactionSignature.AsObject;
  static serializeBinaryToWriter(message: TransactionSignature, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransactionSignature;
  static deserializeBinaryFromReader(message: TransactionSignature, reader: jspb.BinaryReader): TransactionSignature;
}

export namespace TransactionSignature {
  export type AsObject = {
    value: Uint8Array | string,
  }
}

export class TakerGetsCurreny extends jspb.Message {
  getValue(): org_xrpl_rpc_v1_amount_pb.Currency | undefined;
  setValue(value?: org_xrpl_rpc_v1_amount_pb.Currency): void;
  hasValue(): boolean;
  clearValue(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TakerGetsCurreny.AsObject;
  static toObject(includeInstance: boolean, msg: TakerGetsCurreny): TakerGetsCurreny.AsObject;
  static serializeBinaryToWriter(message: TakerGetsCurreny, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TakerGetsCurreny;
  static deserializeBinaryFromReader(message: TakerGetsCurreny, reader: jspb.BinaryReader): TakerGetsCurreny;
}

export namespace TakerGetsCurreny {
  export type AsObject = {
    value?: org_xrpl_rpc_v1_amount_pb.Currency.AsObject,
  }
}

export class TakerPaysCurrency extends jspb.Message {
  getValue(): org_xrpl_rpc_v1_amount_pb.Currency | undefined;
  setValue(value?: org_xrpl_rpc_v1_amount_pb.Currency): void;
  hasValue(): boolean;
  clearValue(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TakerPaysCurrency.AsObject;
  static toObject(includeInstance: boolean, msg: TakerPaysCurrency): TakerPaysCurrency.AsObject;
  static serializeBinaryToWriter(message: TakerPaysCurrency, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TakerPaysCurrency;
  static deserializeBinaryFromReader(message: TakerPaysCurrency, reader: jspb.BinaryReader): TakerPaysCurrency;
}

export namespace TakerPaysCurrency {
  export type AsObject = {
    value?: org_xrpl_rpc_v1_amount_pb.Currency.AsObject,
  }
}

export class Amount extends jspb.Message {
  getValue(): org_xrpl_rpc_v1_amount_pb.CurrencyAmount | undefined;
  setValue(value?: org_xrpl_rpc_v1_amount_pb.CurrencyAmount): void;
  hasValue(): boolean;
  clearValue(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Amount.AsObject;
  static toObject(includeInstance: boolean, msg: Amount): Amount.AsObject;
  static serializeBinaryToWriter(message: Amount, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Amount;
  static deserializeBinaryFromReader(message: Amount, reader: jspb.BinaryReader): Amount;
}

export namespace Amount {
  export type AsObject = {
    value?: org_xrpl_rpc_v1_amount_pb.CurrencyAmount.AsObject,
  }
}

export class Balance extends jspb.Message {
  getValue(): org_xrpl_rpc_v1_amount_pb.CurrencyAmount | undefined;
  setValue(value?: org_xrpl_rpc_v1_amount_pb.CurrencyAmount): void;
  hasValue(): boolean;
  clearValue(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Balance.AsObject;
  static toObject(includeInstance: boolean, msg: Balance): Balance.AsObject;
  static serializeBinaryToWriter(message: Balance, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Balance;
  static deserializeBinaryFromReader(message: Balance, reader: jspb.BinaryReader): Balance;
}

export namespace Balance {
  export type AsObject = {
    value?: org_xrpl_rpc_v1_amount_pb.CurrencyAmount.AsObject,
  }
}

export class DeliverMin extends jspb.Message {
  getValue(): org_xrpl_rpc_v1_amount_pb.CurrencyAmount | undefined;
  setValue(value?: org_xrpl_rpc_v1_amount_pb.CurrencyAmount): void;
  hasValue(): boolean;
  clearValue(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeliverMin.AsObject;
  static toObject(includeInstance: boolean, msg: DeliverMin): DeliverMin.AsObject;
  static serializeBinaryToWriter(message: DeliverMin, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeliverMin;
  static deserializeBinaryFromReader(message: DeliverMin, reader: jspb.BinaryReader): DeliverMin;
}

export namespace DeliverMin {
  export type AsObject = {
    value?: org_xrpl_rpc_v1_amount_pb.CurrencyAmount.AsObject,
  }
}

export class DeliveredAmount extends jspb.Message {
  getValue(): org_xrpl_rpc_v1_amount_pb.CurrencyAmount | undefined;
  setValue(value?: org_xrpl_rpc_v1_amount_pb.CurrencyAmount): void;
  hasValue(): boolean;
  clearValue(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeliveredAmount.AsObject;
  static toObject(includeInstance: boolean, msg: DeliveredAmount): DeliveredAmount.AsObject;
  static serializeBinaryToWriter(message: DeliveredAmount, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeliveredAmount;
  static deserializeBinaryFromReader(message: DeliveredAmount, reader: jspb.BinaryReader): DeliveredAmount;
}

export namespace DeliveredAmount {
  export type AsObject = {
    value?: org_xrpl_rpc_v1_amount_pb.CurrencyAmount.AsObject,
  }
}

export class HighLimit extends jspb.Message {
  getValue(): org_xrpl_rpc_v1_amount_pb.CurrencyAmount | undefined;
  setValue(value?: org_xrpl_rpc_v1_amount_pb.CurrencyAmount): void;
  hasValue(): boolean;
  clearValue(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HighLimit.AsObject;
  static toObject(includeInstance: boolean, msg: HighLimit): HighLimit.AsObject;
  static serializeBinaryToWriter(message: HighLimit, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): HighLimit;
  static deserializeBinaryFromReader(message: HighLimit, reader: jspb.BinaryReader): HighLimit;
}

export namespace HighLimit {
  export type AsObject = {
    value?: org_xrpl_rpc_v1_amount_pb.CurrencyAmount.AsObject,
  }
}

export class LimitAmount extends jspb.Message {
  getValue(): org_xrpl_rpc_v1_amount_pb.CurrencyAmount | undefined;
  setValue(value?: org_xrpl_rpc_v1_amount_pb.CurrencyAmount): void;
  hasValue(): boolean;
  clearValue(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LimitAmount.AsObject;
  static toObject(includeInstance: boolean, msg: LimitAmount): LimitAmount.AsObject;
  static serializeBinaryToWriter(message: LimitAmount, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LimitAmount;
  static deserializeBinaryFromReader(message: LimitAmount, reader: jspb.BinaryReader): LimitAmount;
}

export namespace LimitAmount {
  export type AsObject = {
    value?: org_xrpl_rpc_v1_amount_pb.CurrencyAmount.AsObject,
  }
}

export class LowLimit extends jspb.Message {
  getValue(): org_xrpl_rpc_v1_amount_pb.CurrencyAmount | undefined;
  setValue(value?: org_xrpl_rpc_v1_amount_pb.CurrencyAmount): void;
  hasValue(): boolean;
  clearValue(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LowLimit.AsObject;
  static toObject(includeInstance: boolean, msg: LowLimit): LowLimit.AsObject;
  static serializeBinaryToWriter(message: LowLimit, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LowLimit;
  static deserializeBinaryFromReader(message: LowLimit, reader: jspb.BinaryReader): LowLimit;
}

export namespace LowLimit {
  export type AsObject = {
    value?: org_xrpl_rpc_v1_amount_pb.CurrencyAmount.AsObject,
  }
}

export class SendMax extends jspb.Message {
  getValue(): org_xrpl_rpc_v1_amount_pb.CurrencyAmount | undefined;
  setValue(value?: org_xrpl_rpc_v1_amount_pb.CurrencyAmount): void;
  hasValue(): boolean;
  clearValue(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SendMax.AsObject;
  static toObject(includeInstance: boolean, msg: SendMax): SendMax.AsObject;
  static serializeBinaryToWriter(message: SendMax, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SendMax;
  static deserializeBinaryFromReader(message: SendMax, reader: jspb.BinaryReader): SendMax;
}

export namespace SendMax {
  export type AsObject = {
    value?: org_xrpl_rpc_v1_amount_pb.CurrencyAmount.AsObject,
  }
}

export class TakerGets extends jspb.Message {
  getValue(): org_xrpl_rpc_v1_amount_pb.CurrencyAmount | undefined;
  setValue(value?: org_xrpl_rpc_v1_amount_pb.CurrencyAmount): void;
  hasValue(): boolean;
  clearValue(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TakerGets.AsObject;
  static toObject(includeInstance: boolean, msg: TakerGets): TakerGets.AsObject;
  static serializeBinaryToWriter(message: TakerGets, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TakerGets;
  static deserializeBinaryFromReader(message: TakerGets, reader: jspb.BinaryReader): TakerGets;
}

export namespace TakerGets {
  export type AsObject = {
    value?: org_xrpl_rpc_v1_amount_pb.CurrencyAmount.AsObject,
  }
}

export class TakerPays extends jspb.Message {
  getValue(): org_xrpl_rpc_v1_amount_pb.CurrencyAmount | undefined;
  setValue(value?: org_xrpl_rpc_v1_amount_pb.CurrencyAmount): void;
  hasValue(): boolean;
  clearValue(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TakerPays.AsObject;
  static toObject(includeInstance: boolean, msg: TakerPays): TakerPays.AsObject;
  static serializeBinaryToWriter(message: TakerPays, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TakerPays;
  static deserializeBinaryFromReader(message: TakerPays, reader: jspb.BinaryReader): TakerPays;
}

export namespace TakerPays {
  export type AsObject = {
    value?: org_xrpl_rpc_v1_amount_pb.CurrencyAmount.AsObject,
  }
}

export class Account extends jspb.Message {
  getValue(): org_xrpl_rpc_v1_account_pb.AccountAddress | undefined;
  setValue(value?: org_xrpl_rpc_v1_account_pb.AccountAddress): void;
  hasValue(): boolean;
  clearValue(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Account.AsObject;
  static toObject(includeInstance: boolean, msg: Account): Account.AsObject;
  static serializeBinaryToWriter(message: Account, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Account;
  static deserializeBinaryFromReader(message: Account, reader: jspb.BinaryReader): Account;
}

export namespace Account {
  export type AsObject = {
    value?: org_xrpl_rpc_v1_account_pb.AccountAddress.AsObject,
  }
}

export class Authorize extends jspb.Message {
  getValue(): org_xrpl_rpc_v1_account_pb.AccountAddress | undefined;
  setValue(value?: org_xrpl_rpc_v1_account_pb.AccountAddress): void;
  hasValue(): boolean;
  clearValue(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Authorize.AsObject;
  static toObject(includeInstance: boolean, msg: Authorize): Authorize.AsObject;
  static serializeBinaryToWriter(message: Authorize, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Authorize;
  static deserializeBinaryFromReader(message: Authorize, reader: jspb.BinaryReader): Authorize;
}

export namespace Authorize {
  export type AsObject = {
    value?: org_xrpl_rpc_v1_account_pb.AccountAddress.AsObject,
  }
}

export class Destination extends jspb.Message {
  getValue(): org_xrpl_rpc_v1_account_pb.AccountAddress | undefined;
  setValue(value?: org_xrpl_rpc_v1_account_pb.AccountAddress): void;
  hasValue(): boolean;
  clearValue(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Destination.AsObject;
  static toObject(includeInstance: boolean, msg: Destination): Destination.AsObject;
  static serializeBinaryToWriter(message: Destination, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Destination;
  static deserializeBinaryFromReader(message: Destination, reader: jspb.BinaryReader): Destination;
}

export namespace Destination {
  export type AsObject = {
    value?: org_xrpl_rpc_v1_account_pb.AccountAddress.AsObject,
  }
}

export class Owner extends jspb.Message {
  getValue(): org_xrpl_rpc_v1_account_pb.AccountAddress | undefined;
  setValue(value?: org_xrpl_rpc_v1_account_pb.AccountAddress): void;
  hasValue(): boolean;
  clearValue(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Owner.AsObject;
  static toObject(includeInstance: boolean, msg: Owner): Owner.AsObject;
  static serializeBinaryToWriter(message: Owner, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Owner;
  static deserializeBinaryFromReader(message: Owner, reader: jspb.BinaryReader): Owner;
}

export namespace Owner {
  export type AsObject = {
    value?: org_xrpl_rpc_v1_account_pb.AccountAddress.AsObject,
  }
}

export class RegularKey extends jspb.Message {
  getValue(): org_xrpl_rpc_v1_account_pb.AccountAddress | undefined;
  setValue(value?: org_xrpl_rpc_v1_account_pb.AccountAddress): void;
  hasValue(): boolean;
  clearValue(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RegularKey.AsObject;
  static toObject(includeInstance: boolean, msg: RegularKey): RegularKey.AsObject;
  static serializeBinaryToWriter(message: RegularKey, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RegularKey;
  static deserializeBinaryFromReader(message: RegularKey, reader: jspb.BinaryReader): RegularKey;
}

export namespace RegularKey {
  export type AsObject = {
    value?: org_xrpl_rpc_v1_account_pb.AccountAddress.AsObject,
  }
}

export class Unauthorize extends jspb.Message {
  getValue(): org_xrpl_rpc_v1_account_pb.AccountAddress | undefined;
  setValue(value?: org_xrpl_rpc_v1_account_pb.AccountAddress): void;
  hasValue(): boolean;
  clearValue(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Unauthorize.AsObject;
  static toObject(includeInstance: boolean, msg: Unauthorize): Unauthorize.AsObject;
  static serializeBinaryToWriter(message: Unauthorize, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Unauthorize;
  static deserializeBinaryFromReader(message: Unauthorize, reader: jspb.BinaryReader): Unauthorize;
}

export namespace Unauthorize {
  export type AsObject = {
    value?: org_xrpl_rpc_v1_account_pb.AccountAddress.AsObject,
  }
}

export class Domain extends jspb.Message {
  getValue(): string;
  setValue(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Domain.AsObject;
  static toObject(includeInstance: boolean, msg: Domain): Domain.AsObject;
  static serializeBinaryToWriter(message: Domain, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Domain;
  static deserializeBinaryFromReader(message: Domain, reader: jspb.BinaryReader): Domain;
}

export namespace Domain {
  export type AsObject = {
    value: string,
  }
}

export class SignerEntry extends jspb.Message {
  getAccount(): Account | undefined;
  setAccount(value?: Account): void;
  hasAccount(): boolean;
  clearAccount(): void;

  getSignerWeight(): SignerWeight | undefined;
  setSignerWeight(value?: SignerWeight): void;
  hasSignerWeight(): boolean;
  clearSignerWeight(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SignerEntry.AsObject;
  static toObject(includeInstance: boolean, msg: SignerEntry): SignerEntry.AsObject;
  static serializeBinaryToWriter(message: SignerEntry, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SignerEntry;
  static deserializeBinaryFromReader(message: SignerEntry, reader: jspb.BinaryReader): SignerEntry;
}

export namespace SignerEntry {
  export type AsObject = {
    account?: Account.AsObject,
    signerWeight?: SignerWeight.AsObject,
  }
}

