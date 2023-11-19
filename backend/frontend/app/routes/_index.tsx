import Categories from "app/components/categories";
import Pages from "app/components/pagination";
import VideocardList from "app/components/videocard";
import loadable from "@loadable/component";
import { Suspense } from "react";
import { Videos200Response } from "node_modules/promtube-backend";
import { useApi } from "~/lib/oapi";
import { json, redirect, createCookie } from "@remix-run/node";
import { Navbar } from "app/components/navbar";
import { Footer } from "app/components/footer";

import { useLoaderData, NavLink, useSearchParams } from "@remix-run/react";
import { jwtDecode } from "jwt-decode";
import { UserState } from "~/state";
import {parse} from "cookie-parse";

export async function loader({ request }) {
  // let setUserID = UserState((state) => state.setUserID);
  // let setLoggedIn = UserState((state) => state.setLoggedIn);

  const searchParams = new URL(request.url).searchParams;
  const utf8Encode = new TextEncoder();
  const searchEncoded = utf8Encode.encode(
    searchParams.get("search") !== undefined &&
      searchParams.get("search")?.length > 0
      ? searchParams.get("search")
      : "none"
  ) as unknown as string;
  let encoded = searchParams.get("category") !== null ? searchParams.get("category") : "undefined";
  const categoryEncoded = utf8Encode.encode(encoded) as unknown as string;

  // let jwtParsed = jwtDecode(
  //   cook.protected + "." + cook.payload + "." + cook.signature
  // );

  // setLoggedIn(cookieExists);
  // setUserID(jwtParsed["uid"]);
  const cookie = createCookie("jwt", {});
  const mature = createCookie("mature", {});
  const cookieExists =
    (await cookie.parse(request.headers.get("Cookie"))) !== null;
  // wtf is with the builtin dogshit cookie api? what the hell, remix?
  const showMature = parse(request.headers.get("Cookie")).mature ?? false;
  console.log(showMature);
  let api = useApi();
  let videoData = await api.videos(
    showMature, // oh GOD
    searchEncoded,
    searchParams.get("sortCategory") ?? undefined,
    searchParams.get("order") ?? "desc",
    "true",
    parseInt(searchParams.get("page") ?? "1"),
    categoryEncoded
  );

  return { videos: videoData, banner: cookieExists };
}

export default function Home() {
  const { videos, banner } = useLoaderData<typeof loader>();

  return (
    <div>
      <Navbar displayAvatar={banner}></Navbar>
      <div className="bg-white-200 min-h-screen">
        <div className="px-6 w-full min-h-[calc(100%-53px)] flex flex-col justify-between">
          <div>
            <Categories></Categories>
            <div className="mt-6">
              <VideocardList videos={videos.videos}></VideocardList>
            </div>
          </div>

          <span className="flex justify-center mb-2">
            <Pages numPages={videos.paginationData?.numberOfItems / 50}></Pages>
          </span>
        </div>
      </div>
      <Footer displayAvatar={true}></Footer>
    </div>
  );
}
