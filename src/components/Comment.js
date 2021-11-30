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
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Textfield from "@material-ui/core/Textfield";
import CloseIcon from "@material-ui/icons/Close";
import { useRedux } from "../redux/Redux";
import { getAllStream, postStream, postComment, getComments } from "./apiCalls";
import sammy from "../assets/sammy.jpg";
import moment from "moment";

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
  content: {
    padding: 25,
  },
  image: {
    minWidth: 100,
    borderRadius: "50%",
  },
  card: {
    position: "relative",
    display: "flex",
    marginBottom: 7,
  },
  deleteBtn: {
    position: "absolute",
    left: "90%",
  },
});

function Comment() {
  const classes = useStyles();
  const [{ stream, token, expired, comToggle, comment }, dispatch] = useRedux();
  const [errors, setErrors] = useState({});
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleToggle = () => {
    dispatch({ type: "comtoggle", value: { toggle: false } });
  };

  const handleSubmit = (e) => {
    let _text = String(text);
    setLoading(true);
    e.preventDefault();

    postComment(token, _text, comToggle.streamId)
      .then(() => {
        getComments(token, comToggle.streamId)
          .then((res) => {
            dispatch({ type: "Comment", value: res.data });
            setLoading(false);
            setText("");
          })
          .catch((err) => {
            setLoading(false);
            console.log(err.response?.data);
            setErrors(err.response?.data);
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
      <Dialog open={comToggle.toggle} onClose={handleToggle}>
        <Tooltip title="close" placement="top">
          <IconButton className={classes.closeButton} onClick={handleToggle}>
            <CloseIcon color="inherit" />
          </IconButton>
        </Tooltip>
        <DialogTitle>Post a new Comment</DialogTitle>
        <DialogContent>
          <div>
            {comment?.map((data) => (
              <>
                <Card key={comToggle.streamId} className={classes.card}>
                  <CardMedia
                    className={classes.image}
                    image={data.imageUrl}
                    title="profile image"
                  />
                  <CardContent className={classes.content}>
                    <Typography color="primary" varient="h5">
                      {data.userhandle}
                    </Typography>
                    <Typography varient="h5">
                      {moment(data.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
                    </Typography>
                    <Typography varient="h5">{data.body}</Typography>
                  </CardContent>
                </Card>
              </>
            ))}
          </div>
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
    </div>
  );
}

export default Comment;
