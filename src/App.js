import React, { useEffect, useState } from "react";
import "./App.css";
import jwtDecode from "jwt-decode";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import home from "./pages/Home";
import login from "./pages/Login";
import Signup from "./pages/Signup";
import { useRedux } from "./redux/Redux";

function App() {
  const [{ token }, dispatch] = useRedux();

  useEffect(() => {
    if (token !== "") {
      const { exp } = jwtDecode(token);
      if (exp * 1000 !== Date.now()) {
        dispatch({ type: "validateToken", value: false });
      } else dispatch({ type: "validateToken", value: true });
    }
  }, [token]);
  return (
    <div>
      <Router>
        <div className="ki">
          <Navbar />
          <Switch>
            <Route exact path="/" component={login} />
            <Route exact path="/home" component={home} />
            <Route exact path="/signUp" component={Signup} />
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
