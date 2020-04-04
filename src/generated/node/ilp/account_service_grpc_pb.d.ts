// package: org.interledger.stream.proto
// file: account_service.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "grpc";
import * as account_service_pb from "./account_service_pb";
import * as get_account_response_pb from "./get_account_response_pb";
import * as get_account_request_pb from "./get_account_request_pb";
import * as create_account_request_pb from "./create_account_request_pb";
import * as create_account_response_pb from "./create_account_response_pb";

interface IAccountServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    getAccount: IAccountServiceService_IGetAccount;
    createAccount: IAccountServiceService_ICreateAccount;
}

interface IAccountServiceService_IGetAccount extends grpc.MethodDefinition<get_account_request_pb.GetAccountRequest, get_account_response_pb.GetAccountResponse> {
    path: string; // "/org.interledger.stream.proto.AccountService/GetAccount"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<get_account_request_pb.GetAccountRequest>;
    requestDeserialize: grpc.deserialize<get_account_request_pb.GetAccountRequest>;
    responseSerialize: grpc.serialize<get_account_response_pb.GetAccountResponse>;
    responseDeserialize: grpc.deserialize<get_account_response_pb.GetAccountResponse>;
}
interface IAccountServiceService_ICreateAccount extends grpc.MethodDefinition<create_account_request_pb.CreateAccountRequest, create_account_response_pb.CreateAccountResponse> {
    path: string; // "/org.interledger.stream.proto.AccountService/CreateAccount"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<create_account_request_pb.CreateAccountRequest>;
    requestDeserialize: grpc.deserialize<create_account_request_pb.CreateAccountRequest>;
    responseSerialize: grpc.serialize<create_account_response_pb.CreateAccountResponse>;
    responseDeserialize: grpc.deserialize<create_account_response_pb.CreateAccountResponse>;
}

export const AccountServiceService: IAccountServiceService;

export interface IAccountServiceServer {
    getAccount: grpc.handleUnaryCall<get_account_request_pb.GetAccountRequest, get_account_response_pb.GetAccountResponse>;
    createAccount: grpc.handleUnaryCall<create_account_request_pb.CreateAccountRequest, create_account_response_pb.CreateAccountResponse>;
}

export interface IAccountServiceClient {
    getAccount(request: get_account_request_pb.GetAccountRequest, callback: (error: grpc.ServiceError | null, response: get_account_response_pb.GetAccountResponse) => void): grpc.ClientUnaryCall;
    getAccount(request: get_account_request_pb.GetAccountRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: get_account_response_pb.GetAccountResponse) => void): grpc.ClientUnaryCall;
    getAccount(request: get_account_request_pb.GetAccountRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: get_account_response_pb.GetAccountResponse) => void): grpc.ClientUnaryCall;
    createAccount(request: create_account_request_pb.CreateAccountRequest, callback: (error: grpc.ServiceError | null, response: create_account_response_pb.CreateAccountResponse) => void): grpc.ClientUnaryCall;
    createAccount(request: create_account_request_pb.CreateAccountRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: create_account_response_pb.CreateAccountResponse) => void): grpc.ClientUnaryCall;
    createAccount(request: create_account_request_pb.CreateAccountRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: create_account_response_pb.CreateAccountResponse) => void): grpc.ClientUnaryCall;
}

export class AccountServiceClient extends grpc.Client implements IAccountServiceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public getAccount(request: get_account_request_pb.GetAccountRequest, callback: (error: grpc.ServiceError | null, response: get_account_response_pb.GetAccountResponse) => void): grpc.ClientUnaryCall;
    public getAccount(request: get_account_request_pb.GetAccountRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: get_account_response_pb.GetAccountResponse) => void): grpc.ClientUnaryCall;
    public getAccount(request: get_account_request_pb.GetAccountRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: get_account_response_pb.GetAccountResponse) => void): grpc.ClientUnaryCall;
    public createAccount(request: create_account_request_pb.CreateAccountRequest, callback: (error: grpc.ServiceError | null, response: create_account_response_pb.CreateAccountResponse) => void): grpc.ClientUnaryCall;
    public createAccount(request: create_account_request_pb.CreateAccountRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: create_account_response_pb.CreateAccountResponse) => void): grpc.ClientUnaryCall;
    public createAccount(request: create_account_request_pb.CreateAccountRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: create_account_response_pb.CreateAccountResponse) => void): grpc.ClientUnaryCall;
}
