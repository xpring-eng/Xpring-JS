// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var get_balance_response_pb = require('./get_balance_response_pb.js');
var get_balance_request_pb = require('./get_balance_request_pb.js');

function serialize_org_interledger_stream_proto_GetBalanceRequest(arg) {
  if (!(arg instanceof get_balance_request_pb.GetBalanceRequest)) {
    throw new Error('Expected argument of type org.interledger.stream.proto.GetBalanceRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_org_interledger_stream_proto_GetBalanceRequest(buffer_arg) {
  return get_balance_request_pb.GetBalanceRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_org_interledger_stream_proto_GetBalanceResponse(arg) {
  if (!(arg instanceof get_balance_response_pb.GetBalanceResponse)) {
    throw new Error('Expected argument of type org.interledger.stream.proto.GetBalanceResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_org_interledger_stream_proto_GetBalanceResponse(buffer_arg) {
  return get_balance_response_pb.GetBalanceResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


// RPCs available to interact with Hermes.
var BalanceServiceService = exports.BalanceServiceService = {
  // Get the balance of a certain account on a connector
getBalance: {
    path: '/org.interledger.stream.proto.BalanceService/GetBalance',
    requestStream: false,
    responseStream: false,
    requestType: get_balance_request_pb.GetBalanceRequest,
    responseType: get_balance_response_pb.GetBalanceResponse,
    requestSerialize: serialize_org_interledger_stream_proto_GetBalanceRequest,
    requestDeserialize: deserialize_org_interledger_stream_proto_GetBalanceRequest,
    responseSerialize: serialize_org_interledger_stream_proto_GetBalanceResponse,
    responseDeserialize: deserialize_org_interledger_stream_proto_GetBalanceResponse,
  },
};

exports.BalanceServiceClient = grpc.makeGenericClientConstructor(BalanceServiceService);
