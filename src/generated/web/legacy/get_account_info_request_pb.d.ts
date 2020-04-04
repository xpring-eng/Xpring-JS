import * as jspb from "google-protobuf"

export class GetAccountInfoRequest extends jspb.Message {
  getAddress(): string;
  setAddress(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAccountInfoRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetAccountInfoRequest): GetAccountInfoRequest.AsObject;
  static serializeBinaryToWriter(message: GetAccountInfoRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAccountInfoRequest;
  static deserializeBinaryFromReader(message: GetAccountInfoRequest, reader: jspb.BinaryReader): GetAccountInfoRequest;
}

export namespace GetAccountInfoRequest {
  export type AsObject = {
    address: string,
  }
}

