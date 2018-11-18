const request = require("request");
const observations = require("./__observations.js")
const fs = require("fs")

fs.mkdirSync("dist")
request('https://api.communitysnowobs.org/obs?format=geojson&limit=10000').pipe(fs.createWriteStream('dist/observations.geojson'))
//request('https://api.communitysnowobs.org/obs?format=csv&limit=10000').pipe(fs.createWriteStream('dist/observations.csv'))

observations({limit: 'ALL', format: 'csv'})
  .then(results => {
    const stream = fs.createWriteStream('dist/observations.csv');
    stream.write(results);
    stream.end();
  })
