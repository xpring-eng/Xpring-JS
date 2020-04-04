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

goog.exportSymbol('proto.org.interledger.stream.proto.GetBalanceResponse', null, global);

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
proto.org.interledger.stream.proto.GetBalanceResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.org.interledger.stream.proto.GetBalanceResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.org.interledger.stream.proto.GetBalanceResponse.displayName = 'proto.org.interledger.stream.proto.GetBalanceResponse';
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
proto.org.interledger.stream.proto.GetBalanceResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.org.interledger.stream.proto.GetBalanceResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.org.interledger.stream.proto.GetBalanceResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.org.interledger.stream.proto.GetBalanceResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    accountId: jspb.Message.getFieldWithDefault(msg, 1, ""),
    assetCode: jspb.Message.getFieldWithDefault(msg, 2, ""),
    assetScale: jspb.Message.getFieldWithDefault(msg, 3, 0),
    netBalance: jspb.Message.getFieldWithDefault(msg, 4, 0),
    prepaidAmount: jspb.Message.getFieldWithDefault(msg, 5, 0),
    clearingBalance: jspb.Message.getFieldWithDefault(msg, 6, 0)
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
 * @return {!proto.org.interledger.stream.proto.GetBalanceResponse}
 */
proto.org.interledger.stream.proto.GetBalanceResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.org.interledger.stream.proto.GetBalanceResponse;
  return proto.org.interledger.stream.proto.GetBalanceResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.org.interledger.stream.proto.GetBalanceResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.org.interledger.stream.proto.GetBalanceResponse}
 */
proto.org.interledger.stream.proto.GetBalanceResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setAccountId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setAssetCode(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setAssetScale(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setNetBalance(value);
      break;
    case 5:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setPrepaidAmount(value);
      break;
    case 6:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setClearingBalance(value);
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
proto.org.interledger.stream.proto.GetBalanceResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.org.interledger.stream.proto.GetBalanceResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.org.interledger.stream.proto.GetBalanceResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.org.interledger.stream.proto.GetBalanceResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAccountId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getAssetCode();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getAssetScale();
  if (f !== 0) {
    writer.writeInt32(
      3,
      f
    );
  }
  f = message.getNetBalance();
  if (f !== 0) {
    writer.writeInt64(
      4,
      f
    );
  }
  f = message.getPrepaidAmount();
  if (f !== 0) {
    writer.writeInt64(
      5,
      f
    );
  }
  f = message.getClearingBalance();
  if (f !== 0) {
    writer.writeInt64(
      6,
      f
    );
  }
};


/**
 * optional string account_id = 1;
 * @return {string}
 */
proto.org.interledger.stream.proto.GetBalanceResponse.prototype.getAccountId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/** @param {string} value */
proto.org.interledger.stream.proto.GetBalanceResponse.prototype.setAccountId = function(value) {
  jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string asset_code = 2;
 * @return {string}
 */
proto.org.interledger.stream.proto.GetBalanceResponse.prototype.getAssetCode = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.org.interledger.stream.proto.GetBalanceResponse.prototype.setAssetCode = function(value) {
  jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional int32 asset_scale = 3;
 * @return {number}
 */
proto.org.interledger.stream.proto.GetBalanceResponse.prototype.getAssetScale = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/** @param {number} value */
proto.org.interledger.stream.proto.GetBalanceResponse.prototype.setAssetScale = function(value) {
  jspb.Message.setProto3IntField(this, 3, value);
};


/**
 * optional int64 net_balance = 4;
 * @return {number}
 */
proto.org.interledger.stream.proto.GetBalanceResponse.prototype.getNetBalance = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 4, 0));
};


/** @param {number} value */
proto.org.interledger.stream.proto.GetBalanceResponse.prototype.setNetBalance = function(value) {
  jspb.Message.setProto3IntField(this, 4, value);
};


/**
 * optional int64 prepaid_amount = 5;
 * @return {number}
 */
proto.org.interledger.stream.proto.GetBalanceResponse.prototype.getPrepaidAmount = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 5, 0));
};


/** @param {number} value */
proto.org.interledger.stream.proto.GetBalanceResponse.prototype.setPrepaidAmount = function(value) {
  jspb.Message.setProto3IntField(this, 5, value);
};


/**
 * optional int64 clearing_balance = 6;
 * @return {number}
 */
proto.org.interledger.stream.proto.GetBalanceResponse.prototype.getClearingBalance = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 6, 0));
};


/** @param {number} value */
proto.org.interledger.stream.proto.GetBalanceResponse.prototype.setClearingBalance = function(value) {
  jspb.Message.setProto3IntField(this, 6, value);
};


goog.object.extend(exports, proto.org.interledger.stream.proto);
