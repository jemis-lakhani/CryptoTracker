import { Box, Button, TextField } from "@material-ui/core";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { CryptoState } from "../../CryptoContext";
import { auth } from "../../firebase";

const Login = ({ handleClose }) => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const { setalert } = CryptoState();

  const handleSubmit = async () => {
    if (!password || !email) {
      setalert({
        open: true,
        message: "Please Fill all the Feilds",
        type: "error",
      });
      return;
    }

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setalert({
        open: true,
        message: `Login  Succesfull. Welcome ${result.user.email}`,
        type: "success",
      });
      console.log(result);
      handleClose();
    } catch (error) {
      setalert({
        open: true,
        message: error.message,
        type: "error",
      });
      return;
    }
  };

  return (
    <Box
      p={3}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <TextField
        variant="outlined"
        type="email"
        label="Enter Email"
        value={email}
        onChange={(e) => setemail(e.target.value)}
        fullWidth
      />

      <TextField
        variant="outlined"
        type="password"
        label="Enter Password"
        value={password}
        onChange={(e) => setpassword(e.target.value)}
        fullWidth
      />

      <Button
        variant="contained"
        size="large"
        style={{
          backgroundColor: "#EEBC1D",
        }}
        onClick={handleSubmit}
      >
        Log In
      </Button>
    </Box>
  );
};

export default Login;
