const { parse } = require("url");
const getObservations = require('./getObservations')

module.exports = (req, res) => {
  const queryParams = parse(req.url, true).query;
  getObservations(queryParams)
    .then(results => res.end(results))
}
