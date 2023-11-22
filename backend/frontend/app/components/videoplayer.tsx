import React, { Suspense } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import Avatar from "@mui/material/Avatar";
import { HandThumbUpIcon, EyeIcon } from "@heroicons/react/24/outline";
import Comments from "app/components/comments";
import { NavLink } from "@remix-run/react";
import { VideoDetail200Response } from "node_modules/promtube-backend";
import { useApi } from "~/lib/oapi";
import moment from "moment";
import { UserState } from "~/state";
import { getSelectorsByUserAgent } from "react-device-detect";
export const VideoPlayer = ({
  options,
  onReady,
  videoInp,
  Cookie,
  comments,
  userAgent,
}) => {
  const { isMobile } = getSelectorsByUserAgent(userAgent);
  const videoRef = React.useRef(null);
  const playerRef = React.useRef(null);
  let video: VideoDetail200Response = videoInp;
  const [rating, setRating] = React.useState(video.rating);

  async function rateVideo() {
    // very dumb, FIXME
    if (rating != video.rating + 1) {
      let api = useApi();
      await api.upvoteVideo(video.videoID, 1, Cookie);
      setRating(video.rating + 1);
    }
  }

  React.useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
      const videoElement = document.createElement("video-js");

      // videoElement.classList.add("vjs-big-play-centered");
      videoElement.classList.add("vjs-16-9");
      videoRef.current.appendChild(videoElement);

      const player = (playerRef.current = videojs(videoElement, options, () => {
        videojs.log("player is ready");
        onReady && onReady(player);
      }));

      // You could update an existing player in the `else` block here
      // on prop change, for example:
    } else {
      const player = playerRef.current;

      player.autoplay(options.autoplay);
      player.src(options.sources);
    }
  }, [options, videoRef]);

  // Dispose the Video.js player when the functional component unmounts
  React.useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div data-vjs-player>
      <div className={isMobile ? "w-screen" : null} ref={videoRef} />
      {/* video controls */}
      <div className="bg-white-300 p-2">
        <span className="text-special-heading-4">{video.title}</span>
        <br></br>
        <div className="inline-block mt-3">
          <NavLink to={"/profile/" + video.authorID}>
            <div className="float-left inline-block">
              <Avatar sx={{ width: 60, height: 60 }}>N</Avatar>
            </div>
            {/* whatever nerd... (FIXME) */}
            <div className="inline-block align-middle my-3 ml-1">
              <div className="text-white-900 font-bold leading-3 text-text-single-400">
                {video.username}
              </div>
              <div className="text-white-800 text-text-single-200">
                0 followers
              </div>
            </div>
          </NavLink>
          <span className="ml-3 align-top">
            <button className="rounded-full p-3 border-cherry-red-200 text-cherry-red-200 border-2	">
              Follow
            </button>
          </span>
        </div>
        <br></br>
        <span className="align-center inline-block mt-3 text-text-single-300">
          <span className="cursor-pointer" onClick={rateVideo}>
            <HandThumbUpIcon className="w-4 inline-block relative align-middle" />
            <span className="align-middle ml-1">{rating}</span>
          </span>
          <EyeIcon className="ml-4 w-4 inline-block relative align-middle" />
          <span className="align-middle ml-1">{video.views}</span>
          {/* TODO */}
          <span className="ml-4">{"OtoMAD"}</span>
          <span className="ml-4">
            Uploaded {moment(video.uploadDate, "YYYY-MM-DDTh:mm:ssZ").fromNow()}
          </span>
        </span>
        <div className="mt-3">
          {video.tags?.map((item) => (
            <NavLink
              to={"/?search=" + item}
              className="mr-4 text-cherry-red-100"
            >
              {"#" + item}
            </NavLink>
          ))}
        </div>
      </div>
      <Comments
        commentsInp={comments}
        videoID={video.videoID}
        cookie={Cookie}
      ></Comments>
    </div>
  );
};

export default VideoPlayer;
