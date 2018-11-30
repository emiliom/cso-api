const fs = require("fs")
const __snapshot = require("./__snapshot")

// fs.mkdirSync("dist")
// fs.mkdirSync("dist/snapshot")

__snapshot([
  { name: "csv", params: { format: "csv" }},
  { name: "geojson", params: {format: "geojson" }},
  { name: "json", params: {format: "json" }}
])
  .then(snapshots => {
    snapshots.forEach(({name, results}) => {
      console.log("Test")
      const stream = fs.createWriteStream(`dist/snapshot/${name}.txt`);
      stream.write(results);
      stream.end();
    })
  });
