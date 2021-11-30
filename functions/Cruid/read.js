const express = require("express");
const cors = require("cors");
const {
  Streams,
  User,
  Comments,
  Likes,
  Notification,
} = require("../schema/schema");
const { FBAuth } = require("./write");
const read = express.Router();
read.use(cors({ origin: true }));

//getAllstreams-------------------------------------------
read.get("/getAllStream", (req, res) => {
  Streams.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .then((response) => res.status(200).send(response))
    .catch((err) => {
      if (
        err.message ==
        `Cast to ObjectId failed for value "124cf564" at path "_id" for model "Streams"`
      ) {
        res.status(400).json({ error: "user not found" });
      } else {
        res.status(404).json({ error: err.message });
      }
    });
});

//get notifications
read.get("/getNotifications", FBAuth, (req, res) => {
  Notification.find({ recipiant: req.user.handle })
    .sort({ createdAt: -1 })
    .limit(10)
    .then((response) => res.status(200).send(response))
    .catch((err) => res.status(400).json({ error: err.message }));
});

// getlikes-----------------------------------------------------
read.get("/getlikes", FBAuth, (req, res) => {
  Likes.find()
    .then((response) => res.status(200).send(response))
    .catch((err) => res.status(400).json({ error: err.message }));
});

// getComments-----------------------------------------------------
read.get("/getComments/:streamId", FBAuth, (req, res) => {
  Comments.find({ streamId: req.params.streamId })
    .sort({ createdAt: -1 })
    .limit(10)
    .then((response) => res.status(200).send(response))
    .catch((err) => res.status(400).json({ error: err.message }));
});

//unlike stream-------------------------------------------------
read.get("/unlikes/:streamId", FBAuth, (req, res) => {
  let likes = "";
  Likes.find({
    userHandle: req.user.handle,
    streamId: req.params.streamId,
  }).then((data) => {
    likes = data;

    if (!likes.length == 0) {
      let streamData;
      removeLike(req);
      Streams.find({ _id: req.params.streamId })
        .then((data) => {
          streamData = data[0];
          incrementCount(req.params.streamId, streamData.likeCount - 1);
        })
        .catch((err) => res.status(404).json({ error: err.message }));

      res.status(200).send("unliked");
    } else {
      res.status(404).json({ error: "allready liked" });
    }
  });
});

//like streams
read.get("/likes/:streamId", FBAuth, (req, res) => {
  let likes = "";
  Likes.find({
    userHandle: req.user.handle,
    streamId: req.params.streamId,
  })
    .then((data) => {
      likes = data;

      if (likes.length == 0) {
        let streamData;
        addLike(req);
        Streams.find({ _id: req.params.streamId })
          .then((data) => {
            streamData = data[0];
            likeNotify(req.params.streamId, streamData, req);
            incrementCount(req.params.streamId, streamData.likeCount + 1);
          })
          .catch((err) => res.status(404).json({ error: err.message }));

        res.status(200).send("liked");
      } else {
        res.status(404).json({ error: "allready liked" });
      }
    })
    .catch((err) => console.error(err.message));
});

/// test route
// read.get("/sammy", FBAuth, (req, res) => {
//   res.send("who you be");
// });

function likeNotify(id, data, req) {
  const notify = {
    recipiant: data.userHandle,
    sender: req.user.handle,
    type: "like",
    read: false,
    streamId: id,
  };
  const p = new Promise((resolve, reject) => {
    const note = new Notification(notify);
    resolve(note.save());
    reject(new Error("message"));
  });
  p.then().catch((err) => res.status(400).json({ error: err.mesage }));
}

// likeNotify();

const addLike = (req) => {
  const p = new Promise((resolve, reject) => {
    const newLike = new Likes({
      userHandle: req.user.handle,
      streamId: req.params.streamId,
    });
    resolve(newLike.save());
    reject(new Error("message"));
  });
  p.then().catch((err) => res.status(400).json({ error: err.message }));
};

const removeLike = (req) => {
  const p = new Promise((resovle, reject) => {
    const remove = Likes.deleteOne({
      userHandle: req.user.handle,
      streamId: req.params.streamId,
    });
    resovle(remove);
    reject(new Error("message"));
  });
  p.then().catch((err) => res.status(400).json({ error: err.message }));
};
const incrementCount = (id, count) => {
  const p = new Promise((resolve, reject) => {
    const update = Streams.findByIdAndUpdate(
      id,
      {
        $set: { likeCount: count },
      },
      { new: true }
    );
    resolve(update);
    reject(new Error("message"));
  });
  p.then().catch((err) => res.status(400).json({ error: err.message }));
};

read.get("/getStream/:streamId", (req, res) => {
  let streamData = {};
  Streams.find({ _id: req.params.streamId })
    .then((response) => {
      streamData.data = response;

      Comments.find({ streamId: req.params.id })
        .then((responce) => {
          streamData.comments = responce;
          res.status(200).send(streamData);
        })
        .catch((err) => {
          if (
            err.message ==
            `Cast to ObjectId failed for value "124cf564" at path "_id" for model "Comments"`
          ) {
            res.status(400).json({ error: "user not found" });
          }
        });
    })
    .catch((err) => {
      if (
        err.message ==
        `Cast to ObjectId failed for value "124cf564" at path "_id" for model "Streams"`
      ) {
        res.status(400).json({ error: "user not found" });
      }
    });
});

read.get("/getUser", FBAuth, (req, res) => {
  let userData = {};
  User.find({ _id: req.user.id })
    .then((response) => {
      userData.credentials = response;
      res.status(200).send(userData);
    })
    .catch((err) => {
      if (
        err.message ==
        `Cast to ObjectId failed for value "124cf564" at path "_id" for model "User"`
      ) {
        res.status(400).json({ error: "user not found" });
      } else {
        res.status(500).json({ error: err.message });
      }
    });
});

read.get("/getUserDetails/:handle", (req, res) =>
  User.find({ userHandle: req.params.handle }).then((data) => {
    if (data.length !== 0) {
      Streams.find({ userHandle: req.params.handle })
        .then((data) => {
          if (data.length !== 0) {
            // res.status(200).send(data);
            getAuthuserDetals(req.params.handle, res);
          } else {
            res.status(404).json({ mesaage: "no streams yet" });
          }
        })
        .catch((err) => console.error);
    } else {
      res.status(404).json({ message: "user does not exist" });
    }
  })
);

const getAuthuserDetals = (handle, res) => {
  let userData = {};
  User.find({ userHandle: handle })
    .then((data) => {
      userData.userCredentials = data;
      Notification.find({ recipiant: handle }).then((data) => {
        userData.Notification = data;
      });
      Likes.find({ userHandle: handle })
        .then((data) => {
          return (userData.likes = data);
        })
        .then(() => res.send(userData));
      //   return res.send(userData);
    })
    .catch((err) => {
      console.error;
      res.send(err.message);
    });
};

read.get("/markNotificationRead", FBAuth, (req, res) => {
  Notification.find()
    .then((data) => {
      if (data.length !== 0) {
        updateNotifier(res, req);
      } else {
        res.status(404).json({ message: "No Notification" });
      }
    })
    .catch((err) => {
      res.send(err.message);
      console.error;
    });

  function updateNotifier(res, req) {
    const p = new Promise((resovle, reject) => {
      const notify = Notification.updateMany(
        { recipiant: req.user.handle },
        {
          $set: { read: true },
        }
      );
      resovle(notify);
      reject(new Error("message"));
    });
    p.then((data) => res.status(200).send(data)).catch((err) => {
      console.error;
      res.status(400).json({ error: err.message });
    });
  }
});

module.exports = read;
