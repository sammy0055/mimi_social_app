import React, { useState } from "react";

import {
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";

import Textfield from "@material-ui/core/Textfield";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import { getAllStream, postStream } from "./apiCalls";
import { useRedux } from "../redux/Redux";

const useStyles = makeStyles({
  submitButton: {
    position: "relative",
    marginTop: "3%",
  },
  progressSpiner: {
    position: "absolute",
  },
  closeButton: {
    position: "absolute",
    left: "85%",
    top: "5%",
  },
});

function PostScream() {
  const classes = useStyles();
  const [{ stream, token, expired }, dispatch] = useRedux();
  const [errors, setErrors] = useState({});
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [toggle, setToggle] = useState(false);

  const handleToggle = () => {
    setToggle(!toggle);
  };

  const handleSubmit = (e) => {
    let _text = String(text);
    setLoading(true);
    e.preventDefault();
    postStream(token, _text)
      .then(() => {
        getAllStream().then((res) => {
          dispatch({ type: "Get stream", value: res.data });
          setLoading(false);
          setToggle(!toggle);
        });
      })
      .catch((err) => {
        setLoading(false);
        console.log(err.response?.data);
        setErrors(err.response?.data);
      });
  };

  return (
    <div>
      <>
        <Tooltip title="Post A Scream" placement="top">
          <IconButton onClick={handleToggle}>
            <AddIcon style={{ color: "white" }} />
          </IconButton>
        </Tooltip>
        <Dialog open={toggle} onClose={handleToggle}>
          <Tooltip title="close" placement="top">
            <IconButton className={classes.closeButton} onClick={handleToggle}>
              <CloseIcon color="inherit" />
            </IconButton>
          </Tooltip>
          <DialogTitle>Post a new Scream</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <Textfield
                name="body"
                type="text"
                label="Scream"
                value={text}
                onChange={(e) => setText(e.target.value)}
                row="3"
                placeholder="cream at your fello apps"
                error={errors?.error ? true : false}
                helperText={errors?.error}
                fullWidth
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                className={classes.submitButton}
              >
                submit
                {loading && (
                  <CircularProgress
                    color="secondary"
                    size={30}
                    className={classes.progressSpiner}
                  />
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </>
    </div>
  );
}

export default PostScream;
