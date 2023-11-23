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

export default function ChangePassword({handleClose}) {
  let setLoggedIn = UserState((state) => state.setLoggedIn);
  let setUID = UserState((state) => state.setUID);
  let setAdmin = UserState((state) => state.setAdmin);


  const [oldPassword, setOldPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");

  async function changePassword() {
    let api = useApi();
    await api.resetPassword(oldPassword, newPassword, Cookies.get("jwt"));
    handleClose();
  }

  return (
    <Box
      className="rounded-lg"
      component="form"
      sx={style}
      noValidate
      autoComplete="off"
    >
      <div className="text-heading-3 flex justify-around">Reset password</div>
      <div className="mt-4">
        <TextField
          className="w-full"
          required
          id="outlined-required"
          label="Current password"
          size="small"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
      </div>
      <div className="mt-4">
        <TextField
          className="w-full"
          required
          id="outlined-required"
          label="New password"
          size="small"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      <div>
        <Button
          color="primary"
          className="text-single-100 w-full"
          variant="contained"
          onClick={changePassword}
        >
          Login
        </Button>
      </div>
    </Box>
  );
}
