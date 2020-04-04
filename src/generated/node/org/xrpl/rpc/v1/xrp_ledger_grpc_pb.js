// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var org_xrpl_rpc_v1_get_account_info_pb = require('../../../../org/xrpl/rpc/v1/get_account_info_pb.js');
var org_xrpl_rpc_v1_get_fee_pb = require('../../../../org/xrpl/rpc/v1/get_fee_pb.js');
var org_xrpl_rpc_v1_submit_pb = require('../../../../org/xrpl/rpc/v1/submit_pb.js');
var org_xrpl_rpc_v1_get_transaction_pb = require('../../../../org/xrpl/rpc/v1/get_transaction_pb.js');
var org_xrpl_rpc_v1_get_account_transaction_history_pb = require('../../../../org/xrpl/rpc/v1/get_account_transaction_history_pb.js');

function serialize_org_xrpl_rpc_v1_GetAccountInfoRequest(arg) {
  if (!(arg instanceof org_xrpl_rpc_v1_get_account_info_pb.GetAccountInfoRequest)) {
    throw new Error('Expected argument of type org.xrpl.rpc.v1.GetAccountInfoRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_org_xrpl_rpc_v1_GetAccountInfoRequest(buffer_arg) {
  return org_xrpl_rpc_v1_get_account_info_pb.GetAccountInfoRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_org_xrpl_rpc_v1_GetAccountInfoResponse(arg) {
  if (!(arg instanceof org_xrpl_rpc_v1_get_account_info_pb.GetAccountInfoResponse)) {
    throw new Error('Expected argument of type org.xrpl.rpc.v1.GetAccountInfoResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_org_xrpl_rpc_v1_GetAccountInfoResponse(buffer_arg) {
  return org_xrpl_rpc_v1_get_account_info_pb.GetAccountInfoResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_org_xrpl_rpc_v1_GetAccountTransactionHistoryRequest(arg) {
  if (!(arg instanceof org_xrpl_rpc_v1_get_account_transaction_history_pb.GetAccountTransactionHistoryRequest)) {
    throw new Error('Expected argument of type org.xrpl.rpc.v1.GetAccountTransactionHistoryRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_org_xrpl_rpc_v1_GetAccountTransactionHistoryRequest(buffer_arg) {
  return org_xrpl_rpc_v1_get_account_transaction_history_pb.GetAccountTransactionHistoryRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_org_xrpl_rpc_v1_GetAccountTransactionHistoryResponse(arg) {
  if (!(arg instanceof org_xrpl_rpc_v1_get_account_transaction_history_pb.GetAccountTransactionHistoryResponse)) {
    throw new Error('Expected argument of type org.xrpl.rpc.v1.GetAccountTransactionHistoryResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_org_xrpl_rpc_v1_GetAccountTransactionHistoryResponse(buffer_arg) {
  return org_xrpl_rpc_v1_get_account_transaction_history_pb.GetAccountTransactionHistoryResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_org_xrpl_rpc_v1_GetFeeRequest(arg) {
  if (!(arg instanceof org_xrpl_rpc_v1_get_fee_pb.GetFeeRequest)) {
    throw new Error('Expected argument of type org.xrpl.rpc.v1.GetFeeRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_org_xrpl_rpc_v1_GetFeeRequest(buffer_arg) {
  return org_xrpl_rpc_v1_get_fee_pb.GetFeeRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_org_xrpl_rpc_v1_GetFeeResponse(arg) {
  if (!(arg instanceof org_xrpl_rpc_v1_get_fee_pb.GetFeeResponse)) {
    throw new Error('Expected argument of type org.xrpl.rpc.v1.GetFeeResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_org_xrpl_rpc_v1_GetFeeResponse(buffer_arg) {
  return org_xrpl_rpc_v1_get_fee_pb.GetFeeResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_org_xrpl_rpc_v1_GetTransactionRequest(arg) {
  if (!(arg instanceof org_xrpl_rpc_v1_get_transaction_pb.GetTransactionRequest)) {
    throw new Error('Expected argument of type org.xrpl.rpc.v1.GetTransactionRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_org_xrpl_rpc_v1_GetTransactionRequest(buffer_arg) {
  return org_xrpl_rpc_v1_get_transaction_pb.GetTransactionRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_org_xrpl_rpc_v1_GetTransactionResponse(arg) {
  if (!(arg instanceof org_xrpl_rpc_v1_get_transaction_pb.GetTransactionResponse)) {
    throw new Error('Expected argument of type org.xrpl.rpc.v1.GetTransactionResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_org_xrpl_rpc_v1_GetTransactionResponse(buffer_arg) {
  return org_xrpl_rpc_v1_get_transaction_pb.GetTransactionResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_org_xrpl_rpc_v1_SubmitTransactionRequest(arg) {
  if (!(arg instanceof org_xrpl_rpc_v1_submit_pb.SubmitTransactionRequest)) {
    throw new Error('Expected argument of type org.xrpl.rpc.v1.SubmitTransactionRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_org_xrpl_rpc_v1_SubmitTransactionRequest(buffer_arg) {
  return org_xrpl_rpc_v1_submit_pb.SubmitTransactionRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_org_xrpl_rpc_v1_SubmitTransactionResponse(arg) {
  if (!(arg instanceof org_xrpl_rpc_v1_submit_pb.SubmitTransactionResponse)) {
    throw new Error('Expected argument of type org.xrpl.rpc.v1.SubmitTransactionResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_org_xrpl_rpc_v1_SubmitTransactionResponse(buffer_arg) {
  return org_xrpl_rpc_v1_submit_pb.SubmitTransactionResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


// RPCs available to interact with the XRP Ledger.
var XRPLedgerAPIServiceService = exports.XRPLedgerAPIServiceService = {
  // Get account info for an account on the XRP Ledger.
getAccountInfo: {
    path: '/org.xrpl.rpc.v1.XRPLedgerAPIService/GetAccountInfo',
    requestStream: false,
    responseStream: false,
    requestType: org_xrpl_rpc_v1_get_account_info_pb.GetAccountInfoRequest,
    responseType: org_xrpl_rpc_v1_get_account_info_pb.GetAccountInfoResponse,
    requestSerialize: serialize_org_xrpl_rpc_v1_GetAccountInfoRequest,
    requestDeserialize: deserialize_org_xrpl_rpc_v1_GetAccountInfoRequest,
    responseSerialize: serialize_org_xrpl_rpc_v1_GetAccountInfoResponse,
    responseDeserialize: deserialize_org_xrpl_rpc_v1_GetAccountInfoResponse,
  },
  // Get the fee for a transaction on the XRP Ledger.
getFee: {
    path: '/org.xrpl.rpc.v1.XRPLedgerAPIService/GetFee',
    requestStream: false,
    responseStream: false,
    requestType: org_xrpl_rpc_v1_get_fee_pb.GetFeeRequest,
    responseType: org_xrpl_rpc_v1_get_fee_pb.GetFeeResponse,
    requestSerialize: serialize_org_xrpl_rpc_v1_GetFeeRequest,
    requestDeserialize: deserialize_org_xrpl_rpc_v1_GetFeeRequest,
    responseSerialize: serialize_org_xrpl_rpc_v1_GetFeeResponse,
    responseDeserialize: deserialize_org_xrpl_rpc_v1_GetFeeResponse,
  },
  // Submit a signed transaction to the XRP Ledger.
submitTransaction: {
    path: '/org.xrpl.rpc.v1.XRPLedgerAPIService/SubmitTransaction',
    requestStream: false,
    responseStream: false,
    requestType: org_xrpl_rpc_v1_submit_pb.SubmitTransactionRequest,
    responseType: org_xrpl_rpc_v1_submit_pb.SubmitTransactionResponse,
    requestSerialize: serialize_org_xrpl_rpc_v1_SubmitTransactionRequest,
    requestDeserialize: deserialize_org_xrpl_rpc_v1_SubmitTransactionRequest,
    responseSerialize: serialize_org_xrpl_rpc_v1_SubmitTransactionResponse,
    responseDeserialize: deserialize_org_xrpl_rpc_v1_SubmitTransactionResponse,
  },
  // Get the status of a transaction
getTransaction: {
    path: '/org.xrpl.rpc.v1.XRPLedgerAPIService/GetTransaction',
    requestStream: false,
    responseStream: false,
    requestType: org_xrpl_rpc_v1_get_transaction_pb.GetTransactionRequest,
    responseType: org_xrpl_rpc_v1_get_transaction_pb.GetTransactionResponse,
    requestSerialize: serialize_org_xrpl_rpc_v1_GetTransactionRequest,
    requestDeserialize: deserialize_org_xrpl_rpc_v1_GetTransactionRequest,
    responseSerialize: serialize_org_xrpl_rpc_v1_GetTransactionResponse,
    responseDeserialize: deserialize_org_xrpl_rpc_v1_GetTransactionResponse,
  },
  getAccountTransactionHistory: {
    path: '/org.xrpl.rpc.v1.XRPLedgerAPIService/GetAccountTransactionHistory',
    requestStream: false,
    responseStream: false,
    requestType: org_xrpl_rpc_v1_get_account_transaction_history_pb.GetAccountTransactionHistoryRequest,
    responseType: org_xrpl_rpc_v1_get_account_transaction_history_pb.GetAccountTransactionHistoryResponse,
    requestSerialize: serialize_org_xrpl_rpc_v1_GetAccountTransactionHistoryRequest,
    requestDeserialize: deserialize_org_xrpl_rpc_v1_GetAccountTransactionHistoryRequest,
    responseSerialize: serialize_org_xrpl_rpc_v1_GetAccountTransactionHistoryResponse,
    responseDeserialize: deserialize_org_xrpl_rpc_v1_GetAccountTransactionHistoryResponse,
  },
};

exports.XRPLedgerAPIServiceClient = grpc.makeGenericClientConstructor(XRPLedgerAPIServiceService);
