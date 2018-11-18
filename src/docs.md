# Community Snow Observations API Docs

Functions running CSO's serverless [API](https://api.communitysnowobs.org/obs)

## Parameters

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

response = requests.get("http://api.communitysnowobs.org/obs", params=params)
print(response.content)
```

### Matlab
```matlab
% Up to 10 observations between 120°W and 110°W, 40°N and 45°N from Jan 2018 formatted as GeoJSON
data = urlread('https://api.communitysnowobs.org/obs', 'Get', {
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
curl -G https://api.communitysnowobs.org/obs \
  -d bbox=-120,45,-110,40 \
  -d start_date=2018-01-01 \
  -d end_date=2018-01-31 \
  -d format=geojson \
  -d limit=10
```
