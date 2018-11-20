const pg = require('pg');
const format = require('pg-format');

const pgConfig = {
  max: 1,
  user: process.env.SQL_USERNAME,
  password: process.env.SQL_PASSWORD,
  host: process.env.SQL_HOSTNAME,
  database: process.env.SQL_DATABASE,
}

let pgPool;

module.exports = async function (observations) {
  if (!pgPool) {
    pgPool = new pg.Pool(pgConfig);
  }
  try {
    await pgPool.query('BEGIN');
    observations = observations.map(o => `(ST_SetSRID(ST_MakePoint(${o.long}, ${o.lat}), 4236), ${o.id}, ${o.author_name}, ${o.depth}, ${o.timestamp}, ${o.source}, ${o.elevation})`)
    const query = `
      INSERT INTO observations(location, id, author, depth, timestamp, source, elevation)
      VALUES ${observations}
      ON CONFLICT DO NOTHING
    `
    console.log("Query", query)
    await pgPool.query(query);
    await pgPool.query('COMMIT');
    console.log("Done")
  } catch (e) {
    await pgPool.query('ROLLBACK')
    return "Error"
  }
  return "Success"
}
