import * as jspb from "google-protobuf"

import * as org_xrpl_rpc_v1_ledger_objects_pb from '../../../../org/xrpl/rpc/v1/ledger_objects_pb';
import * as org_xrpl_rpc_v1_amount_pb from '../../../../org/xrpl/rpc/v1/amount_pb';
import * as org_xrpl_rpc_v1_account_pb from '../../../../org/xrpl/rpc/v1/account_pb';
import * as org_xrpl_rpc_v1_ledger_pb from '../../../../org/xrpl/rpc/v1/ledger_pb';
import * as org_xrpl_rpc_v1_common_pb from '../../../../org/xrpl/rpc/v1/common_pb';

export class GetAccountInfoRequest extends jspb.Message {
  getAccount(): org_xrpl_rpc_v1_account_pb.AccountAddress | undefined;
  setAccount(value?: org_xrpl_rpc_v1_account_pb.AccountAddress): void;
  hasAccount(): boolean;
  clearAccount(): void;

  getStrict(): boolean;
  setStrict(value: boolean): void;

  getLedger(): org_xrpl_rpc_v1_ledger_pb.LedgerSpecifier | undefined;
  setLedger(value?: org_xrpl_rpc_v1_ledger_pb.LedgerSpecifier): void;
  hasLedger(): boolean;
  clearLedger(): void;

  getQueue(): boolean;
  setQueue(value: boolean): void;

  getSignerLists(): boolean;
  setSignerLists(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAccountInfoRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetAccountInfoRequest): GetAccountInfoRequest.AsObject;
  static serializeBinaryToWriter(message: GetAccountInfoRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAccountInfoRequest;
  static deserializeBinaryFromReader(message: GetAccountInfoRequest, reader: jspb.BinaryReader): GetAccountInfoRequest;
}

export namespace GetAccountInfoRequest {
  export type AsObject = {
    account?: org_xrpl_rpc_v1_account_pb.AccountAddress.AsObject,
    strict: boolean,
    ledger?: org_xrpl_rpc_v1_ledger_pb.LedgerSpecifier.AsObject,
    queue: boolean,
    signerLists: boolean,
  }
}

export class GetAccountInfoResponse extends jspb.Message {
  getAccountData(): org_xrpl_rpc_v1_ledger_objects_pb.AccountRoot | undefined;
  setAccountData(value?: org_xrpl_rpc_v1_ledger_objects_pb.AccountRoot): void;
  hasAccountData(): boolean;
  clearAccountData(): void;

  getSignerList(): org_xrpl_rpc_v1_ledger_objects_pb.SignerList | undefined;
  setSignerList(value?: org_xrpl_rpc_v1_ledger_objects_pb.SignerList): void;
  hasSignerList(): boolean;
  clearSignerList(): void;

  getLedgerIndex(): number;
  setLedgerIndex(value: number): void;

  getQueueData(): QueueData | undefined;
  setQueueData(value?: QueueData): void;
  hasQueueData(): boolean;
  clearQueueData(): void;

  getValidated(): boolean;
  setValidated(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAccountInfoResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetAccountInfoResponse): GetAccountInfoResponse.AsObject;
  static serializeBinaryToWriter(message: GetAccountInfoResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAccountInfoResponse;
  static deserializeBinaryFromReader(message: GetAccountInfoResponse, reader: jspb.BinaryReader): GetAccountInfoResponse;
}

export namespace GetAccountInfoResponse {
  export type AsObject = {
    accountData?: org_xrpl_rpc_v1_ledger_objects_pb.AccountRoot.AsObject,
    signerList?: org_xrpl_rpc_v1_ledger_objects_pb.SignerList.AsObject,
    ledgerIndex: number,
    queueData?: QueueData.AsObject,
    validated: boolean,
  }
}

export class QueueData extends jspb.Message {
  getTxnCount(): number;
  setTxnCount(value: number): void;

  getAuthChangeQueued(): boolean;
  setAuthChangeQueued(value: boolean): void;

  getLowestSequence(): number;
  setLowestSequence(value: number): void;

  getHighestSequence(): number;
  setHighestSequence(value: number): void;

  getMaxSpendDropsTotal(): org_xrpl_rpc_v1_amount_pb.XRPDropsAmount | undefined;
  setMaxSpendDropsTotal(value?: org_xrpl_rpc_v1_amount_pb.XRPDropsAmount): void;
  hasMaxSpendDropsTotal(): boolean;
  clearMaxSpendDropsTotal(): void;

  getTransactionsList(): Array<QueuedTransaction>;
  setTransactionsList(value: Array<QueuedTransaction>): void;
  clearTransactionsList(): void;
  addTransactions(value?: QueuedTransaction, index?: number): QueuedTransaction;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueueData.AsObject;
  static toObject(includeInstance: boolean, msg: QueueData): QueueData.AsObject;
  static serializeBinaryToWriter(message: QueueData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueueData;
  static deserializeBinaryFromReader(message: QueueData, reader: jspb.BinaryReader): QueueData;
}

export namespace QueueData {
  export type AsObject = {
    txnCount: number,
    authChangeQueued: boolean,
    lowestSequence: number,
    highestSequence: number,
    maxSpendDropsTotal?: org_xrpl_rpc_v1_amount_pb.XRPDropsAmount.AsObject,
    transactionsList: Array<QueuedTransaction.AsObject>,
  }
}

export class QueuedTransaction extends jspb.Message {
  getAuthChange(): boolean;
  setAuthChange(value: boolean): void;

  getFee(): org_xrpl_rpc_v1_amount_pb.XRPDropsAmount | undefined;
  setFee(value?: org_xrpl_rpc_v1_amount_pb.XRPDropsAmount): void;
  hasFee(): boolean;
  clearFee(): void;

  getFeeLevel(): string;
  setFeeLevel(value: string): void;

  getMaxSpendDrops(): org_xrpl_rpc_v1_amount_pb.XRPDropsAmount | undefined;
  setMaxSpendDrops(value?: org_xrpl_rpc_v1_amount_pb.XRPDropsAmount): void;
  hasMaxSpendDrops(): boolean;
  clearMaxSpendDrops(): void;

  getSequence(): org_xrpl_rpc_v1_common_pb.Sequence | undefined;
  setSequence(value?: org_xrpl_rpc_v1_common_pb.Sequence): void;
  hasSequence(): boolean;
  clearSequence(): void;

  getLastLedgerSequence(): org_xrpl_rpc_v1_common_pb.LastLedgerSequence | undefined;
  setLastLedgerSequence(value?: org_xrpl_rpc_v1_common_pb.LastLedgerSequence): void;
  hasLastLedgerSequence(): boolean;
  clearLastLedgerSequence(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueuedTransaction.AsObject;
  static toObject(includeInstance: boolean, msg: QueuedTransaction): QueuedTransaction.AsObject;
  static serializeBinaryToWriter(message: QueuedTransaction, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueuedTransaction;
  static deserializeBinaryFromReader(message: QueuedTransaction, reader: jspb.BinaryReader): QueuedTransaction;
}

export namespace QueuedTransaction {
  export type AsObject = {
    authChange: boolean,
    fee?: org_xrpl_rpc_v1_amount_pb.XRPDropsAmount.AsObject,
    feeLevel: string,
    maxSpendDrops?: org_xrpl_rpc_v1_amount_pb.XRPDropsAmount.AsObject,
    sequence?: org_xrpl_rpc_v1_common_pb.Sequence.AsObject,
    lastLedgerSequence?: org_xrpl_rpc_v1_common_pb.LastLedgerSequence.AsObject,
  }
}

