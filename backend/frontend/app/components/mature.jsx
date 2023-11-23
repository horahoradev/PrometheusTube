import { NavLink } from "@remix-run/react";
import { BellAlertIcon } from "@heroicons/react/24/outline";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useApi } from "~/lib/oapi";
import React from "react";
import Cookies from "js-cookie";
import { UserState } from "~/state";
import { jwtDecode } from "jwt-decode";
import { json, redirect, createCookie } from "@remix-run/node";
import { Checkbox } from "@mui/material";

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

export default function Mature({ closeWindow, handleRefresh, mature, setMatureS}) {
  let setMature = (e)=> Cookies.set('mature',  e);
  return (
    <Box
      className="rounded-lg"
      component="form"
      sx={style}
      noValidate
      autoComplete="off"
    >
      <div className="text-heading-3 flex justify-around">Settings</div>
      <div>
        <div className="mt-4">
        <FormControlLabel control={<Checkbox onChange={(e)=>{
          setMature(e.target.checked);
          setMatureS(e.target.checked);
          handleRefresh();
        }
        }/>
      } checked={mature} label="I certify that I am over the age of 18 and wish to see NSFW content"/>
        </div>
      </div>
    </Box>
  );
}
