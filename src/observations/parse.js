// Format list of coordinates as linestring
const region = str => {
  if (!str) return null;
  const polygon = str.split('_').map(x => x.replace(',', ' '));
  return `LINESTRING(${polygon.concat([polygon[0]]).join(',')})`;
};

// Format bounding box as linestring
const box = str => {
  if (!str) return null;
  const [min_long, max_lat, max_long, min_lat] = str.split(',');
  const polygon = [
    min_long + ' ' + min_lat,
    min_long + ' ' + max_lat,
    max_long + ' ' + max_lat,
    max_long + ' ' + min_lat
  ];
  return `LINESTRING(${polygon.concat([polygon[0]]).join(',')})`;
};

const providers = providers => (providers ? providers.split(',') : null);
const date = date => {
  date = new Date(date);
  return date instanceof Date && !isNaN(date) ? date : null;
};
const limit = str =>
  (str && str.toUpperCase()) == 'ALL' ? null : Number(str) || 100;
const page = str => Math.max(Number(str), 1);
const offset = (limit_str, page_str) =>
  (page(page_str) - 1) * limit(limit_str) || null;

module.exports = {
  region,
  box,
  providers,
  date,
  limit,
  page,
  offset
};
