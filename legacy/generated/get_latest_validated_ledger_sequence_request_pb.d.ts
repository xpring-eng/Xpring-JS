// package: io.xpring
// file: get_latest_validated_ledger_sequence_request.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class GetLatestValidatedLedgerSequenceRequest extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetLatestValidatedLedgerSequenceRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetLatestValidatedLedgerSequenceRequest): GetLatestValidatedLedgerSequenceRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetLatestValidatedLedgerSequenceRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetLatestValidatedLedgerSequenceRequest;
    static deserializeBinaryFromReader(message: GetLatestValidatedLedgerSequenceRequest, reader: jspb.BinaryReader): GetLatestValidatedLedgerSequenceRequest;
}

export namespace GetLatestValidatedLedgerSequenceRequest {
    export type AsObject = {
    }
}
