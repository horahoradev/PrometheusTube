import { NavLink } from "@remix-run/react";
import { BellAlertIcon } from "@heroicons/react/24/outline";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";

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

export default function Register() {
  return (
    <Box
      className="rounded-lg"
      component="form"
      sx={style}
      noValidate
      autoComplete="off"
    >
      <div className="text-heading-3 flex justify-around">Register</div>
      <div className="mt-4">
        <TextField
          className="w-full"
          required
          id="outlined-required"
          label="Username"
          size="small"
        />
      </div>
      <div className="mt-4">
        <TextField
          className="w-full"
          required
          id="outlined-required"
          label="Email"
          size="small"
        />
      </div>
      <div className="mt-4">
        <TextField
          className="w-full"
          required
          id="outlined-required"
          label="Password"
          size="small"
        />
      </div>
      <div className="flex justify-around items-center my-2 mx-0">
        <span>
          Already have an account?
          <a className="underline text-primary-blue-400 ml-1">Log in</a>
        </span>
      </div>
      <div>
        <Button
          color="primary"
          className="text-single-100 w-full"
          variant="contained"
        >
          Login
        </Button>
      </div>
    </Box>
  );
}
