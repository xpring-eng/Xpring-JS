#!/usr/bin/env bash

set -e -o pipefail

##########################################################################
# Generate Protocol Buffers from Rippled.
##########################################################################

echo "Generating Protocol Buffers from Rippled"

# Directory to write generated code to (.js and .d.ts files)
XRP_OUT_DIR="./src/XRP/Generated/"

PROTO_PATH="./rippled/src/ripple/proto/"
PROTO_SRC_FILES=$PROTO_PATH/org/xrpl/rpc/v1/*.proto

mkdir -p $XRP_OUT_DIR

# Generate code.
npx grpc_tools_node_protoc \
    --js_out=import_style=commonjs,binary:$XRP_OUT_DIR \
    --grpc_out=generate_package_definition:$XRP_OUT_DIR \
    -I $PROTO_PATH \
    $PROTO_SRC_FILES

# Generate typescript declaration files.
npx protoc \
    --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
    --ts_out=generate_package_definition:$XRP_OUT_DIR \
    -I $PROTO_PATH \
    $PROTO_SRC_FILES

##########################################################################
# Generate Protocol Buffers from hermes-ilp.
##########################################################################

echo "Generating Protocol Buffers from hermes-ilp"

# Directory to write generated code to (.js and .d.ts files)
ILP_OUT_DIR="./src/ILP/Generated/"

mkdir -p $ILP_OUT_DIR

# Generate code.
npx grpc_tools_node_protoc \
    --js_out=import_style=commonjs,binary:$ILP_OUT_DIR \
    --grpc_out=generate_package_definition:$ILP_OUT_DIR \
    -I $PWD/hermes-ilp/protocol-buffers/proto \
    $PWD/hermes-ilp/protocol-buffers/proto/*.proto

# Generate typescript declaration files.
npx protoc \
    --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
    --ts_out=generate_package_definition:$ILP_OUT_DIR \
    -I $PWD/hermes-ilp/protocol-buffers/proto \
    $PWD/hermes-ilp/protocol-buffers/proto/*.proto

echo "All done!"
