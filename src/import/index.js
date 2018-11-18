const mh = require('./mountainhub')
const sp = requier('./snowpilot')
const { retrieveObservations, insertObservations } = require('./observations')

module.exports = (req, res) => {
  const providers = [sp]
  retrieveObservations(providers)
    .then(data => insertObservations(data))
    .then(results => res.end(results))
}
