#!/usr/bin/env bash

set -e -o pipefail

# Folder to place the generated classes in.
DESTINATION_FOLDER=./src/PayID/Generated/

# Open API Specfication to use for generation.
PAY_ID_OPEN_API_SPEC=./pay-id-api-spec/pay-id.v1.yml

# Temporary directory to write files to.
TMP_SWAGGER_DIR=./.tmp_swagger

# Language to generate.
# axios - no access to headers
# fetch - no access to headers
LANG=typescript-axios

# Folder containing generated sources.
GENERATED_SOURCES_FOLDER=$TMP_SWAGGER_DIR/

##########################################################################
# Remove any stale files which are already generated.
##########################################################################
echo "Removing stale files"
rm -rf $DESTINATION_FOLDER
echo "Done removing stale files"

##########################################################################
# Regenerate Swagger API
##########################################################################

echo "Regenerating Swagger API from PayID Open API Spec"

mkdir -p $TMP_SWAGGER_DIR
mkdir -p $DESTINATION_FOLDER

# TODO(keefertaylor): Separate model objects?
npx openapi-generator generate -i $PAY_ID_OPEN_API_SPEC -g $LANG -o $TMP_SWAGGER_DIR # --additional-properties=withSeparateModelsAndApi=true,withInterfaces=true --api-package api --model-package models

echo "Swagger Generation Complete!"

##########################################################################
# Copy artifacts and remove excess files
#
# Swagger outputs a lot of helper boilerplate by default which we don't need.
# Copy the source files to the directory and then delete the remainder.
#
# TODO(keefertaylor): There's probably a better way to do this. Investigate.
##########################################################################

echo "Cleaning Up...."

# Copy Source files
cp -r $GENERATED_SOURCES_FOLDER/* $DESTINATION_FOLDER
# Remove everything else.
rm -rf $TMP_SWAGGER_DIR

echo "Done Cleaning Up"
echo "All Done!"

# Fix a bug where swagger outputs invalid types and tsc chokes on it.
# TODO(keefertaylor): Improve / fix this hack.
# sed -i -e 's/module:ApiClient/ApiClient/g' ./src/PayID/Generated/ApiClient.js
