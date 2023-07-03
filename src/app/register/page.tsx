"use client";
import { Box, Button, TextField, Typography } from "@mui/material";
import "./register.css";

const Register = () => {
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
        />
        <TextField
          label="Password"
          variant="outlined"
          className="w-full mt-6"
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
