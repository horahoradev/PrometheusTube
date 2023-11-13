import VideocardList from "app/components/videocard";
import Categories from "app/components/categories";
import Pages from "app/components/pagination";
import RecommendationsList from "app/components/recommendationslist";
import { json, redirect, createCookie } from "@remix-run/node";

import { Suspense } from "react";
import * as React from "react";
import { ClientOnly } from "remix-utils/client-only";

import { useApi } from "~/lib/oapi";
import { useLoaderData, NavLink, useSearchParams } from "@remix-run/react";

import loadable from "@loadable/component";
import { VideoDetail200Response } from "node_modules/promtube-backend";
import { Navbar } from "app/components/navbar";

const VideoPlayer = loadable(() => import("app/components/videoplayer"), {
  ssr: false,
});

export async function loader({ request, params }: LoaderFunctionArgs) {
  let api = useApi();
  var detail = await api.videoDetail(params.id);
  const cookie = createCookie("jwt", {});
  const cookieExists =
    (await cookie.parse(request.headers.get("Cookie"))) !== null;
  return {
    video: detail,
    banner: cookieExists,
  };
}

export default function Video() {
  const { video, banner } = useLoaderData<typeof loader>();

  const playerRef = React.useRef(null);

  const videoJsOptions = {
    autoplay: false,
    controls: true,
    sources: [
      {
        src: video.mPDLoc,
        type: "application/dash+xml",
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
    <div>
      <Navbar displayAvatar={banner}></Navbar>
      <div className="bg-white-200 h-screen">
        <div className="px-6 w-full h-screen inline-block flex justify-between">
          <div className="w-[calc(100%-20rem)] mt-3 float-left">
            <VideoPlayer
              video={video}
              options={videoJsOptions}
              onReady={handlePlayerReady}
            />
          </div>
          <div className="inline-block relative float-left">
            <RecommendationsList></RecommendationsList>
          </div>
        </div>
      </div>
    </div>
  );
}
