# syntax=docker/dockerfile:1.2

FROM alpine:3.14 as ffmpeg-builder
LABEL org.opencontainers.image.source=https://github.com/horahoradev/horahora

RUN apk add --update --no-cache wget
# RUN wget https://johnvansickle.com/ffmpeg/builds/ffmpeg-git-amd64-static.tar.xz
# TODO(ivan): Using my server temporarily because johnvansickle's site is very slow
RUN wget https://media.sq10.net/ffmpeg-git-amd64-static.tar.xz
RUN tar -xvf ffmpeg-git-amd64-static.tar.xz
RUN cd ffmpeg-git-*-amd64-static && cp ffmpeg /usr/local/bin/ffmpeg
RUN wget https://github.com/shaka-project/shaka-packager/releases/download/v2.6.1/packager-linux-x64 -O /usr/local/bin/packager
RUN chmod +x /usr/local/bin/packager

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

FROM golang:1.20.0-alpine as builder
LABEL org.opencontainers.image.source=https://github.com/horahoradev/horahora

WORKDIR /horahora/videoservice

RUN apk add --update --no-cache gcc musl-dev

# download modules
COPY go.mod /horahora/videoservice/
COPY go.sum /horahora/videoservice/

RUN go mod download

# build binary
COPY . /horahora/videoservice

RUN go build -o /videoservice.bin

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

FROM alpine:3.14 AS runtime
LABEL org.opencontainers.image.source=https://github.com/horahoradev/horahora

WORKDIR /horahora/videoservice

RUN apk add --update --no-cache bash ffmpeg

COPY --from=ffmpeg-builder /usr/local/bin/ffmpeg /usr/bin/ffmpeg
COPY --from=ffmpeg-builder /usr/local/bin/packager /usr/local/bin/packager

COPY --from=builder /videoservice.bin /videoservice.bin
COPY scripts/ /horahora/videoservice/scripts/

ENTRYPOINT ["/videoservice.bin"]
