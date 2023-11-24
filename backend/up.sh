#!/bin/bash
set -euo pipefail -x
# git submodule update --recursive

DOCKER_DEFAULT_PLATFORM=linux/amd64  DOCKER_BUILDKIT=1 COMPOSE_DOCKER_CLI_BUILD=1 docker build -f Dockerfile.template -t gen . && docker run -i -v $(pwd):/gen -t gen

# docker compose by default reads `.env` file
# so no need to pass it as an option
DOCKER_DEFAULT_PLATFORM=linux/amd64  DOCKER_BUILDKIT=1 COMPOSE_DOCKER_CLI_BUILD=1 docker compose build && \
docker compose up -d
