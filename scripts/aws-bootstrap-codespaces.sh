#!/usr/bin/env bash
set -euo pipefail

mkdir -p ~/.aws
: "${AWS_ACCESS_KEY_ID:?missing AWS_ACCESS_KEY_ID}"
: "${AWS_SECRET_ACCESS_KEY:?missing AWS_SECRET_ACCESS_KEY}"
: "${AWS_DEFAULT_REGION:=us-east-1}"

cat > ~/.aws/credentials <<CREDS
[default]
aws_access_key_id=$AWS_ACCESS_KEY_ID
aws_secret_access_key=$AWS_SECRET_ACCESS_KEY
CREDS

cat > ~/.aws/config <<CONF
[default]
region=$AWS_DEFAULT_REGION
output=json
CONF

echo "✅ Wrote ~/.aws/credentials and ~/.aws/config"
