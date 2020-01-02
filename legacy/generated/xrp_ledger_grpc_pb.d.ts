// package: io.xpring
// file: xrp_ledger.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "grpc";
import * as xrp_ledger_pb from "./xrp_ledger_pb";
import * as account_info_pb from "./account_info_pb";
import * as fee_pb from "./fee_pb";
import * as get_account_info_request_pb from "./get_account_info_request_pb";
import * as get_fee_request_pb from "./get_fee_request_pb";
import * as get_latest_validated_ledger_sequence_request_pb from "./get_latest_validated_ledger_sequence_request_pb";
import * as get_transaction_status_request_pb from "./get_transaction_status_request_pb";
import * as ledger_sequence_pb from "./ledger_sequence_pb";
import * as submit_signed_transaction_request_pb from "./submit_signed_transaction_request_pb";
import * as submit_signed_transaction_response_pb from "./submit_signed_transaction_response_pb";
import * as transaction_status_pb from "./transaction_status_pb";

interface IXRPLedgerAPIService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    getAccountInfo: IXRPLedgerAPIService_IGetAccountInfo;
    getFee: IXRPLedgerAPIService_IGetFee;
    submitSignedTransaction: IXRPLedgerAPIService_ISubmitSignedTransaction;
    getTransactionStatus: IXRPLedgerAPIService_IGetTransactionStatus;
    getLatestValidatedLedgerSequence: IXRPLedgerAPIService_IGetLatestValidatedLedgerSequence;
}

interface IXRPLedgerAPIService_IGetAccountInfo extends grpc.MethodDefinition<get_account_info_request_pb.GetAccountInfoRequest, account_info_pb.AccountInfo> {
    path: string; // "/io.xpring.XRPLedgerAPI/GetAccountInfo"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<get_account_info_request_pb.GetAccountInfoRequest>;
    requestDeserialize: grpc.deserialize<get_account_info_request_pb.GetAccountInfoRequest>;
    responseSerialize: grpc.serialize<account_info_pb.AccountInfo>;
    responseDeserialize: grpc.deserialize<account_info_pb.AccountInfo>;
}
interface IXRPLedgerAPIService_IGetFee extends grpc.MethodDefinition<get_fee_request_pb.GetFeeRequest, fee_pb.Fee> {
    path: string; // "/io.xpring.XRPLedgerAPI/GetFee"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<get_fee_request_pb.GetFeeRequest>;
    requestDeserialize: grpc.deserialize<get_fee_request_pb.GetFeeRequest>;
    responseSerialize: grpc.serialize<fee_pb.Fee>;
    responseDeserialize: grpc.deserialize<fee_pb.Fee>;
}
interface IXRPLedgerAPIService_ISubmitSignedTransaction extends grpc.MethodDefinition<submit_signed_transaction_request_pb.SubmitSignedTransactionRequest, submit_signed_transaction_response_pb.SubmitSignedTransactionResponse> {
    path: string; // "/io.xpring.XRPLedgerAPI/SubmitSignedTransaction"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<submit_signed_transaction_request_pb.SubmitSignedTransactionRequest>;
    requestDeserialize: grpc.deserialize<submit_signed_transaction_request_pb.SubmitSignedTransactionRequest>;
    responseSerialize: grpc.serialize<submit_signed_transaction_response_pb.SubmitSignedTransactionResponse>;
    responseDeserialize: grpc.deserialize<submit_signed_transaction_response_pb.SubmitSignedTransactionResponse>;
}
interface IXRPLedgerAPIService_IGetTransactionStatus extends grpc.MethodDefinition<get_transaction_status_request_pb.GetTransactionStatusRequest, transaction_status_pb.TransactionStatus> {
    path: string; // "/io.xpring.XRPLedgerAPI/GetTransactionStatus"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<get_transaction_status_request_pb.GetTransactionStatusRequest>;
    requestDeserialize: grpc.deserialize<get_transaction_status_request_pb.GetTransactionStatusRequest>;
    responseSerialize: grpc.serialize<transaction_status_pb.TransactionStatus>;
    responseDeserialize: grpc.deserialize<transaction_status_pb.TransactionStatus>;
}
interface IXRPLedgerAPIService_IGetLatestValidatedLedgerSequence extends grpc.MethodDefinition<get_latest_validated_ledger_sequence_request_pb.GetLatestValidatedLedgerSequenceRequest, ledger_sequence_pb.LedgerSequence> {
    path: string; // "/io.xpring.XRPLedgerAPI/GetLatestValidatedLedgerSequence"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<get_latest_validated_ledger_sequence_request_pb.GetLatestValidatedLedgerSequenceRequest>;
    requestDeserialize: grpc.deserialize<get_latest_validated_ledger_sequence_request_pb.GetLatestValidatedLedgerSequenceRequest>;
    responseSerialize: grpc.serialize<ledger_sequence_pb.LedgerSequence>;
    responseDeserialize: grpc.deserialize<ledger_sequence_pb.LedgerSequence>;
}

export const XRPLedgerAPIService: IXRPLedgerAPIService;

export interface IXRPLedgerAPIServer {
    getAccountInfo: grpc.handleUnaryCall<get_account_info_request_pb.GetAccountInfoRequest, account_info_pb.AccountInfo>;
    getFee: grpc.handleUnaryCall<get_fee_request_pb.GetFeeRequest, fee_pb.Fee>;
    submitSignedTransaction: grpc.handleUnaryCall<submit_signed_transaction_request_pb.SubmitSignedTransactionRequest, submit_signed_transaction_response_pb.SubmitSignedTransactionResponse>;
    getTransactionStatus: grpc.handleUnaryCall<get_transaction_status_request_pb.GetTransactionStatusRequest, transaction_status_pb.TransactionStatus>;
    getLatestValidatedLedgerSequence: grpc.handleUnaryCall<get_latest_validated_ledger_sequence_request_pb.GetLatestValidatedLedgerSequenceRequest, ledger_sequence_pb.LedgerSequence>;
}

export interface IXRPLedgerAPIClient {
    getAccountInfo(request: get_account_info_request_pb.GetAccountInfoRequest, callback: (error: grpc.ServiceError | null, response: account_info_pb.AccountInfo) => void): grpc.ClientUnaryCall;
    getAccountInfo(request: get_account_info_request_pb.GetAccountInfoRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: account_info_pb.AccountInfo) => void): grpc.ClientUnaryCall;
    getAccountInfo(request: get_account_info_request_pb.GetAccountInfoRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: account_info_pb.AccountInfo) => void): grpc.ClientUnaryCall;
    getFee(request: get_fee_request_pb.GetFeeRequest, callback: (error: grpc.ServiceError | null, response: fee_pb.Fee) => void): grpc.ClientUnaryCall;
    getFee(request: get_fee_request_pb.GetFeeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: fee_pb.Fee) => void): grpc.ClientUnaryCall;
    getFee(request: get_fee_request_pb.GetFeeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: fee_pb.Fee) => void): grpc.ClientUnaryCall;
    submitSignedTransaction(request: submit_signed_transaction_request_pb.SubmitSignedTransactionRequest, callback: (error: grpc.ServiceError | null, response: submit_signed_transaction_response_pb.SubmitSignedTransactionResponse) => void): grpc.ClientUnaryCall;
    submitSignedTransaction(request: submit_signed_transaction_request_pb.SubmitSignedTransactionRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: submit_signed_transaction_response_pb.SubmitSignedTransactionResponse) => void): grpc.ClientUnaryCall;
    submitSignedTransaction(request: submit_signed_transaction_request_pb.SubmitSignedTransactionRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: submit_signed_transaction_response_pb.SubmitSignedTransactionResponse) => void): grpc.ClientUnaryCall;
    getTransactionStatus(request: get_transaction_status_request_pb.GetTransactionStatusRequest, callback: (error: grpc.ServiceError | null, response: transaction_status_pb.TransactionStatus) => void): grpc.ClientUnaryCall;
    getTransactionStatus(request: get_transaction_status_request_pb.GetTransactionStatusRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: transaction_status_pb.TransactionStatus) => void): grpc.ClientUnaryCall;
    getTransactionStatus(request: get_transaction_status_request_pb.GetTransactionStatusRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: transaction_status_pb.TransactionStatus) => void): grpc.ClientUnaryCall;
    getLatestValidatedLedgerSequence(request: get_latest_validated_ledger_sequence_request_pb.GetLatestValidatedLedgerSequenceRequest, callback: (error: grpc.ServiceError | null, response: ledger_sequence_pb.LedgerSequence) => void): grpc.ClientUnaryCall;
    getLatestValidatedLedgerSequence(request: get_latest_validated_ledger_sequence_request_pb.GetLatestValidatedLedgerSequenceRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: ledger_sequence_pb.LedgerSequence) => void): grpc.ClientUnaryCall;
    getLatestValidatedLedgerSequence(request: get_latest_validated_ledger_sequence_request_pb.GetLatestValidatedLedgerSequenceRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: ledger_sequence_pb.LedgerSequence) => void): grpc.ClientUnaryCall;
}

export class XRPLedgerAPIClient extends grpc.Client implements IXRPLedgerAPIClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public getAccountInfo(request: get_account_info_request_pb.GetAccountInfoRequest, callback: (error: grpc.ServiceError | null, response: account_info_pb.AccountInfo) => void): grpc.ClientUnaryCall;
    public getAccountInfo(request: get_account_info_request_pb.GetAccountInfoRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: account_info_pb.AccountInfo) => void): grpc.ClientUnaryCall;
    public getAccountInfo(request: get_account_info_request_pb.GetAccountInfoRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: account_info_pb.AccountInfo) => void): grpc.ClientUnaryCall;
    public getFee(request: get_fee_request_pb.GetFeeRequest, callback: (error: grpc.ServiceError | null, response: fee_pb.Fee) => void): grpc.ClientUnaryCall;
    public getFee(request: get_fee_request_pb.GetFeeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: fee_pb.Fee) => void): grpc.ClientUnaryCall;
    public getFee(request: get_fee_request_pb.GetFeeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: fee_pb.Fee) => void): grpc.ClientUnaryCall;
    public submitSignedTransaction(request: submit_signed_transaction_request_pb.SubmitSignedTransactionRequest, callback: (error: grpc.ServiceError | null, response: submit_signed_transaction_response_pb.SubmitSignedTransactionResponse) => void): grpc.ClientUnaryCall;
    public submitSignedTransaction(request: submit_signed_transaction_request_pb.SubmitSignedTransactionRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: submit_signed_transaction_response_pb.SubmitSignedTransactionResponse) => void): grpc.ClientUnaryCall;
    public submitSignedTransaction(request: submit_signed_transaction_request_pb.SubmitSignedTransactionRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: submit_signed_transaction_response_pb.SubmitSignedTransactionResponse) => void): grpc.ClientUnaryCall;
    public getTransactionStatus(request: get_transaction_status_request_pb.GetTransactionStatusRequest, callback: (error: grpc.ServiceError | null, response: transaction_status_pb.TransactionStatus) => void): grpc.ClientUnaryCall;
    public getTransactionStatus(request: get_transaction_status_request_pb.GetTransactionStatusRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: transaction_status_pb.TransactionStatus) => void): grpc.ClientUnaryCall;
    public getTransactionStatus(request: get_transaction_status_request_pb.GetTransactionStatusRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: transaction_status_pb.TransactionStatus) => void): grpc.ClientUnaryCall;
    public getLatestValidatedLedgerSequence(request: get_latest_validated_ledger_sequence_request_pb.GetLatestValidatedLedgerSequenceRequest, callback: (error: grpc.ServiceError | null, response: ledger_sequence_pb.LedgerSequence) => void): grpc.ClientUnaryCall;
    public getLatestValidatedLedgerSequence(request: get_latest_validated_ledger_sequence_request_pb.GetLatestValidatedLedgerSequenceRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: ledger_sequence_pb.LedgerSequence) => void): grpc.ClientUnaryCall;
    public getLatestValidatedLedgerSequence(request: get_latest_validated_ledger_sequence_request_pb.GetLatestValidatedLedgerSequenceRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: ledger_sequence_pb.LedgerSequence) => void): grpc.ClientUnaryCall;
}
