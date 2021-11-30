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
// import Cropper from "react-easy-crop"
import sammy from "../assets/sammy.jpg";

const useStyles = makeStyles({
  img: {
    objectFit: "contain",
    width: "100%",
    height: "70vh",
  },
  imgContainer: {
    width: "100%",
    height: "70vh",
    background: "green",
  },
});

function ImageCropDialog() {
  const classes = useStyles();
  const [toggle, setToggle] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const cropValues = {
    zoomInit: 1,
    cropInit: { x: 0, y: 0 },
    aspectInit: 1 / 2,
  };

  const handleToggle = () => {
    setToggle(!toggle);
  };
  return (
    <div>
      <Dialog open={toggle} onClose={handleToggle}>
        <DialogTitle>crop image to passport size</DialogTitle>
        <DialogContent>
          <div className={classes.imgContainer}>
            <img src={sammy} alt="profile" className={classes.img} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ImageCropDialog;
