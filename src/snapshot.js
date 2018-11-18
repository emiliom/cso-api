const request = require("request");
const observations = require("./__observations")
const fs = require("fs")

fs.mkdirSync("dist")
fs.mkdirSync("dist/snapshots")

observations({limit: 'ALL', format: 'csv'})
  .then(results => {
    const stream = fs.createWriteStream('dist/snapshots/csv');
    stream.write(results);
    stream.end();
  })

observations({limit: 'ALL', format: 'geojson'})
  .then(results => {
    const stream = fs.createWriteStream('dist/snapshots/geojson');
    stream.write(results);
    stream.end();
  })
