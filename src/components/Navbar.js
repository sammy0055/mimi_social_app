import React from "react";
import "../styles/Navbar.css";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
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
import ImageCropDialog from "./ImageCropDialog";

function Navbar() {
  const [{ expired, token }, dispatch] = useRedux();
  return (
    <AppBar>
      <Toolbar className="Btn-Container">
        {expired || !token ? (
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
            <ImageCropDialog />
          </>
        ) : (
          <>
            <PostScream />

            <Tooltip title="Home" placement="top">
              <IconButton>
                <HomeIcon color="inherit" style={{ color: "white" }} />
              </IconButton>
            </Tooltip>

            <Notification />
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
