ncc build src/observations/index.js -o builds/observations
ncc build src/snapshot -o builds/snapshot
ncc build src/import/index.js -o builds/import

cd builds/observations
zip index index.js

cd ../snapshot
zip index index.js

cd ../import
zip index index.js
