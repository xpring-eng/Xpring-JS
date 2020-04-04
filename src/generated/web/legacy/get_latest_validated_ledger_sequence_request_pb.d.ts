import * as jspb from "google-protobuf"

export class GetLatestValidatedLedgerSequenceRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetLatestValidatedLedgerSequenceRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetLatestValidatedLedgerSequenceRequest): GetLatestValidatedLedgerSequenceRequest.AsObject;
  static serializeBinaryToWriter(message: GetLatestValidatedLedgerSequenceRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetLatestValidatedLedgerSequenceRequest;
  static deserializeBinaryFromReader(message: GetLatestValidatedLedgerSequenceRequest, reader: jspb.BinaryReader): GetLatestValidatedLedgerSequenceRequest;
}

export namespace GetLatestValidatedLedgerSequenceRequest {
  export type AsObject = {
  }
}

