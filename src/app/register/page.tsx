"use client";
import { Box, Button, TextField, Typography } from "@mui/material";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import UserService from "../client/UserService";
import DataValidator from "../shared/helpers/DataValidator";
import "./register.css";
import { LoadingButton } from "@mui/lab";

const Register = () => {
  const session = useSession();
  const router = useRouter();
  const userService = new UserService();
  const dataValidator = new DataValidator();
  const [username, setUsername] = useState("");
  const [usernameValidationError, setUsernameValidationError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordValidationError, setPasswordValidationError] = useState("");
  const [anyValidationErrors, setAnyValidationErrors] = useState(false);
  const [processingData, setProcessingData] = useState(false);

  useEffect(() => {
    if (session.status === "authenticated") {
      router.push("/");
    }
  }, [session.status]);

  useEffect(() => {
    if (usernameValidationError || passwordValidationError) {
      setAnyValidationErrors(true);
    } else {
      setAnyValidationErrors(false);
    }
  }, [usernameValidationError, passwordValidationError]);

  if (session.status === "loading" || session.status === "authenticated") {
    return <></>;
  }

  return (
    <Box className="register-page-wrapper flex justify-center items-center flex-col w-screen h-screen">
      <Box className="register-form-container rounded-2xl p-8 sm:p-12 flex flex-col items-center w-2/3 max-w-md">
        <Typography variant="h3" className="sm:text-4xl text-xl">
          Create your account
        </Typography>
        <TextField
          label="Username"
          variant="outlined"
          className="w-full mt-8 sm:mt-12"
          error={Boolean(usernameValidationError)}
          helperText={usernameValidationError}
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setUsernameValidationError(
              dataValidator.validateUsername(e.target.value).errorMsg
            );
          }}
        />
        <TextField
          label="Password"
          variant="outlined"
          className="w-full mt-6"
          error={Boolean(passwordValidationError)}
          helperText={passwordValidationError}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setPasswordValidationError(
              dataValidator.validatePassword(e.target.value).errorMsg
            );
          }}
        />
        <LoadingButton
          loading={processingData}
          variant="contained"
          className="w-36 mt-8"
          onClick={async () => {
            if (!anyValidationErrors) {
              setProcessingData(true);
              const registrationResult = await userService.register({
                username,
                password,
              });

              const result = await signIn("credentials", {
                redirect: false,
                username,
                password,
              });

              if (result?.ok) {
                router.push("/");
              } else {
                setProcessingData(false);
              }
            }
          }}
        >
          Sign Up
        </LoadingButton>
        <Typography className="mt-8">
          Already have an account? <span className="link">Login</span> instead
        </Typography>
      </Box>
    </Box>
  );
};

export default Register;
