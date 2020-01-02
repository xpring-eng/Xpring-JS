// package: io.xpring
// file: account_info.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as xrp_amount_pb from "./xrp_amount_pb";

export class AccountInfo extends jspb.Message { 

    hasBalance(): boolean;
    clearBalance(): void;
    getBalance(): xrp_amount_pb.XRPAmount | undefined;
    setBalance(value?: xrp_amount_pb.XRPAmount): void;

    getSequence(): number;
    setSequence(value: number): void;

    getOwnerCount(): number;
    setOwnerCount(value: number): void;

    getPreviousAffectingTransactionId(): string;
    setPreviousAffectingTransactionId(value: string): void;

    getPreviousAffectingTransactionLedgerVersion(): number;
    setPreviousAffectingTransactionLedgerVersion(value: number): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): AccountInfo.AsObject;
    static toObject(includeInstance: boolean, msg: AccountInfo): AccountInfo.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: AccountInfo, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): AccountInfo;
    static deserializeBinaryFromReader(message: AccountInfo, reader: jspb.BinaryReader): AccountInfo;
}

export namespace AccountInfo {
    export type AsObject = {
        balance?: xrp_amount_pb.XRPAmount.AsObject,
        sequence: number,
        ownerCount: number,
        previousAffectingTransactionId: string,
        previousAffectingTransactionLedgerVersion: number,
    }
}
