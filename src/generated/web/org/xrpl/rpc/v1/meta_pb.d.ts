import * as jspb from "google-protobuf"

import * as org_xrpl_rpc_v1_ledger_objects_pb from '../../../../org/xrpl/rpc/v1/ledger_objects_pb';
import * as org_xrpl_rpc_v1_common_pb from '../../../../org/xrpl/rpc/v1/common_pb';

export class Meta extends jspb.Message {
  getTransactionIndex(): string;
  setTransactionIndex(value: string): void;

  getTransactionResult(): TransactionResult | undefined;
  setTransactionResult(value?: TransactionResult): void;
  hasTransactionResult(): boolean;
  clearTransactionResult(): void;

  getAffectedNodesList(): Array<AffectedNode>;
  setAffectedNodesList(value: Array<AffectedNode>): void;
  clearAffectedNodesList(): void;
  addAffectedNodes(value?: AffectedNode, index?: number): AffectedNode;

  getDeliveredAmount(): org_xrpl_rpc_v1_common_pb.DeliveredAmount | undefined;
  setDeliveredAmount(value?: org_xrpl_rpc_v1_common_pb.DeliveredAmount): void;
  hasDeliveredAmount(): boolean;
  clearDeliveredAmount(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Meta.AsObject;
  static toObject(includeInstance: boolean, msg: Meta): Meta.AsObject;
  static serializeBinaryToWriter(message: Meta, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Meta;
  static deserializeBinaryFromReader(message: Meta, reader: jspb.BinaryReader): Meta;
}

export namespace Meta {
  export type AsObject = {
    transactionIndex: string,
    transactionResult?: TransactionResult.AsObject,
    affectedNodesList: Array<AffectedNode.AsObject>,
    deliveredAmount?: org_xrpl_rpc_v1_common_pb.DeliveredAmount.AsObject,
  }
}

export class TransactionResult extends jspb.Message {
  getResultType(): TransactionResult.ResultType;
  setResultType(value: TransactionResult.ResultType): void;

  getResult(): string;
  setResult(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransactionResult.AsObject;
  static toObject(includeInstance: boolean, msg: TransactionResult): TransactionResult.AsObject;
  static serializeBinaryToWriter(message: TransactionResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransactionResult;
  static deserializeBinaryFromReader(message: TransactionResult, reader: jspb.BinaryReader): TransactionResult;
}

export namespace TransactionResult {
  export type AsObject = {
    resultType: TransactionResult.ResultType,
    result: string,
  }

  export enum ResultType { 
    RESULT_TYPE_UNSPECIFIED = 0,
    RESULT_TYPE_TEC = 1,
    RESULT_TYPE_TEF = 2,
    RESULT_TYPE_TEL = 3,
    RESULT_TYPE_TEM = 4,
    RESULT_TYPE_TER = 5,
    RESULT_TYPE_TES = 6,
  }
}

export class AffectedNode extends jspb.Message {
  getLedgerEntryType(): org_xrpl_rpc_v1_ledger_objects_pb.LedgerEntryType;
  setLedgerEntryType(value: org_xrpl_rpc_v1_ledger_objects_pb.LedgerEntryType): void;

  getLedgerIndex(): Uint8Array | string;
  getLedgerIndex_asU8(): Uint8Array;
  getLedgerIndex_asB64(): string;
  setLedgerIndex(value: Uint8Array | string): void;

  getCreatedNode(): CreatedNode | undefined;
  setCreatedNode(value?: CreatedNode): void;
  hasCreatedNode(): boolean;
  clearCreatedNode(): void;

  getDeletedNode(): DeletedNode | undefined;
  setDeletedNode(value?: DeletedNode): void;
  hasDeletedNode(): boolean;
  clearDeletedNode(): void;

  getModifiedNode(): ModifiedNode | undefined;
  setModifiedNode(value?: ModifiedNode): void;
  hasModifiedNode(): boolean;
  clearModifiedNode(): void;

  getNodeCase(): AffectedNode.NodeCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AffectedNode.AsObject;
  static toObject(includeInstance: boolean, msg: AffectedNode): AffectedNode.AsObject;
  static serializeBinaryToWriter(message: AffectedNode, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AffectedNode;
  static deserializeBinaryFromReader(message: AffectedNode, reader: jspb.BinaryReader): AffectedNode;
}

export namespace AffectedNode {
  export type AsObject = {
    ledgerEntryType: org_xrpl_rpc_v1_ledger_objects_pb.LedgerEntryType,
    ledgerIndex: Uint8Array | string,
    createdNode?: CreatedNode.AsObject,
    deletedNode?: DeletedNode.AsObject,
    modifiedNode?: ModifiedNode.AsObject,
  }

  export enum NodeCase { 
    NODE_NOT_SET = 0,
    CREATED_NODE = 3,
    DELETED_NODE = 4,
    MODIFIED_NODE = 5,
  }
}

export class CreatedNode extends jspb.Message {
  getNewFields(): org_xrpl_rpc_v1_ledger_objects_pb.LedgerObject | undefined;
  setNewFields(value?: org_xrpl_rpc_v1_ledger_objects_pb.LedgerObject): void;
  hasNewFields(): boolean;
  clearNewFields(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreatedNode.AsObject;
  static toObject(includeInstance: boolean, msg: CreatedNode): CreatedNode.AsObject;
  static serializeBinaryToWriter(message: CreatedNode, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreatedNode;
  static deserializeBinaryFromReader(message: CreatedNode, reader: jspb.BinaryReader): CreatedNode;
}

export namespace CreatedNode {
  export type AsObject = {
    newFields?: org_xrpl_rpc_v1_ledger_objects_pb.LedgerObject.AsObject,
  }
}

export class DeletedNode extends jspb.Message {
  getFinalFields(): org_xrpl_rpc_v1_ledger_objects_pb.LedgerObject | undefined;
  setFinalFields(value?: org_xrpl_rpc_v1_ledger_objects_pb.LedgerObject): void;
  hasFinalFields(): boolean;
  clearFinalFields(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeletedNode.AsObject;
  static toObject(includeInstance: boolean, msg: DeletedNode): DeletedNode.AsObject;
  static serializeBinaryToWriter(message: DeletedNode, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeletedNode;
  static deserializeBinaryFromReader(message: DeletedNode, reader: jspb.BinaryReader): DeletedNode;
}

export namespace DeletedNode {
  export type AsObject = {
    finalFields?: org_xrpl_rpc_v1_ledger_objects_pb.LedgerObject.AsObject,
  }
}

export class ModifiedNode extends jspb.Message {
  getFinalFields(): org_xrpl_rpc_v1_ledger_objects_pb.LedgerObject | undefined;
  setFinalFields(value?: org_xrpl_rpc_v1_ledger_objects_pb.LedgerObject): void;
  hasFinalFields(): boolean;
  clearFinalFields(): void;

  getPreviousFields(): org_xrpl_rpc_v1_ledger_objects_pb.LedgerObject | undefined;
  setPreviousFields(value?: org_xrpl_rpc_v1_ledger_objects_pb.LedgerObject): void;
  hasPreviousFields(): boolean;
  clearPreviousFields(): void;

  getPreviousTransactionId(): org_xrpl_rpc_v1_common_pb.PreviousTransactionID | undefined;
  setPreviousTransactionId(value?: org_xrpl_rpc_v1_common_pb.PreviousTransactionID): void;
  hasPreviousTransactionId(): boolean;
  clearPreviousTransactionId(): void;

  getPreviousTransactionLedgerSequence(): org_xrpl_rpc_v1_common_pb.PreviousTransactionLedgerSequence | undefined;
  setPreviousTransactionLedgerSequence(value?: org_xrpl_rpc_v1_common_pb.PreviousTransactionLedgerSequence): void;
  hasPreviousTransactionLedgerSequence(): boolean;
  clearPreviousTransactionLedgerSequence(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ModifiedNode.AsObject;
  static toObject(includeInstance: boolean, msg: ModifiedNode): ModifiedNode.AsObject;
  static serializeBinaryToWriter(message: ModifiedNode, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ModifiedNode;
  static deserializeBinaryFromReader(message: ModifiedNode, reader: jspb.BinaryReader): ModifiedNode;
}

export namespace ModifiedNode {
  export type AsObject = {
    finalFields?: org_xrpl_rpc_v1_ledger_objects_pb.LedgerObject.AsObject,
    previousFields?: org_xrpl_rpc_v1_ledger_objects_pb.LedgerObject.AsObject,
    previousTransactionId?: org_xrpl_rpc_v1_common_pb.PreviousTransactionID.AsObject,
    previousTransactionLedgerSequence?: org_xrpl_rpc_v1_common_pb.PreviousTransactionLedgerSequence.AsObject,
  }
}

