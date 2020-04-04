import * as jspb from "google-protobuf"

export class SendPaymentResponse extends jspb.Message {
  getOriginalAmount(): number;
  setOriginalAmount(value: number): void;

  getAmountDelivered(): number;
  setAmountDelivered(value: number): void;

  getAmountSent(): number;
  setAmountSent(value: number): void;

  getSuccessfulPayment(): boolean;
  setSuccessfulPayment(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SendPaymentResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SendPaymentResponse): SendPaymentResponse.AsObject;
  static serializeBinaryToWriter(message: SendPaymentResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SendPaymentResponse;
  static deserializeBinaryFromReader(message: SendPaymentResponse, reader: jspb.BinaryReader): SendPaymentResponse;
}

export namespace SendPaymentResponse {
  export type AsObject = {
    originalAmount: number,
    amountDelivered: number,
    amountSent: number,
    successfulPayment: boolean,
  }
}

