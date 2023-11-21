import { NavLink, useSearchParams } from "@remix-run/react";
import { BellAlertIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import Avatar from "@mui/material/Avatar";
import Login from "app/components/login";
import Register from "app/components/register";
import Mature from "app/components/mature";
import Cookies from "js-cookie";
import Modal from "@mui/material/Modal";
import React from "react";
import { UserState } from "~/state";
import { useEffect, useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ChangePassword from "./changepassword";

export function Navbar({ displayAvatar, handleRefresh, mature, showSearch, setMature }) {
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const [open, setOpen] = React.useState(false);
  const [showAvatar, setShowAvatar] = React.useState(displayAvatar);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [openLogin, setOpenLogin] = React.useState(false);
  const handleOpenLogin = () => setOpenLogin(true);
  const handleCloseLogin = () => setOpenLogin(false);

  const [openReset, setOpenReset] = React.useState(false);
  const handleOpenReset = () => setOpenReset(true);
  const handleCloseReset = () => setOpenReset(false);

  const [openMature, setOpenMature] = React.useState(false);
  const handleOpenMature = () => setOpenMature(true);
  const handleCloseMature = () => setOpenMature(false);

  let [searchParams, setSearchParams] = useSearchParams();
  let loggedIn = UserState((state) => state.loggedIn);
  let uid = UserState((state) => state.UID);
  let admin = UserState((state) => state.admin);


  // menu nav stuff
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  let setLoggedIn = UserState((state) => state.setLoggedIn);
  let setUID = UserState((state) => state.setUID);
  let setAdmin = UserState((state) => state.setAdmin);

  function handleLogout() {
    setLoggedIn(false);
    setUID(null); // TODO clear the jwt cookie
    setAdmin(false);
  }

  return (
    <div className="flex justify-between bg-white-50 w-screen py-2 px-6">
      <div className="col-start-1 pt-1 self-start w-36">
        <NavLink
          className="text-cherry-red-100 font-extrabold text-text-single-400"
          to="/"
        >
          PrometheusTube
        </NavLink>
      </div>
      { showSearch ? <div className="inline-block w-96 flex justify-between">
        <input
          placeholder="Search"
          value={searchParams.get("search") ?? ""}
          className="w-[calc(100%-40px)] bg-white-300 rounded-full w-full pl-3 p-1 float-left"
          onChange={async (event) => {
            setSearchParams((prev) => {
              prev.set("search", event.currentTarget.value);
              return prev;
            });
          }}
        />
        <Cog6ToothIcon onClick={handleOpenMature} className="w-5 mt-1 ml-1"></Cog6ToothIcon>
        </div> : null }
      <div className="inline-block text-right w-36 ">
        {!loggedIn || !isHydrated ? (
          <span className="float-left">
            <span>
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
                <span className="float-left inline-block relative">
                  Register
                </span>
              </button>
            </span>
          </span>
        ) : (
          <span>
            <span className="w-5 inline-block relative align-middle">
              <BellAlertIcon className="w-5 text-cherry-red-100"></BellAlertIcon>
            </span>
            <span
              onClick={handleClick}
              className="w-5 inline-block relative align-middle ml-1"
            >
              <Avatar sx={{ width: 32, height: 32 }}>{uid}</Avatar>
            </span>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={openMenu}
              onClose={handleCloseMenu}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <NavLink to={"/profile/" + uid}>
                <MenuItem>Profile</MenuItem>
              </NavLink>
              <MenuItem onClick={handleOpenReset}>Reset Password</MenuItem>
              {admin ? <NavLink to={"/archive-requests/"}>
                <MenuItem>Archive requests</MenuItem>
              </NavLink>
              : null
              }
              {admin ? <NavLink to={"/video-downloads/"}>
                <MenuItem>Download approvals</MenuItem>
              </NavLink>
              : null
              }
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </span>
        )}
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Register setRegister={() => {
            setOpen();
            setShowAvatar(true);
          }}></Register>
      </Modal>
      <Modal
        open={openLogin}
        onClose={handleCloseLogin}
        aria-labelledby="modal-modal-login"
        aria-describedby="modal-modal-login"
      >
        <Login
          setLogin={() => {
            setOpenLogin();
            setShowAvatar(true);
          }}
        ></Login>
      </Modal>
      <Modal
        open={openMature}
        onClose={handleCloseMature}
        aria-labelledby="modal-modal-mature"
        aria-describedby="modal-modal-mature"
      >
        <Mature setMatureS={setMature} handleRefresh={handleRefresh} mature={mature} closeWindow={handleCloseMature}></Mature>
      </Modal>
      <Modal
        open={openReset}
        onClose={handleCloseReset}
        aria-labelledby="modal-modal-reset"
        aria-describedby="modal-modal-reset"
      >
        <ChangePassword handleClose={handleCloseReset}></ChangePassword>
      </Modal>
    </div>
  );
}
