const withElevation = require('./withElevation')
const ONE_WEEK = 604800000


module.exports = async function(providers, startDate = undefined, endDate = undefined) {
  const data = await Promise.all(providers.map(provider => __retrieveObservation(provider, startDate, endDate)))
  return [].concat.apply([], data)
}

const __retrieveObservation = async function(provider, startDate = undefined, endDate = undefined) {
  try {
    startDate = parseDate(startDate) || new Date(new Date().getTime() - ONE_WEEK)
    endDate = parseDate(endDate) || new Date()
    const rawData = await provider.rawData(startDate, endDate);
    let data = rawData.map(provider.parseData).filter(x => x);
    data = await withElevation(data);
    return data
  }
  catch (error) {
    return []
  }
}

const parseDate = date => {
  date = new Date(date)
  return date instanceof Date && !isNaN(date) ? date : null
}
