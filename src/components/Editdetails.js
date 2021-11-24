import React, { useReducer, useState } from "react";
import { useRedux } from "../redux/Redux";
//MUI stuff
import { IconButton, Tooltip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import EditIcon from "@material-ui/icons/Edit";
import { user as getUser, updateUser } from "./apiCalls";

const useStyles = makeStyles({
  TextField: {
    padding: 20,
  },
});

const reducer = (state, action) => {
  switch (action.type) {
    case "bio":
      return { ...state, bio: action.input };

    case "website":
      return { ...state, website: action.input };

    case "location":
      return { ...state, location: action.input };
  }
};

function Editdetails() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [{ user, token, loading }, dispatch] = useRedux();
  //   const [data, setdata] = useState(user.credentials[0]);
  const [data, _dispatch] = useReducer(reducer, user.credentials[0]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmite = () => {
    setOpen(false);
    dispatch({ type: "Set loading", value: !loading });
    const userData = {
      bio: data.bio,
      website: data.website,
      location: data.location,
    };
    updateUser(userData, token)
      .then((res) => {
        console.log("mmmmmmmm", res.data);
        getUser(token).then((res) => {
          dispatch({ type: "Add userData", value: res.data });
          dispatch({ type: "Set loading", value: false });
        });
      })
      .catch((err) => console.log("err.response.data"));
  };

  return (
    <div>
      <Tooltip title="edit profile" placement="top">
        <IconButton onClick={handleClickOpen}>
          <EditIcon color="inherit" />
        </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Edit ypur Profile Here</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="bio"
            name="bio"
            type="text"
            fullWidth
            value={data.bio}
            onChange={(e) => _dispatch({ type: "bio", input: e.target.value })}
          />

          <TextField
            autoFocus
            margin="dense"
            label="webste"
            name="website"
            type="text"
            fullWidth
            value={data.website}
            onChange={(e) =>
              _dispatch({ type: "website", input: e.target.value })
            }
          />

          <TextField
            autoFocus
            margin="dense"
            label="location"
            name="location"
            type="text"
            fullWidth
            value={data.location}
            onChange={(e) =>
              _dispatch({ type: "location", input: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmite} color="primary">
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Editdetails;
