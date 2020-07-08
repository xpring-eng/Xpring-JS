#!/usr/bin/env bash

set -e -o pipefail

##########################################################################
# Generate Protocol Buffers from Rippled.
##########################################################################

echo "Generating Protocol Buffers from Rippled"

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

echo "generated web"

# Generate node code.
npx grpc_tools_node_protoc \
    --js_out=import_style=commonjs,binary:$XRP_OUT_DIR_NODE \
    --grpc_out=generate_package_definition:$XRP_OUT_DIR_NODE \
    -I $PROTO_PATH \
    $PROTO_SRC_FILES

echo "generated node"


# Generate node typescript declaration files.
npx protoc \
    --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
    --ts_out=generate_package_definition:$XRP_OUT_DIR_NODE \
    -I $PROTO_PATH \
    $PROTO_SRC_FILES

echo "generated ts"


##########################################################################
# Generate Protocol Buffers from hermes-ilp.
##########################################################################

echo "Generating Protocol Buffers from hermes-ilp"

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
npx grpc_tools_node_protoc \
    --js_out=import_style=commonjs,binary:$ILP_OUT_DIR_NODE \
    --grpc_out=generate_package_definition:$ILP_OUT_DIR_NODE \
    -I $PWD/hermes-ilp/protocol-buffers/proto \
    $PWD/hermes-ilp/protocol-buffers/proto/*.proto

# Generate node typescript declaration files.
npx protoc \
    --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
    --ts_out=generate_package_definition:$ILP_OUT_DIR_NODE \
    -I $PWD/hermes-ilp/protocol-buffers/proto \
    $PWD/hermes-ilp/protocol-buffers/proto/*.proto

echo "All done!"
