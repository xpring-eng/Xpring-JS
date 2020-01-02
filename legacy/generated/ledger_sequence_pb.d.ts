// package: io.xpring
// file: ledger_sequence.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class LedgerSequence extends jspb.Message { 
    getIndex(): number;
    setIndex(value: number): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): LedgerSequence.AsObject;
    static toObject(includeInstance: boolean, msg: LedgerSequence): LedgerSequence.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: LedgerSequence, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): LedgerSequence;
    static deserializeBinaryFromReader(message: LedgerSequence, reader: jspb.BinaryReader): LedgerSequence;
}

export namespace LedgerSequence {
    export type AsObject = {
        index: number,
    }
}
