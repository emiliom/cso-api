const __snapshot = require("./__snapshot")
const AWS = require('aws-sdk');

exports.handler = async (event, context) => {
  const s3 = new AWS.S3();
  const _ = await __snapshot([
    { name: "data.csv", params: { format: "csv", bucket: "cso-app" }},
    { name: "data.geojson", params: { format: "geojson",  providers: "mountainhub,snowpilot,regobs", bucket: "cso-app"}},
    { name: "data.geojson", params: { format: "geojson",  providers: "mountainhub,snowpilot,regobs", bucket: "cso-app-beta"}},
    { name: "data.json", params: { format: "json", bucket: "cso-app" }}
  ])
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
