import Categories from "app/components/categories";
import Pages from "app/components/pagination";
import Avatar from "@mui/material/Avatar";
import { Cog8ToothIcon } from "@heroicons/react/24/outline";

import loadable from "@loadable/component";

const VideocardList = loadable(() => import("app/components/videocard"), {
  ssr: false,
});

export default function Profile() {
  return (
    <div className="px-6 w-full h-screen">
      <div className="flex justify-center">
        <div className="mt-4">
          <Avatar sx={{ width: 240, height: 240 }}>N</Avatar>
          <div className=" text-center text-special-heading-3">Cocanut</div>
          <div className="text-single-200 text-center">967k followers</div>
          <div className="text-single-200 text-center">12 videos</div>
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

      <Categories></Categories>
      <div className="mt-6">
        <VideocardList></VideocardList>
      </div>

      <span>
        <Pages></Pages>
      </span>
    </div>
  );
}
