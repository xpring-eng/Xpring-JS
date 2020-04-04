// package: org.xrpl.rpc.v1
// file: org/xrpl/rpc/v1/get_account_transaction_history.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as org_xrpl_rpc_v1_get_transaction_pb from "../../../../org/xrpl/rpc/v1/get_transaction_pb";
import * as org_xrpl_rpc_v1_account_pb from "../../../../org/xrpl/rpc/v1/account_pb";
import * as org_xrpl_rpc_v1_ledger_pb from "../../../../org/xrpl/rpc/v1/ledger_pb";

export class GetAccountTransactionHistoryRequest extends jspb.Message { 

    hasAccount(): boolean;
    clearAccount(): void;
    getAccount(): org_xrpl_rpc_v1_account_pb.AccountAddress | undefined;
    setAccount(value?: org_xrpl_rpc_v1_account_pb.AccountAddress): void;


    hasLedgerSpecifier(): boolean;
    clearLedgerSpecifier(): void;
    getLedgerSpecifier(): org_xrpl_rpc_v1_ledger_pb.LedgerSpecifier | undefined;
    setLedgerSpecifier(value?: org_xrpl_rpc_v1_ledger_pb.LedgerSpecifier): void;


    hasLedgerRange(): boolean;
    clearLedgerRange(): void;
    getLedgerRange(): org_xrpl_rpc_v1_ledger_pb.LedgerRange | undefined;
    setLedgerRange(value?: org_xrpl_rpc_v1_ledger_pb.LedgerRange): void;

    getBinary(): boolean;
    setBinary(value: boolean): void;

    getForward(): boolean;
    setForward(value: boolean): void;

    getLimit(): number;
    setLimit(value: number): void;


    hasMarker(): boolean;
    clearMarker(): void;
    getMarker(): Marker | undefined;
    setMarker(value?: Marker): void;


    getLedgerCase(): GetAccountTransactionHistoryRequest.LedgerCase;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetAccountTransactionHistoryRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetAccountTransactionHistoryRequest): GetAccountTransactionHistoryRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetAccountTransactionHistoryRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetAccountTransactionHistoryRequest;
    static deserializeBinaryFromReader(message: GetAccountTransactionHistoryRequest, reader: jspb.BinaryReader): GetAccountTransactionHistoryRequest;
}

export namespace GetAccountTransactionHistoryRequest {
    export type AsObject = {
        account?: org_xrpl_rpc_v1_account_pb.AccountAddress.AsObject,
        ledgerSpecifier?: org_xrpl_rpc_v1_ledger_pb.LedgerSpecifier.AsObject,
        ledgerRange?: org_xrpl_rpc_v1_ledger_pb.LedgerRange.AsObject,
        binary: boolean,
        forward: boolean,
        limit: number,
        marker?: Marker.AsObject,
    }

    export enum LedgerCase {
        LEDGER_NOT_SET = 0,
    
    LEDGER_SPECIFIER = 2,

    LEDGER_RANGE = 3,

    }

}

export class GetAccountTransactionHistoryResponse extends jspb.Message { 

    hasAccount(): boolean;
    clearAccount(): void;
    getAccount(): org_xrpl_rpc_v1_account_pb.AccountAddress | undefined;
    setAccount(value?: org_xrpl_rpc_v1_account_pb.AccountAddress): void;

    getLedgerIndexMin(): number;
    setLedgerIndexMin(value: number): void;

    getLedgerIndexMax(): number;
    setLedgerIndexMax(value: number): void;

    getLimit(): number;
    setLimit(value: number): void;


    hasMarker(): boolean;
    clearMarker(): void;
    getMarker(): Marker | undefined;
    setMarker(value?: Marker): void;

    clearTransactionsList(): void;
    getTransactionsList(): Array<org_xrpl_rpc_v1_get_transaction_pb.GetTransactionResponse>;
    setTransactionsList(value: Array<org_xrpl_rpc_v1_get_transaction_pb.GetTransactionResponse>): void;
    addTransactions(value?: org_xrpl_rpc_v1_get_transaction_pb.GetTransactionResponse, index?: number): org_xrpl_rpc_v1_get_transaction_pb.GetTransactionResponse;

    getValidated(): boolean;
    setValidated(value: boolean): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetAccountTransactionHistoryResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GetAccountTransactionHistoryResponse): GetAccountTransactionHistoryResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetAccountTransactionHistoryResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetAccountTransactionHistoryResponse;
    static deserializeBinaryFromReader(message: GetAccountTransactionHistoryResponse, reader: jspb.BinaryReader): GetAccountTransactionHistoryResponse;
}

export namespace GetAccountTransactionHistoryResponse {
    export type AsObject = {
        account?: org_xrpl_rpc_v1_account_pb.AccountAddress.AsObject,
        ledgerIndexMin: number,
        ledgerIndexMax: number,
        limit: number,
        marker?: Marker.AsObject,
        transactionsList: Array<org_xrpl_rpc_v1_get_transaction_pb.GetTransactionResponse.AsObject>,
        validated: boolean,
    }
}

export class Marker extends jspb.Message { 
    getLedgerIndex(): number;
    setLedgerIndex(value: number): void;

    getAccountSequence(): number;
    setAccountSequence(value: number): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Marker.AsObject;
    static toObject(includeInstance: boolean, msg: Marker): Marker.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Marker, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Marker;
    static deserializeBinaryFromReader(message: Marker, reader: jspb.BinaryReader): Marker;
}

export namespace Marker {
    export type AsObject = {
        ledgerIndex: number,
        accountSequence: number,
    }
}
