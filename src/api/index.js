const { parse } = require("url");
const getObservations = require('./observations')

module.exports = (req, res) => {
  const queryParams = parse(req.url, true).query;
  getObservations(queryParams)
    .then(results => res.end(results))
}
