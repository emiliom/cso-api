const query = require("../observations/query")
const AWS = require('aws-sdk');

// Snapshot configurations
const configs = [
  { name: "data.csv", params: { format: "csv", bucket: "cso-app-mtn-hub" }},
  { name: "data.geojson", params: { format: "geojson",  providers: "mountainhub,snowpilot,regobs", bucket: "cso-app-mtn-hub"}},
  { name: "data.json", params: { format: "json", bucket: "cso-app-mtn-hub" }}
]

const snapshot = async (templates) => {
  const data = await Promise.all(templates.map(template => query({limit: 'ALL', ...template.params})))
  return templates.map((template, i) => ({...template, results: data[i]}))
}

// Lambda function
exports.handler = async (event, context) => {
  const s3 = new AWS.S3();
  const _ = await snapshot(configs)
    .then(snapshots => Promise.all(
      snapshots.map(({name, results, params}) => {
        return s3.putObject({
            Bucket: params.bucket,
            Key: name,
            Body: results,
            ContentType: "text/plain",
            ACL: 'public-read'
          }).promise()
      })
    )
  );
}
