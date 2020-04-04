// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var account_info_pb = require('./account_info_pb.js');
var fee_pb = require('./fee_pb.js');
var get_account_info_request_pb = require('./get_account_info_request_pb.js');
var get_fee_request_pb = require('./get_fee_request_pb.js');
var get_latest_validated_ledger_sequence_request_pb = require('./get_latest_validated_ledger_sequence_request_pb.js');
var get_transaction_status_request_pb = require('./get_transaction_status_request_pb.js');
var ledger_sequence_pb = require('./ledger_sequence_pb.js');
var submit_signed_transaction_request_pb = require('./submit_signed_transaction_request_pb.js');
var submit_signed_transaction_response_pb = require('./submit_signed_transaction_response_pb.js');
var transaction_status_pb = require('./transaction_status_pb.js');

function serialize_io_xpring_AccountInfo(arg) {
  if (!(arg instanceof account_info_pb.AccountInfo)) {
    throw new Error('Expected argument of type io.xpring.AccountInfo');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_io_xpring_AccountInfo(buffer_arg) {
  return account_info_pb.AccountInfo.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_io_xpring_Fee(arg) {
  if (!(arg instanceof fee_pb.Fee)) {
    throw new Error('Expected argument of type io.xpring.Fee');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_io_xpring_Fee(buffer_arg) {
  return fee_pb.Fee.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_io_xpring_GetAccountInfoRequest(arg) {
  if (!(arg instanceof get_account_info_request_pb.GetAccountInfoRequest)) {
    throw new Error('Expected argument of type io.xpring.GetAccountInfoRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_io_xpring_GetAccountInfoRequest(buffer_arg) {
  return get_account_info_request_pb.GetAccountInfoRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_io_xpring_GetFeeRequest(arg) {
  if (!(arg instanceof get_fee_request_pb.GetFeeRequest)) {
    throw new Error('Expected argument of type io.xpring.GetFeeRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_io_xpring_GetFeeRequest(buffer_arg) {
  return get_fee_request_pb.GetFeeRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_io_xpring_GetLatestValidatedLedgerSequenceRequest(arg) {
  if (!(arg instanceof get_latest_validated_ledger_sequence_request_pb.GetLatestValidatedLedgerSequenceRequest)) {
    throw new Error('Expected argument of type io.xpring.GetLatestValidatedLedgerSequenceRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_io_xpring_GetLatestValidatedLedgerSequenceRequest(buffer_arg) {
  return get_latest_validated_ledger_sequence_request_pb.GetLatestValidatedLedgerSequenceRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_io_xpring_GetTransactionStatusRequest(arg) {
  if (!(arg instanceof get_transaction_status_request_pb.GetTransactionStatusRequest)) {
    throw new Error('Expected argument of type io.xpring.GetTransactionStatusRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_io_xpring_GetTransactionStatusRequest(buffer_arg) {
  return get_transaction_status_request_pb.GetTransactionStatusRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_io_xpring_LedgerSequence(arg) {
  if (!(arg instanceof ledger_sequence_pb.LedgerSequence)) {
    throw new Error('Expected argument of type io.xpring.LedgerSequence');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_io_xpring_LedgerSequence(buffer_arg) {
  return ledger_sequence_pb.LedgerSequence.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_io_xpring_SubmitSignedTransactionRequest(arg) {
  if (!(arg instanceof submit_signed_transaction_request_pb.SubmitSignedTransactionRequest)) {
    throw new Error('Expected argument of type io.xpring.SubmitSignedTransactionRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_io_xpring_SubmitSignedTransactionRequest(buffer_arg) {
  return submit_signed_transaction_request_pb.SubmitSignedTransactionRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_io_xpring_SubmitSignedTransactionResponse(arg) {
  if (!(arg instanceof submit_signed_transaction_response_pb.SubmitSignedTransactionResponse)) {
    throw new Error('Expected argument of type io.xpring.SubmitSignedTransactionResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_io_xpring_SubmitSignedTransactionResponse(buffer_arg) {
  return submit_signed_transaction_response_pb.SubmitSignedTransactionResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_io_xpring_TransactionStatus(arg) {
  if (!(arg instanceof transaction_status_pb.TransactionStatus)) {
    throw new Error('Expected argument of type io.xpring.TransactionStatus');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_io_xpring_TransactionStatus(buffer_arg) {
  return transaction_status_pb.TransactionStatus.deserializeBinary(new Uint8Array(buffer_arg));
}


// RPCs available to interact with the XRP Ledger.
var XRPLedgerAPIService = exports.XRPLedgerAPIService = {
  // Get account info for an account on the XRP Ledger.
getAccountInfo: {
    path: '/io.xpring.XRPLedgerAPI/GetAccountInfo',
    requestStream: false,
    responseStream: false,
    requestType: get_account_info_request_pb.GetAccountInfoRequest,
    responseType: account_info_pb.AccountInfo,
    requestSerialize: serialize_io_xpring_GetAccountInfoRequest,
    requestDeserialize: deserialize_io_xpring_GetAccountInfoRequest,
    responseSerialize: serialize_io_xpring_AccountInfo,
    responseDeserialize: deserialize_io_xpring_AccountInfo,
  },
  // Get the fee for a transaction on the XRP Ledger.
getFee: {
    path: '/io.xpring.XRPLedgerAPI/GetFee',
    requestStream: false,
    responseStream: false,
    requestType: get_fee_request_pb.GetFeeRequest,
    responseType: fee_pb.Fee,
    requestSerialize: serialize_io_xpring_GetFeeRequest,
    requestDeserialize: deserialize_io_xpring_GetFeeRequest,
    responseSerialize: serialize_io_xpring_Fee,
    responseDeserialize: deserialize_io_xpring_Fee,
  },
  // Submit a signed transaction to the XRP Ledger.
submitSignedTransaction: {
    path: '/io.xpring.XRPLedgerAPI/SubmitSignedTransaction',
    requestStream: false,
    responseStream: false,
    requestType: submit_signed_transaction_request_pb.SubmitSignedTransactionRequest,
    responseType: submit_signed_transaction_response_pb.SubmitSignedTransactionResponse,
    requestSerialize: serialize_io_xpring_SubmitSignedTransactionRequest,
    requestDeserialize: deserialize_io_xpring_SubmitSignedTransactionRequest,
    responseSerialize: serialize_io_xpring_SubmitSignedTransactionResponse,
    responseDeserialize: deserialize_io_xpring_SubmitSignedTransactionResponse,
  },
  // Get the status of a transaction on the XRP Ledger.
getTransactionStatus: {
    path: '/io.xpring.XRPLedgerAPI/GetTransactionStatus',
    requestStream: false,
    responseStream: false,
    requestType: get_transaction_status_request_pb.GetTransactionStatusRequest,
    responseType: transaction_status_pb.TransactionStatus,
    requestSerialize: serialize_io_xpring_GetTransactionStatusRequest,
    requestDeserialize: deserialize_io_xpring_GetTransactionStatusRequest,
    responseSerialize: serialize_io_xpring_TransactionStatus,
    responseDeserialize: deserialize_io_xpring_TransactionStatus,
  },
  // Get the latest validated ledger sequence.
getLatestValidatedLedgerSequence: {
    path: '/io.xpring.XRPLedgerAPI/GetLatestValidatedLedgerSequence',
    requestStream: false,
    responseStream: false,
    requestType: get_latest_validated_ledger_sequence_request_pb.GetLatestValidatedLedgerSequenceRequest,
    responseType: ledger_sequence_pb.LedgerSequence,
    requestSerialize: serialize_io_xpring_GetLatestValidatedLedgerSequenceRequest,
    requestDeserialize: deserialize_io_xpring_GetLatestValidatedLedgerSequenceRequest,
    responseSerialize: serialize_io_xpring_LedgerSequence,
    responseDeserialize: deserialize_io_xpring_LedgerSequence,
  },
};

exports.XRPLedgerAPIClient = grpc.makeGenericClientConstructor(XRPLedgerAPIService);
