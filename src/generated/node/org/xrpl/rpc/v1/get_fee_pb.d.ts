// package: org.xrpl.rpc.v1
// file: org/xrpl/rpc/v1/get_fee.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as org_xrpl_rpc_v1_amount_pb from "../../../../org/xrpl/rpc/v1/amount_pb";

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

export class GetFeeResponse extends jspb.Message { 
    getCurrentLedgerSize(): string;
    setCurrentLedgerSize(value: string): void;

    getCurrentQueueSize(): string;
    setCurrentQueueSize(value: string): void;


    hasFee(): boolean;
    clearFee(): void;
    getFee(): Fee | undefined;
    setFee(value?: Fee): void;

    getExpectedLedgerSize(): string;
    setExpectedLedgerSize(value: string): void;

    getLedgerCurrentIndex(): number;
    setLedgerCurrentIndex(value: number): void;


    hasLevels(): boolean;
    clearLevels(): void;
    getLevels(): FeeLevels | undefined;
    setLevels(value?: FeeLevels): void;

    getMaxQueueSize(): string;
    setMaxQueueSize(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetFeeResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GetFeeResponse): GetFeeResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetFeeResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetFeeResponse;
    static deserializeBinaryFromReader(message: GetFeeResponse, reader: jspb.BinaryReader): GetFeeResponse;
}

export namespace GetFeeResponse {
    export type AsObject = {
        currentLedgerSize: string,
        currentQueueSize: string,
        fee?: Fee.AsObject,
        expectedLedgerSize: string,
        ledgerCurrentIndex: number,
        levels?: FeeLevels.AsObject,
        maxQueueSize: string,
    }
}

export class Fee extends jspb.Message { 

    hasBaseFee(): boolean;
    clearBaseFee(): void;
    getBaseFee(): org_xrpl_rpc_v1_amount_pb.XRPDropsAmount | undefined;
    setBaseFee(value?: org_xrpl_rpc_v1_amount_pb.XRPDropsAmount): void;


    hasMedianFee(): boolean;
    clearMedianFee(): void;
    getMedianFee(): org_xrpl_rpc_v1_amount_pb.XRPDropsAmount | undefined;
    setMedianFee(value?: org_xrpl_rpc_v1_amount_pb.XRPDropsAmount): void;


    hasMinimumFee(): boolean;
    clearMinimumFee(): void;
    getMinimumFee(): org_xrpl_rpc_v1_amount_pb.XRPDropsAmount | undefined;
    setMinimumFee(value?: org_xrpl_rpc_v1_amount_pb.XRPDropsAmount): void;


    hasOpenLedgerFee(): boolean;
    clearOpenLedgerFee(): void;
    getOpenLedgerFee(): org_xrpl_rpc_v1_amount_pb.XRPDropsAmount | undefined;
    setOpenLedgerFee(value?: org_xrpl_rpc_v1_amount_pb.XRPDropsAmount): void;


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
        baseFee?: org_xrpl_rpc_v1_amount_pb.XRPDropsAmount.AsObject,
        medianFee?: org_xrpl_rpc_v1_amount_pb.XRPDropsAmount.AsObject,
        minimumFee?: org_xrpl_rpc_v1_amount_pb.XRPDropsAmount.AsObject,
        openLedgerFee?: org_xrpl_rpc_v1_amount_pb.XRPDropsAmount.AsObject,
    }
}

export class FeeLevels extends jspb.Message { 
    getMedianLevel(): string;
    setMedianLevel(value: string): void;

    getMinimumLevel(): string;
    setMinimumLevel(value: string): void;

    getOpenLedgerLevel(): string;
    setOpenLedgerLevel(value: string): void;

    getReferenceLevel(): string;
    setReferenceLevel(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): FeeLevels.AsObject;
    static toObject(includeInstance: boolean, msg: FeeLevels): FeeLevels.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: FeeLevels, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): FeeLevels;
    static deserializeBinaryFromReader(message: FeeLevels, reader: jspb.BinaryReader): FeeLevels;
}

export namespace FeeLevels {
    export type AsObject = {
        medianLevel: string,
        minimumLevel: string,
        openLedgerLevel: string,
        referenceLevel: string,
    }
}
