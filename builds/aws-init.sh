eval $(sed 's/"/\\"/g' .env.yaml | sed "s/'/'\\\''/g" | sed -e 's/:[^:\/\/]/='\''/g;s/$/'\''/g;s/ *=/=/g')

ENVIRONMENT_JSON='
  {
    "Variables": {
      "SQL_USERNAME":'"\""$SQL_USERNAME"\""',
      "SQL_PASSWORD":'"\""$SQL_PASSWORD"\""',
      "SQL_HOSTNAME":'"\""$SQL_HOSTNAME"\""',
      "SQL_DATABASE":'"\""$SQL_DATABASE"\""',
      "SNOWPILOT_USERNAME":'"\""$SNOWPILOT_USERNAME"\""',
      "SNOWPILOT_PASSWORD":'"\""$SNOWPILOT_PASSWORD"\""',
      "ELEVATION_API_KEY":'"\""$ELEVATION_API_KEY"\""'
    }
  }'

# Delete existing functions
aws lambda delete-function --function-name observations
aws lambda delete-function --function-name snapshot
aws lambda delete-function --function-name import

# Create new functions
aws lambda create-function --function-name observations \
--runtime nodejs8.10 \
--handler index.handler \
--role arn:aws:iam::105987315436:role/lambda-cli-role \
--zip-file fileb://aws-builds/observations/index.zip \
--timeout 60 \
--environment "$ENVIRONMENT_JSON"

aws lambda create-function --function-name snapshot \
--runtime nodejs8.10 \
--handler index.handler \
--role arn:aws:iam::105987315436:role/lambda-cli-role \
--zip-file fileb://aws-builds/snapshot/index.zip \
--timeout 60 \
--environment "$ENVIRONMENT_JSON"

aws lambda create-function --function-name import \
--runtime nodejs8.10 \
--handler index.handler \
--role arn:aws:iam::105987315436:role/lambda-cli-role \
--zip-file fileb://aws-builds/import/index.zip \
--timeout 60 \
--environment "$ENVIRONMENT_JSON"

# Get ARNS for scheduled events
snapshot_arn=$(aws events put-rule \
--name snapshot \
--schedule-expression 'rate(1 hour)' | jq -r ".RuleArn")

import_arn=$(aws events put-rule \
--name import \
--schedule-expression 'rate(15 minutes)' | jq -r ".RuleArn")

# Remove existing scheduling permissions
aws lambda remove-permission --function-name observations --statement-id observations
aws lambda remove-permission --function-name snapshot --statement-id snapshot
aws lambda remove-permission --function-name import --statement-id import

# Create new scheduling permissions
snapshot_function_arn=$(aws lambda add-permission \
--function-name snapshot \
--statement-id snapshot \
--action 'lambda:InvokeFunction' \
--principal events.amazonaws.com \
--source-arn $snapshot_arn | jq -r ".Statement" | jq -r ".Resource")

import_function_arn=$(aws lambda add-permission \
--function-name import \
--statement-id import \
--action 'lambda:InvokeFunction' \
--principal events.amazonaws.com \
--source-arn $import_arn | jq -r ".Statement" | jq -r ".Resource")

# Create new schedulers
aws events put-targets --rule snapshot --targets "Id"="1","Arn"="$snapshot_function_arn"
aws events put-targets --rule import --targets "Id"="1","Arn"="$import_function_arn"

API_GATEWAY_ID=r21887apdb
API_PARENT_ID=$(aws apigateway get-resources --rest-api-id $API_GATEWAY_ID | jq -r '.items[] | select(.path == "/") | .id')
REGION="us-west-2"
ACCOUNT="105987315436"

API_RESOURCE_ID=$(aws apigateway create-resource --rest-api-id $API_GATEWAY_ID \
--path-part observations \
--parent-id $API_PARENT_ID | jq -r ".id")

aws apigateway put-method \
  --rest-api-id $API_GATEWAY_ID \
  --resource-id $API_RESOURCE_ID \
  --http-method ANY \
  --authorization-type NONE

aws apigateway put-integration \
  --rest-api-id $API_GATEWAY_ID \
  --resource-id $API_RESOURCE_ID \
  --http-method ANY \
  --type AWS_PROXY \
  --integration-http-method POST \
  --uri arn:aws:apigateway:"$REGION":lambda:path/2015-03-31/functions/arn:aws:lambda:"$REGION":"$ACCOUNT":function:observations/invocations

aws lambda add-permission \
  --function-name observations \
  --statement-id observations \
  --action 'lambda:InvokeFunction' \
  --principal apigateway.amazonaws.com \
  --source-arn "arn:aws:execute-api:""$REGION":"$ACCOUNT":"$API_GATEWAY_ID""/*/*"
