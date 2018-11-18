const request = require("request");
const getObservations = require("./api/observations")
const fs = require("fs")

fs.mkdirSync("dist")
fs.mkdirSync("dist/snapshots")

getObservations({limit: 'ALL', format: 'csv'})
  .then(results => {
    const stream = fs.createWriteStream('dist/snapshots/csv.txt');
    stream.write(results);
    stream.end();
  })

getObservations({limit: 'ALL', format: 'geojson'})
  .then(results => {
    const stream = fs.createWriteStream('dist/snapshots/geojson.txt');
    stream.write(results);
    stream.end();
  })

getObservations({limit: 'ALL', format: 'json'})
  .then(results => {
    const stream = fs.createWriteStream('dist/snapshots/json.txt');
    stream.write(results);
    stream.end();
  })
