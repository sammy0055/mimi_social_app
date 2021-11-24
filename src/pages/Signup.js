import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "../styles/Login.css";
import axios from "../components/axios";
import sackboy from "../assets/sackboy.png";

import { useRedux } from "../redux/Redux";

import {
  TextField,
  Typography,
  Button,
  CircularProgress,
} from "@material-ui/core";

function Signup() {
  const [email, setEmail] = useState("");
  const [handle, setHandle] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState();
  const [error, setError] = useState();

  const [state, dispatch] = useRedux();

  const history = useHistory();
  const handleSubmit = (e) => {
    setLoading(!loading);
    e.preventDefault();
    const userData = {
      email: email,
      password: password,
      confirmPassword: confirmPassword,
      handle: handle,
    };
    axios
      .post("/auth", userData)
      .then((res) => {
        setToken(res.data.token);
        dispatch({ type: "Add token", value: res.data.token });
        axios.defaults.headers.common["Authorization"] = token;
        setLoading(false);
        history.push("/");
      })
      .catch((err) => {
        setLoading(false);
        setError(err.response.data);
        console.log(err.response.data);
      });
  };
  console.log("ddddd", token);
  return (
    <div className="Lcontainer">
      <div className="Lcont">
        <img src={sackboy} alt="available shotly" />
        <Typography variant="h3">Sign-Up</Typography>
        <form onSubmit={handleSubmit} className="FormCont">
          <TextField
            id="userHandle"
            label="userHandle"
            name="userHandle"
            helperText={error?.handle}
            error={error?.handle ? true : false}
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
          />
          <TextField
            id="email"
            label="email"
            name="email"
            helperText={error?.email}
            error={error?.email ? true : false}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            id="password"
            label="password"
            name="password"
            type="password"
            helperText={error?.password}
            error={error?.password ? true : false}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <TextField
            id="confirmPassword"
            label="confirm Password"
            name="confirmPassword"
            type="password"
            helperText={error?.confirmPassword}
            error={error?.confirmPassword ? true : false}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <div>
            {error?.error && (
              <Typography variant="body1" color="error">
                {error?.error}
              </Typography>
            )}
          </div>
          <Button
            disabled={loading}
            type="submit"
            variant="contained"
            color="primary"
          >
            send
            {loading && <CircularProgress color="secondary" size={20} />}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
