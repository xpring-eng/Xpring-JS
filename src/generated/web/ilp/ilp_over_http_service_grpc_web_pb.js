/**
 * @fileoverview gRPC-Web generated client stub for org.interledger.stream.proto
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!



const grpc = {};
grpc.web = require('grpc-web');


var send_payment_request_pb = require('./send_payment_request_pb.js')

var send_payment_response_pb = require('./send_payment_response_pb.js')
const proto = {};
proto.org = {};
proto.org.interledger = {};
proto.org.interledger.stream = {};
proto.org.interledger.stream.proto = require('./ilp_over_http_service_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.org.interledger.stream.proto.IlpOverHttpServiceClient =
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
proto.org.interledger.stream.proto.IlpOverHttpServicePromiseClient =
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
 *   !proto.org.interledger.stream.proto.SendPaymentRequest,
 *   !proto.org.interledger.stream.proto.SendPaymentResponse>}
 */
const methodDescriptor_IlpOverHttpService_SendMoney = new grpc.web.MethodDescriptor(
  '/org.interledger.stream.proto.IlpOverHttpService/SendMoney',
  grpc.web.MethodType.UNARY,
  send_payment_request_pb.SendPaymentRequest,
  send_payment_response_pb.SendPaymentResponse,
  /**
   * @param {!proto.org.interledger.stream.proto.SendPaymentRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  send_payment_response_pb.SendPaymentResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.org.interledger.stream.proto.SendPaymentRequest,
 *   !proto.org.interledger.stream.proto.SendPaymentResponse>}
 */
const methodInfo_IlpOverHttpService_SendMoney = new grpc.web.AbstractClientBase.MethodInfo(
  send_payment_response_pb.SendPaymentResponse,
  /**
   * @param {!proto.org.interledger.stream.proto.SendPaymentRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  send_payment_response_pb.SendPaymentResponse.deserializeBinary
);


/**
 * @param {!proto.org.interledger.stream.proto.SendPaymentRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.org.interledger.stream.proto.SendPaymentResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.org.interledger.stream.proto.SendPaymentResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.org.interledger.stream.proto.IlpOverHttpServiceClient.prototype.sendMoney =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/org.interledger.stream.proto.IlpOverHttpService/SendMoney',
      request,
      metadata || {},
      methodDescriptor_IlpOverHttpService_SendMoney,
      callback);
};


/**
 * @param {!proto.org.interledger.stream.proto.SendPaymentRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.org.interledger.stream.proto.SendPaymentResponse>}
 *     A native promise that resolves to the response
 */
proto.org.interledger.stream.proto.IlpOverHttpServicePromiseClient.prototype.sendMoney =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/org.interledger.stream.proto.IlpOverHttpService/SendMoney',
      request,
      metadata || {},
      methodDescriptor_IlpOverHttpService_SendMoney);
};


module.exports = proto.org.interledger.stream.proto;

