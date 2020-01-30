#!/usr/bin/env bash

set -e -o pipefail

##########################################################################
# Generate Protocol Buffers from Rippled.
##########################################################################

echo "Regenerating Protocol Buffers from Rippled"

# Directory to write generated code to (.js and .d.ts files)
OUT_DIR_WEB="./src/generated/web"
OUT_DIR_NODE="./src/generated/node"

PROTO_PATH="./rippled/src/ripple/proto/"

mkdir -p $OUT_DIR_WEB
mkdir -p $OUT_DIR_NODE

# Generate web code.
$PWD/node_modules/grpc-tools/bin/protoc \
    --js_out=import_style=commonjs,binary:$OUT_DIR_WEB \
    --grpc-web_out=import_style=commonjs+dts,mode=grpcwebtext:$OUT_DIR_WEB \
    --proto_path $PROTO_PATH \
    ./rippled/src/ripple/proto/rpc/v1/*.proto

# Generate node code.
$PWD/node_modules/grpc-tools/bin/protoc \
    --js_out=import_style=commonjs,binary:$OUT_DIR_NODE \
    --grpc_out=$OUT_DIR_NODE \
    --plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin` \
    --proto_path $PROTO_PATH \
    ./rippled/src/ripple/proto/rpc/v1/*.proto

# Generate node typescript declaration files.
$PWD/node_modules/grpc-tools/bin/protoc \
    --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
    --ts_out=$OUT_DIR_NODE \
    --proto_path=$PROTO_PATH \
    ./rippled/src/ripple/proto/rpc/v1/*.proto

##########################################################################
# Regenerate legacy protocol buffers.
# TODO(keefertaylor): Remove this when rippled fully supports gRPC.
##########################################################################

echo "Regenerating Protocol Buffers from xpring-common-protocol-buffers"

# Directory to write generated code to (.js and .d.ts files)
LEGACY_OUT_DIR_WEB="$OUT_DIR_WEB/legacy"
LEGACY_OUT_DIR_NODE="$OUT_DIR_NODE/legacy"

mkdir -p $LEGACY_OUT_DIR_WEB
mkdir -p $LEGACY_OUT_DIR_NODE

# Generate web code.
$PWD/node_modules/grpc-tools/bin/protoc \
    --js_out=import_style=commonjs,binary:$LEGACY_OUT_DIR_WEB \
    --grpc-web_out=import_style=commonjs+dts,mode=grpcwebtext:$LEGACY_OUT_DIR_WEB \
    --proto_path=$PWD/xpring-common-protocol-buffers/proto \
    $PWD/xpring-common-protocol-buffers/**/*.proto

# Generate node code.
$PWD/node_modules/grpc-tools/bin/protoc \
    --js_out=import_style=commonjs,binary:$LEGACY_OUT_DIR_NODE \
    --grpc_out=$LEGACY_OUT_DIR_NODE \
    --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
    --plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin` \
    --proto_path=$PWD/xpring-common-protocol-buffers/proto \
    $PWD/xpring-common-protocol-buffers/**/*.proto

# Generate node typescript declaration files.
$PWD/node_modules/grpc-tools/bin/protoc \
    --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
    --ts_out=$LEGACY_OUT_DIR_NODE \
    --proto_path=$PWD/xpring-common-protocol-buffers/proto \
    $PWD/xpring-common-protocol-buffers/**/*.proto

echo "All done!"
