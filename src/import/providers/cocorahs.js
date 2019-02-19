const axios = require("axios");
const { generateId } = require("../utils")
const parseString = require('xml2js').parseString;

const BASE_URL = 'http://data.cocorahs.org/cocorahs/export/exportreports.aspx';

// http://data.cocorahs.org/cocorahs/export/exportreports.aspx?dtf=1&Format=json&StartDate=01/01/2017&EndDate=01/03/2017&state=All&responsefields=All&ReportDateType=reportdate&TimesInGMT=True

const rawData = async function(min_date, max_date) {

  const args = {
    dtf : 1,
    format: "XML",
    state: "All",
    responseFields: "totalsnowdepth",
    reportDateType: "reportdate",
    timesInGMT: "False",
    startDate: min_date.toLocaleDateString('en-US'),
    endDate: max_date.toLocaleDateString('en-US')
  };

  try {
    const response = await axios.get(BASE_URL, {params: args});
    let response_data = response.data
    response_data = response_data.replace(/\s{2,}/g, ' ')
    response_data = response_data.replace(/\t/g, ' ');
    response_data = response_data.trim().replace(/(\r\n|\n|\r)/g,"");
    const results = await new Promise((resolve, reject) => parseString(response_data, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    }));
    console.log(results.Cocorahs.DailyPrecipReports[0].DailyPrecipReport.length)
    return results.Cocorahs.DailyPrecipReports[0].DailyPrecipReport
  } catch (error) {
    console.error(error)
    return [];
  }
}

const parseData = (record) => {
  try {
    if (isNaN(Number(record.TotalSnowDepth[0])) || !Number(record.TotalSnowDepth[0])) throw new Error("Snow Depth Undefined");
    const format = {
      author_name: record.StationName[0].replace(/['"]+/g, ''),
      id: generateId(record.StationName[0] + record.EntryDateTime[0]),
      timestamp: new Date(record.EntryDateTime[0]),
      lat: record.Latitude[0],
      long: record.Longitude[0],
      depth: Number(record.TotalSnowDepth[0]) * 2.54,
      source: "CoCoRaHS"
    };
    return format;
  } catch (error) {
    return null;
  }
}

module.exports = {
  rawData,
  parseData
}
