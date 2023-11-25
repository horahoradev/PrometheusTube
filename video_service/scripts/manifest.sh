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
  in=${1}_audio.m4a,stream=audio,output=${1}_audio.m4a,playlist_name=${1}_audio.m3u8 \
  in=${1}_360p.mp4,stream=video,output=${1}_360p.mp4,playlist_name=${1}_video_360p.m3u8 \
  in=${1}_720p.mp4,stream=video,output=${1}_720p.mp4,playlist_name=${1}_video_720p.m3u8 \
  --hls_master_playlist_output ${1}.mpd
  # so i know it's not an mpd but i have a hard dependency on this file extension LOL
