const { parse } = require("url");
const pg = require('pg');

const pgConfig = {
  max: 1,
  user: process.env.SQL_USERNAME,
  password: process.env.SQL_PASSWORD,
  host: process.env.SQL_HOSTNAME,
  database: process.env.SQL_DATABASE,
}

const query = `
    SELECT id, author, depth, source, timestamp, ST_X(location) as long, ST_Y(location) as lat, elevation FROM observations WHERE
    ($1::text is null or location && ST_Polygon(ST_GeomFromText($1), 4326)) AND
    ($2::varchar[] is null or source = ANY ($2::varchar[])) AND
    elevation >= 0 AND
    ($3::timestamp is null or timestamp > $3) AND
    ($4::timestamp is null or timestamp < $4)
    ORDER BY id
    OFFSET $6
    LIMIT $5
`

let pgPool;

const __observations = async (queryParams) => {

  const pgParams = [
    parseBBox(queryParams.bbox) || parseRegion(queryParams.region), // Region
    parseProviders(queryParams.providers), // Providers
    parseDate(queryParams.startDate), // Start Date
    parseDate(queryParams.endDate), // End Date
    parseLimit(queryParams.limit), // Limit
    parseOffset(queryParams.limit, queryParams.page) // Offset
  ]

  console.log(pgParams)

  if (!pgPool) {
    pgPool = new pg.Pool(pgConfig);
  }

  results = await pgPool.query(query, pgParams)
  return format(results, queryParams.format);
}

const observations = (req, res) => {

  const queryParams = parse(req.url, true).query;

  __observations(queryParams)
    .then(results => res.end(results))
}

const format = (results, type) => {
  switch(type) {
    case "csv":
      return formatCSV(results)
    case "json":
      return formatJSON(results)
    default:
      return formatGeoJSON(results)
  }
}

const formatCSV = results => {
  if (results.rows.length == 0) {
    return "No features"
  }
  let output = Object.keys(results.rows[0]).map(value => String(value)).join(",") + "\n"
  return results.rows.reduce((str, next) => {
      str += Object.values(next).map(value => String(value)).join(",") + '\n';
      return str;
  }, output);
}
const formatJSON = results => {
  return JSON.stringify({
    features: results.rows
  }, null, 2)
}
const formatGeoJSON = results => {
  return JSON.stringify({
    type: "FeatureCollection",
    features: results.rows.map(row => ({
      type: "Feature",
      properties: Object.assign({}, row, { lat: undefined, long: undefined}),
      geometry: {
        type: "Point",
        coordinates: [row.long, row.lat]
      }
    }))
  }, null, 2)
}

// Format list of coordinates as linestring
const parseRegion = (str) => {
  if (!str) return null;
  const polygon = str.split("_").map(x => x.replace(",", " "));
  console.log(polygon)
  return `LINESTRING(${polygon.concat([polygon[0]]).join(",")})`;
};

// Format bounding box as linestring
const parseBBox = (str) => {
  if (!str) return null;
  const [min_long,max_lat,max_long,min_lat] = str.split(",");
  const polygon = [min_long + " " + min_lat, min_long + " " + max_lat, max_long + " " + max_lat, max_long + " " + min_lat]
  console.log(polygon)
  return `LINESTRING(${polygon.concat([polygon[0]]).join(",")})`;
}

const parseProviders = providers => providers ? providers.split(",") : null
const parseDate = date => {
  date = new Date(date)
  return date instanceof Date && !isNaN(date) ? date : null
}
const parseLimit = limit => (limit && limit.toUpperCase()) == "ALL" ? "ALL" : (Number(limit) || 100)
const parsePage = page => Math.max(Number(page), 1)
const parseOffset = (limit, page) => (parsePage(page) - 1) * parseLimit(limit) || null

module.exports = __observations
