// Example for importing data from source
// Here, weekly data is imported from CoCoRaHs

const cocorahs = require('./providers/cocorahs')
const retrieveObservations = require('./retrieveObservations')
const insertObservations = require('./insertObservations')

const ONE_WEEK = 604800000

const __import = async (startDate, endDate) => {
  const providers = [cocorahs]
  const results = await retrieveObservations(providers, startDate, endDate)
    .then(observations => insertObservations(observations))
}
const batch = async () => {
  for (var i in [...Array(52).keys()]) {
    let startDate = new Date(new Date("2018-01-01").getTime())
    let endDate = new Date(startDate.getTime() + ONE_WEEK)
    let _ = await __import(startDate, endDate)
  }
}

batch()
