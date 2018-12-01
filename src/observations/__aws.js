const { parse } = require("url");
const __observations = require('./__observations')

exports.handler = async (event, context) => {
  const queryParams = event.queryStringParameters || {}
  const results = await __observations(queryParams)
  const response = {
    statusCode: 200,
    headers: {
        "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
    },
    body: results
  }
  return response
}
