const withElevation = require('./withElevation')
const ONE_MONTH = 2592000000;

module.exports = async function(providers, startDate = null, endDate = null) {
  const data = await Promise.all(providers.map(provider => __retrieveObservation(provider, startDate, endDate)))
  return [].concat.apply([], data)
}

const __retrieveObservation = async function(provider, startDate = null, endDate = null) {
  try {
    startDate = parseDate(startDate) || new Date().getTime() - ONE_MONTH
    endDate = parseDate(endDate) || new Date().getTime()
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
