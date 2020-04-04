import * as jspb from "google-protobuf"

import * as payment_pb from './payment_pb';
import * as xrp_amount_pb from './xrp_amount_pb';

export class Transaction extends jspb.Message {
  getAccount(): string;
  setAccount(value: string): void;

  getFee(): xrp_amount_pb.XRPAmount | undefined;
  setFee(value?: xrp_amount_pb.XRPAmount): void;
  hasFee(): boolean;
  clearFee(): void;

  getSequence(): number;
  setSequence(value: number): void;

  getPayment(): payment_pb.Payment | undefined;
  setPayment(value?: payment_pb.Payment): void;
  hasPayment(): boolean;
  clearPayment(): void;

  getSigningPublicKeyHex(): string;
  setSigningPublicKeyHex(value: string): void;

  getLastLedgerSequence(): number;
  setLastLedgerSequence(value: number): void;

  getTransactionDataCase(): Transaction.TransactionDataCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Transaction.AsObject;
  static toObject(includeInstance: boolean, msg: Transaction): Transaction.AsObject;
  static serializeBinaryToWriter(message: Transaction, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Transaction;
  static deserializeBinaryFromReader(message: Transaction, reader: jspb.BinaryReader): Transaction;
}

export namespace Transaction {
  export type AsObject = {
    account: string,
    fee?: xrp_amount_pb.XRPAmount.AsObject,
    sequence: number,
    payment?: payment_pb.Payment.AsObject,
    signingPublicKeyHex: string,
    lastLedgerSequence: number,
  }

  export enum TransactionDataCase { 
    TRANSACTION_DATA_NOT_SET = 0,
    PAYMENT = 4,
  }
}

