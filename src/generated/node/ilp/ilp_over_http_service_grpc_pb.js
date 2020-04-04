// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var send_payment_request_pb = require('./send_payment_request_pb.js');
var send_payment_response_pb = require('./send_payment_response_pb.js');

function serialize_org_interledger_stream_proto_SendPaymentRequest(arg) {
  if (!(arg instanceof send_payment_request_pb.SendPaymentRequest)) {
    throw new Error('Expected argument of type org.interledger.stream.proto.SendPaymentRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_org_interledger_stream_proto_SendPaymentRequest(buffer_arg) {
  return send_payment_request_pb.SendPaymentRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_org_interledger_stream_proto_SendPaymentResponse(arg) {
  if (!(arg instanceof send_payment_response_pb.SendPaymentResponse)) {
    throw new Error('Expected argument of type org.interledger.stream.proto.SendPaymentResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_org_interledger_stream_proto_SendPaymentResponse(buffer_arg) {
  return send_payment_response_pb.SendPaymentResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


// RPCs available to interact with Hermes.
var IlpOverHttpServiceService = exports.IlpOverHttpServiceService = {
  // Send a payment through Hermes to a given payment pointer
sendMoney: {
    path: '/org.interledger.stream.proto.IlpOverHttpService/SendMoney',
    requestStream: false,
    responseStream: false,
    requestType: send_payment_request_pb.SendPaymentRequest,
    responseType: send_payment_response_pb.SendPaymentResponse,
    requestSerialize: serialize_org_interledger_stream_proto_SendPaymentRequest,
    requestDeserialize: deserialize_org_interledger_stream_proto_SendPaymentRequest,
    responseSerialize: serialize_org_interledger_stream_proto_SendPaymentResponse,
    responseDeserialize: deserialize_org_interledger_stream_proto_SendPaymentResponse,
  },
};

exports.IlpOverHttpServiceClient = grpc.makeGenericClientConstructor(IlpOverHttpServiceService);
