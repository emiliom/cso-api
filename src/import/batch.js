// Example for importing data from source
// Here, 2016 weekly data is imported from MountainHUb
require('dotenv').config()

const mountainhub = require('./providers/mountainhub')
const retrieveObservations = require('./retrieveObservations')
const insertObservations = require('./insertObservations')

const ONE_WEEK = 604800000

const __import = async (startDate, endDate) => {
  const providers = [mountainhub]
  const results = await retrieveObservations(providers, startDate, endDate)
    .then(observations => insertObservations(observations))
}
// Fetch data four weeks at a time
const batch = async () => {
  for (var i in [...Array(5).keys()]) {
    let startDate = new Date(new Date("2019-10-01").getTime() + i * ONE_WEEK * 4)
    let endDate = new Date(startDate.getTime() + ONE_WEEK * 4)
    let _ = await __import(startDate, endDate)
  }
}

batch()
