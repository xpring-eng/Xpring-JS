// package: io.xpring
// file: signed_transaction.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as transaction_pb from "./transaction_pb";

export class SignedTransaction extends jspb.Message { 

    hasTransaction(): boolean;
    clearTransaction(): void;
    getTransaction(): transaction_pb.Transaction | undefined;
    setTransaction(value?: transaction_pb.Transaction): void;

    getTransactionSignatureHex(): string;
    setTransactionSignatureHex(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SignedTransaction.AsObject;
    static toObject(includeInstance: boolean, msg: SignedTransaction): SignedTransaction.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SignedTransaction, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SignedTransaction;
    static deserializeBinaryFromReader(message: SignedTransaction, reader: jspb.BinaryReader): SignedTransaction;
}

export namespace SignedTransaction {
    export type AsObject = {
        transaction?: transaction_pb.Transaction.AsObject,
        transactionSignatureHex: string,
    }
}
