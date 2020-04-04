// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var get_account_response_pb = require('./get_account_response_pb.js');
var get_account_request_pb = require('./get_account_request_pb.js');
var create_account_request_pb = require('./create_account_request_pb.js');
var create_account_response_pb = require('./create_account_response_pb.js');

function serialize_org_interledger_stream_proto_CreateAccountRequest(arg) {
  if (!(arg instanceof create_account_request_pb.CreateAccountRequest)) {
    throw new Error('Expected argument of type org.interledger.stream.proto.CreateAccountRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_org_interledger_stream_proto_CreateAccountRequest(buffer_arg) {
  return create_account_request_pb.CreateAccountRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_org_interledger_stream_proto_CreateAccountResponse(arg) {
  if (!(arg instanceof create_account_response_pb.CreateAccountResponse)) {
    throw new Error('Expected argument of type org.interledger.stream.proto.CreateAccountResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_org_interledger_stream_proto_CreateAccountResponse(buffer_arg) {
  return create_account_response_pb.CreateAccountResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_org_interledger_stream_proto_GetAccountRequest(arg) {
  if (!(arg instanceof get_account_request_pb.GetAccountRequest)) {
    throw new Error('Expected argument of type org.interledger.stream.proto.GetAccountRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_org_interledger_stream_proto_GetAccountRequest(buffer_arg) {
  return get_account_request_pb.GetAccountRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_org_interledger_stream_proto_GetAccountResponse(arg) {
  if (!(arg instanceof get_account_response_pb.GetAccountResponse)) {
    throw new Error('Expected argument of type org.interledger.stream.proto.GetAccountResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_org_interledger_stream_proto_GetAccountResponse(buffer_arg) {
  return get_account_response_pb.GetAccountResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


// RPCs available to interact with Hermes.
var AccountServiceService = exports.AccountServiceService = {
  // Get account info for a given AccountId on the connector
getAccount: {
    path: '/org.interledger.stream.proto.AccountService/GetAccount',
    requestStream: false,
    responseStream: false,
    requestType: get_account_request_pb.GetAccountRequest,
    responseType: get_account_response_pb.GetAccountResponse,
    requestSerialize: serialize_org_interledger_stream_proto_GetAccountRequest,
    requestDeserialize: deserialize_org_interledger_stream_proto_GetAccountRequest,
    responseSerialize: serialize_org_interledger_stream_proto_GetAccountResponse,
    responseDeserialize: deserialize_org_interledger_stream_proto_GetAccountResponse,
  },
  // Create a new account on a connector. HTTP response code will tell if succeeded
createAccount: {
    path: '/org.interledger.stream.proto.AccountService/CreateAccount',
    requestStream: false,
    responseStream: false,
    requestType: create_account_request_pb.CreateAccountRequest,
    responseType: create_account_response_pb.CreateAccountResponse,
    requestSerialize: serialize_org_interledger_stream_proto_CreateAccountRequest,
    requestDeserialize: deserialize_org_interledger_stream_proto_CreateAccountRequest,
    responseSerialize: serialize_org_interledger_stream_proto_CreateAccountResponse,
    responseDeserialize: deserialize_org_interledger_stream_proto_CreateAccountResponse,
  },
};

exports.AccountServiceClient = grpc.makeGenericClientConstructor(AccountServiceService);
