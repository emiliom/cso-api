const pg = require('pg');

const pgConfig = {
  max: 1,
  user: process.env.SQL_USERNAME,
  password: process.env.SQL_PASSWORD,
  host: process.env.SQL_HOSTNAME,
  database: process.env.SQL_DATABASE,
}

const query = `
  INSERT INTO observations(location, id, author, depth, timestamp, source, elevation)
  VALUES(ST_SetSRID(ST_MakePoint($1,$2), 4326), $3, $4, $5, $6, $7, $8)
  ON CONFLICT DO NOTHING
`

let pgPool;

module.exports = async function (observations) {
  if (!pgPool) {
    pgPool = new pg.Pool(pgConfig);
  }
  try {
    await pgPool.query('BEGIN');
    for (let d of observations) {
      await pgPool.query(query, [d.long, d.lat, d.id, d.author_name, d.depth, d.timestamp, d.source, d.elevation]);
    }
    await pgPool.query('COMMIT');
  } catch (e) {
    await pgPool.query('ROLLBACK')
    return "Error"
  }
  return "Success"
}
