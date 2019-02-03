const MountainHub = require('./providers/mountainhub')
const SnowPilot = require('./providers/snowpilot')
const RegObs = require('./providers/regobs')
const Cocorahs = require('./providers/cocorahs')
const retrieveObservations = require('./retrieveObservations')
const insertObservations = require('./insertObservations')

exports.handler = async (event, context) => {
  const providers = [MountainHub, SnowPilot, RegObs]
  const results = await retrieveObservations(providers)
    .then(observations => insertObservations(observations))
}
