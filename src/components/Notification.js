import React, { useEffect, useState } from "react";
import {
  IconButton,
  Tooltip,
  Typography,
  Badge,
  Menu,
  Fade,
  MenuItem,
} from "@material-ui/core";
import NotificationsIcon from "@material-ui/icons/Notifications";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ChatIcon from "@material-ui/icons/Chat";
import Notifications from "@material-ui/icons/Notifications";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRedux } from "../redux/Redux";
import { getNotification, makeNotificationRead } from "./apiCalls";

function Notification() {
  const [{ notifications, token }, dispatch] = useRedux();
  const [notCount, setNotCount] = useState("");

  //mui states
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    makeNotificationRead(token);
    getNotification(token).then((res) =>
      dispatch({ type: "notifications", value: res.data })
    );
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (notifications && notifications.length > 0) {
      let count = notifications.filter((not) => not.read === false).length;
      setNotCount(count);
    }
  });

  // dayjs.extend(relativeTime);

  return (
    <div>
      <Tooltip title="notification" placement="top">
        <IconButton
          id="fade-button"
          aria-controls="fade-menu"
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          <Badge badgeContent={notCount}>
            <NotificationsIcon style={{ color: "white" }} />
          </Badge>
        </IconButton>
      </Tooltip>

      <Menu
        id="fade-menu"
        MenuListProps={{
          "aria-labelledby": "fade-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        {notifications &&
          notifications.length > 0 &&
          notifications.map((not) =>
            not.type === "like" ? (
              <MenuItem onClick={handleClose}>
                {not.read ? (
                  <FavoriteIcon
                    style={{ color: "green", marginRight: "5px" }}
                  />
                ) : (
                  <FavoriteIcon style={{ color: "red", marginRight: "5px" }} />
                )}
                <Typography variant="body1">
                  {" "}
                  {not.sender} liked your srceam
                </Typography>
                {/* <Typography variant="body1">{dayjs(not.createdAt)}</Typography> */}
              </MenuItem>
            ) : (
              <MenuItem onClick={handleClose}>
                {not.read ? (
                  <ChatIcon style={{ color: "green", marginRight: 10 }} />
                ) : (
                  <ChatIcon style={{ color: "red", marginRight: 10 }} />
                )}
                <Typography variant="body1">
                  {not.sender} commented on your scream
                </Typography>
              </MenuItem>
            )
          )}
      </Menu>
    </div>
  );
}

export default Notification;
