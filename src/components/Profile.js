import React from "react";
import "../styles/Profile.css";
import { IconButton, Paper, Tooltip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MuiLink from "@material-ui/core/Link";
import { Link } from "react-router-dom";
import LocationOn from "@material-ui/icons/LocationOn";
import CalendarToday from "@material-ui/icons/CalendarToday";
import KeyboardReturn from "@material-ui/icons/KeyboardReturn";
import EditIcon from "@material-ui/icons/Edit";
import { uploadImg, user } from "./apiCalls";
import { useRedux } from "../redux/Redux";
import Editdetails from "./Editdetails";
import { useHistory } from "react-router-dom";
import moment from "moment";

const useStyles = makeStyles({
  paper: {
    marginLeft: 20,
  },
});

function Profile({ userHandle, bio, website, createdAt, location, image }) {
  const history = useHistory();
  const classes = useStyles();
  const [{ token, loading }, dispatch] = useRedux();

  const inputChange = (e) => {
    dispatch({ type: "Set loading", value: !loading });
    const image = e.target.files[0];
    const formData = new FormData();
    formData.append("image", image, image.name);
    uploadImg(formData, token)
      .then(() => {
        user(token)
          .then((res) => {
            dispatch({ type: "Add userData", value: res.data });
            dispatch({ type: "Set loading", value: false });
          })
          .catch((err) => console.log("err.response.data"));
      })
      .catch((err) => console.log("err.response.data"));
  };

  const inputBtn = () => {
    const file = document.getElementById("imageInput");
    file.click();
  };

  const handleLogOut = () => {
    dispatch({ type: "Add token", value: "" });
    localStorage.removeItem("FBIdToken");
    dispatch({ type: "Set loading", value: true });
    history.push("/");
    dispatch({ type: "validateToken", value: false });
  };

  return (
    <Paper className={classes.paper}>
      <div className="Profile">
        <div className="Profile-image">
          <img className="Img" src={image} alt="profile" />
          <input
            type="file"
            onChange={inputChange}
            hidden="hidden"
            id="imageInput"
          />
          <Tooltip title="select profile picture" placement="top">
            <IconButton onClick={inputBtn}>
              <EditIcon color="inherit" />
            </IconButton>
          </Tooltip>
        </div>
        <br />
        <div className="Profile-details">
          <MuiLink component={Link} to={`/users/$`}>
            <p>{userHandle}</p>
          </MuiLink>
          <br />
          <p>{bio}</p>
          <LocationOn color="inherit" />
          {location && <span>{location}</span>}
          <br />
          <MuiLink component={Link} to={`/users/$`}>
            {website && <span>{website}</span>}
          </MuiLink>
          <br />
          {createdAt && (
            <>
              <CalendarToday color="inherit" />
              <span>{moment(createdAt).format("MMMM Do YYYY, h:mm:ss a")}</span>
              <div>
                <Tooltip title="logOut" placement="top">
                  <IconButton onClick={handleLogOut}>
                    <KeyboardReturn />
                  </IconButton>
                </Tooltip>
                <Editdetails />
              </div>
            </>
          )}
        </div>
      </div>
    </Paper>
  );
}

export default Profile;
