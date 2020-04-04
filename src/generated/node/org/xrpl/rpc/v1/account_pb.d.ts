// package: org.xrpl.rpc.v1
// file: org/xrpl/rpc/v1/account.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class AccountAddress extends jspb.Message { 
    getAddress(): string;
    setAddress(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): AccountAddress.AsObject;
    static toObject(includeInstance: boolean, msg: AccountAddress): AccountAddress.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: AccountAddress, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): AccountAddress;
    static deserializeBinaryFromReader(message: AccountAddress, reader: jspb.BinaryReader): AccountAddress;
}

export namespace AccountAddress {
    export type AsObject = {
        address: string,
    }
}
