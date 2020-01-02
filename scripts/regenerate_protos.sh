#!/usr/bin/env bash

set -e -o pipefail

##########################################################################
# Generate Protocol Buffers from Rippled.
##########################################################################

echo "Regenerating Protocol Buffers from Rippled"

# Directory to write generated code to (.js and .d.ts files)
JS_OUT_DIR="./build/generated"
TS_OUT_DIR="./generated"

PROTO_PATH="./rippled/src/ripple/proto/"

mkdir -p $TS_OUT_DIR
mkdir -p $JS_OUT_DIR

# Generate node code.
$PWD/node_modules/grpc-tools/bin/protoc \
    --js_out=import_style=commonjs,binary:$TS_OUT_DIR \
    --js_out=import_style=commonjs,binary:$JS_OUT_DIR \
    --grpc_out=$TS_OUT_DIR \
    --grpc_out=$JS_OUT_DIR \
    --plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin` \
    --proto_path $PROTO_PATH \
    ./rippled/src/ripple/proto/rpc/v1/*.proto

# Generate typescript declaration files.
$PWD/node_modules/grpc-tools/bin/protoc \
    --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
    --ts_out=$TS_OUT_DIR \
    --ts_out=$JS_OUT_DIR \
    --proto_path=$PROTO_PATH \
    ./rippled/src/ripple/proto/rpc/v1/*.proto

##########################################################################
# Regenerate legacy protocol buffers.
# TODO(keefertaylor): Remove this when rippled fully supports gRPC.
##########################################################################

echo "Regenerating Protocol Buffers from xpring-common-protocol-buffers"

# Directory to write generated code to (.js and .d.ts files)
LEGACY_JS_OUT_DIR="$JS_OUT_DIR/legacy"
LEGACY_TS_OUT_DIR="$TS_OUT_DIR/legacy"

mkdir -p $LEGACY_TS_OUT_DIR
mkdir -p $LEGACY_JS_OUT_DIR

# Generate node code.
$PWD/node_modules/grpc-tools/bin/protoc \
    --js_out=import_style=commonjs,binary:$LEGACY_TS_OUT_DIR \
    --js_out=import_style=commonjs,binary:$LEGACY_JS_OUT_DIR \
    --grpc_out=$LEGACY_TS_OUT_DIR \
    --grpc_out=$LEGACY_JS_OUT_DIR \
    --plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin` \
    --proto_path=$PWD/xpring-common-protocol-buffers/proto \
    $PWD/xpring-common-protocol-buffers/**/*.proto

# Generate typescript declaration files.
$PWD/node_modules/grpc-tools/bin/protoc \
    --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
    --ts_out=$LEGACY_TS_OUT_DIR \
    --ts_out=$LEGACY_JS_OUT_DIR \
    --proto_path=$PWD/xpring-common-protocol-buffers/proto \
    $PWD/xpring-common-protocol-buffers/**/*.proto

echo "All done!"
