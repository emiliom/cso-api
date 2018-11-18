const crypto = require('crypto');
// Used to generate random ids
const generateId = (data) => crypto.createHash('sha1').update(data).digest('base64').slice(0,8)

module.exports = {
  generateId
}
