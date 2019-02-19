# API Docs (V1)

Functions running CSO's serverless [API](https://api.communitysnowobs.org/observations)

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
