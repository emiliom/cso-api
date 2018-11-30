const { parse } = require("url");
const __observations = require('./__observations')

module.exports = (req, res) => {
  const queryParams = parse(req.url, true).query;
  __observations(queryParams)
    .then(results => res.end(results))
}
