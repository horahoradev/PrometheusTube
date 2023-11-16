import Categories from "app/components/categories";
import Pages from "app/components/pagination";
import VideocardList from "app/components/videocard";
import loadable from "@loadable/component";
import { Suspense } from "react";
import { Videos200Response } from "node_modules/promtube-backend";
import { useApi } from "~/lib/oapi";
import { json, redirect, createCookie } from "@remix-run/node";
import { Navbar } from "app/components/navbar";
import { useLoaderData, NavLink, useSearchParams } from "@remix-run/react";
import { jwtDecode } from "jwt-decode";
import { UserState } from "~/state";

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
  const categoryEncoded =  utf8Encode.encode(searchParams.get("category")) as unknown as string ?? utf8Encode.encode("undefined") as unknown as string;

  // let jwtParsed = jwtDecode(
  //   cook.protected + "." + cook.payload + "." + cook.signature
  // );

  // setLoggedIn(cookieExists);
  // setUserID(jwtParsed["uid"]);

  let api = useApi();
  let videoData = await api.videos(
    searchEncoded,
    searchParams.get("sortCategory") ?? undefined,
    searchParams.get("order") ?? "desc",
    "true",
    parseInt(searchParams.get("page") ?? "1"),
    categoryEncoded
  );

  return { videos: videoData };
}

export default function Home() {
  const { videos } = useLoaderData<typeof loader>();

  return (
    <div>
      <Navbar></Navbar>
      <div className="bg-white-200 h-screen">
        <div className="px-6 w-full min-h-[calc(100%-53px)] flex flex-col justify-between">
          <div>
            <Categories></Categories>
            <div className="mt-6">
              <VideocardList videos={videos.videos}></VideocardList>
            </div>
          </div>

          <span className="flex justify-center mb-2">
            <Pages></Pages>
          </span>
        </div>
      </div>
    </div>
  );
}
