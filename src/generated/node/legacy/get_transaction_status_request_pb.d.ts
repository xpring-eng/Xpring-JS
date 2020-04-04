// package: io.xpring
// file: get_transaction_status_request.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class GetTransactionStatusRequest extends jspb.Message { 
    getTransactionHash(): string;
    setTransactionHash(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetTransactionStatusRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetTransactionStatusRequest): GetTransactionStatusRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetTransactionStatusRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetTransactionStatusRequest;
    static deserializeBinaryFromReader(message: GetTransactionStatusRequest, reader: jspb.BinaryReader): GetTransactionStatusRequest;
}

export namespace GetTransactionStatusRequest {
    export type AsObject = {
        transactionHash: string,
    }
}
