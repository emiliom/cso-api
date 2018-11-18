const request = require("request");
const fs = require("fs")

fs.mkdirSync("dist")
request('https://api.communitysnowobs.org/obs?format=geojson&limit=10000').pipe(fs.createWriteStream('dist/observations.geojson'))
// request('https://api.communitysnowobs.org/obs?format=csv&limit=10000').pipe(fs.createWriteStream('dist/observations.csv'))


request('https://api.zeit.co/v3/now/deployments').pipe(fs.createWriteStream('dist/observations.csv'))
