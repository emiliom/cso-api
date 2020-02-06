const __observations = require("../observations/__observations")

const __snapshot = async (templates) => {
  const data = await Promise.all(templates.map(template => __observations({limit: 'ALL', ...template.params})))
  return templates.map((template, i) => ({...template, results: data[i]}))
}

module.exports = __snapshot
