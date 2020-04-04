/**
 * @fileoverview gRPC-Web generated client stub for io.xpring
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!



const grpc = {};
grpc.web = require('grpc-web');


var account_info_pb = require('./account_info_pb.js')

var fee_pb = require('./fee_pb.js')

var get_account_info_request_pb = require('./get_account_info_request_pb.js')

var get_fee_request_pb = require('./get_fee_request_pb.js')

var get_latest_validated_ledger_sequence_request_pb = require('./get_latest_validated_ledger_sequence_request_pb.js')

var get_transaction_status_request_pb = require('./get_transaction_status_request_pb.js')

var ledger_sequence_pb = require('./ledger_sequence_pb.js')

var submit_signed_transaction_request_pb = require('./submit_signed_transaction_request_pb.js')

var submit_signed_transaction_response_pb = require('./submit_signed_transaction_response_pb.js')

var transaction_status_pb = require('./transaction_status_pb.js')
const proto = {};
proto.io = {};
proto.io.xpring = require('./xrp_ledger_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.io.xpring.XRPLedgerAPIClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.io.xpring.XRPLedgerAPIPromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.io.xpring.GetAccountInfoRequest,
 *   !proto.io.xpring.AccountInfo>}
 */
const methodDescriptor_XRPLedgerAPI_GetAccountInfo = new grpc.web.MethodDescriptor(
  '/io.xpring.XRPLedgerAPI/GetAccountInfo',
  grpc.web.MethodType.UNARY,
  get_account_info_request_pb.GetAccountInfoRequest,
  account_info_pb.AccountInfo,
  /**
   * @param {!proto.io.xpring.GetAccountInfoRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  account_info_pb.AccountInfo.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.io.xpring.GetAccountInfoRequest,
 *   !proto.io.xpring.AccountInfo>}
 */
const methodInfo_XRPLedgerAPI_GetAccountInfo = new grpc.web.AbstractClientBase.MethodInfo(
  account_info_pb.AccountInfo,
  /**
   * @param {!proto.io.xpring.GetAccountInfoRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  account_info_pb.AccountInfo.deserializeBinary
);


/**
 * @param {!proto.io.xpring.GetAccountInfoRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.io.xpring.AccountInfo)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.io.xpring.AccountInfo>|undefined}
 *     The XHR Node Readable Stream
 */
proto.io.xpring.XRPLedgerAPIClient.prototype.getAccountInfo =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/io.xpring.XRPLedgerAPI/GetAccountInfo',
      request,
      metadata || {},
      methodDescriptor_XRPLedgerAPI_GetAccountInfo,
      callback);
};


/**
 * @param {!proto.io.xpring.GetAccountInfoRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.io.xpring.AccountInfo>}
 *     A native promise that resolves to the response
 */
proto.io.xpring.XRPLedgerAPIPromiseClient.prototype.getAccountInfo =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/io.xpring.XRPLedgerAPI/GetAccountInfo',
      request,
      metadata || {},
      methodDescriptor_XRPLedgerAPI_GetAccountInfo);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.io.xpring.GetFeeRequest,
 *   !proto.io.xpring.Fee>}
 */
const methodDescriptor_XRPLedgerAPI_GetFee = new grpc.web.MethodDescriptor(
  '/io.xpring.XRPLedgerAPI/GetFee',
  grpc.web.MethodType.UNARY,
  get_fee_request_pb.GetFeeRequest,
  fee_pb.Fee,
  /**
   * @param {!proto.io.xpring.GetFeeRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  fee_pb.Fee.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.io.xpring.GetFeeRequest,
 *   !proto.io.xpring.Fee>}
 */
const methodInfo_XRPLedgerAPI_GetFee = new grpc.web.AbstractClientBase.MethodInfo(
  fee_pb.Fee,
  /**
   * @param {!proto.io.xpring.GetFeeRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  fee_pb.Fee.deserializeBinary
);


/**
 * @param {!proto.io.xpring.GetFeeRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.io.xpring.Fee)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.io.xpring.Fee>|undefined}
 *     The XHR Node Readable Stream
 */
proto.io.xpring.XRPLedgerAPIClient.prototype.getFee =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/io.xpring.XRPLedgerAPI/GetFee',
      request,
      metadata || {},
      methodDescriptor_XRPLedgerAPI_GetFee,
      callback);
};


/**
 * @param {!proto.io.xpring.GetFeeRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.io.xpring.Fee>}
 *     A native promise that resolves to the response
 */
proto.io.xpring.XRPLedgerAPIPromiseClient.prototype.getFee =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/io.xpring.XRPLedgerAPI/GetFee',
      request,
      metadata || {},
      methodDescriptor_XRPLedgerAPI_GetFee);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.io.xpring.SubmitSignedTransactionRequest,
 *   !proto.io.xpring.SubmitSignedTransactionResponse>}
 */
const methodDescriptor_XRPLedgerAPI_SubmitSignedTransaction = new grpc.web.MethodDescriptor(
  '/io.xpring.XRPLedgerAPI/SubmitSignedTransaction',
  grpc.web.MethodType.UNARY,
  submit_signed_transaction_request_pb.SubmitSignedTransactionRequest,
  submit_signed_transaction_response_pb.SubmitSignedTransactionResponse,
  /**
   * @param {!proto.io.xpring.SubmitSignedTransactionRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  submit_signed_transaction_response_pb.SubmitSignedTransactionResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.io.xpring.SubmitSignedTransactionRequest,
 *   !proto.io.xpring.SubmitSignedTransactionResponse>}
 */
const methodInfo_XRPLedgerAPI_SubmitSignedTransaction = new grpc.web.AbstractClientBase.MethodInfo(
  submit_signed_transaction_response_pb.SubmitSignedTransactionResponse,
  /**
   * @param {!proto.io.xpring.SubmitSignedTransactionRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  submit_signed_transaction_response_pb.SubmitSignedTransactionResponse.deserializeBinary
);


/**
 * @param {!proto.io.xpring.SubmitSignedTransactionRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.io.xpring.SubmitSignedTransactionResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.io.xpring.SubmitSignedTransactionResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.io.xpring.XRPLedgerAPIClient.prototype.submitSignedTransaction =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/io.xpring.XRPLedgerAPI/SubmitSignedTransaction',
      request,
      metadata || {},
      methodDescriptor_XRPLedgerAPI_SubmitSignedTransaction,
      callback);
};


/**
 * @param {!proto.io.xpring.SubmitSignedTransactionRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.io.xpring.SubmitSignedTransactionResponse>}
 *     A native promise that resolves to the response
 */
proto.io.xpring.XRPLedgerAPIPromiseClient.prototype.submitSignedTransaction =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/io.xpring.XRPLedgerAPI/SubmitSignedTransaction',
      request,
      metadata || {},
      methodDescriptor_XRPLedgerAPI_SubmitSignedTransaction);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.io.xpring.GetTransactionStatusRequest,
 *   !proto.io.xpring.TransactionStatus>}
 */
const methodDescriptor_XRPLedgerAPI_GetTransactionStatus = new grpc.web.MethodDescriptor(
  '/io.xpring.XRPLedgerAPI/GetTransactionStatus',
  grpc.web.MethodType.UNARY,
  get_transaction_status_request_pb.GetTransactionStatusRequest,
  transaction_status_pb.TransactionStatus,
  /**
   * @param {!proto.io.xpring.GetTransactionStatusRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  transaction_status_pb.TransactionStatus.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.io.xpring.GetTransactionStatusRequest,
 *   !proto.io.xpring.TransactionStatus>}
 */
const methodInfo_XRPLedgerAPI_GetTransactionStatus = new grpc.web.AbstractClientBase.MethodInfo(
  transaction_status_pb.TransactionStatus,
  /**
   * @param {!proto.io.xpring.GetTransactionStatusRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  transaction_status_pb.TransactionStatus.deserializeBinary
);


/**
 * @param {!proto.io.xpring.GetTransactionStatusRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.io.xpring.TransactionStatus)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.io.xpring.TransactionStatus>|undefined}
 *     The XHR Node Readable Stream
 */
proto.io.xpring.XRPLedgerAPIClient.prototype.getTransactionStatus =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/io.xpring.XRPLedgerAPI/GetTransactionStatus',
      request,
      metadata || {},
      methodDescriptor_XRPLedgerAPI_GetTransactionStatus,
      callback);
};


/**
 * @param {!proto.io.xpring.GetTransactionStatusRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.io.xpring.TransactionStatus>}
 *     A native promise that resolves to the response
 */
proto.io.xpring.XRPLedgerAPIPromiseClient.prototype.getTransactionStatus =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/io.xpring.XRPLedgerAPI/GetTransactionStatus',
      request,
      metadata || {},
      methodDescriptor_XRPLedgerAPI_GetTransactionStatus);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.io.xpring.GetLatestValidatedLedgerSequenceRequest,
 *   !proto.io.xpring.LedgerSequence>}
 */
const methodDescriptor_XRPLedgerAPI_GetLatestValidatedLedgerSequence = new grpc.web.MethodDescriptor(
  '/io.xpring.XRPLedgerAPI/GetLatestValidatedLedgerSequence',
  grpc.web.MethodType.UNARY,
  get_latest_validated_ledger_sequence_request_pb.GetLatestValidatedLedgerSequenceRequest,
  ledger_sequence_pb.LedgerSequence,
  /**
   * @param {!proto.io.xpring.GetLatestValidatedLedgerSequenceRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  ledger_sequence_pb.LedgerSequence.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.io.xpring.GetLatestValidatedLedgerSequenceRequest,
 *   !proto.io.xpring.LedgerSequence>}
 */
const methodInfo_XRPLedgerAPI_GetLatestValidatedLedgerSequence = new grpc.web.AbstractClientBase.MethodInfo(
  ledger_sequence_pb.LedgerSequence,
  /**
   * @param {!proto.io.xpring.GetLatestValidatedLedgerSequenceRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  ledger_sequence_pb.LedgerSequence.deserializeBinary
);


/**
 * @param {!proto.io.xpring.GetLatestValidatedLedgerSequenceRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.io.xpring.LedgerSequence)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.io.xpring.LedgerSequence>|undefined}
 *     The XHR Node Readable Stream
 */
proto.io.xpring.XRPLedgerAPIClient.prototype.getLatestValidatedLedgerSequence =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/io.xpring.XRPLedgerAPI/GetLatestValidatedLedgerSequence',
      request,
      metadata || {},
      methodDescriptor_XRPLedgerAPI_GetLatestValidatedLedgerSequence,
      callback);
};


/**
 * @param {!proto.io.xpring.GetLatestValidatedLedgerSequenceRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.io.xpring.LedgerSequence>}
 *     A native promise that resolves to the response
 */
proto.io.xpring.XRPLedgerAPIPromiseClient.prototype.getLatestValidatedLedgerSequence =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/io.xpring.XRPLedgerAPI/GetLatestValidatedLedgerSequence',
      request,
      metadata || {},
      methodDescriptor_XRPLedgerAPI_GetLatestValidatedLedgerSequence);
};


module.exports = proto.io.xpring;

