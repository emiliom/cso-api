const query = require('./query')

// Lambda function
exports.handler = async (event, context) => {
  const queryParams = event.queryStringParameters || {}
  // Query observations from database
  const results = await query(queryParams)
  // Return API response
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
