// package: org.interledger.stream.proto
// file: balance_service.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "grpc";
import * as balance_service_pb from "./balance_service_pb";
import * as get_balance_response_pb from "./get_balance_response_pb";
import * as get_balance_request_pb from "./get_balance_request_pb";

interface IBalanceServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    getBalance: IBalanceServiceService_IGetBalance;
}

interface IBalanceServiceService_IGetBalance extends grpc.MethodDefinition<get_balance_request_pb.GetBalanceRequest, get_balance_response_pb.GetBalanceResponse> {
    path: string; // "/org.interledger.stream.proto.BalanceService/GetBalance"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<get_balance_request_pb.GetBalanceRequest>;
    requestDeserialize: grpc.deserialize<get_balance_request_pb.GetBalanceRequest>;
    responseSerialize: grpc.serialize<get_balance_response_pb.GetBalanceResponse>;
    responseDeserialize: grpc.deserialize<get_balance_response_pb.GetBalanceResponse>;
}

export const BalanceServiceService: IBalanceServiceService;

export interface IBalanceServiceServer {
    getBalance: grpc.handleUnaryCall<get_balance_request_pb.GetBalanceRequest, get_balance_response_pb.GetBalanceResponse>;
}

export interface IBalanceServiceClient {
    getBalance(request: get_balance_request_pb.GetBalanceRequest, callback: (error: grpc.ServiceError | null, response: get_balance_response_pb.GetBalanceResponse) => void): grpc.ClientUnaryCall;
    getBalance(request: get_balance_request_pb.GetBalanceRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: get_balance_response_pb.GetBalanceResponse) => void): grpc.ClientUnaryCall;
    getBalance(request: get_balance_request_pb.GetBalanceRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: get_balance_response_pb.GetBalanceResponse) => void): grpc.ClientUnaryCall;
}

export class BalanceServiceClient extends grpc.Client implements IBalanceServiceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public getBalance(request: get_balance_request_pb.GetBalanceRequest, callback: (error: grpc.ServiceError | null, response: get_balance_response_pb.GetBalanceResponse) => void): grpc.ClientUnaryCall;
    public getBalance(request: get_balance_request_pb.GetBalanceRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: get_balance_response_pb.GetBalanceResponse) => void): grpc.ClientUnaryCall;
    public getBalance(request: get_balance_request_pb.GetBalanceRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: get_balance_response_pb.GetBalanceResponse) => void): grpc.ClientUnaryCall;
}
