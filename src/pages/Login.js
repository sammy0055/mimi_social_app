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
import { user as getUser } from "../components/apiCalls";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const history = useHistory();

  const [state, dispatch] = useRedux();
  const handleSubmit = (e) => {
    setLoading(!loading);
    e.preventDefault();
    const userData = { email: email, password: password };
    axios({
      method: "post",
      url: "/auth/sign-in",
      data: userData,
    })
      .then((res) => {
        // axios.defaults.headers.common["Authorization"] = res.data.token;
        getUser(res.data.token)
          .then((res) => {
            dispatch({ type: "Add userData", value: res.data });
            dispatch({ type: "Set loading", value: false });
          })
          .catch((err) => console.log(err.data));
        localStorage.setItem("FBIdToken", res.data.token);
        dispatch({ type: "Add token", value: res.data.token });
        setLoading(false);
        history.push("/home");
      })
      .catch((err) => {
        setLoading(false);
        setError(err.response?.data);
        console.log(err.response.data);
      });
  };

  // console.log(token.token);
  return (
    <div className="Lcontainer">
      <div className="Lcont">
        <img src={sackboy} alt="available shotly" />
        <Typography variant="h3">LogIn</Typography>
        <form onSubmit={handleSubmit} className="FormCont">
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

export default Login;
