const express = require("express");
const {
  Streams,
  User,
  Comments,
  Likes,
  Notification,
} = require("../schema/schema");
const { FBAuth } = require("./write");
const remove = express.Router();

//Unlike stream --------------------------------------------------------
const unlike = (req, res, id) => {
  const p = new Promise((resolve, reject) => {
    const removeLike = Likes.deleteOne({ _id: id });
    resolve(removeLike);
    reject(new Error("mesagge"));
  });
  p.then(() => {
    decrement();
    res.send("unliked");
  }).catch((err) => {
    console.error;
    res.status(400).json({ error: err.message });
  });

  function decrement() {
    Streams.find({ _id: req.params.streamId }).then((data) => {
      deCount(req.params.streamId, data[0]);
    });

    function deCount(id, data) {
      const p = new Promise((resolve, reject) => {
        const update = Streams.findByIdAndUpdate(
          id,
          {
            $set: { likeCount: data.likeCount - 1 },
          },
          { new: true }
        );
        resolve(update);
        reject(new Error("message"));
      });
      p.then().catch((err) => {
        console.error;
        res.status(400).json({ error: err.message });
      });
    }
  }
};

const removeNotifier = () => {
  Notification.find({
    userHandle: req.user.handle,
    streamId: req.params.streamId,
  }).then((data) => notify(data[0]._id));

  function notify(id) {
    const p = new Promise((resovle, reject) => {
      const note = Notification.findOne({ _id: id });
      resovle(note);
      reject(new Error("message"));
    });
    p.then().catch((error) => console.error);
  }
};

remove.delete("/unlike/:streamId", FBAuth, (req, res) => {
  let Unlike;
  Likes.find({
    userHandle: req.user.handle,
    streamId: req.params.streamId,
  })
    .then((data) => {
      Unlike = data;
      if (Unlike == 0) {
        res.send("stream does not exist");
      } else {
        unlike(req, res, Unlike[0]._id);
        removeNotifier();
      }
    })
    .catch((err) => res.status(400).json({ error: err.message }));
});

//delete stream -----------------------------------------------------------
const removeStream = (id, res) => {
  const p = new Promise((resolve, reject) => {
    const stream = Streams.deleteOne({ _id: id });
    resolve(stream);
    reject(new Error("message"));
  });
  p.then(() => res.status(200).json({ message: "removed successfully" })).catch(
    (err) => res.status(400).json({ error: err.message })
  );
};

remove.delete("/removeStream/:streamId", FBAuth, (req, res) => {
  Streams.find({ _id: req.params.streamId })
    .then((data) => {
      let _data = data[0];
      if (_data.userHandle == req.user.handle) {
        removeStream(req.params.streamId, res);
      } else {
        res.status(403).json({ error: "unAuthorized user" });
      }
    })
    .catch((err) => res.status(400).json({ error: err.message }));
});

module.exports = remove;
