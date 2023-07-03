"use client";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import DataValidator from "../shared/helpers/DataValidator";
import "./register.css";

const Register = () => {
  const dataValidator = new DataValidator();
  const [username, setUsername] = useState("");
  const [usernameValidationError, setUsernameValidationError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordValidationError, setPasswordValidationError] = useState("");

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
        <Button variant="contained" className="w-36 mt-8">
          Sign Up
        </Button>
        <Typography className="mt-8">
          Already have an account? <span className="link">Login</span> instead
        </Typography>
      </Box>
    </Box>
  );
};

export default Register;
