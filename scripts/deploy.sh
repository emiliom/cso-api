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

aws --profile cso lambda update-function-code \
  --function-name observations \
  --zip-file fileb://builds/observations/index.zip

aws --profile cso lambda update-function-configuration \
  --function-name observations \
  --environment "$ENVIRONMENT_JSON"

aws --profile cso lambda update-function-code \
  --function-name snapshot \
  --zip-file fileb://builds/snapshot/index.zip

aws --profile cso lambda update-function-configuration \
  --function-name snapshot \
  --environment "$ENVIRONMENT_JSON"

aws --profile cso lambda update-function-code \
  --function-name import \
  --zip-file fileb://builds/import/index.zip

aws --profile cso lambda update-function-configuration \
  --function-name import \
  --environment "$ENVIRONMENT_JSON"
