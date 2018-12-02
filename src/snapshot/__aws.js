const __snapshot = require("./__snapshot")
const AWS = require('aws-sdk');

exports.handler = async (event, context) => {
  const s3 = new AWS.S3();
  const _ = await __snapshot([
    { name: "static/csv", params: { format: "csv" }},
    { name: "static/geojson", params: { format: "geojson" }},
    { name: "static/data.geojson", params: { format: "geojson",  providers: "mountainhub,snowpilot,regobs"}},
    { name: "static/json", params: { format: "json" }}
  ])
    .then(snapshots => Promise.all(
      snapshots.map(({name, results}) => {
        return s3.putObject({
            Bucket: 'cso-app',
            Key: `${name}`,
            Body: results,
            ContentType: "text/plain",
            ACL: 'public-read'
          }).promise()
      })
    )
  );
}
