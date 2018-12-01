const { parse } = require("url");
const __observations = require('./__observations')

const observations = (req, res) => {
  __observations(req.query)
    .then(results => res.end(results))
}

module.exports = {
  observations
}
