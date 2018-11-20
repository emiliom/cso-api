const withElevation = require('./withElevation')
const ONE_MONTH = 2592000000;

module.exports = async function(providers) {
  const data = await Promise.all(providers.map(provider => __retrieveObservation(provider)))
  return [].concat.apply([], data)
}

const __retrieveObservation = async function(provider) {
  const rawData = await provider.rawData(new Date().getTime() - ONE_MONTH, new Date().getTime());
  console.log(rawData)
  let data = rawData.map(provider.parseData).filter(x => x);
  data = await withElevation(data);
  return data
}
