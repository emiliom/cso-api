const request = require("request");
const observations = require("../__observations")
const fs = require("fs")

fs.mkdirSync("dist")

observations({limit: 'ALL', format: 'csv'})
  .then(results => {
    const stream = fs.createWriteStream('dist/observations.csv');
    stream.write(results);
    stream.end();
  })

observations({limit: 'ALL', format: 'geojson'})
  .then(results => {
    const stream = fs.createWriteStream('dist/observations.geojson');
    stream.write(results);
    stream.end();
  })
