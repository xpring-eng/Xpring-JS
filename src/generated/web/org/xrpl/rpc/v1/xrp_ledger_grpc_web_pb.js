/**
 * @fileoverview gRPC-Web generated client stub for org.xrpl.rpc.v1
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!



const grpc = {};
grpc.web = require('grpc-web');


var org_xrpl_rpc_v1_get_account_info_pb = require('../../../../org/xrpl/rpc/v1/get_account_info_pb.js')

var org_xrpl_rpc_v1_get_fee_pb = require('../../../../org/xrpl/rpc/v1/get_fee_pb.js')

var org_xrpl_rpc_v1_submit_pb = require('../../../../org/xrpl/rpc/v1/submit_pb.js')

var org_xrpl_rpc_v1_get_transaction_pb = require('../../../../org/xrpl/rpc/v1/get_transaction_pb.js')

var org_xrpl_rpc_v1_get_account_transaction_history_pb = require('../../../../org/xrpl/rpc/v1/get_account_transaction_history_pb.js')
const proto = {};
proto.org = {};
proto.org.xrpl = {};
proto.org.xrpl.rpc = {};
proto.org.xrpl.rpc.v1 = require('./xrp_ledger_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.org.xrpl.rpc.v1.XRPLedgerAPIServiceClient =
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
proto.org.xrpl.rpc.v1.XRPLedgerAPIServicePromiseClient =
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
 *   !proto.org.xrpl.rpc.v1.GetAccountInfoRequest,
 *   !proto.org.xrpl.rpc.v1.GetAccountInfoResponse>}
 */
const methodDescriptor_XRPLedgerAPIService_GetAccountInfo = new grpc.web.MethodDescriptor(
  '/org.xrpl.rpc.v1.XRPLedgerAPIService/GetAccountInfo',
  grpc.web.MethodType.UNARY,
  org_xrpl_rpc_v1_get_account_info_pb.GetAccountInfoRequest,
  org_xrpl_rpc_v1_get_account_info_pb.GetAccountInfoResponse,
  /**
   * @param {!proto.org.xrpl.rpc.v1.GetAccountInfoRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  org_xrpl_rpc_v1_get_account_info_pb.GetAccountInfoResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.org.xrpl.rpc.v1.GetAccountInfoRequest,
 *   !proto.org.xrpl.rpc.v1.GetAccountInfoResponse>}
 */
const methodInfo_XRPLedgerAPIService_GetAccountInfo = new grpc.web.AbstractClientBase.MethodInfo(
  org_xrpl_rpc_v1_get_account_info_pb.GetAccountInfoResponse,
  /**
   * @param {!proto.org.xrpl.rpc.v1.GetAccountInfoRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  org_xrpl_rpc_v1_get_account_info_pb.GetAccountInfoResponse.deserializeBinary
);


/**
 * @param {!proto.org.xrpl.rpc.v1.GetAccountInfoRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.org.xrpl.rpc.v1.GetAccountInfoResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.org.xrpl.rpc.v1.GetAccountInfoResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.org.xrpl.rpc.v1.XRPLedgerAPIServiceClient.prototype.getAccountInfo =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/org.xrpl.rpc.v1.XRPLedgerAPIService/GetAccountInfo',
      request,
      metadata || {},
      methodDescriptor_XRPLedgerAPIService_GetAccountInfo,
      callback);
};


/**
 * @param {!proto.org.xrpl.rpc.v1.GetAccountInfoRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.org.xrpl.rpc.v1.GetAccountInfoResponse>}
 *     A native promise that resolves to the response
 */
proto.org.xrpl.rpc.v1.XRPLedgerAPIServicePromiseClient.prototype.getAccountInfo =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/org.xrpl.rpc.v1.XRPLedgerAPIService/GetAccountInfo',
      request,
      metadata || {},
      methodDescriptor_XRPLedgerAPIService_GetAccountInfo);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.org.xrpl.rpc.v1.GetFeeRequest,
 *   !proto.org.xrpl.rpc.v1.GetFeeResponse>}
 */
const methodDescriptor_XRPLedgerAPIService_GetFee = new grpc.web.MethodDescriptor(
  '/org.xrpl.rpc.v1.XRPLedgerAPIService/GetFee',
  grpc.web.MethodType.UNARY,
  org_xrpl_rpc_v1_get_fee_pb.GetFeeRequest,
  org_xrpl_rpc_v1_get_fee_pb.GetFeeResponse,
  /**
   * @param {!proto.org.xrpl.rpc.v1.GetFeeRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  org_xrpl_rpc_v1_get_fee_pb.GetFeeResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.org.xrpl.rpc.v1.GetFeeRequest,
 *   !proto.org.xrpl.rpc.v1.GetFeeResponse>}
 */
const methodInfo_XRPLedgerAPIService_GetFee = new grpc.web.AbstractClientBase.MethodInfo(
  org_xrpl_rpc_v1_get_fee_pb.GetFeeResponse,
  /**
   * @param {!proto.org.xrpl.rpc.v1.GetFeeRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  org_xrpl_rpc_v1_get_fee_pb.GetFeeResponse.deserializeBinary
);


/**
 * @param {!proto.org.xrpl.rpc.v1.GetFeeRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.org.xrpl.rpc.v1.GetFeeResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.org.xrpl.rpc.v1.GetFeeResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.org.xrpl.rpc.v1.XRPLedgerAPIServiceClient.prototype.getFee =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/org.xrpl.rpc.v1.XRPLedgerAPIService/GetFee',
      request,
      metadata || {},
      methodDescriptor_XRPLedgerAPIService_GetFee,
      callback);
};


/**
 * @param {!proto.org.xrpl.rpc.v1.GetFeeRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.org.xrpl.rpc.v1.GetFeeResponse>}
 *     A native promise that resolves to the response
 */
proto.org.xrpl.rpc.v1.XRPLedgerAPIServicePromiseClient.prototype.getFee =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/org.xrpl.rpc.v1.XRPLedgerAPIService/GetFee',
      request,
      metadata || {},
      methodDescriptor_XRPLedgerAPIService_GetFee);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.org.xrpl.rpc.v1.SubmitTransactionRequest,
 *   !proto.org.xrpl.rpc.v1.SubmitTransactionResponse>}
 */
const methodDescriptor_XRPLedgerAPIService_SubmitTransaction = new grpc.web.MethodDescriptor(
  '/org.xrpl.rpc.v1.XRPLedgerAPIService/SubmitTransaction',
  grpc.web.MethodType.UNARY,
  org_xrpl_rpc_v1_submit_pb.SubmitTransactionRequest,
  org_xrpl_rpc_v1_submit_pb.SubmitTransactionResponse,
  /**
   * @param {!proto.org.xrpl.rpc.v1.SubmitTransactionRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  org_xrpl_rpc_v1_submit_pb.SubmitTransactionResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.org.xrpl.rpc.v1.SubmitTransactionRequest,
 *   !proto.org.xrpl.rpc.v1.SubmitTransactionResponse>}
 */
const methodInfo_XRPLedgerAPIService_SubmitTransaction = new grpc.web.AbstractClientBase.MethodInfo(
  org_xrpl_rpc_v1_submit_pb.SubmitTransactionResponse,
  /**
   * @param {!proto.org.xrpl.rpc.v1.SubmitTransactionRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  org_xrpl_rpc_v1_submit_pb.SubmitTransactionResponse.deserializeBinary
);


/**
 * @param {!proto.org.xrpl.rpc.v1.SubmitTransactionRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.org.xrpl.rpc.v1.SubmitTransactionResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.org.xrpl.rpc.v1.SubmitTransactionResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.org.xrpl.rpc.v1.XRPLedgerAPIServiceClient.prototype.submitTransaction =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/org.xrpl.rpc.v1.XRPLedgerAPIService/SubmitTransaction',
      request,
      metadata || {},
      methodDescriptor_XRPLedgerAPIService_SubmitTransaction,
      callback);
};


/**
 * @param {!proto.org.xrpl.rpc.v1.SubmitTransactionRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.org.xrpl.rpc.v1.SubmitTransactionResponse>}
 *     A native promise that resolves to the response
 */
proto.org.xrpl.rpc.v1.XRPLedgerAPIServicePromiseClient.prototype.submitTransaction =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/org.xrpl.rpc.v1.XRPLedgerAPIService/SubmitTransaction',
      request,
      metadata || {},
      methodDescriptor_XRPLedgerAPIService_SubmitTransaction);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.org.xrpl.rpc.v1.GetTransactionRequest,
 *   !proto.org.xrpl.rpc.v1.GetTransactionResponse>}
 */
const methodDescriptor_XRPLedgerAPIService_GetTransaction = new grpc.web.MethodDescriptor(
  '/org.xrpl.rpc.v1.XRPLedgerAPIService/GetTransaction',
  grpc.web.MethodType.UNARY,
  org_xrpl_rpc_v1_get_transaction_pb.GetTransactionRequest,
  org_xrpl_rpc_v1_get_transaction_pb.GetTransactionResponse,
  /**
   * @param {!proto.org.xrpl.rpc.v1.GetTransactionRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  org_xrpl_rpc_v1_get_transaction_pb.GetTransactionResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.org.xrpl.rpc.v1.GetTransactionRequest,
 *   !proto.org.xrpl.rpc.v1.GetTransactionResponse>}
 */
const methodInfo_XRPLedgerAPIService_GetTransaction = new grpc.web.AbstractClientBase.MethodInfo(
  org_xrpl_rpc_v1_get_transaction_pb.GetTransactionResponse,
  /**
   * @param {!proto.org.xrpl.rpc.v1.GetTransactionRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  org_xrpl_rpc_v1_get_transaction_pb.GetTransactionResponse.deserializeBinary
);


/**
 * @param {!proto.org.xrpl.rpc.v1.GetTransactionRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.org.xrpl.rpc.v1.GetTransactionResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.org.xrpl.rpc.v1.GetTransactionResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.org.xrpl.rpc.v1.XRPLedgerAPIServiceClient.prototype.getTransaction =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/org.xrpl.rpc.v1.XRPLedgerAPIService/GetTransaction',
      request,
      metadata || {},
      methodDescriptor_XRPLedgerAPIService_GetTransaction,
      callback);
};


/**
 * @param {!proto.org.xrpl.rpc.v1.GetTransactionRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.org.xrpl.rpc.v1.GetTransactionResponse>}
 *     A native promise that resolves to the response
 */
proto.org.xrpl.rpc.v1.XRPLedgerAPIServicePromiseClient.prototype.getTransaction =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/org.xrpl.rpc.v1.XRPLedgerAPIService/GetTransaction',
      request,
      metadata || {},
      methodDescriptor_XRPLedgerAPIService_GetTransaction);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.org.xrpl.rpc.v1.GetAccountTransactionHistoryRequest,
 *   !proto.org.xrpl.rpc.v1.GetAccountTransactionHistoryResponse>}
 */
const methodDescriptor_XRPLedgerAPIService_GetAccountTransactionHistory = new grpc.web.MethodDescriptor(
  '/org.xrpl.rpc.v1.XRPLedgerAPIService/GetAccountTransactionHistory',
  grpc.web.MethodType.UNARY,
  org_xrpl_rpc_v1_get_account_transaction_history_pb.GetAccountTransactionHistoryRequest,
  org_xrpl_rpc_v1_get_account_transaction_history_pb.GetAccountTransactionHistoryResponse,
  /**
   * @param {!proto.org.xrpl.rpc.v1.GetAccountTransactionHistoryRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  org_xrpl_rpc_v1_get_account_transaction_history_pb.GetAccountTransactionHistoryResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.org.xrpl.rpc.v1.GetAccountTransactionHistoryRequest,
 *   !proto.org.xrpl.rpc.v1.GetAccountTransactionHistoryResponse>}
 */
const methodInfo_XRPLedgerAPIService_GetAccountTransactionHistory = new grpc.web.AbstractClientBase.MethodInfo(
  org_xrpl_rpc_v1_get_account_transaction_history_pb.GetAccountTransactionHistoryResponse,
  /**
   * @param {!proto.org.xrpl.rpc.v1.GetAccountTransactionHistoryRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  org_xrpl_rpc_v1_get_account_transaction_history_pb.GetAccountTransactionHistoryResponse.deserializeBinary
);


/**
 * @param {!proto.org.xrpl.rpc.v1.GetAccountTransactionHistoryRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.org.xrpl.rpc.v1.GetAccountTransactionHistoryResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.org.xrpl.rpc.v1.GetAccountTransactionHistoryResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.org.xrpl.rpc.v1.XRPLedgerAPIServiceClient.prototype.getAccountTransactionHistory =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/org.xrpl.rpc.v1.XRPLedgerAPIService/GetAccountTransactionHistory',
      request,
      metadata || {},
      methodDescriptor_XRPLedgerAPIService_GetAccountTransactionHistory,
      callback);
};


/**
 * @param {!proto.org.xrpl.rpc.v1.GetAccountTransactionHistoryRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.org.xrpl.rpc.v1.GetAccountTransactionHistoryResponse>}
 *     A native promise that resolves to the response
 */
proto.org.xrpl.rpc.v1.XRPLedgerAPIServicePromiseClient.prototype.getAccountTransactionHistory =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/org.xrpl.rpc.v1.XRPLedgerAPIService/GetAccountTransactionHistory',
      request,
      metadata || {},
      methodDescriptor_XRPLedgerAPIService_GetAccountTransactionHistory);
};


module.exports = proto.org.xrpl.rpc.v1;

