import React, { useEffect, useState } from "react";
import { Button, IconButton, Tooltip, Typography, Badge } from "@material-ui/core";
import NotificationsIcon from "@material-ui/icons/Notifications";
// import Notifications from "@material-ui/icons/Notifications";
import { useRedux } from "../redux/Redux";
import { getNotification } from "./apiCalls";

// import Badge from "@mui/material/Badge";
import MailIcon from "@material-ui/icons/Mail";

function Notification() {
  const [{ notifications, token }, dispatch] = useRedux();
  const { notCount, setNotCount } = useState(34);

  useEffect(() => {
    if (notifications && notifications.length > 0) {
      let count = notifications.filter((not) => not.read === false).length;
      setNotCount(count);
    }
  });
  const handleClick = () => {
    getNotification(token).then((res) => {
      dispatch({ type: "notifications", value: res.data });
    });
  };

  return (
    <div>
      <Tooltip title="notification" placement="top">
        <Badge badgeContent={0}>
          <NotificationsIcon color="inherit" />
        </Badge>
      </Tooltip>

      <Badge color="secondary" badgeContent={0}>
        <MailIcon />
      </Badge>
    </div>
  );
}

export default Notification;
