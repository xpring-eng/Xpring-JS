// package: org.xrpl.rpc.v1
// file: org/xrpl/rpc/v1/xrp_ledger.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "grpc";
import * as org_xrpl_rpc_v1_xrp_ledger_pb from "../../../../org/xrpl/rpc/v1/xrp_ledger_pb";
import * as org_xrpl_rpc_v1_get_account_info_pb from "../../../../org/xrpl/rpc/v1/get_account_info_pb";
import * as org_xrpl_rpc_v1_get_fee_pb from "../../../../org/xrpl/rpc/v1/get_fee_pb";
import * as org_xrpl_rpc_v1_submit_pb from "../../../../org/xrpl/rpc/v1/submit_pb";
import * as org_xrpl_rpc_v1_get_transaction_pb from "../../../../org/xrpl/rpc/v1/get_transaction_pb";
import * as org_xrpl_rpc_v1_get_account_transaction_history_pb from "../../../../org/xrpl/rpc/v1/get_account_transaction_history_pb";

interface IXRPLedgerAPIServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    getAccountInfo: IXRPLedgerAPIServiceService_IGetAccountInfo;
    getFee: IXRPLedgerAPIServiceService_IGetFee;
    submitTransaction: IXRPLedgerAPIServiceService_ISubmitTransaction;
    getTransaction: IXRPLedgerAPIServiceService_IGetTransaction;
    getAccountTransactionHistory: IXRPLedgerAPIServiceService_IGetAccountTransactionHistory;
}

interface IXRPLedgerAPIServiceService_IGetAccountInfo extends grpc.MethodDefinition<org_xrpl_rpc_v1_get_account_info_pb.GetAccountInfoRequest, org_xrpl_rpc_v1_get_account_info_pb.GetAccountInfoResponse> {
    path: string; // "/org.xrpl.rpc.v1.XRPLedgerAPIService/GetAccountInfo"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<org_xrpl_rpc_v1_get_account_info_pb.GetAccountInfoRequest>;
    requestDeserialize: grpc.deserialize<org_xrpl_rpc_v1_get_account_info_pb.GetAccountInfoRequest>;
    responseSerialize: grpc.serialize<org_xrpl_rpc_v1_get_account_info_pb.GetAccountInfoResponse>;
    responseDeserialize: grpc.deserialize<org_xrpl_rpc_v1_get_account_info_pb.GetAccountInfoResponse>;
}
interface IXRPLedgerAPIServiceService_IGetFee extends grpc.MethodDefinition<org_xrpl_rpc_v1_get_fee_pb.GetFeeRequest, org_xrpl_rpc_v1_get_fee_pb.GetFeeResponse> {
    path: string; // "/org.xrpl.rpc.v1.XRPLedgerAPIService/GetFee"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<org_xrpl_rpc_v1_get_fee_pb.GetFeeRequest>;
    requestDeserialize: grpc.deserialize<org_xrpl_rpc_v1_get_fee_pb.GetFeeRequest>;
    responseSerialize: grpc.serialize<org_xrpl_rpc_v1_get_fee_pb.GetFeeResponse>;
    responseDeserialize: grpc.deserialize<org_xrpl_rpc_v1_get_fee_pb.GetFeeResponse>;
}
interface IXRPLedgerAPIServiceService_ISubmitTransaction extends grpc.MethodDefinition<org_xrpl_rpc_v1_submit_pb.SubmitTransactionRequest, org_xrpl_rpc_v1_submit_pb.SubmitTransactionResponse> {
    path: string; // "/org.xrpl.rpc.v1.XRPLedgerAPIService/SubmitTransaction"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<org_xrpl_rpc_v1_submit_pb.SubmitTransactionRequest>;
    requestDeserialize: grpc.deserialize<org_xrpl_rpc_v1_submit_pb.SubmitTransactionRequest>;
    responseSerialize: grpc.serialize<org_xrpl_rpc_v1_submit_pb.SubmitTransactionResponse>;
    responseDeserialize: grpc.deserialize<org_xrpl_rpc_v1_submit_pb.SubmitTransactionResponse>;
}
interface IXRPLedgerAPIServiceService_IGetTransaction extends grpc.MethodDefinition<org_xrpl_rpc_v1_get_transaction_pb.GetTransactionRequest, org_xrpl_rpc_v1_get_transaction_pb.GetTransactionResponse> {
    path: string; // "/org.xrpl.rpc.v1.XRPLedgerAPIService/GetTransaction"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<org_xrpl_rpc_v1_get_transaction_pb.GetTransactionRequest>;
    requestDeserialize: grpc.deserialize<org_xrpl_rpc_v1_get_transaction_pb.GetTransactionRequest>;
    responseSerialize: grpc.serialize<org_xrpl_rpc_v1_get_transaction_pb.GetTransactionResponse>;
    responseDeserialize: grpc.deserialize<org_xrpl_rpc_v1_get_transaction_pb.GetTransactionResponse>;
}
interface IXRPLedgerAPIServiceService_IGetAccountTransactionHistory extends grpc.MethodDefinition<org_xrpl_rpc_v1_get_account_transaction_history_pb.GetAccountTransactionHistoryRequest, org_xrpl_rpc_v1_get_account_transaction_history_pb.GetAccountTransactionHistoryResponse> {
    path: string; // "/org.xrpl.rpc.v1.XRPLedgerAPIService/GetAccountTransactionHistory"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<org_xrpl_rpc_v1_get_account_transaction_history_pb.GetAccountTransactionHistoryRequest>;
    requestDeserialize: grpc.deserialize<org_xrpl_rpc_v1_get_account_transaction_history_pb.GetAccountTransactionHistoryRequest>;
    responseSerialize: grpc.serialize<org_xrpl_rpc_v1_get_account_transaction_history_pb.GetAccountTransactionHistoryResponse>;
    responseDeserialize: grpc.deserialize<org_xrpl_rpc_v1_get_account_transaction_history_pb.GetAccountTransactionHistoryResponse>;
}

export const XRPLedgerAPIServiceService: IXRPLedgerAPIServiceService;

export interface IXRPLedgerAPIServiceServer {
    getAccountInfo: grpc.handleUnaryCall<org_xrpl_rpc_v1_get_account_info_pb.GetAccountInfoRequest, org_xrpl_rpc_v1_get_account_info_pb.GetAccountInfoResponse>;
    getFee: grpc.handleUnaryCall<org_xrpl_rpc_v1_get_fee_pb.GetFeeRequest, org_xrpl_rpc_v1_get_fee_pb.GetFeeResponse>;
    submitTransaction: grpc.handleUnaryCall<org_xrpl_rpc_v1_submit_pb.SubmitTransactionRequest, org_xrpl_rpc_v1_submit_pb.SubmitTransactionResponse>;
    getTransaction: grpc.handleUnaryCall<org_xrpl_rpc_v1_get_transaction_pb.GetTransactionRequest, org_xrpl_rpc_v1_get_transaction_pb.GetTransactionResponse>;
    getAccountTransactionHistory: grpc.handleUnaryCall<org_xrpl_rpc_v1_get_account_transaction_history_pb.GetAccountTransactionHistoryRequest, org_xrpl_rpc_v1_get_account_transaction_history_pb.GetAccountTransactionHistoryResponse>;
}

export interface IXRPLedgerAPIServiceClient {
    getAccountInfo(request: org_xrpl_rpc_v1_get_account_info_pb.GetAccountInfoRequest, callback: (error: grpc.ServiceError | null, response: org_xrpl_rpc_v1_get_account_info_pb.GetAccountInfoResponse) => void): grpc.ClientUnaryCall;
    getAccountInfo(request: org_xrpl_rpc_v1_get_account_info_pb.GetAccountInfoRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: org_xrpl_rpc_v1_get_account_info_pb.GetAccountInfoResponse) => void): grpc.ClientUnaryCall;
    getAccountInfo(request: org_xrpl_rpc_v1_get_account_info_pb.GetAccountInfoRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: org_xrpl_rpc_v1_get_account_info_pb.GetAccountInfoResponse) => void): grpc.ClientUnaryCall;
    getFee(request: org_xrpl_rpc_v1_get_fee_pb.GetFeeRequest, callback: (error: grpc.ServiceError | null, response: org_xrpl_rpc_v1_get_fee_pb.GetFeeResponse) => void): grpc.ClientUnaryCall;
    getFee(request: org_xrpl_rpc_v1_get_fee_pb.GetFeeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: org_xrpl_rpc_v1_get_fee_pb.GetFeeResponse) => void): grpc.ClientUnaryCall;
    getFee(request: org_xrpl_rpc_v1_get_fee_pb.GetFeeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: org_xrpl_rpc_v1_get_fee_pb.GetFeeResponse) => void): grpc.ClientUnaryCall;
    submitTransaction(request: org_xrpl_rpc_v1_submit_pb.SubmitTransactionRequest, callback: (error: grpc.ServiceError | null, response: org_xrpl_rpc_v1_submit_pb.SubmitTransactionResponse) => void): grpc.ClientUnaryCall;
    submitTransaction(request: org_xrpl_rpc_v1_submit_pb.SubmitTransactionRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: org_xrpl_rpc_v1_submit_pb.SubmitTransactionResponse) => void): grpc.ClientUnaryCall;
    submitTransaction(request: org_xrpl_rpc_v1_submit_pb.SubmitTransactionRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: org_xrpl_rpc_v1_submit_pb.SubmitTransactionResponse) => void): grpc.ClientUnaryCall;
    getTransaction(request: org_xrpl_rpc_v1_get_transaction_pb.GetTransactionRequest, callback: (error: grpc.ServiceError | null, response: org_xrpl_rpc_v1_get_transaction_pb.GetTransactionResponse) => void): grpc.ClientUnaryCall;
    getTransaction(request: org_xrpl_rpc_v1_get_transaction_pb.GetTransactionRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: org_xrpl_rpc_v1_get_transaction_pb.GetTransactionResponse) => void): grpc.ClientUnaryCall;
    getTransaction(request: org_xrpl_rpc_v1_get_transaction_pb.GetTransactionRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: org_xrpl_rpc_v1_get_transaction_pb.GetTransactionResponse) => void): grpc.ClientUnaryCall;
    getAccountTransactionHistory(request: org_xrpl_rpc_v1_get_account_transaction_history_pb.GetAccountTransactionHistoryRequest, callback: (error: grpc.ServiceError | null, response: org_xrpl_rpc_v1_get_account_transaction_history_pb.GetAccountTransactionHistoryResponse) => void): grpc.ClientUnaryCall;
    getAccountTransactionHistory(request: org_xrpl_rpc_v1_get_account_transaction_history_pb.GetAccountTransactionHistoryRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: org_xrpl_rpc_v1_get_account_transaction_history_pb.GetAccountTransactionHistoryResponse) => void): grpc.ClientUnaryCall;
    getAccountTransactionHistory(request: org_xrpl_rpc_v1_get_account_transaction_history_pb.GetAccountTransactionHistoryRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: org_xrpl_rpc_v1_get_account_transaction_history_pb.GetAccountTransactionHistoryResponse) => void): grpc.ClientUnaryCall;
}

export class XRPLedgerAPIServiceClient extends grpc.Client implements IXRPLedgerAPIServiceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public getAccountInfo(request: org_xrpl_rpc_v1_get_account_info_pb.GetAccountInfoRequest, callback: (error: grpc.ServiceError | null, response: org_xrpl_rpc_v1_get_account_info_pb.GetAccountInfoResponse) => void): grpc.ClientUnaryCall;
    public getAccountInfo(request: org_xrpl_rpc_v1_get_account_info_pb.GetAccountInfoRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: org_xrpl_rpc_v1_get_account_info_pb.GetAccountInfoResponse) => void): grpc.ClientUnaryCall;
    public getAccountInfo(request: org_xrpl_rpc_v1_get_account_info_pb.GetAccountInfoRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: org_xrpl_rpc_v1_get_account_info_pb.GetAccountInfoResponse) => void): grpc.ClientUnaryCall;
    public getFee(request: org_xrpl_rpc_v1_get_fee_pb.GetFeeRequest, callback: (error: grpc.ServiceError | null, response: org_xrpl_rpc_v1_get_fee_pb.GetFeeResponse) => void): grpc.ClientUnaryCall;
    public getFee(request: org_xrpl_rpc_v1_get_fee_pb.GetFeeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: org_xrpl_rpc_v1_get_fee_pb.GetFeeResponse) => void): grpc.ClientUnaryCall;
    public getFee(request: org_xrpl_rpc_v1_get_fee_pb.GetFeeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: org_xrpl_rpc_v1_get_fee_pb.GetFeeResponse) => void): grpc.ClientUnaryCall;
    public submitTransaction(request: org_xrpl_rpc_v1_submit_pb.SubmitTransactionRequest, callback: (error: grpc.ServiceError | null, response: org_xrpl_rpc_v1_submit_pb.SubmitTransactionResponse) => void): grpc.ClientUnaryCall;
    public submitTransaction(request: org_xrpl_rpc_v1_submit_pb.SubmitTransactionRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: org_xrpl_rpc_v1_submit_pb.SubmitTransactionResponse) => void): grpc.ClientUnaryCall;
    public submitTransaction(request: org_xrpl_rpc_v1_submit_pb.SubmitTransactionRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: org_xrpl_rpc_v1_submit_pb.SubmitTransactionResponse) => void): grpc.ClientUnaryCall;
    public getTransaction(request: org_xrpl_rpc_v1_get_transaction_pb.GetTransactionRequest, callback: (error: grpc.ServiceError | null, response: org_xrpl_rpc_v1_get_transaction_pb.GetTransactionResponse) => void): grpc.ClientUnaryCall;
    public getTransaction(request: org_xrpl_rpc_v1_get_transaction_pb.GetTransactionRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: org_xrpl_rpc_v1_get_transaction_pb.GetTransactionResponse) => void): grpc.ClientUnaryCall;
    public getTransaction(request: org_xrpl_rpc_v1_get_transaction_pb.GetTransactionRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: org_xrpl_rpc_v1_get_transaction_pb.GetTransactionResponse) => void): grpc.ClientUnaryCall;
    public getAccountTransactionHistory(request: org_xrpl_rpc_v1_get_account_transaction_history_pb.GetAccountTransactionHistoryRequest, callback: (error: grpc.ServiceError | null, response: org_xrpl_rpc_v1_get_account_transaction_history_pb.GetAccountTransactionHistoryResponse) => void): grpc.ClientUnaryCall;
    public getAccountTransactionHistory(request: org_xrpl_rpc_v1_get_account_transaction_history_pb.GetAccountTransactionHistoryRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: org_xrpl_rpc_v1_get_account_transaction_history_pb.GetAccountTransactionHistoryResponse) => void): grpc.ClientUnaryCall;
    public getAccountTransactionHistory(request: org_xrpl_rpc_v1_get_account_transaction_history_pb.GetAccountTransactionHistoryRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: org_xrpl_rpc_v1_get_account_transaction_history_pb.GetAccountTransactionHistoryResponse) => void): grpc.ClientUnaryCall;
}
