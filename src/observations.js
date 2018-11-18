const { parse } = require("url");
const __observations = require('./snapshots/__observations')

const observations = (req, res) => {
  const queryParams = parse(req.url, true).query;
  __observations(queryParams)
    .then(results => res.end(results))
}

module.exports = observations
