const mh = require('./mountainhub')
const { retrieveObservations, insertObservations } = require('./observations')

module.exports = (req, res) => {
  const providers = [mh]
  res.end("Test")
  return
  retrieveObservations(providers)
    .then(data => insertObservations(data))
    .then(results => res.end(results))
}
