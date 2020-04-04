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

var fiat_amount_pb = require('./fiat_amount_pb.js');
goog.object.extend(proto, fiat_amount_pb);
var xrp_amount_pb = require('./xrp_amount_pb.js');
goog.object.extend(proto, xrp_amount_pb);
goog.exportSymbol('proto.io.xpring.Payment', null, global);

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
proto.io.xpring.Payment = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.io.xpring.Payment.oneofGroups_);
};
goog.inherits(proto.io.xpring.Payment, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.io.xpring.Payment.displayName = 'proto.io.xpring.Payment';
}
/**
 * Oneof group definitions for this message. Each group defines the field
 * numbers belonging to that group. When of these fields' value is set, all
 * other fields in the group are cleared. During deserialization, if multiple
 * fields are encountered for a group, only the last value seen will be kept.
 * @private {!Array<!Array<number>>}
 * @const
 */
proto.io.xpring.Payment.oneofGroups_ = [[1,2]];

/**
 * @enum {number}
 */
proto.io.xpring.Payment.AmountCase = {
  AMOUNT_NOT_SET: 0,
  XRP_AMOUNT: 1,
  FIAT_AMOUNT: 2
};

/**
 * @return {proto.io.xpring.Payment.AmountCase}
 */
proto.io.xpring.Payment.prototype.getAmountCase = function() {
  return /** @type {proto.io.xpring.Payment.AmountCase} */(jspb.Message.computeOneofCase(this, proto.io.xpring.Payment.oneofGroups_[0]));
};



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
proto.io.xpring.Payment.prototype.toObject = function(opt_includeInstance) {
  return proto.io.xpring.Payment.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.io.xpring.Payment} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.io.xpring.Payment.toObject = function(includeInstance, msg) {
  var f, obj = {
    xrpAmount: (f = msg.getXrpAmount()) && xrp_amount_pb.XRPAmount.toObject(includeInstance, f),
    fiatAmount: (f = msg.getFiatAmount()) && fiat_amount_pb.FiatAmount.toObject(includeInstance, f),
    destination: jspb.Message.getFieldWithDefault(msg, 3, "")
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
 * @return {!proto.io.xpring.Payment}
 */
proto.io.xpring.Payment.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.io.xpring.Payment;
  return proto.io.xpring.Payment.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.io.xpring.Payment} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.io.xpring.Payment}
 */
proto.io.xpring.Payment.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new xrp_amount_pb.XRPAmount;
      reader.readMessage(value,xrp_amount_pb.XRPAmount.deserializeBinaryFromReader);
      msg.setXrpAmount(value);
      break;
    case 2:
      var value = new fiat_amount_pb.FiatAmount;
      reader.readMessage(value,fiat_amount_pb.FiatAmount.deserializeBinaryFromReader);
      msg.setFiatAmount(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setDestination(value);
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
proto.io.xpring.Payment.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.io.xpring.Payment.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.io.xpring.Payment} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.io.xpring.Payment.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getXrpAmount();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      xrp_amount_pb.XRPAmount.serializeBinaryToWriter
    );
  }
  f = message.getFiatAmount();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      fiat_amount_pb.FiatAmount.serializeBinaryToWriter
    );
  }
  f = message.getDestination();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
};


/**
 * optional XRPAmount xrp_amount = 1;
 * @return {?proto.io.xpring.XRPAmount}
 */
proto.io.xpring.Payment.prototype.getXrpAmount = function() {
  return /** @type{?proto.io.xpring.XRPAmount} */ (
    jspb.Message.getWrapperField(this, xrp_amount_pb.XRPAmount, 1));
};


/** @param {?proto.io.xpring.XRPAmount|undefined} value */
proto.io.xpring.Payment.prototype.setXrpAmount = function(value) {
  jspb.Message.setOneofWrapperField(this, 1, proto.io.xpring.Payment.oneofGroups_[0], value);
};


proto.io.xpring.Payment.prototype.clearXrpAmount = function() {
  this.setXrpAmount(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.io.xpring.Payment.prototype.hasXrpAmount = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional FiatAmount fiat_amount = 2;
 * @return {?proto.io.xpring.FiatAmount}
 */
proto.io.xpring.Payment.prototype.getFiatAmount = function() {
  return /** @type{?proto.io.xpring.FiatAmount} */ (
    jspb.Message.getWrapperField(this, fiat_amount_pb.FiatAmount, 2));
};


/** @param {?proto.io.xpring.FiatAmount|undefined} value */
proto.io.xpring.Payment.prototype.setFiatAmount = function(value) {
  jspb.Message.setOneofWrapperField(this, 2, proto.io.xpring.Payment.oneofGroups_[0], value);
};


proto.io.xpring.Payment.prototype.clearFiatAmount = function() {
  this.setFiatAmount(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.io.xpring.Payment.prototype.hasFiatAmount = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional string destination = 3;
 * @return {string}
 */
proto.io.xpring.Payment.prototype.getDestination = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/** @param {string} value */
proto.io.xpring.Payment.prototype.setDestination = function(value) {
  jspb.Message.setProto3StringField(this, 3, value);
};


goog.object.extend(exports, proto.io.xpring);
