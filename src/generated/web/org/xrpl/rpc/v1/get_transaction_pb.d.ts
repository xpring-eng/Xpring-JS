import * as jspb from "google-protobuf"

import * as org_xrpl_rpc_v1_meta_pb from '../../../../org/xrpl/rpc/v1/meta_pb';
import * as org_xrpl_rpc_v1_ledger_pb from '../../../../org/xrpl/rpc/v1/ledger_pb';
import * as org_xrpl_rpc_v1_transaction_pb from '../../../../org/xrpl/rpc/v1/transaction_pb';
import * as org_xrpl_rpc_v1_common_pb from '../../../../org/xrpl/rpc/v1/common_pb';

export class GetTransactionRequest extends jspb.Message {
  getHash(): Uint8Array | string;
  getHash_asU8(): Uint8Array;
  getHash_asB64(): string;
  setHash(value: Uint8Array | string): void;

  getBinary(): boolean;
  setBinary(value: boolean): void;

  getLedgerRange(): org_xrpl_rpc_v1_ledger_pb.LedgerRange | undefined;
  setLedgerRange(value?: org_xrpl_rpc_v1_ledger_pb.LedgerRange): void;
  hasLedgerRange(): boolean;
  clearLedgerRange(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTransactionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetTransactionRequest): GetTransactionRequest.AsObject;
  static serializeBinaryToWriter(message: GetTransactionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTransactionRequest;
  static deserializeBinaryFromReader(message: GetTransactionRequest, reader: jspb.BinaryReader): GetTransactionRequest;
}

export namespace GetTransactionRequest {
  export type AsObject = {
    hash: Uint8Array | string,
    binary: boolean,
    ledgerRange?: org_xrpl_rpc_v1_ledger_pb.LedgerRange.AsObject,
  }
}

export class GetTransactionResponse extends jspb.Message {
  getTransaction(): org_xrpl_rpc_v1_transaction_pb.Transaction | undefined;
  setTransaction(value?: org_xrpl_rpc_v1_transaction_pb.Transaction): void;
  hasTransaction(): boolean;
  clearTransaction(): void;

  getTransactionBinary(): Uint8Array | string;
  getTransactionBinary_asU8(): Uint8Array;
  getTransactionBinary_asB64(): string;
  setTransactionBinary(value: Uint8Array | string): void;

  getLedgerIndex(): number;
  setLedgerIndex(value: number): void;

  getHash(): Uint8Array | string;
  getHash_asU8(): Uint8Array;
  getHash_asB64(): string;
  setHash(value: Uint8Array | string): void;

  getValidated(): boolean;
  setValidated(value: boolean): void;

  getMeta(): org_xrpl_rpc_v1_meta_pb.Meta | undefined;
  setMeta(value?: org_xrpl_rpc_v1_meta_pb.Meta): void;
  hasMeta(): boolean;
  clearMeta(): void;

  getMetaBinary(): Uint8Array | string;
  getMetaBinary_asU8(): Uint8Array;
  getMetaBinary_asB64(): string;
  setMetaBinary(value: Uint8Array | string): void;

  getDate(): org_xrpl_rpc_v1_common_pb.Date | undefined;
  setDate(value?: org_xrpl_rpc_v1_common_pb.Date): void;
  hasDate(): boolean;
  clearDate(): void;

  getSerializedTransactionCase(): GetTransactionResponse.SerializedTransactionCase;

  getSerializedMetaCase(): GetTransactionResponse.SerializedMetaCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTransactionResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetTransactionResponse): GetTransactionResponse.AsObject;
  static serializeBinaryToWriter(message: GetTransactionResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTransactionResponse;
  static deserializeBinaryFromReader(message: GetTransactionResponse, reader: jspb.BinaryReader): GetTransactionResponse;
}

export namespace GetTransactionResponse {
  export type AsObject = {
    transaction?: org_xrpl_rpc_v1_transaction_pb.Transaction.AsObject,
    transactionBinary: Uint8Array | string,
    ledgerIndex: number,
    hash: Uint8Array | string,
    validated: boolean,
    meta?: org_xrpl_rpc_v1_meta_pb.Meta.AsObject,
    metaBinary: Uint8Array | string,
    date?: org_xrpl_rpc_v1_common_pb.Date.AsObject,
  }

  export enum SerializedTransactionCase { 
    SERIALIZED_TRANSACTION_NOT_SET = 0,
    TRANSACTION = 1,
    TRANSACTION_BINARY = 2,
  }

  export enum SerializedMetaCase { 
    SERIALIZED_META_NOT_SET = 0,
    META = 6,
    META_BINARY = 7,
  }
}

