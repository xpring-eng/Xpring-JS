// package: io.xpring
// file: fee.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as xrp_amount_pb from "./xrp_amount_pb";

export class Fee extends jspb.Message { 

    hasAmount(): boolean;
    clearAmount(): void;
    getAmount(): xrp_amount_pb.XRPAmount | undefined;
    setAmount(value?: xrp_amount_pb.XRPAmount): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Fee.AsObject;
    static toObject(includeInstance: boolean, msg: Fee): Fee.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Fee, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Fee;
    static deserializeBinaryFromReader(message: Fee, reader: jspb.BinaryReader): Fee;
}

export namespace Fee {
    export type AsObject = {
        amount?: xrp_amount_pb.XRPAmount.AsObject,
    }
}
