#!/bin/sh
docker tag prometheustube-frontapi ghcr.io/horahoradev/prometheustube/front_api:master
docker push ghcr.io/horahoradev/prometheustube/front_api:master

docker tag prometheustube-videoservice ghcr.io/horahoradev/prometheustube/videoservice:master
docker push ghcr.io/horahoradev/prometheustube/videoservice:master

docker tag prometheustube-userservice ghcr.io/horahoradev/prometheustube/userservice:master
docker push ghcr.io/horahoradev/prometheustube/userservice:master

docker tag prometheustube-scheduler ghcr.io/horahoradev/prometheustube/scheduler:master
docker push ghcr.io/horahoradev/prometheustube/scheduler:master

docker tag prometheustube-postgres ghcr.io/horahoradev/prometheustube/postgres:master
docker push ghcr.io/horahoradev/prometheustube/postgres:master

docker tag prometheustube-horaminio ghcr.io/horahoradev/prometheustube/minio:master
docker push ghcr.io/horahoradev/prometheustube/minio:master

docker tag prometheustube-frontend ghcr.io/horahoradev/prometheustube/frontend:master
docker push ghcr.io/horahoradev/prometheustube/frontend:master
