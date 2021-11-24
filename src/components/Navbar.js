import React from "react";
import "../styles/Navbar.css";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import HomeIcon from "@material-ui/icons/Home";
import Notification from "./Notification";
import Notifications from "@material-ui/icons/Notifications";

import { useRedux } from "../redux/Redux";
import PostScream from "./PostScream";

function Navbar() {
  const [{ expired }, dispatch] = useRedux();
  return (
    <AppBar>
      <Toolbar className="Btn-Container">
        {expired ? (
          <>
            {" "}
            <Button color="inherit" component={Link} to="/home">
              Home
            </Button>
            <Button
              color="inherit"
              component={Link}
              to={expired ? "/" : "/home"}
            >
              Log-In
            </Button>
            <Button color="inherit" component={Link} to="/signUp">
              Sign-Up
            </Button>
            <Notification />
          </>
        ) : (
          <>
            {/* <Tooltip title="Post A Scream" placement="top">
              <IconButton>
                <AddIcon color="inherit" />
              </IconButton>
            </Tooltip> */}
            <PostScream />

            <Tooltip title="Home" placement="top">
              <IconButton>
                <HomeIcon color="inherit" />
              </IconButton>
            </Tooltip>

            <Tooltip title="notification" placement="top">
              <IconButton>
                <Notifications color="inherit" />
              </IconButton>
            </Tooltip>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
