/**
 * @fileoverview gRPC-Web generated client stub for org.interledger.stream.proto
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!



const grpc = {};
grpc.web = require('grpc-web');


var get_balance_response_pb = require('./get_balance_response_pb.js')

var get_balance_request_pb = require('./get_balance_request_pb.js')
const proto = {};
proto.org = {};
proto.org.interledger = {};
proto.org.interledger.stream = {};
proto.org.interledger.stream.proto = require('./balance_service_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.org.interledger.stream.proto.BalanceServiceClient =
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
proto.org.interledger.stream.proto.BalanceServicePromiseClient =
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
 *   !proto.org.interledger.stream.proto.GetBalanceRequest,
 *   !proto.org.interledger.stream.proto.GetBalanceResponse>}
 */
const methodDescriptor_BalanceService_GetBalance = new grpc.web.MethodDescriptor(
  '/org.interledger.stream.proto.BalanceService/GetBalance',
  grpc.web.MethodType.UNARY,
  get_balance_request_pb.GetBalanceRequest,
  get_balance_response_pb.GetBalanceResponse,
  /**
   * @param {!proto.org.interledger.stream.proto.GetBalanceRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  get_balance_response_pb.GetBalanceResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.org.interledger.stream.proto.GetBalanceRequest,
 *   !proto.org.interledger.stream.proto.GetBalanceResponse>}
 */
const methodInfo_BalanceService_GetBalance = new grpc.web.AbstractClientBase.MethodInfo(
  get_balance_response_pb.GetBalanceResponse,
  /**
   * @param {!proto.org.interledger.stream.proto.GetBalanceRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  get_balance_response_pb.GetBalanceResponse.deserializeBinary
);


/**
 * @param {!proto.org.interledger.stream.proto.GetBalanceRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.org.interledger.stream.proto.GetBalanceResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.org.interledger.stream.proto.GetBalanceResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.org.interledger.stream.proto.BalanceServiceClient.prototype.getBalance =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/org.interledger.stream.proto.BalanceService/GetBalance',
      request,
      metadata || {},
      methodDescriptor_BalanceService_GetBalance,
      callback);
};


/**
 * @param {!proto.org.interledger.stream.proto.GetBalanceRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.org.interledger.stream.proto.GetBalanceResponse>}
 *     A native promise that resolves to the response
 */
proto.org.interledger.stream.proto.BalanceServicePromiseClient.prototype.getBalance =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/org.interledger.stream.proto.BalanceService/GetBalance',
      request,
      metadata || {},
      methodDescriptor_BalanceService_GetBalance);
};


module.exports = proto.org.interledger.stream.proto;

