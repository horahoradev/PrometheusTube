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

export default function Mature({ closeWindow }) {
  let setMature = UserState((state) => state.setMature);

  return (
    <Box
      className="rounded-lg"
      component="form"
      sx={style}
      noValidate
      autoComplete="off"
    >
      <div className="text-heading-3 flex justify-around">Are you over the age of 18, and do you want to see NSFW content?</div>
      <div>
        <div className="mt-4">
        <Button
          color="primary"
          className="text-single-100 w-full"
          variant="contained"
          onClick={() => {
            setMature(true);
            closeWindow();
          }}
        >
          Yes, I am over 18, and I wish to see NSFW content
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
        }}
        >
          No, I am not over 18, or do not wish to see NSFW content
        </Button>
        </div>
      </div>
    </Box>
  );
}
