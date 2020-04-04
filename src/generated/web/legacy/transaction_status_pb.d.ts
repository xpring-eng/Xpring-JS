import * as jspb from "google-protobuf"

export class TransactionStatus extends jspb.Message {
  getTransactionStatusCode(): string;
  setTransactionStatusCode(value: string): void;

  getValidated(): boolean;
  setValidated(value: boolean): void;

  getLastLedgerSequence(): number;
  setLastLedgerSequence(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransactionStatus.AsObject;
  static toObject(includeInstance: boolean, msg: TransactionStatus): TransactionStatus.AsObject;
  static serializeBinaryToWriter(message: TransactionStatus, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransactionStatus;
  static deserializeBinaryFromReader(message: TransactionStatus, reader: jspb.BinaryReader): TransactionStatus;
}

export namespace TransactionStatus {
  export type AsObject = {
    transactionStatusCode: string,
    validated: boolean,
    lastLedgerSequence: number,
  }
}

