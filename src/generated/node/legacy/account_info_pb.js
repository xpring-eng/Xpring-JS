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
goog.exportSymbol('proto.io.xpring.AccountInfo', null, global);

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
proto.io.xpring.AccountInfo = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.io.xpring.AccountInfo, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.io.xpring.AccountInfo.displayName = 'proto.io.xpring.AccountInfo';
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
proto.io.xpring.AccountInfo.prototype.toObject = function(opt_includeInstance) {
  return proto.io.xpring.AccountInfo.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.io.xpring.AccountInfo} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.io.xpring.AccountInfo.toObject = function(includeInstance, msg) {
  var f, obj = {
    balance: (f = msg.getBalance()) && xrp_amount_pb.XRPAmount.toObject(includeInstance, f),
    sequence: jspb.Message.getFieldWithDefault(msg, 2, 0),
    ownerCount: jspb.Message.getFieldWithDefault(msg, 3, 0),
    previousAffectingTransactionId: jspb.Message.getFieldWithDefault(msg, 4, ""),
    previousAffectingTransactionLedgerVersion: jspb.Message.getFieldWithDefault(msg, 5, 0)
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
 * @return {!proto.io.xpring.AccountInfo}
 */
proto.io.xpring.AccountInfo.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.io.xpring.AccountInfo;
  return proto.io.xpring.AccountInfo.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.io.xpring.AccountInfo} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.io.xpring.AccountInfo}
 */
proto.io.xpring.AccountInfo.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new xrp_amount_pb.XRPAmount;
      reader.readMessage(value,xrp_amount_pb.XRPAmount.deserializeBinaryFromReader);
      msg.setBalance(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setSequence(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setOwnerCount(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setPreviousAffectingTransactionId(value);
      break;
    case 5:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setPreviousAffectingTransactionLedgerVersion(value);
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
proto.io.xpring.AccountInfo.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.io.xpring.AccountInfo.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.io.xpring.AccountInfo} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.io.xpring.AccountInfo.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getBalance();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      xrp_amount_pb.XRPAmount.serializeBinaryToWriter
    );
  }
  f = message.getSequence();
  if (f !== 0) {
    writer.writeUint64(
      2,
      f
    );
  }
  f = message.getOwnerCount();
  if (f !== 0) {
    writer.writeUint64(
      3,
      f
    );
  }
  f = message.getPreviousAffectingTransactionId();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getPreviousAffectingTransactionLedgerVersion();
  if (f !== 0) {
    writer.writeUint64(
      5,
      f
    );
  }
};


/**
 * optional XRPAmount balance = 1;
 * @return {?proto.io.xpring.XRPAmount}
 */
proto.io.xpring.AccountInfo.prototype.getBalance = function() {
  return /** @type{?proto.io.xpring.XRPAmount} */ (
    jspb.Message.getWrapperField(this, xrp_amount_pb.XRPAmount, 1));
};


/** @param {?proto.io.xpring.XRPAmount|undefined} value */
proto.io.xpring.AccountInfo.prototype.setBalance = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.io.xpring.AccountInfo.prototype.clearBalance = function() {
  this.setBalance(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.io.xpring.AccountInfo.prototype.hasBalance = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional uint64 sequence = 2;
 * @return {number}
 */
proto.io.xpring.AccountInfo.prototype.getSequence = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/** @param {number} value */
proto.io.xpring.AccountInfo.prototype.setSequence = function(value) {
  jspb.Message.setProto3IntField(this, 2, value);
};


/**
 * optional uint64 owner_count = 3;
 * @return {number}
 */
proto.io.xpring.AccountInfo.prototype.getOwnerCount = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/** @param {number} value */
proto.io.xpring.AccountInfo.prototype.setOwnerCount = function(value) {
  jspb.Message.setProto3IntField(this, 3, value);
};


/**
 * optional string previous_affecting_transaction_id = 4;
 * @return {string}
 */
proto.io.xpring.AccountInfo.prototype.getPreviousAffectingTransactionId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/** @param {string} value */
proto.io.xpring.AccountInfo.prototype.setPreviousAffectingTransactionId = function(value) {
  jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * optional uint64 previous_affecting_transaction_ledger_version = 5;
 * @return {number}
 */
proto.io.xpring.AccountInfo.prototype.getPreviousAffectingTransactionLedgerVersion = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 5, 0));
};


/** @param {number} value */
proto.io.xpring.AccountInfo.prototype.setPreviousAffectingTransactionLedgerVersion = function(value) {
  jspb.Message.setProto3IntField(this, 5, value);
};


goog.object.extend(exports, proto.io.xpring);
