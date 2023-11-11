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

  const [openLogin, setOpenLogin] = React.useState(false);
  const handleOpenLogin = () => setOpenLogin(true);
  const handleCloseLogin = () => setOpenLogin(false);

  return (
    <div className="flex justify-between w-screen py-2 px-6">
      <div className="col-start-1 pt-1 self-start w-36">
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
      <div className="inline-block text-right w-36 ">
        <span className="float-left">
          <button
            onClick={handleOpenLogin}
            className="rounded-full py-1 px-2 border-cherry-red-200 text-cherry-red-200  border-2	"
          >
            <span className="float-left inline-block relative">Login</span>
          </button>
        </span>
        <span>
          <button
            onClick={handleOpen}
            className="rounded-full py-1 px-2 text-cherry-red-100	"
          >
            <span className="float-left inline-block relative">Register</span>
          </button>
        </span>
        {/* <span className="w-5 inline-block relative align-middle">
          <BellAlertIcon className="w-5 text-cherry-red-100"></BellAlertIcon>
        </span>
        <span
          onClick={handleOpen}
          className="w-5 inline-block relative align-middle ml-1"
        >
          <Avatar sx={{ width: 32, height: 32 }}>N</Avatar>
        </span> */}
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Register></Register>
      </Modal>
      <Modal
        open={openLogin}
        onClose={handleCloseLogin}
        aria-labelledby="modal-modal-login"
        aria-describedby="modal-modal-login"
      >
        <Login setLogin={setOpenLogin}></Login>
      </Modal>
    </div>
  );
}
