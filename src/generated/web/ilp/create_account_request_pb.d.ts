import * as jspb from "google-protobuf"

export class CreateAccountRequest extends jspb.Message {
  getAccountId(): string;
  setAccountId(value: string): void;

  getAssetCode(): string;
  setAssetCode(value: string): void;

  getAssetScale(): number;
  setAssetScale(value: number): void;

  getDescription(): string;
  setDescription(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateAccountRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateAccountRequest): CreateAccountRequest.AsObject;
  static serializeBinaryToWriter(message: CreateAccountRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateAccountRequest;
  static deserializeBinaryFromReader(message: CreateAccountRequest, reader: jspb.BinaryReader): CreateAccountRequest;
}

export namespace CreateAccountRequest {
  export type AsObject = {
    accountId: string,
    assetCode: string,
    assetScale: number,
    description: string,
  }
}

