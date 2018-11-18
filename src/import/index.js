const MountainHub = require('./providers/mountainhub')
const SnowPilot = require('./providers/snowpilot')
const retrieveObservations = require('./retrieveObservations')
const insertObservations = require('./insertObservations')

module.exports = (req, res) => {
  const providers = [MountainHub, SnowPilot]
  retrieveObservations(providers)
    .then(data => insertObservations(data))
    .then(results => res.end(results))
}
