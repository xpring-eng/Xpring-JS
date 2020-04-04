// package: org.xrpl.rpc.v1
// file: org/xrpl/rpc/v1/amount.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as org_xrpl_rpc_v1_account_pb from "../../../../org/xrpl/rpc/v1/account_pb";

export class CurrencyAmount extends jspb.Message { 

    hasXrpAmount(): boolean;
    clearXrpAmount(): void;
    getXrpAmount(): XRPDropsAmount | undefined;
    setXrpAmount(value?: XRPDropsAmount): void;


    hasIssuedCurrencyAmount(): boolean;
    clearIssuedCurrencyAmount(): void;
    getIssuedCurrencyAmount(): IssuedCurrencyAmount | undefined;
    setIssuedCurrencyAmount(value?: IssuedCurrencyAmount): void;


    getAmountCase(): CurrencyAmount.AmountCase;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CurrencyAmount.AsObject;
    static toObject(includeInstance: boolean, msg: CurrencyAmount): CurrencyAmount.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CurrencyAmount, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CurrencyAmount;
    static deserializeBinaryFromReader(message: CurrencyAmount, reader: jspb.BinaryReader): CurrencyAmount;
}

export namespace CurrencyAmount {
    export type AsObject = {
        xrpAmount?: XRPDropsAmount.AsObject,
        issuedCurrencyAmount?: IssuedCurrencyAmount.AsObject,
    }

    export enum AmountCase {
        AMOUNT_NOT_SET = 0,
    
    XRP_AMOUNT = 1,

    ISSUED_CURRENCY_AMOUNT = 2,

    }

}

export class XRPDropsAmount extends jspb.Message { 
    getDrops(): string;
    setDrops(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): XRPDropsAmount.AsObject;
    static toObject(includeInstance: boolean, msg: XRPDropsAmount): XRPDropsAmount.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: XRPDropsAmount, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): XRPDropsAmount;
    static deserializeBinaryFromReader(message: XRPDropsAmount, reader: jspb.BinaryReader): XRPDropsAmount;
}

export namespace XRPDropsAmount {
    export type AsObject = {
        drops: string,
    }
}

export class IssuedCurrencyAmount extends jspb.Message { 

    hasCurrency(): boolean;
    clearCurrency(): void;
    getCurrency(): Currency | undefined;
    setCurrency(value?: Currency): void;

    getValue(): string;
    setValue(value: string): void;


    hasIssuer(): boolean;
    clearIssuer(): void;
    getIssuer(): org_xrpl_rpc_v1_account_pb.AccountAddress | undefined;
    setIssuer(value?: org_xrpl_rpc_v1_account_pb.AccountAddress): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): IssuedCurrencyAmount.AsObject;
    static toObject(includeInstance: boolean, msg: IssuedCurrencyAmount): IssuedCurrencyAmount.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: IssuedCurrencyAmount, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): IssuedCurrencyAmount;
    static deserializeBinaryFromReader(message: IssuedCurrencyAmount, reader: jspb.BinaryReader): IssuedCurrencyAmount;
}

export namespace IssuedCurrencyAmount {
    export type AsObject = {
        currency?: Currency.AsObject,
        value: string,
        issuer?: org_xrpl_rpc_v1_account_pb.AccountAddress.AsObject,
    }
}

export class Currency extends jspb.Message { 
    getName(): string;
    setName(value: string): void;

    getCode(): Uint8Array | string;
    getCode_asU8(): Uint8Array;
    getCode_asB64(): string;
    setCode(value: Uint8Array | string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Currency.AsObject;
    static toObject(includeInstance: boolean, msg: Currency): Currency.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Currency, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Currency;
    static deserializeBinaryFromReader(message: Currency, reader: jspb.BinaryReader): Currency;
}

export namespace Currency {
    export type AsObject = {
        name: string,
        code: Uint8Array | string,
    }
}
