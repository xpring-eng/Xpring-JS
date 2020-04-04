import * as jspb from "google-protobuf"

export class LedgerSequence extends jspb.Message {
  getIndex(): number;
  setIndex(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LedgerSequence.AsObject;
  static toObject(includeInstance: boolean, msg: LedgerSequence): LedgerSequence.AsObject;
  static serializeBinaryToWriter(message: LedgerSequence, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LedgerSequence;
  static deserializeBinaryFromReader(message: LedgerSequence, reader: jspb.BinaryReader): LedgerSequence;
}

export namespace LedgerSequence {
  export type AsObject = {
    index: number,
  }
}

