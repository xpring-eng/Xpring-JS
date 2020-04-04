/**
 * @fileoverview gRPC-Web generated client stub for org.interledger.stream.proto
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!



const grpc = {};
grpc.web = require('grpc-web');


var get_account_response_pb = require('./get_account_response_pb.js')

var get_account_request_pb = require('./get_account_request_pb.js')

var create_account_request_pb = require('./create_account_request_pb.js')

var create_account_response_pb = require('./create_account_response_pb.js')
const proto = {};
proto.org = {};
proto.org.interledger = {};
proto.org.interledger.stream = {};
proto.org.interledger.stream.proto = require('./account_service_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.org.interledger.stream.proto.AccountServiceClient =
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
proto.org.interledger.stream.proto.AccountServicePromiseClient =
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
 *   !proto.org.interledger.stream.proto.GetAccountRequest,
 *   !proto.org.interledger.stream.proto.GetAccountResponse>}
 */
const methodDescriptor_AccountService_GetAccount = new grpc.web.MethodDescriptor(
  '/org.interledger.stream.proto.AccountService/GetAccount',
  grpc.web.MethodType.UNARY,
  get_account_request_pb.GetAccountRequest,
  get_account_response_pb.GetAccountResponse,
  /**
   * @param {!proto.org.interledger.stream.proto.GetAccountRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  get_account_response_pb.GetAccountResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.org.interledger.stream.proto.GetAccountRequest,
 *   !proto.org.interledger.stream.proto.GetAccountResponse>}
 */
const methodInfo_AccountService_GetAccount = new grpc.web.AbstractClientBase.MethodInfo(
  get_account_response_pb.GetAccountResponse,
  /**
   * @param {!proto.org.interledger.stream.proto.GetAccountRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  get_account_response_pb.GetAccountResponse.deserializeBinary
);


/**
 * @param {!proto.org.interledger.stream.proto.GetAccountRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.org.interledger.stream.proto.GetAccountResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.org.interledger.stream.proto.GetAccountResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.org.interledger.stream.proto.AccountServiceClient.prototype.getAccount =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/org.interledger.stream.proto.AccountService/GetAccount',
      request,
      metadata || {},
      methodDescriptor_AccountService_GetAccount,
      callback);
};


/**
 * @param {!proto.org.interledger.stream.proto.GetAccountRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.org.interledger.stream.proto.GetAccountResponse>}
 *     A native promise that resolves to the response
 */
proto.org.interledger.stream.proto.AccountServicePromiseClient.prototype.getAccount =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/org.interledger.stream.proto.AccountService/GetAccount',
      request,
      metadata || {},
      methodDescriptor_AccountService_GetAccount);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.org.interledger.stream.proto.CreateAccountRequest,
 *   !proto.org.interledger.stream.proto.CreateAccountResponse>}
 */
const methodDescriptor_AccountService_CreateAccount = new grpc.web.MethodDescriptor(
  '/org.interledger.stream.proto.AccountService/CreateAccount',
  grpc.web.MethodType.UNARY,
  create_account_request_pb.CreateAccountRequest,
  create_account_response_pb.CreateAccountResponse,
  /**
   * @param {!proto.org.interledger.stream.proto.CreateAccountRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  create_account_response_pb.CreateAccountResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.org.interledger.stream.proto.CreateAccountRequest,
 *   !proto.org.interledger.stream.proto.CreateAccountResponse>}
 */
const methodInfo_AccountService_CreateAccount = new grpc.web.AbstractClientBase.MethodInfo(
  create_account_response_pb.CreateAccountResponse,
  /**
   * @param {!proto.org.interledger.stream.proto.CreateAccountRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  create_account_response_pb.CreateAccountResponse.deserializeBinary
);


/**
 * @param {!proto.org.interledger.stream.proto.CreateAccountRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.org.interledger.stream.proto.CreateAccountResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.org.interledger.stream.proto.CreateAccountResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.org.interledger.stream.proto.AccountServiceClient.prototype.createAccount =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/org.interledger.stream.proto.AccountService/CreateAccount',
      request,
      metadata || {},
      methodDescriptor_AccountService_CreateAccount,
      callback);
};


/**
 * @param {!proto.org.interledger.stream.proto.CreateAccountRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.org.interledger.stream.proto.CreateAccountResponse>}
 *     A native promise that resolves to the response
 */
proto.org.interledger.stream.proto.AccountServicePromiseClient.prototype.createAccount =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/org.interledger.stream.proto.AccountService/CreateAccount',
      request,
      metadata || {},
      methodDescriptor_AccountService_CreateAccount);
};


module.exports = proto.org.interledger.stream.proto;

