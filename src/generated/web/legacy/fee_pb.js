/**
 * @fileoverview
 * @enhanceable
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!

var jspb = require('google-protobuf');
var goog = jspb;
var global = Function('return this')();

var xrp_amount_pb = require('./xrp_amount_pb.js');
goog.object.extend(proto, xrp_amount_pb);
goog.exportSymbol('proto.io.xpring.Fee', null, global);

/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.io.xpring.Fee = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.io.xpring.Fee, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.io.xpring.Fee.displayName = 'proto.io.xpring.Fee';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.io.xpring.Fee.prototype.toObject = function(opt_includeInstance) {
  return proto.io.xpring.Fee.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.io.xpring.Fee} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.io.xpring.Fee.toObject = function(includeInstance, msg) {
  var f, obj = {
    amount: (f = msg.getAmount()) && xrp_amount_pb.XRPAmount.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.io.xpring.Fee}
 */
proto.io.xpring.Fee.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.io.xpring.Fee;
  return proto.io.xpring.Fee.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.io.xpring.Fee} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.io.xpring.Fee}
 */
proto.io.xpring.Fee.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new xrp_amount_pb.XRPAmount;
      reader.readMessage(value,xrp_amount_pb.XRPAmount.deserializeBinaryFromReader);
      msg.setAmount(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.io.xpring.Fee.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.io.xpring.Fee.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.io.xpring.Fee} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.io.xpring.Fee.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAmount();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      xrp_amount_pb.XRPAmount.serializeBinaryToWriter
    );
  }
};


/**
 * optional XRPAmount amount = 1;
 * @return {?proto.io.xpring.XRPAmount}
 */
proto.io.xpring.Fee.prototype.getAmount = function() {
  return /** @type{?proto.io.xpring.XRPAmount} */ (
    jspb.Message.getWrapperField(this, xrp_amount_pb.XRPAmount, 1));
};


/** @param {?proto.io.xpring.XRPAmount|undefined} value */
proto.io.xpring.Fee.prototype.setAmount = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.io.xpring.Fee.prototype.clearAmount = function() {
  this.setAmount(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.io.xpring.Fee.prototype.hasAmount = function() {
  return jspb.Message.getField(this, 1) != null;
};


goog.object.extend(exports, proto.io.xpring);
