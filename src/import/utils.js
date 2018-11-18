const crypto = require('crypto');
const axios = require('axios');
// Used to generate random ids
const generateId = (data) => crypto.createHash('sha1').update(data).digest('base64').slice(0,8)

const BASE_ELEVATION_URL = 'https://maps.googleapis.com/maps/api/elevation/json'

const withElevation = async function(data) {
  let out = []
  for (let i = 0; i < data.length; i += 128) {
    let next = await __withElevationBatch(data.slice(i,i+128))
    out = out.concat(next)
  }
  return out
}

const __withElevationBatch = async function(data) {
  const params = {
    locations: data.map(x => String(x.lat) + "," + String(x.long)).join("|"),
    key: process.env.ELEVATION_API_KEY
  }
  const response = await axios.get(BASE_ELEVATION_URL, {params: params});
  console.log(response.data)
  const results = data.map((x,i) => (Object.assign(x, {elevation: response.data.results[i].elevation})))
  return results
}

module.exports = {
  generateId,
  withElevation
}
