// const pg = require('pg');

// Postgres query template
// const q = `SELECT id, author, depth, source, timestamp, ST_X(location) as long, ST_Y(location) as lat, elevation FROM observations WHERE
//     ($1::text is null or location && ST_Polygon(ST_GeomFromText($1), 4326)) AND
//     ($2::varchar[] is null or source = ANY ($2::varchar[])) AND
//     elevation >= 0 AND
//     timestamp > $3 AND timestamp < $4
//     ORDER BY id
//     OFFSET $5 * ($6 - 1)
//     LIMIT $5
//     `

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

module.exports = async (req, res) => {
  await sleep(5000);
  res.end("Hello, World!");
}

// exports.handler = async function(event, context, callback) {
//   // Parse params and replace with defaults
//   const queryParams = event.queryStringParameters || {};
//   const params = {
//     region: format_region(queryParams.region),
//     bbox: format_bbox(queryParams.bbox),
//     src: safe_split(queryParams.src),
//     limit: Math.min(Number(queryParams.limit) || 100, 10000),
//     page: Number(queryParams.page) || 1,
//     start_date: new Date(queryParams.start_date || "2016-01-01"),
//     end_date: new Date(queryParams.end_date || new Date().getTime())
//   };
//
//   // Create Postgres connection
//   const client = new pg.Client({
//     user: process.env.DB_USER,
//     host: process.env.DB_HOST,
//     database: process.env.DB_NAME,
//     password: process.env.DB_PASS,
//     port: 5432,
//   })
//   await client.connect();
//   // Execute query
//   const results = await client.query(q, [params.bbox || params.region, params.src, params.start_date, params.end_date, params.limit, params.page]);
//   await client.end();
//
//   // Send response
//   const response = {
//     statusCode: 200,
//     headers: {
//         "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
//         "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
//     },
//     body: format(results, queryParams.format || "json"),
//   };
//
//   callback(null, response);
//   return;
//
// };
//
// const format = (results, format) => {
//   switch (format) {
//     case "geojson":
//       return format_geojson(results)
//     case "csv":
//       return format_csv(results)
//     default:
//       return format_json(results)
//   }
// }
//
// const format_json = (results) => {
//   return JSON.stringify({
//     features: results.rows
//   }, null, 2)
//
// }
//
// const format_geojson = (results) => {
//   return JSON.stringify({
//     type: "FeatureCollection",
//     features: results.rows.map(row => ({
//       type: "Feature",
//       properties: Object.assign({}, row, { lat: undefined, long: undefined}),
//       geometry: {
//         type: "Point",
//         coordinates: [row.long, row.lat]
//       }
//     }))
//   }, null, 2)
// }
//
// const format_csv = (results) => {
//   if (results.rows.length == 0) {
//     return "No features"
//   }
//   else {
//     let output = Object.keys(results.rows[0]).map(value => String(value)).join(",") + "\n"
//     return results.rows.reduce((str, next) => {
//         str += Object.values(next).map(value => String(value)).join(",") + '\n';
//         return str;
//     }, output);
//   }
// }
//
// // Format list of coordinates as linestring
// const format_region = (str) => {
//   if (!str) return null;
//   const polygon = str.split("_").map(x => x.replace(",", " "));
//   console.log(polygon)
//   return `LINESTRING(${polygon.concat([polygon[0]]).join(",")})`;
// };
//
// // Format bounding box as linestring
// const format_bbox = (str) => {
//   if (!str) return null;
//   const [min_long,max_lat,max_long,min_lat] = str.split(",");
//   const polygon = [min_long + " " + min_lat, min_long + " " + max_lat, max_long + " " + max_lat, max_long + " " + min_lat]
//   console.log(polygon)
//   return `LINESTRING(${polygon.concat([polygon[0]]).join(",")})`;
// }
//
// const safe_split = str => str ? str.split(",") : null
