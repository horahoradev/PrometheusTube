# kirakira-backend

Kirakira's backend, written in Go, adapted from https://github.com/horahoradev/horahora

The architecture is microservice-based (a holdover from a time when I had a more romantic view of microservices). Requests first hit front_api, which defines the RESTful API using OpenAPI, which makes the relevant remote procedure call(s) to other services, and returns the correct response. Inter-service communication is handled via GRPC.

## Architecture

![](https://github.com/KIRAKIRA-DOUGA/KIRAKIRA-golang-backend/blob/master/KIRAKIRA_backend.png?raw=true)
KIRAKIRA's architecture is microservice-based. The main microservices are:

- `front_api`: which is the RESTful API to the rest of the services
- `userservice`: which does all authentication and handles user storage/permissions
- `videoservice`: which does all video storage, uploads to the origin (e.g. s3/backblaze), queries, transcoding, etc
- `scheduler`: which handles content archival requests and downloads
- `gorse`: which handles recommendations
  Communication between userservice, videoservice, and scheduler is GRPC-based.

Postgresql is used as the database for each service, but Redis is also used for very specific purposes (e.g. distributed locking). Elasticsearch is mirrored from the videodb, and used for video search queries. Schema migrations can be found within the "migrations" directory within each service. As an example, [here's the migrations directory for Videoservice](https://github.com/KIRAKIRA-DOUGA/KIRAKIRA-golang-backend/tree/master/video_service/migrations). Migrations are applied by the relevant services themselves using Goose, a library.

Since microservices communicate via GRPC, the API for each service is defined by the domain specific proto3 language. [Here's an example.](https://github.com/KIRAKIRA-DOUGA/KIRAKIRA-golang-backend/blob/master/video_service/protocol/videoservice.proto) This file in particular defines the API for videoservice, which other services will use to invoke videoservice's functionality. We use this file to generate interface and struct definitions in Golang (our target language), and then implement every method. GRPC implementations for videoservice can be found here: https://github.com/KIRAKIRA-DOUGA/KIRAKIRA-golang-backend/blob/master/video_service/internal/grpcserver/grpc.go. [Here's a minimal method implementation example](https://github.com/KIRAKIRA-DOUGA/KIRAKIRA-golang-backend/blob/master/video_service/internal/grpcserver/grpc.go#L587), which rates videos: the implementation simply calls the AddRatingToVideoID method from the videos model (which is really more like an example of the repository pattern) with the supplied GRPC arguments, and returns a response.

## Usage Instructions (START HERE)

Warning: parts of this backend are esoteric, and reflect the structure of my brain. Be warned...

1. git submodule update --recursive --init
2. cd KIRAKIRA-Cerasus && npm install (i will fix this lmao)
3. sudo ./up.sh (unless your user has been added to the docker group)
   1. respond to requests for input (answer "localhost")
4. Bring up the frontent with npm run dev, point it at http://localhost:9000, then visit https://localhost:3000

That's it for basic usage, and should work. If that doesn't work, bug me on Discord.

## Useful Commands\

`sudo docker run --rm -v $(pwd):/local openapitools/openapi-generator-cli generate -i /local/backend/front_api/openapi/api.yaml --additional-properties=npmName=kirakirabackend,supportsES6=true    -g typescript     -o /local/frontend/packages/promtube-backend && sudo chown -R $USER: frontend/packages/promtube-backend && rm -r frontend/node_modules && cd frontend && npm install`

`git checkout HEAD -- packages/kirakira-backend/tsconfig.json packages/kirakira-backend/configuration.ts packages/kirakira-backend/servers.ts packages/kirakira-backend/http/isomorphic-fetch.ts`
