// package: org.interledger.stream.proto
// file: ilp_over_http_service.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "grpc";
import * as ilp_over_http_service_pb from "./ilp_over_http_service_pb";
import * as send_payment_request_pb from "./send_payment_request_pb";
import * as send_payment_response_pb from "./send_payment_response_pb";

interface IIlpOverHttpServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    sendMoney: IIlpOverHttpServiceService_ISendMoney;
}

interface IIlpOverHttpServiceService_ISendMoney extends grpc.MethodDefinition<send_payment_request_pb.SendPaymentRequest, send_payment_response_pb.SendPaymentResponse> {
    path: string; // "/org.interledger.stream.proto.IlpOverHttpService/SendMoney"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<send_payment_request_pb.SendPaymentRequest>;
    requestDeserialize: grpc.deserialize<send_payment_request_pb.SendPaymentRequest>;
    responseSerialize: grpc.serialize<send_payment_response_pb.SendPaymentResponse>;
    responseDeserialize: grpc.deserialize<send_payment_response_pb.SendPaymentResponse>;
}

export const IlpOverHttpServiceService: IIlpOverHttpServiceService;

export interface IIlpOverHttpServiceServer {
    sendMoney: grpc.handleUnaryCall<send_payment_request_pb.SendPaymentRequest, send_payment_response_pb.SendPaymentResponse>;
}

export interface IIlpOverHttpServiceClient {
    sendMoney(request: send_payment_request_pb.SendPaymentRequest, callback: (error: grpc.ServiceError | null, response: send_payment_response_pb.SendPaymentResponse) => void): grpc.ClientUnaryCall;
    sendMoney(request: send_payment_request_pb.SendPaymentRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: send_payment_response_pb.SendPaymentResponse) => void): grpc.ClientUnaryCall;
    sendMoney(request: send_payment_request_pb.SendPaymentRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: send_payment_response_pb.SendPaymentResponse) => void): grpc.ClientUnaryCall;
}

export class IlpOverHttpServiceClient extends grpc.Client implements IIlpOverHttpServiceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public sendMoney(request: send_payment_request_pb.SendPaymentRequest, callback: (error: grpc.ServiceError | null, response: send_payment_response_pb.SendPaymentResponse) => void): grpc.ClientUnaryCall;
    public sendMoney(request: send_payment_request_pb.SendPaymentRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: send_payment_response_pb.SendPaymentResponse) => void): grpc.ClientUnaryCall;
    public sendMoney(request: send_payment_request_pb.SendPaymentRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: send_payment_response_pb.SendPaymentResponse) => void): grpc.ClientUnaryCall;
}
