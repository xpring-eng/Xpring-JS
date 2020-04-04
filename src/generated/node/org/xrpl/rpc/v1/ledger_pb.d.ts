// package: org.xrpl.rpc.v1
// file: org/xrpl/rpc/v1/ledger.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class LedgerSpecifier extends jspb.Message { 

    hasShortcut(): boolean;
    clearShortcut(): void;
    getShortcut(): LedgerSpecifier.Shortcut;
    setShortcut(value: LedgerSpecifier.Shortcut): void;


    hasSequence(): boolean;
    clearSequence(): void;
    getSequence(): number;
    setSequence(value: number): void;


    hasHash(): boolean;
    clearHash(): void;
    getHash(): Uint8Array | string;
    getHash_asU8(): Uint8Array;
    getHash_asB64(): string;
    setHash(value: Uint8Array | string): void;


    getLedgerCase(): LedgerSpecifier.LedgerCase;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): LedgerSpecifier.AsObject;
    static toObject(includeInstance: boolean, msg: LedgerSpecifier): LedgerSpecifier.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: LedgerSpecifier, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): LedgerSpecifier;
    static deserializeBinaryFromReader(message: LedgerSpecifier, reader: jspb.BinaryReader): LedgerSpecifier;
}

export namespace LedgerSpecifier {
    export type AsObject = {
        shortcut: LedgerSpecifier.Shortcut,
        sequence: number,
        hash: Uint8Array | string,
    }

    export enum Shortcut {
    SHORTCUT_UNSPECIFIED = 0,
    SHORTCUT_VALIDATED = 1,
    SHORTCUT_CLOSED = 2,
    SHORTCUT_CURRENT = 3,
    }


    export enum LedgerCase {
        LEDGER_NOT_SET = 0,
    
    SHORTCUT = 1,

    SEQUENCE = 2,

    HASH = 3,

    }

}

export class LedgerRange extends jspb.Message { 
    getLedgerIndexMin(): number;
    setLedgerIndexMin(value: number): void;

    getLedgerIndexMax(): number;
    setLedgerIndexMax(value: number): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): LedgerRange.AsObject;
    static toObject(includeInstance: boolean, msg: LedgerRange): LedgerRange.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: LedgerRange, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): LedgerRange;
    static deserializeBinaryFromReader(message: LedgerRange, reader: jspb.BinaryReader): LedgerRange;
}

export namespace LedgerRange {
    export type AsObject = {
        ledgerIndexMin: number,
        ledgerIndexMax: number,
    }
}
