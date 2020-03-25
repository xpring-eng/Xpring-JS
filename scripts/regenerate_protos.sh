#!/usr/bin/env bash

set -e -o pipefail

##########################################################################
# Generate Protocol Buffers from Rippled.
##########################################################################

echo "Regenerating Protocol Buffers from Rippled"

# Directory to write generated code to (.js and .d.ts files)
XRP_OUT_DIR_WEB="./src/XRP/Generated/web"
XRP_OUT_DIR_NODE="./src/XRP/Generated/node"

PROTO_PATH="./rippled/src/ripple/proto/"
PROTO_SRC_FILES=$PROTO_PATH/org/xrpl/rpc/v1/*.proto

mkdir -p $XRP_OUT_DIR_WEB
mkdir -p $XRP_OUT_DIR_NODE

# Generate web code.
$PWD/node_modules/grpc-tools/bin/protoc \
    --js_out=import_style=commonjs,binary:$XRP_OUT_DIR_WEB \
    --grpc-web_out=import_style=commonjs+dts,mode=grpcwebtext:$XRP_OUT_DIR_WEB \
    --proto_path $PROTO_PATH \
    $PROTO_SRC_FILES

# Generate node code.
$PWD/node_modules/grpc-tools/bin/protoc \
    --js_out=import_style=commonjs,binary:$XRP_OUT_DIR_NODE \
    --grpc_out=$XRP_OUT_DIR_NODE \
    --plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin` \
    --proto_path $PROTO_PATH \
    $PROTO_SRC_FILES

# Generate node typescript declaration files.
$PWD/node_modules/grpc-tools/bin/protoc \
    --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
    --ts_out=$XRP_OUT_DIR_NODE \
    --proto_path=$PROTO_PATH \
    $PROTO_SRC_FILES

##########################################################################
# Regenerate legacy protocol buffers.
# TODO(keefertaylor): Remove this when rippled fully supports gRPC.
##########################################################################

echo "Regenerating Protocol Buffers from xpring-common-protocol-buffers"

# Directory to write generated code to (.js and .d.ts files)
LEGACY_XRP_OUT_DIR_WEB="$XRP_OUT_DIR_WEB/legacy"
LEGACY_XRP_OUT_DIR_NODE="$XRP_OUT_DIR_NODE/legacy"

mkdir -p $LEGACY_XRP_OUT_DIR_WEB
mkdir -p $LEGACY_XRP_OUT_DIR_NODE

# Generate web code.
$PWD/node_modules/grpc-tools/bin/protoc \
    --js_out=import_style=commonjs,binary:$LEGACY_XRP_OUT_DIR_WEB \
    --grpc-web_out=import_style=commonjs+dts,mode=grpcwebtext:$LEGACY_XRP_OUT_DIR_WEB \
    --proto_path=$PWD/xpring-common-protocol-buffers/proto \
    $PWD/xpring-common-protocol-buffers/**/*.proto

# Generate node code.
$PWD/node_modules/grpc-tools/bin/protoc \
    --js_out=import_style=commonjs,binary:$LEGACY_XRP_OUT_DIR_NODE \
    --grpc_out=$LEGACY_XRP_OUT_DIR_NODE \
    --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
    --plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin` \
    --proto_path=$PWD/xpring-common-protocol-buffers/proto \
    $PWD/xpring-common-protocol-buffers/**/*.proto

# Generate node typescript declaration files.
$PWD/node_modules/grpc-tools/bin/protoc \
    --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
    --ts_out=$LEGACY_XRP_OUT_DIR_NODE \
    --proto_path=$PWD/xpring-common-protocol-buffers/proto \
    $PWD/xpring-common-protocol-buffers/**/*.proto

##########################################################################
# Generate Protocol Buffers from hermes-ilp.
##########################################################################

echo "Regenerating Protocol Buffers from hermes-ilp"

# Directory to write generated code to (.js and .d.ts files)
ILP_OUT_DIR_WEB="./src/ILP/Generated/web"
ILP_OUT_DIR_NODE="./src/ILP/Generated/node"

mkdir -p $ILP_OUT_DIR_WEB
mkdir -p $ILP_OUT_DIR_NODE

# Generate web code.
$PWD/node_modules/grpc-tools/bin/protoc \
    --js_out=import_style=commonjs,binary:$ILP_OUT_DIR_WEB \
    --grpc-web_out=import_style=commonjs+dts,mode=grpcwebtext:$ILP_OUT_DIR_WEB \
    --proto_path=$PWD/hermes-ilp/protocol-buffers/proto \
    $PWD/hermes-ilp/protocol-buffers/proto/*.proto

# Generate node code.
$PWD/node_modules/grpc-tools/bin/protoc \
    --js_out=import_style=commonjs,binary:$ILP_OUT_DIR_NODE \
    --grpc_out=$ILP_OUT_DIR_NODE \
    --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
    --plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin` \
    --proto_path=$PWD/hermes-ilp/protocol-buffers/proto \
    $PWD/hermes-ilp/protocol-buffers/proto/*.proto

# Generate node typescript declaration files.
$PWD/node_modules/grpc-tools/bin/protoc \
    --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
    --ts_out=$ILP_OUT_DIR_NODE \
    --proto_path=$PWD/hermes-ilp/protocol-buffers/proto \
    $PWD/hermes-ilp/protocol-buffers/proto/*.proto

echo "All done!"
