import { NavLink } from "@remix-run/react";
import { BellAlertIcon } from "@heroicons/react/24/outline";
import Avatar from "@mui/material/Avatar";
import {
  HandThumbUpIcon,
  HandThumbDownIcon,
} from "@heroicons/react/24/outline";

export default function Comments() {
  return (
    <div className="mt-4">
      <div className="text-text-single-400">37 replies</div>
      <div className="mt-4">
        <Avatar className="float-left" sx={{ width: 50, height: 50 }}>
          N
        </Avatar>
        <div className="ml-2 mt-3 align-middle inline-block text-white-700">
          Add a reply...
        </div>
      </div>
      <br></br>
      <hr className="border-cherry-red-200 my-3"></hr>
      <div className="w-full h-24">
        <Avatar className="float-left" sx={{ width: 50, height: 50 }}>
          N
        </Avatar>
        {/* used a very funny trick by setting and overriding the font size to achieve text alignment */}
        <div className="text-text-single-300 inline-block ml-2 float-left text-bottom leading-5">
          <div className=" text-white-900 font-bold text-bottom float-left text-bottom">
            Cocanut
          </div>
          <div className="inline-block text-white-800 ml-2 text-text-single-200 text-bottom font-normal">
            4 hours ago
          </div>
          <div className="leading-5 text-text-single-200 font-normal">
            Here's my comment: FUCK YOU
          </div>
          <div className="font-sans text-white-700">
            <HandThumbUpIcon className="w-4 inline-block relative align-middle" />
            <span className="align-middle ml-1">0</span>
            <HandThumbDownIcon className="ml-2 w-4 inline-block relative align-middle" />
            <span className="align-middle ml-1">3</span>
          </div>
        </div>
      </div>
      <div className="w-full h-24">
        <Avatar className="float-left" sx={{ width: 50, height: 50 }}>
          N
        </Avatar>
        {/* used a very funny trick by setting and overriding the font size to achieve text alignment */}
        <div className="text-text-single-300 inline-block ml-2 float-left text-bottom leading-5">
          <div className=" text-white-900 font-bold text-bottom float-left text-bottom">
            Hauss
          </div>
          <div className="inline-block text-white-800 ml-2 text-text-single-200 text-bottom font-normal">
            4 hours ago
          </div>
          <div className="leading-5 text-text-single-200 font-normal">
            any redditfurs?
          </div>
          <div className="font-sans text-white-700">
            <HandThumbUpIcon className="w-4 inline-block relative align-middle" />
            <span className="align-middle ml-1">1</span>
            <HandThumbDownIcon className="ml-2 w-4 inline-block relative align-middle" />
            <span className="align-middle ml-1">0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
