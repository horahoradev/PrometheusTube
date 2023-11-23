import { NavLink } from "@remix-run/react";
import { BellAlertIcon } from "@heroicons/react/24/outline";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Stepper from "@mui/material/Stepper";
import { useApi } from "~/lib/oapi";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";
import React from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { UserState } from "~/state";
import TermsOfService from "./terms-of-service";
import PrivacyPolicy from "./privacy-policy";
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

const steps = ["Email validation", "Registration"];

export default function Register({ setRegister }) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [verification, setVerification] = React.useState(0);
  const [activeStep, setActiveStep] = React.useState(0);

  async function RegisterOne() {
    let api = useApi();
    await api.emailValidation(email);
    setActiveStep((v) => v + 1);
  }

  let setLoggedIn = UserState((state) => state.setLoggedIn);
  let setUID = UserState((state) => state.setUID);
  let setAdmin = UserState((state) => state.setAdmin);

  async function RegisterTwo() {
    let api = useApi();
    await api.register(username, password, email, verification);
    // TODO: NO!!!!!!!!!!!!!!!!!!!!!!!!! COPY PASTA ALERT
    const cook = Cookies.get("jwt");
    let jwtParsed = jwtDecode(cook, { header: true });
    let claims = jwtDecode(
      jwtParsed.protected + "." + jwtParsed.payload + "." + jwtParsed.signature
    );
    setLoggedIn(true);
    setUID(claims["uid"]);
    setAdmin(claims["admin"]);
    setRegister(false);
  }

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Box
      className="rounded-lg"
      component="form"
      sx={style}
      noValidate
      autoComplete="off"
    >
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: {
            optional?: React.ReactNode;
          } = {};

          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep == 0 ? (
        <div>
          <div className="text-heading-3 flex justify-around">Register</div>
          <div className="mt-4">
            <TextField
              className="w-full"
              required
              id="outlined-required"
              label="Email"
              size="small"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              onClick={RegisterOne}
            >
              Next
            </Button>
            <div>
              By clicking next, you agree to the{" "}
              <TermsOfService></TermsOfService> and{" "}
              <PrivacyPolicy></PrivacyPolicy>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="text-heading-3 flex justify-around">Register</div>
          <div className="mt-4">
            <TextField
              className="w-full"
              required
              id="outlined-required"
              label="Username"
              size="small"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mt-4">
            <TextField
              className="w-full"
              required
              id="outlined-required"
              label="Password"
              size="small"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mt-4">
            <TextField
              className="w-full"
              required
              id="outlined-required"
              label="Verification code"
              size="small"
              value={verification}
              onChange={(e) => setVerification(parseInt(e.target.value))}
            />
          </div>
          <div className="mt-4">
            <Button
              color="primary"
              className="text-single-100 w-full"
              variant="contained"
              onClick={RegisterTwo}
            >
              Register
            </Button>
          </div>
        </div>
      )}
    </Box>
  );
}
