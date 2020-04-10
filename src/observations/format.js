// Format as CSV
const asCSV = results => {
  if (results.rows.length == 0) {
    return 'No features';
  }
  let output =
    Object.keys(results.rows[0])
      .map(value => String(value))
      .join(',') + '\n';
  return results.rows.reduce((str, next) => {
    str +=
      Object.values(next)
        .map(value => String(value))
        .join(',') + '\n';
    return str;
  }, output);
};

// Format as JSON
const asJSON = results => {
  return JSON.stringify(
    {
      features: results.rows
    },
    null,
    2
  );
};

// Format as GeoJSON
const asGeoJSON = results => {
  return JSON.stringify(
    {
      type: 'FeatureCollection',
      features: results.rows.map(row => ({
        type: 'Feature',
        properties: Object.assign({}, row, { lat: undefined, long: undefined }),
        geometry: {
          type: 'Point',
          coordinates: [row.long, row.lat]
        }
      }))
    },
    null,
    2
  );
};

module.exports = {
    asCSV,
    asJSON,
    asGeoJSON
}