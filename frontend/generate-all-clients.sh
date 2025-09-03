#!/bin/bash

# Directory containing OpenAPI files
OPENAPI_DIR="../openapi"
OUTPUT_BASE_DIR="./src/clients"

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_BASE_DIR"

# Loop through all OpenAPI YAML files
for file in "$OPENAPI_DIR"/*-openapi.yml; do
  if [ -f "$file" ]; then
    # Extract filename without path and extension
    filename=$(basename "$file")
    # Remove -openapi.yml suffix to get client name
    client_name="${filename%-openapi.yml}"
    
    echo "Generating client for $filename -> $client_name"
    npx @hey-api/openapi-ts -i "$file" -o "$OUTPUT_BASE_DIR/$client_name"
  fi
done

echo "All clients generated!"