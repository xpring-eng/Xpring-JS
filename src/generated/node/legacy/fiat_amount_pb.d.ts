// package: io.xpring
// file: fiat_amount.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as currency_pb from "./currency_pb";

export class FiatAmount extends jspb.Message { 
    getCurrency(): currency_pb.Currency;
    setCurrency(value: currency_pb.Currency): void;

    getValue(): string;
    setValue(value: string): void;

    getIssuer(): string;
    setIssuer(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): FiatAmount.AsObject;
    static toObject(includeInstance: boolean, msg: FiatAmount): FiatAmount.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: FiatAmount, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): FiatAmount;
    static deserializeBinaryFromReader(message: FiatAmount, reader: jspb.BinaryReader): FiatAmount;
}

export namespace FiatAmount {
    export type AsObject = {
        currency: currency_pb.Currency,
        value: string,
        issuer: string,
    }
}
