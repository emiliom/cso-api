const __snapshot = require("./__snapshot")
const AWS = require('aws-sdk');

exports.handler = async (event, context) => {
  const s3 = new AWS.S3();
  const _ = await __snapshot([
    { name: "csv", params: { format: "csv" }},
    { name: "geojson", params: { format: "geojson" }},
    { name: "json", params: { format: "json" }}
  ])
    .then(snapshots => Promise.all(
      snapshots.map(({name, results}) => {
        return s3.putObject({
            Bucket: 'community-snow-observations',
            Key: `${name}`,
            Body: results,
            ContentType: "text/plain",
            ACL: 'public-read'
          }).promise()
      })
    )
  );
}
