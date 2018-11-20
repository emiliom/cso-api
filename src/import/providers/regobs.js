const axios = require("axios");
const { generateId } = require("../utils")

const BASE_URL = 'https://api.nve.no/hydrology/regobs/webapi_latest/search/all';
const HEADER = { "Content-Type": "application/json" };

const rawData = async function(min_timestamp, max_timestamp) {

  const args = {
    FromDate : new Date(min_timestamp).toISOString().split("T")[0],
    ToDate : new Date(max_timestamp).toISOString().split("T")[0],
    NumberOfRecords: 1000
  };

  try {
    let offset = 0;
    let results = []
    while (true) {
      const response = await axios.post(BASE_URL, {...args, offset}, {headers: HEADER});
      results = results.concat(response.data.Results)
      offset += response.data.ResultsInPage
      if (offset >= response.data.TotalMatches) {
        break
      }
    }
    console.log("Count: ", offset)
    return results
  } catch (error) {
    return error;
  }
}

const parseData = (record) => {
  try {
    const format = {
      author_name: record.NickName,
      id: generateId(record.RegId.toString() + record.DtObsTime),
      timestamp: new Date(record.DtObsTime),
      lat: record.Latitude,
      long: record.Longitude,
      depth: Number(record.Registrations[0].FullObject.SnowDepth) * 100,
      source: "regObs"
    };
    console.log(format)
    if (!format.depth) throw new Error("Snow Depth Undefined");
    return format;
  }
  catch (error) {
    return null;
  }
}

module.exports = {
  rawData,
  parseData
}
