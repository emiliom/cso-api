ncc build src/observations/__aws.js -o aws-builds/observations
ncc build src/snapshot/__aws.js -o aws-builds/snapshot
ncc build src/import/__aws.js -o aws-builds/import

cd aws-builds/observations
zip index index.js

cd ../snapshot
zip index index.js

cd ../import
zip index index.js
