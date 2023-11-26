#!/bin/sh
docker tag horahora-frontapi ghcr.io/horahoradev/prometheustube/front_api:master
docker push ghcr.io/horahoradev/prometheustube/front_api:master

docker tag horahora-videoservice ghcr.io/horahoradev/prometheustube/videoservice:master
docker push ghcr.io/horahoradev/prometheustube/videoservice:master

docker tag horahora-userservice ghcr.io/horahoradev/prometheustube/userservice:master
docker push ghcr.io/horahoradev/prometheustube/userservice:master

docker tag horahora-scheduler ghcr.io/horahoradev/prometheustube/scheduler:master
docker push ghcr.io/horahoradev/prometheustube/scheduler:master

docker tag horahora-postgres ghcr.io/horahoradev/prometheustube/postgres:master
docker push ghcr.io/horahoradev/prometheustube/postgres:master

docker tag horahora-horaminio ghcr.io/horahoradev/prometheustube/minio:master
docker push ghcr.io/horahoradev/prometheustube/minio:master

docker tag horahora-frontend ghcr.io/horahoradev/prometheustube/frontend:master
docker push ghcr.io/horahoradev/prometheustube/frontend:master
