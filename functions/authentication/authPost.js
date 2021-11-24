const express = require("express");
const { User, Likes, Notification } = require("../schema/schema");
const { updateUser, FBAuth } = require("../Cruid/write");
const { auth, firebaseConfig } = require("./firebase");
const { isEmpty } = require("../validation/validation");
const authPost = express.Router();

authPost.post("/", (req, res) => {
  let _data;
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle,
    imageUrl: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/noface.png?alt=media`,
  };

  let error = {};
  if (isEmpty(newUser.handle)) error.handle = "userHandle must not be empty";
  if (isEmpty(newUser.email)) error.email = "email must not be empty";
  if (isEmpty(newUser.password)) error.password = "password must not be empty";
  if (isEmpty(newUser.confirmPassword)) {
    error.confirmPassword = "confirmPassword must not be empty";
  } else if (newUser.password !== newUser.confirmPassword) {
    error.confirmPassword = "Password does not match";
  }

  if (Object.keys(error).length > 0) return res.status(400).json(error);

  User.find({ userHandle: newUser.handle })
    .then((data) => {
      if (data.length == 0) {
        auth
          .createUserWithEmailAndPassword(newUser.email, newUser.password)
          .then((data) => {
            _data = data.user.uid;
            return data.user.getIdToken();
          })
          .then((token) => {
            const users = new User({
              userHandle: newUser.handle,
              email: newUser.email,
              imageUrl: newUser.imageUrl,
              uid: _data,
              token: token,
            });
            users.save();
            return res.status(200).send({ token });
          })
          .catch((err) => {
            if (err.code === "auth/network-request-failed") {
              res.status(500).json({
                error:
                  "network request failed, please check your internet connection",
              });
            } else if (err.code === "auth/email-already-in-use") {
              res.status(500).json({ error: "email is already in use" });
            } else {
              res.status(400).json({ error: err.code });
            }
          });
      } else {
        return res.status(500).json({ error: "userHandle already exist" });
      }
    })
    .catch((err) => console.error(err.message));
});

authPost.post("/sign-in", (req, res) => {
  let user = {
    email: req.body.email,
    password: req.body.password,
  };
  let error = {};
  if (isEmpty(user.email)) error.email = "email must not be empty";
  if (isEmpty(user.password)) error.password = "password must not be empty";
  if (Object.keys(error).length > 0) return res.status(400).json(error);

  User.find({ email: user.email }).then((response) => {
    if (response.length == 0) {
      res.status(404).json({ error: "User does not exist" });
    } else {
      id = response[0]._id;
      let email = String(user.email);
      let password = String(user.password);
      auth
        .signInWithEmailAndPassword(email, password)
        .then((data) => {
          return data.user.getIdToken();
        })
        .then((token) => {
          updateUser(id, { token: token });
          res.status(200).send({ token });
        })
        .catch((err) => {
          if (err.code === "auth/network-request-failed") {
            res.status(500).json({
              error:
                "network request failed, please check your internet connection",
            });
          } else if (err.code === "auth/email-already-in-use") {
            res.status(500).json({ error: "email is already in use" });
          } else {
            res.status(400).json({ error: err.code });
          }
        });
    }
  });
});

module.exports = authPost;
