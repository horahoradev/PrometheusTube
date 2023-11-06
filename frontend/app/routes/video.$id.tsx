import VideocardList from "app/components/videocard";
import Categories from "app/components/categories";
import Pages from "app/components/pagination";

import { Suspense } from "react";
import * as React from "react";
import { ClientOnly } from "remix-utils/client-only";

import loadable from "@loadable/component";

const VideoPlayer = loadable(() => import("app/components/videoplayer"), {
  ssr: false,
});

export default function Video() {
  const playerRef = React.useRef(null);

  const videoJsOptions = {
    autoplay: false,
    controls: true,
    sources: [
      {
        src: "//vjs.zencdn.net/v/oceans.mp4",
        type: "video/mp4",
      },
    ],
  };
  const handlePlayerReady = (player) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    //     player.on("waiting", () => {
    //       VideoPlayer.log("player is waiting");
    //     });

    //     player.on("dispose", () => {
    //       VideoPlayer.log("player will dispose");
    //     });
  };

  return (
    <div className="px-6 w-full h-screen">
      <Suspense>
        <VideoPlayer options={videoJsOptions} onReady={handlePlayerReady} />
      </Suspense>
    </div>
  );
}
