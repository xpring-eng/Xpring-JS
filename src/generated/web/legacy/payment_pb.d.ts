import * as jspb from "google-protobuf"

import * as fiat_amount_pb from './fiat_amount_pb';
import * as xrp_amount_pb from './xrp_amount_pb';

export class Payment extends jspb.Message {
  getXrpAmount(): xrp_amount_pb.XRPAmount | undefined;
  setXrpAmount(value?: xrp_amount_pb.XRPAmount): void;
  hasXrpAmount(): boolean;
  clearXrpAmount(): void;

  getFiatAmount(): fiat_amount_pb.FiatAmount | undefined;
  setFiatAmount(value?: fiat_amount_pb.FiatAmount): void;
  hasFiatAmount(): boolean;
  clearFiatAmount(): void;

  getDestination(): string;
  setDestination(value: string): void;

  getAmountCase(): Payment.AmountCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Payment.AsObject;
  static toObject(includeInstance: boolean, msg: Payment): Payment.AsObject;
  static serializeBinaryToWriter(message: Payment, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Payment;
  static deserializeBinaryFromReader(message: Payment, reader: jspb.BinaryReader): Payment;
}

export namespace Payment {
  export type AsObject = {
    xrpAmount?: xrp_amount_pb.XRPAmount.AsObject,
    fiatAmount?: fiat_amount_pb.FiatAmount.AsObject,
    destination: string,
  }

  export enum AmountCase { 
    AMOUNT_NOT_SET = 0,
    XRP_AMOUNT = 1,
    FIAT_AMOUNT = 2,
  }
}

