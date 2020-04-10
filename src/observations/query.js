const pg = require('pg');
const format = require("./format")
const parse = require("./parse")

const pgConfig = {
  max: 1,
  user: process.env.SQL_USERNAME,
  password: process.env.SQL_PASSWORD,
  host: process.env.SQL_HOSTNAME,
  database: process.env.SQL_DATABASE,
}

const queryString = `
    SELECT id, author, depth, source, timestamp, ST_X(location) as long, ST_Y(location) as lat, elevation FROM observations WHERE
    ($1::text is null or location && ST_Polygon(ST_GeomFromText($1), 4326)) AND
    ($2::varchar[] is null or source ilike ANY ($2::varchar[])) AND
    elevation >= 0 AND
    ($3::timestamp is null or timestamp > $3) AND
    ($4::timestamp is null or timestamp < $4)
    ORDER BY id
    OFFSET $6
    LIMIT $5
`

let pgPool;

const query = async (queryParams) => {
  const pgParams = [
    parse.box(queryParams.bbox) || parse.region(queryParams.region), // Region
    parse.providers(queryParams.providers), // Providers
    parse.date(queryParams.startDate), // Start Date
    parse.date(queryParams.endDate), // End Date
    parse.limit(queryParams.limit), // Limit
    parse.offset(queryParams.limit, queryParams.page) // Offset
  ]

  if (!pgPool) {
    pgPool = new pg.Pool(pgConfig);
  }

  results = await pgPool.query(queryString, pgParams)

  switch(queryParams.format) {
    case "csv":
      return format.asCSV(results)
    case "json":
      return format.asJSON(results)
    default:
      return format.asGeoJSON(results)
  }
}

module.exports = query
