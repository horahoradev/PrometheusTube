#!/bin/bash
set -euo pipefail -x
touch .secrets.env

DOCKER_DEFAULT_PLATFORM=linux/amd64  DOCKER_BUILDKIT=1 COMPOSE_DOCKER_CLI_BUILD=1 docker build -f Dockerfile.template -t gen . && docker run -v $(pwd):/gen -t gen localhost

# docker compose by default reads `.env` file
# so no need to pass it as an option
DOCKER_DEFAULT_PLATFORM=linux/amd64  DOCKER_BUILDKIT=1 COMPOSE_DOCKER_CLI_BUILD=1 docker compose build && \
docker compose up -d
