#!/bin/bash

set -euo pipefail

docker run --network host --rm -v $(pwd)/video_service/migrations:/flyway/sql flyway/flyway:7.9.1 -url=jdbc:postgresql://localhost:5432/videoservice -user=admin -password=password migrate
docker run --network host --rm -v $(pwd)/user_service/migrations:/flyway/sql flyway/flyway:7.9.1 -url=jdbc:postgresql://localhost:5432/userservice -user=admin -password=password migrate
docker run --network host --rm -v $(pwd)/scheduler/migrations:/flyway/sql flyway/flyway:7.9.1 -url=jdbc:postgresql://localhost:5432/scheduler -user=admin -password=password migrate