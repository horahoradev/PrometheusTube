import { NavLink } from "@remix-run/react";
import { BellAlertIcon } from "@heroicons/react/24/outline";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import { useApi } from "~/lib/oapi";
import React from "react";
import Cookies from "js-cookie";
import { UserState } from "~/state";
import { jwtDecode } from "jwt-decode";
import { json, redirect, createCookie } from "@remix-run/node";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 3,
};

export default function Mature({ closeWindow, handleRefresh}) {
  let setMature = (e)=> Cookies.set('mature',  e);

  return (
    <Box
      className="rounded-lg"
      component="form"
      sx={style}
      noValidate
      autoComplete="off"
    >
      <div className="text-heading-3 flex justify-around">Are you over the age of 18?</div>
      <div>The answer to this question determines whether NSFW content will be visible to you </div>
      <div>
        <div className="mt-4">
        <Button
          color="primary"
          className="text-single-100 w-full"
          variant="contained"
          onClick={() => {
            setMature(true);
            closeWindow();
            handleRefresh();
          }}
        >
          Yes, I am over age 18
        </Button>
        </div>
        <div className="mt-4">
        <Button
          color="secondary"
          className="text-single-100 w-full"
          variant="contained"
          onClick={() => {
            setMature(false);
            closeWindow();
            handleRefresh();
        }}
        >
          No, I am not over 18, but I am at least age 13, OR I am at least 18, but do not wish to see NSFW content.
        </Button>

        <div className="mt-4 mb-4">
          <NavLink to="https://www.roblox.com/">
            <Button
            color="secondary"
            className="text-single-100 w-full mt-4"
            variant="contained"
          >
            I am not at least age 13
          </Button>
        </NavLink>
        </div>
        </div>
      </div>
    </Box>
  );
}
