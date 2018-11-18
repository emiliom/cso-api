
const { generateId } = require("./utils")
const request = require('request-promise');
const parseString = require('xml2js').parseString;

const LOGIN_URL = 'https://snowpilot.org/user/login'
const LOGIN_HEADERS = { 'User-Agent': 'script login', withCredentials:true }
const BASE_URL = 'https://snowpilot.org/snowpilot-query-feed.xml';
const HEADER = {
    'Content-Disposition': 'attachment; filename="query-results.xml"',
    'Content-Type': 'application/xml'
}

const rawData = async (min_timestamp, max_timestamp) => {

  const jar = request.jar()
  await __setCookies(jar)

  const min_date = new Date(min_timestamp).toISOString().split("T")[0]
  const max_date = new Date(max_timestamp).toISOString().split("T")[0]

  const args = {
      LOC_NAME: '',
      OBS_DATE_MIN: min_date,
      OBS_DATE_MAX: max_date,
      USERNAME: '',
      AFFIL: '',
      per_page: '1000',
      submit: 'Get Pits'
  }

  try {
    const response = await request.get({
      url: BASE_URL,
      qs: args,
      headers: HEADER,
      jar: jar
    })
    const results = await new Promise((resolve, reject) => parseString(response, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    }));
    return results.Pit_Data.Pit_Observation
  } catch (error) {
    console.log("ERROR")
    return error;
  }
}

const parseData = (record) => {
  try {
    const format = {
      author_name: `${record.User[0].$.first} ${record.User[0].$.last}`,
      id: generateId(record.$.nid),
      timestamp: new Date(Number(record.$.timestamp)),
      lat: Number(record.$.lat),
      long: Number(record.$.longitude),
      depth: Number(record.$.heightOfSnowpack),
      source: "SnowPilot"
    };
    if (format.lat == 0 && format.long == 0) throw new Error("No location data");
    return format;
  } catch (error) {
    return null;
  }
}

const __setCookies = async (jar) => {
  const post_data = {
      name : process.env.SNOWPILOT_USERNAME,
      pass : process.env.SNOWPILOT_PASSWORD,
      form_id : 'user_login',
      op : 'Log in'
  }

  await request.post({
    url: LOGIN_URL,
    headers: LOGIN_HEADERS,
    jar: jar,
    simple: false,
    form: post_data
  })
  return
}

module.exports = {
  rawData,
  parseData
}
