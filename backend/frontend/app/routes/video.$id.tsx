import VideocardList from "app/components/videocard";
import Categories from "app/components/categories";
import Pages from "app/components/pagination";
import RecommendationsList from "app/components/recommendationslist";
import { json, redirect, createCookie } from "@remix-run/node";

import { Suspense } from "react";
import * as React from "react";
import { ClientOnly } from "remix-utils/client-only";
import Cookies from "js-cookie";
import { getSelectorsByUserAgent } from "react-device-detect";
import { useApi } from "~/lib/oapi";
import { useLoaderData, NavLink, useSearchParams } from "@remix-run/react";
import { parse } from "cookie-parse";
import { useState, useEffect } from "react";
import loadable from "@loadable/component";
import { VideoDetail200Response } from "node_modules/promtube-backend";
import { Navbar } from "app/components/navbar";
import { Footer } from "~/components/footer";
import { MetaFunction } from "@remix-run/node";
import { UserState } from "~/state";
import { Button } from "@mui/material";
const VideoPlayer = loadable(() => import("app/components/videoplayer"), {
  ssr: false,
});

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data.video.title },
    { description: data.video.videoDescription },
    { "twitter:card": "summary_large_image" },
    { "og:description": data.video.videoDescription },
    { "og:image": data.video.thumbnail },
    { "og:title": data.video.title },
  ];
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  let api = useApi();
  var detail = await api.videoDetail(params.id);
  const showMature =
    (parse(request.headers.get("Cookie") ?? "").mature ?? "false") == "true";
  var recommendations = await api.recommendations(
    params.id,
    showMature,
    request.headers.get("Cookie")
  );

  const cookie = createCookie("jwt", {});
  const cookieExists =
    (await cookie.parse(request.headers.get("Cookie"))) !== null;

  let comments = await api.comments(params.id);

  return {
    video: detail,
    banner: cookieExists,
    recommendations: recommendations,
    cookie: request.headers.get("Cookie"),
    comments: comments,
    userAgent: request.headers.get("user-agent"),
  };
}

export default function Video() {
  let admin = UserState((state) => state.admin);
  const { video, banner, recommendations, cookie, comments, userAgent } =
    useLoaderData<typeof loader>();
  let api = useApi();
  const { isMobile } = getSelectorsByUserAgent(userAgent);

  // oh great heavens
  // why is there no better way to do this LMAO
  const showMature = (Cookies.get("mature") ?? "false") == "true";
  console.log(showMature);

  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    setIsHydrated(true);
  }, []);

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

  if (isHydrated && video.isMature && !showMature) {
    return (
      <div>
        This video is for mature audiences only, bucko. Change your content
        visibility settings if you're over 18.
      </div>
    );
  }

  return (
    <div>
      <Navbar userAgent={userAgent} displayAvatar={banner}></Navbar>
      <div className=" min-h-screen">
        <div
          className={
            isMobile
              ? "w-full min-h-screen inline-block "
              : "px-6 w-full min-h-screen inline-block flex justify-between"
          }
        >
          <div
            className={
              isMobile
                ? "w-screen mt-3"
                : "w-[calc(100%-20rem)] mt-3 float-left"
            }
          >
            <VideoPlayer
              videoInp={video}
              options={videoJsOptions}
              onReady={handlePlayerReady}
              Cookie={cookie}
              comments={comments}
              userAgent={userAgent}
            />
          </div>
          <div className={isMobile ? "" : "inline-block relative float-left"}>
            <RecommendationsList videos={recommendations}></RecommendationsList>
          </div>
        </div>
        {isHydrated && admin ? (
          <div>
            <div className="mt-4">
              <Button
                color="primary"
                className="text-single-100 w-full"
                variant="contained"
                onClick={() => api.approveVideo(video.videoID, true)}
              >
                Approve, mature content
              </Button>
            </div>
            <div className="mt-4">
              <Button
                color="primary"
                className="text-single-100 w-full"
                variant="contained"
                onClick={() => api.approveVideo(video.videoID, false)}
              >
                Approve, suitable for ages under 18
              </Button>
            </div>
          </div>
        ) : null}
      </div>
      <Footer displayAvatar={true}></Footer>
    </div>
  );
}
