// package: org.interledger.stream.proto
// file: get_balance_response.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class GetBalanceResponse extends jspb.Message { 
    getAccountId(): string;
    setAccountId(value: string): void;

    getAssetCode(): string;
    setAssetCode(value: string): void;

    getAssetScale(): number;
    setAssetScale(value: number): void;

    getNetBalance(): number;
    setNetBalance(value: number): void;

    getPrepaidAmount(): number;
    setPrepaidAmount(value: number): void;

    getClearingBalance(): number;
    setClearingBalance(value: number): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetBalanceResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GetBalanceResponse): GetBalanceResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetBalanceResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetBalanceResponse;
    static deserializeBinaryFromReader(message: GetBalanceResponse, reader: jspb.BinaryReader): GetBalanceResponse;
}

export namespace GetBalanceResponse {
    export type AsObject = {
        accountId: string,
        assetCode: string,
        assetScale: number,
        netBalance: number,
        prepaidAmount: number,
        clearingBalance: number,
    }
}
