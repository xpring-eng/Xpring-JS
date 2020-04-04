import * as jspb from "google-protobuf"

export class SendPaymentRequest extends jspb.Message {
  getDestinationPaymentPointer(): string;
  setDestinationPaymentPointer(value: string): void;

  getAmount(): number;
  setAmount(value: number): void;

  getTimeoutSeconds(): number;
  setTimeoutSeconds(value: number): void;

  getAccountId(): string;
  setAccountId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SendPaymentRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SendPaymentRequest): SendPaymentRequest.AsObject;
  static serializeBinaryToWriter(message: SendPaymentRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SendPaymentRequest;
  static deserializeBinaryFromReader(message: SendPaymentRequest, reader: jspb.BinaryReader): SendPaymentRequest;
}

export namespace SendPaymentRequest {
  export type AsObject = {
    destinationPaymentPointer: string,
    amount: number,
    timeoutSeconds: number,
    accountId: string,
  }
}

