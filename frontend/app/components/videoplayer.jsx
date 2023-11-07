import React, { Suspense } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import Avatar from "@mui/material/Avatar";
import { HandThumbUpIcon, EyeIcon } from "@heroicons/react/24/outline";
import { Chip } from "@mui/material";
import { NavLink } from "@remix-run/react";
export const VideoPlayer = (props) => {
  const videoRef = React.useRef(null);
  const playerRef = React.useRef(null);
  const { options, onReady, videoID } = props;

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
      <Suspense>
        <div ref={videoRef} />
      </Suspense>
      {/* video controls */}
      <div className="bg-white-300 p-2">
        <span className="text-special-heading-4">Video Title</span>
        <br></br>
        <div className="inline-block mt-3">
          <div className="float-left inline-block">
            <Avatar sx={{ width: 60, height: 60 }}>N</Avatar>
          </div>
          {/* whatever nerd... (FIXME) */}
          <div className="inline-block align-middle my-3 ml-1">
            <div className="text-white-900 font-bold leading-3 text-text-single-400">
              Cocanut
            </div>
            {/* <br></br> */}
            <div className="text-white-800 text-text-single-200">
              967k followers
            </div>
          </div>
          <span className="ml-3 align-top">
            <button className="rounded-full p-3 border-cherry-red-200 text-cherry-red-200  border-2	">
              Follow
            </button>
          </span>
        </div>
        <br></br>
        <span className="align-center inline-block mt-3 text-text-single-300">
          <HandThumbUpIcon className="w-4 inline-block relative align-middle" />
          <span className="align-middle ml-1">0</span>
          <EyeIcon className="ml-4 w-4 inline-block relative align-middle" />
          <span className="align-middle ml-1">0</span>
          <span className="ml-4">Anime</span>
          <span className="ml-4">Uploaded 05/12/23</span>
        </span>
        <div className="mt-3">
          <NavLink to="/?search=Anime" className="text-cherry-red-100">
            #Anime
          </NavLink>
          <NavLink to="/?search=OtoMAD" className=" ml-2 text-cherry-red-100">
            #OtoMAD
          </NavLink>
          <NavLink to="/?search=gaming" className="ml-2 text-cherry-red-100">
            #gaming
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
