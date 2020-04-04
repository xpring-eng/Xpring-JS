// package: io.xpring
// file: get_account_info_request.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class GetAccountInfoRequest extends jspb.Message { 
    getAddress(): string;
    setAddress(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetAccountInfoRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetAccountInfoRequest): GetAccountInfoRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetAccountInfoRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetAccountInfoRequest;
    static deserializeBinaryFromReader(message: GetAccountInfoRequest, reader: jspb.BinaryReader): GetAccountInfoRequest;
}

export namespace GetAccountInfoRequest {
    export type AsObject = {
        address: string,
    }
}
