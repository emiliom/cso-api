gcloud beta functions deploy import --source ./gcloud-builds/import --runtime nodejs8 --trigger-topic import --entry-point __import --env-vars-file ./.env.yaml
gcloud beta functions deploy observations --source ./gcloud-builds/observations --runtime nodejs8 --trigger-http --env-vars-file ./.env.yaml
gcloud beta functions deploy snapshot --source ./gcloud-builds/snapshot --runtime nodejs8 --trigger-topic snapshot --env-vars-file ./.env.yaml

cd src/appengine
yarn run deploy
