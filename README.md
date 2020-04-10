# API Docs

Functions running CSO's serverless [API](https://api.communitysnowobs.org/observations)

## Getting started

CSO's API is built on top of the AWS Lambda platform and a PostgreSQL database. The API handles data importation, exportation, and querying.

### Running in development
*The following steps can be followed using either yarn or npm*

1. Install necessary packages

```
cd src
yarn install
```

2. Create .env file
```
touch .env
```

3. Add variables to env file. `SQL_USERNAME, SQL_PASSWORD, SQL_HOSTNAME, SQL_DATABASE` refer to the database credentials. `SNOWPILOT_PASSWORD, `SNOWPILOT_USERNAME` refer to the credentials for accessing SnowPilot's API. `ELEVATION_API_KEY` refers to a Google Maps API key with elevation permissions enabled. 
```
SQL_USERNAME={INSERT_SQL_USERNAME_HERE}
SQL_PASSWORD={INSERT_SQL_PASSWORD_HERE}
SQL_HOSTNAME={INSERT_SQL_HOSTNAME_HERE}
SQL_DATABASE={INSERT_SQL_DATABASE_HERE}
SNOWPILOT_PASSWORD={INSERT_SNOWPILOT_PASSWORD_HERE}
SNOWPILOT_USERNAME={INSERT_SNOWPILOT_USERNAME_HERE}
ELEVATION_API_KEY={INSERT_ELEVATION_API_KEY_HERE}
```
4. Run lambda locally
```
ncc run `path/to/lambda.js`
```
Ex: `ncc run src/import/batch.js

### Adding new providers

New provider modules should contain two functions, `raw_data(min_date, max_date)`, which should return a list of observations in raw form, and `parse_record(record)`, which converts a record into the standard record format below. 

`json 
{
  author_name: String,
  id: String,
  timestamp: Date,
  lat: Number
  long: Number,
  depth: Number,
  source: String
}
`

Elevation data from the Google Maps API is automatically inserted into the records when processed. To ensure that data from the new provider is being fetched, add the provider to the list of provider modules in `import/providers/index.js`.

## Parameters
- bbox: Bounding box to return results from, specified by `<west,north,east,south>` edges in that order. Takes precedence over region. Longitude ranges from -180° to 180°. Example: `-120,45,-110,40`. Default: `None`.
- region: Arbitrary polygon to return results from, specified by `<long_1>,<lat_1>_<long_2>,<lat_2>_<long_3>,<lat_3>`... Example: `-120,45_-120,50_-110,50_-110,45`. Default: `None`.
- startDate: Earliest date to fetch results from. Example: `2018-06-23`. Default: `2016-01-01`
- endDate: Latest date to fetch results from. Example: `2018-06-23`. Default: `2016-01-01`
- format: Format to return results from. One of `geojson`, `csv`, `json`. Default: `geojson`
- limit: Maximum number of results to return. Example: `1000`. Default: `100`
- page: Page number of results to return. Example: `1`. Default: `1`.

## Example API calls

### Python
```python
from __future__ import print_function
import requests

# Up to 10 observations between 120°W and 110°W, 40°N and 45°N from Jan 2018 formatted as GeoJSON
params = {
  "bbox": "-120,45,-110,40",
  "start_date": "2018-01-01",
  "end_date": "2018-01-31",
  "format": "geojson",
  "limit": 10,
}

response = requests.get("http://api.communitysnowobs.org/observations", params=params)
print(response.content)
```

### Matlab
```matlab
% Up to 10 observations between 120°W and 110°W, 40°N and 45°N from Jan 2018 formatted as GeoJSON
data = urlread('https://api.communitysnowobs.org/observations', 'Get', {
  'bbox', '-120,45,-110,40', ...
  'start_date', '2018-01-01', ...
  'end_date', '2018-01-31', ...
  'format', 'geojson', ...
  'limit', '10'
});
disp(data)
```

### Bash
```bash
# Up to 10 observations between 120°W and 110°W, 40°N and 45°N from Jan 2018 formatted as GeoJSON
curl -G https://api.communitysnowobs.org/observations \
  -d bbox=-120,45,-110,40 \
  -d start_date=2018-01-01 \
  -d end_date=2018-01-31 \
  -d format=geojson \
  -d limit=10
```
