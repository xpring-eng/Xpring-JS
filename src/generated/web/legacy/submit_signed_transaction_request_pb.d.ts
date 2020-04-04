import * as jspb from "google-protobuf"

import * as signed_transaction_pb from './signed_transaction_pb';

export class SubmitSignedTransactionRequest extends jspb.Message {
  getSignedTransaction(): signed_transaction_pb.SignedTransaction | undefined;
  setSignedTransaction(value?: signed_transaction_pb.SignedTransaction): void;
  hasSignedTransaction(): boolean;
  clearSignedTransaction(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SubmitSignedTransactionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SubmitSignedTransactionRequest): SubmitSignedTransactionRequest.AsObject;
  static serializeBinaryToWriter(message: SubmitSignedTransactionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SubmitSignedTransactionRequest;
  static deserializeBinaryFromReader(message: SubmitSignedTransactionRequest, reader: jspb.BinaryReader): SubmitSignedTransactionRequest;
}

export namespace SubmitSignedTransactionRequest {
  export type AsObject = {
    signedTransaction?: signed_transaction_pb.SignedTransaction.AsObject,
  }
}

