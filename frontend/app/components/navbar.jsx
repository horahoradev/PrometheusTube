import { NavLink } from "@remix-run/react";
import { BellAlertIcon } from "@heroicons/react/24/outline";
import Avatar from "@mui/material/Avatar";
import Login from "app/components/login";
import Register from "app/components/register";

import Modal from "@mui/material/Modal";
import React from "react";

export function Navbar() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div className="flex justify-between w-screen py-2 px-6">
      <div className="col-start-1 pt-1 self-start w-24">
        <NavLink
          className="text-cherry-red-100 font-extrabold text-text-single-400"
          to="/"
        >
          PrometheusTube
        </NavLink>
      </div>
      <div className="inline-block w-96">
        <input
          placeholder="Search"
          className="w-full bg-white-300 rounded-full w-full pl-3 p-1"
          type="text"
        />
      </div>
      <div className="col-start-8 inline-block text-right mr-5 w-24 ">
        <span className="w-5 inline-block relative align-middle">
          <BellAlertIcon className="w-5 text-cherry-red-100"></BellAlertIcon>
        </span>
        <span
          onClick={handleOpen}
          className="w-5 inline-block relative align-middle ml-1"
        >
          <Avatar sx={{ width: 32, height: 32 }}>N</Avatar>
        </span>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Register></Register>
      </Modal>
    </div>
  );
}
