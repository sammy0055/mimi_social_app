import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import moment from "moment";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { makeStyles } from "@material-ui/core/styles";
import sammy from "../assets/sammy.jpg";
import {
  getAllStream,
  getComments,
  likeStream,
  unLikeStream,
  _removeStream
} from "./apiCalls";
import { useRedux } from "../redux/Redux";
const useStyles = makeStyles({
  content: {
    padding: 25,
  },
  image: {
    minWidth: 200,
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

function Scard({
  likeCount,
  commentCount,
  imageUrl,
  userHandle,
  createdAt,
  body,
  id,
}) {
  const classes = useStyles();
  const [{ token, expired, liked_stream, user, stream, comToggle }, dispatch] =
    useRedux();
  const history = useHistory();

  const removeStream = () => {
    _removeStream(token, id);
    let _stream = [...stream];
    const index = _stream.findIndex((item) => {
      return item._id === id;
    });
    console.log(index);
    _stream.splice(index, 1);
    dispatch({ type: "Get stream", value: _stream });
  };

  const logedIn = () => {
    if (expired) return true;
    else return false;
  };
  let newUser = { ...user.credentials };
  const likedStream = () => {
    let like = liked_stream.find(
      (item) =>
        item.userHandle === newUser[0]?.userHandle && item.streamId === id
    );
    if (like) return true;
    else return false;
  };

  const myStream = () => {
    if (userHandle == newUser[0]?.userHandle) return true;
  };

  // console.log(newUser[0]?.userHandle, "uuuuuuuuuu");

  const handleLike = () => {
    if (!likedStream() && !expired) {
      likeStream(token, id)
        .then(() => {
          getAllStream(token).then((res) => {
            dispatch({ type: "Get stream", value: res.data });
          });
        })
        .catch();
      dispatch({
        type: "update likes",
        value: { userHandle: user.credentials[0].userHandle, streamId: id },
      });
    } else if (expired) {
      history.push("/");
    } else {
      unLikeStream(token, id)
        .then(() => {
          getAllStream(token).then((res) => {
            dispatch({ type: "Get stream", value: res.data });
          });
        })
        .catch((err) => {
          console.log(err.response?.data);
        });
      let data = liked_stream.filter((item) => item.streamId !== id);

      dispatch({ type: "remove likes", value: data });
    }
  };

  const getComment = () => {
    dispatch({ type: "comtoggle", value: { toggle: true, streamId: id } });
    getComments(token, id)
      .then((res) => {
        dispatch({ type: "Comment", value: res.data });
      })
      .catch((err) => {
        console.log(err.response?.data);
      });
  };

  return (
    <Card className={classes.card}>
      <CardMedia
        className={classes.image}
        image={imageUrl}
        title="profile image"
      />
      <CardContent className={classes.content}>
        <Typography color="primary" varient="h5">
          {userHandle}
        </Typography>
        <Typography varient="h5">
          {moment(createdAt).format("MMMM Do YYYY, h:mm:ss a")}
        </Typography>
        <Typography varient="h5">{body}</Typography>
        <Tooltip title="like" placement="top">
          <IconButton onClick={handleLike}>
            {likedStream() ? (
              <FavoriteIcon color="primary" />
            ) : logedIn() ? (
              <FavoriteBorder color="primary" />
            ) : (
              <FavoriteBorder color="primary" />
            )}
          </IconButton>
        </Tooltip>
        <span>{likeCount}</span> <span>like</span>
        <Tooltip title="comments" placement="top">
          <IconButton>
            <ChatIcon color="primary" onClick={getComment} />
          </IconButton>
        </Tooltip>
        <span>{commentCount}</span> <span>comments</span>
        <Tooltip title="like" placement="top">
          <IconButton className={classes.deleteBtn} onClick={removeStream}>
            {myStream() && <DeleteOutline color="secondary" />}
          </IconButton>
        </Tooltip>
      </CardContent>
    </Card>
  );
}

export default Scard;
