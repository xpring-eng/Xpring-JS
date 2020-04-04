import * as jspb from "google-protobuf"

import * as xrp_amount_pb from './xrp_amount_pb';

export class Fee extends jspb.Message {
  getAmount(): xrp_amount_pb.XRPAmount | undefined;
  setAmount(value?: xrp_amount_pb.XRPAmount): void;
  hasAmount(): boolean;
  clearAmount(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Fee.AsObject;
  static toObject(includeInstance: boolean, msg: Fee): Fee.AsObject;
  static serializeBinaryToWriter(message: Fee, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Fee;
  static deserializeBinaryFromReader(message: Fee, reader: jspb.BinaryReader): Fee;
}

export namespace Fee {
  export type AsObject = {
    amount?: xrp_amount_pb.XRPAmount.AsObject,
  }
}

