// package: org.interledger.stream.proto
// file: get_account_request.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class GetAccountRequest extends jspb.Message { 
    getAccountId(): string;
    setAccountId(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetAccountRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetAccountRequest): GetAccountRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetAccountRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetAccountRequest;
    static deserializeBinaryFromReader(message: GetAccountRequest, reader: jspb.BinaryReader): GetAccountRequest;
}

export namespace GetAccountRequest {
    export type AsObject = {
        accountId: string,
    }
}
