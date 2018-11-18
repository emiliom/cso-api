const pg = require('pg');
const axios = require("axios");
const { generateId, withElevation } = require("./utils")

const BASE_URL = 'https://api.mountainhub.com/timeline';
const HEADER = { 'Accept-version': '1' };


const rawData = async (min_timestamp, max_timestamp) => {

  const args = {
    publisher : 'all',
    obs_type : 'snow_conditions',
    limit : 10000,
    since : min_timestamp,
    before : max_timestamp
  };

  try {
    const response = await axios.get(BASE_URL, {params: args, headers: HEADER});
    return response.data.results;
  } catch (error) {
    return error;
  }
}

const parseData = (record) => {
  try {
    const format = {
      author_name: record.actor.full_name || record.actor.fullName,
      id: hash(record.observation._id),
      timestamp: new Date(record.observation.reported_at),
      lat: record.observation.location[1],
      long: record.observation.location[0],
      depth: Number(record.observation.details[0].snowpack_depth),
      source: "MountainHub"
    };
    if (isNaN(format.depth)) throw new Error("Snow Depth Undefined");
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
