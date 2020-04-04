// package: io.xpring
// file: submit_signed_transaction_response.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class SubmitSignedTransactionResponse extends jspb.Message { 
    getEngineResult(): string;
    setEngineResult(value: string): void;

    getEngineResultCode(): number;
    setEngineResultCode(value: number): void;

    getEngineResultMessage(): string;
    setEngineResultMessage(value: string): void;

    getTransactionBlob(): string;
    setTransactionBlob(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SubmitSignedTransactionResponse.AsObject;
    static toObject(includeInstance: boolean, msg: SubmitSignedTransactionResponse): SubmitSignedTransactionResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SubmitSignedTransactionResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SubmitSignedTransactionResponse;
    static deserializeBinaryFromReader(message: SubmitSignedTransactionResponse, reader: jspb.BinaryReader): SubmitSignedTransactionResponse;
}

export namespace SubmitSignedTransactionResponse {
    export type AsObject = {
        engineResult: string,
        engineResultCode: number,
        engineResultMessage: string,
        transactionBlob: string,
    }
}
