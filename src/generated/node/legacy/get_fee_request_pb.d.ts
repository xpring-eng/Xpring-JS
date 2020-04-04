// package: io.xpring
// file: get_fee_request.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class GetFeeRequest extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetFeeRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetFeeRequest): GetFeeRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetFeeRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetFeeRequest;
    static deserializeBinaryFromReader(message: GetFeeRequest, reader: jspb.BinaryReader): GetFeeRequest;
}

export namespace GetFeeRequest {
    export type AsObject = {
    }
}
