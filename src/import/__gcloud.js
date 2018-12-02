const MountainHub = require('./providers/mountainhub')
const SnowPilot = require('./providers/snowpilot')
const RegObs = require('./providers/regobs')
const Cocorahs = require('./providers/cocorahs')
const retrieveObservations = require('./retrieveObservations')
const insertObservations = require('./insertObservations')

const __import = async (data, context) => {
  const providers = [MountainHub, SnowPilot, RegObs, Cocorahs]
  const results = await retrieveObservations(providers)
    .then(observations => insertObservations(observations))
}

module.exports = {
  __import
}
