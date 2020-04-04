import * as jspb from "google-protobuf"

import * as org_xrpl_rpc_v1_meta_pb from '../../../../org/xrpl/rpc/v1/meta_pb';

export class SubmitTransactionRequest extends jspb.Message {
  getSignedTransaction(): Uint8Array | string;
  getSignedTransaction_asU8(): Uint8Array;
  getSignedTransaction_asB64(): string;
  setSignedTransaction(value: Uint8Array | string): void;

  getFailHard(): boolean;
  setFailHard(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SubmitTransactionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SubmitTransactionRequest): SubmitTransactionRequest.AsObject;
  static serializeBinaryToWriter(message: SubmitTransactionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SubmitTransactionRequest;
  static deserializeBinaryFromReader(message: SubmitTransactionRequest, reader: jspb.BinaryReader): SubmitTransactionRequest;
}

export namespace SubmitTransactionRequest {
  export type AsObject = {
    signedTransaction: Uint8Array | string,
    failHard: boolean,
  }
}

export class SubmitTransactionResponse extends jspb.Message {
  getEngineResult(): org_xrpl_rpc_v1_meta_pb.TransactionResult | undefined;
  setEngineResult(value?: org_xrpl_rpc_v1_meta_pb.TransactionResult): void;
  hasEngineResult(): boolean;
  clearEngineResult(): void;

  getEngineResultCode(): number;
  setEngineResultCode(value: number): void;

  getEngineResultMessage(): string;
  setEngineResultMessage(value: string): void;

  getHash(): Uint8Array | string;
  getHash_asU8(): Uint8Array;
  getHash_asB64(): string;
  setHash(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SubmitTransactionResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SubmitTransactionResponse): SubmitTransactionResponse.AsObject;
  static serializeBinaryToWriter(message: SubmitTransactionResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SubmitTransactionResponse;
  static deserializeBinaryFromReader(message: SubmitTransactionResponse, reader: jspb.BinaryReader): SubmitTransactionResponse;
}

export namespace SubmitTransactionResponse {
  export type AsObject = {
    engineResult?: org_xrpl_rpc_v1_meta_pb.TransactionResult.AsObject,
    engineResultCode: number,
    engineResultMessage: string,
    hash: Uint8Array | string,
  }
}

