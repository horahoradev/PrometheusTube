# PrometheusTube

Steal fire (videos) from the Gods (other video sites)

This project is under very active development. Please join the discord for updates, and to help me guide this project's development.

https://discord.gg/hYG39hHMmE

Demo site: https://prometheus.tube

This project is currently pre-release; please wait a week or two while I make things easier to use.

## Usage Instructions (START HERE)

1. sudo ./up.sh (unless your user has been added to the docker group)
2. wait until completion, then visit http://localhost:3000

That's it for basic usage, and should work. If that doesn't work, bug me on Discord.

## Advanced Configuration

1. replace "localhost" in up.sh with the fully-qualified domain name of the server on which you're accessing the service (e.g. for me, it's prometheus.tube)
2. configure templates/env.j2 ORIGIN_FQDN appropriately (e.g. if you're using https, turn https on)
3. configure front_api/openapi/openapi.yaml servers.url with your origin FQDN, then regenerate (run from project root):

```
sudo docker run --rm -v $(pwd):/local openapitools/openapi-generator-cli generate -i /local/front_api/openapi/api.yaml --additional-properties=npmName=kirakirabackend,supportsES6=true    -g typescript     -o /local/frontend/packages/promtube-backend && sudo chown -R $USER: frontend/packages/promtube-backend && rm -r frontend/node_modules && cd frontend && npm install
```

that should do it.

Additionally, we currently use postmark for email verifications (should you choose to have user registrations). To make this work, you need to include a .secrets.env file with POSTMARK_API_TOKEN.

## Architecture

![](https://github.com/horahoradev/PrometheusTube/blob/main/promtube_backend.png?raw=true)
PrometheusTube's architecture is microservice-based. The main microservices are:

- `front_api`: which is the RESTful API to the rest of the services
- `userservice`: which does all authentication and handles user storage/permissions
- `videoservice`: which does all video storage, uploads to the origin (e.g. s3/backblaze), queries, transcoding, etc
- `scheduler`: which handles content archival requests and downloads
- `gorse`: which handles recommendations
  Communication between userservice, videoservice, and scheduler is GRPC-based.

Postgresql is used as the database for each service, but Redis is also used for very specific purposes (e.g. distributed locking). Elasticsearch is mirrored from the videodb, and used for video search queries. Schema migrations can be found within the "migrations" directory within each service. As an example, [here's the migrations directory for Videoservice](https://github.com/KIRAKIRA-DOUGA/KIRAKIRA-golang-backend/tree/master/video_service/migrations). Migrations are applied by the relevant services themselves using Goose, a library.

Since microservices communicate via GRPC, the API for each service is defined by the domain specific proto3 language. [Here's an example.](https://github.com/KIRAKIRA-DOUGA/KIRAKIRA-golang-backend/blob/master/video_service/protocol/videoservice.proto) This file in particular defines the API for videoservice, which other services will use to invoke videoservice's functionality. We use this file to generate interface and struct definitions in Golang (our target language), and then implement every method. GRPC implementations for videoservice can be found here: https://github.com/KIRAKIRA-DOUGA/KIRAKIRA-golang-backend/blob/master/video_service/internal/grpcserver/grpc.go. [Here's a minimal method implementation example](https://github.com/KIRAKIRA-DOUGA/KIRAKIRA-golang-backend/blob/master/video_service/internal/grpcserver/grpc.go#L587), which rates videos: the implementation simply calls the AddRatingToVideoID method from the videos model (which is really more like an example of the repository pattern) with the supplied GRPC arguments, and returns a response.

## Useful Commands

```
sudo docker run --rm -v $(pwd):/local openapitools/openapi-generator-cli generate -i /local/front_api/openapi/api.yaml --additional-properties=npmName=kirakirabackend,supportsES6=true    -g typescript     -o /local/frontend/packages/promtube-backend && sudo chown -R $USER: frontend/packages/promtube-backend && rm -r frontend/node_modules && cd frontend && npm install
```

`git checkout HEAD -- packages/kirakira-backend/tsconfig.json packages/kirakira-backend/configuration.ts packages/kirakira-backend/servers.ts packages/kirakira-backend/http/isomorphic-fetch.ts`
