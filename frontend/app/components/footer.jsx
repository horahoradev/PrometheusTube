import { NavLink, useSearchParams } from "@remix-run/react";
import { BellAlertIcon } from "@heroicons/react/24/outline";
import Avatar from "@mui/material/Avatar";
import Login from "app/components/login";
import Register from "app/components/register";

import Modal from "@mui/material/Modal";
import React from "react";
import { UserState } from "~/state";
import { useEffect, useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ChangePassword from "./changepassword";
import Discord from "app/components/discord";
import TermsOfService from "./terms-of-service";
import PrivacyPolicy from "./privacy-policy";

export function Footer() {
  return (
    <div className="mt-2 flex justify-between bg-white-50 w-screen py-2 px-10  ">
      <TermsOfService></TermsOfService>
      <PrivacyPolicy></PrivacyPolicy>
      <Discord></Discord>
    </div>
  );
}
