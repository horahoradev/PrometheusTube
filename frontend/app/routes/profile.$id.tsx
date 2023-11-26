import Categories from "app/components/categories";
import Pages from "app/components/pagination";
import Avatar from "@mui/material/Avatar";
import { Cog8ToothIcon } from "@heroicons/react/24/outline";

import loadable from "@loadable/component";
import { Navbar } from "app/components/navbar";
import { useApi } from "~/lib/oapi";
import { Users200Response } from "node_modules/promtube-backend";
import { useLoaderData, NavLink, useSearchParams } from "@remix-run/react";
import { json, redirect, createCookie } from "@remix-run/node";
import { Footer } from "~/components/footer";
import { parse } from "cookie-parse";
const VideocardList = loadable(() => import("app/components/videocard"), {
  ssr: false,
});

export async function loader({ request, params }) {
  const cookie = createCookie("jwt", {});
  const cook = request.headers.get("Cookie");
  const cookieExists = cookie.parse(cook) !== undefined;
  const showMature =
    (parse(request.headers.get("Cookie") ?? "").mature ?? "false") == "true";

  let api = useApi(true, process.env.nginx);
  let userData: Users200Response = await api.users(params.id, showMature);

  return {
    user: userData,
    banner: cookieExists,
    userAgent: request.headers.get("user-agent"),
  };
}

export default function Profile() {
  const { user, banner, userAgent } = useLoaderData<typeof loader>();
  return (
    <div>
      <Navbar userAgent={userAgent} displayAvatar={banner}></Navbar>
      <div className="bg-white-200 min-h-screen">
        <div className="px-6 w-full min-h-screen">
          <div className="flex justify-center">
            <div className="mt-4 flex-justify-center">
              <Avatar className="mx-auto" sx={{ width: 240, height: 240 }}>
                N
              </Avatar>
              <div className=" text-center text-special-heading-3">
                {user.username}
              </div>
              <div className="text-single-200 text-center">0 followers</div>
              <div className="text-single-200 text-center">
                {user.videos?.length} videos
              </div>
              <div className="flex justify-center">
                <button className="rounded-full p-3 border-cherry-red-200 text-cherry-red-200  border-2	">
                  Follow
                </button>
                <button className="rounded-full ml-1 p-3 border-cherry-red-200 text-cherry-red-200  border-2	">
                  <span className="float-left inline-block relative align-middle">
                    Edit Profile
                  </span>
                  <span className="inline-block relative align-middle ml-1">
                    <Cog8ToothIcon className="w-5 float-left	"></Cog8ToothIcon>
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* <Categories></Categories> */}
          <div className="mt-6">
            <VideocardList videos={user.videos}></VideocardList>
          </div>

          <span>
            <Pages numPages={user.paginationData?.numberOfItems / 50}></Pages>
          </span>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}
