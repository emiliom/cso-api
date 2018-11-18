const mh = require('./mountainhub')
const sp = require('./snowpilot')
const { retrieveObservations, insertObservations } = require('./observations')

module.exports = (req, res) => {
  const providers = [sp, mh]
  retrieveObservations(providers)
    .then(data => insertObservations(data))
    .then(results => res.end(results))
}
