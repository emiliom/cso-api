const MountainHub = require('./providers/mountainhub')
const SnowPilot = require('./providers/snowpilot')
const RegObs = require('./providers/regobs')
const retrieveObservations = require('./retrieveObservations')
const insertObservations = require('./insertObservations')
const { parse } = require("url");



module.exports = (req, res) => {
  const queryParams = parse(req.url, true).query;
  const providers = [MountainHub, SnowPilot, RegObs]
  retrieveObservations(providers, queryParams.startDate, queryParams.endDate)
    .then(data => insertObservations(data))
    .then(results => res.end(results))
}
