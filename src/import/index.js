const pg = require('pg');
const mh = require('./mountainhub')
const { retrieveObservations, insertObservations } = require('./observations')

module.exports = (req, res) => {
  providers = [mh]
  retrieveObservations(providers)
    .then(data => insertObservations(data))
    .then(results => res.end(results))
}
