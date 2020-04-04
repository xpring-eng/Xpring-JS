import * as jspb from "google-protobuf"

export class XRPAmount extends jspb.Message {
  getDrops(): string;
  setDrops(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): XRPAmount.AsObject;
  static toObject(includeInstance: boolean, msg: XRPAmount): XRPAmount.AsObject;
  static serializeBinaryToWriter(message: XRPAmount, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): XRPAmount;
  static deserializeBinaryFromReader(message: XRPAmount, reader: jspb.BinaryReader): XRPAmount;
}

export namespace XRPAmount {
  export type AsObject = {
    drops: string,
  }
}

