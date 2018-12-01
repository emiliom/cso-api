const __snapshot = require("./__snapshot")
const {Storage} = require('@google-cloud/storage');

const snapshot = async (data, context) => {
  const storage = new Storage();
  const bucket = storage.bucket('community-snow-observations');
  const _ = await __snapshot([
    { name: "csv", params: { format: "csv" }},
    { name: "geojson", params: { format: "geojson" }},
    { name: "json", params: { format: "json" }}
  ])
    .then(snapshots => Promise.all(
      snapshots.map(({name, results}) => {
        const file = bucket.file(name)
        const stream = file.createWriteStream({
          metadata: {
            contentType: 'text/plain',
          }
        });
        stream.write(results);
        stream.end();
        return new Promise((resolve, reject) => {
          stream.on('finish', resolve);
          stream.on('error', reject);
        })
      })
    )
  );
}

module.exports = {
  snapshot
}
