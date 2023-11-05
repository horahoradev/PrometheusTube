import { NavLink } from "@remix-run/react";
import { BellAlertIcon } from "@heroicons/react/24/outline";
import Avatar from "@mui/material/Avatar";

export function Navbar() {
  return (
    <div className="grid grid-cols-8 w-screen py-2 px-5">
      <div className="col-start-1 pt-1">
        <NavLink className="text-cherry-red-100 font-bold" to="/">
          PrometheusTube
        </NavLink>
      </div>
      <div className="col-start-4 col-end-6">
        <input
          placeholder="Search"
          className="w-full bg-white-300 rounded-full pl-3 p-1"
          type="text"
        />
      </div>
      <div className="col-start-8 inline-block text-right mr-5 ">
        <span className="w-5 inline-block relative align-middle">
          <BellAlertIcon className="w-5 text-cherry-red-100"></BellAlertIcon>
        </span>
        <span className="w-5 inline-block relative align-middle ml-1">
          <Avatar sx={{ width: 32, height: 32 }}>N</Avatar>
        </span>
      </div>
    </div>
  );
}
