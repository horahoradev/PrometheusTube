#!/bin/bash
set -e -x -o pipefail

cd /tmp

  # http://wiki.webmproject.org/adaptive-streaming/instructions-to-playback-adaptive-webm-using-dash was used as a reference

# MP4Box -dash 4000 -frag 4000 -rap \
# -segment-name '$RepresentationID$_' -fps 30 \
# ${1}_360p.mp4#video:id=${1}_360p \
# ${1}_360p.mp4#video:id=${1}_720p \
# ${1}_audio.m4a#audio:id=${1}_128k:role=main \
# -out ${1}.mpd

packager \
  in=${1}_audio.m4a,stream=audio,output=${1}_audio.m4a \
  in=${1}_360p.mp4,stream=video,output=${1}_360p.mp4 \
  in=${1}_720p.mp4,stream=video,output=${1}_720p.mp4 \
  --mpd_output ${1}.mpd
