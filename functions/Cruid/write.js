const express = require("express");
const cors = require("cors");
const {
  Streams,
  User,
  Comments,
  Likes,
  Notification,
} = require("../schema/schema");
const { admin, firebaseConfig } = require("../authentication/firebase");
const { reduceUserDetails } = require("../validation/validation");
const write = express.Router();

admin.initializeApp();
write.use(express.json());
write.use(cors({ origin: true }));

//verification of user token
const FBAuth = (req, res, next) => {
  let idToken;
  if (req.headers.authorization) {
    idToken = req.headers.authorization;
  } else {
    console.error("no token found");
    return res.status(500).json({ error: "unauthorized" });
  }

  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      req.user = decodedToken;
      // console.log(decodedToken);

      User.find({ token: idToken })
        .then((response) => {
          req.user.id = response[0]._id;
          req.user.handle = response[0].userHandle;
          req.user._imageUrl = response[0].imageUrl;
          // console.log(req.user.id, "idddddddddddd");
          return next();
        })
        .catch((err) => res.status(400).send(err.message));
    })
    .catch((err) => {
      console.error("error while verifing token", err);
      res.status(400).json(err);
    });
};

//add streams to the database
write.post("/postStreams", FBAuth, (req, res) => {
  let data = {
    body: req.body.body,
    userHandle: req.user.handle,
    imageUrl: req.user._imageUrl,
    likeCount: 0,
    commentCount: 0,
  };
  const p = new Promise((resolve, reject) => {
    // console.log(req.body);
    const strems = new Streams(data);
    resolve(strems.save());
    reject(new Error("message"));
  });
  p.then((response) => res.status(200).send(response)).catch((err) =>
    res.status(400).json({ error: err.message })
  );
});

// parseInt
//add comments route-0-----------------------------------------------------
write.post("/Addcomment/:streamId", FBAuth, (req, res) => {
  let data = {
    body: req.body.body,
    streamId: req.params.streamId,
    userHandle: req.user.handle,
    imageUrl: req.user._imageUrl,
  };
  const p = new Promise((resolve, reject) => {
    const comment = new Comments(data);
    resolve(comment.save());
    reject(new Error("message"));
  });
  p.then((data) => {
    deCount(req, res);
    res.status(200).send(data);
  }).catch((err) => res.status(400).send(err.message));

  const deCount = (req, res) => {
    Streams.find({ _id: req.params.streamId }).then((data) => {
      newComent(req.params.streamId, data[0], res);
      comentNotify(req.params.streamId, data[0], res);
    });

    function newComent(id, data, res) {
      const p = new Promise((resolve, reject) => {
        const update = Streams.findByIdAndUpdate(
          id,
          {
            $set: { commentCount: data.commentCount + 1 },
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

    function comentNotify(id, data, res) {
      const notify = {
        recipiant: data.userHandle,
        sender: req.user.handle,
        type: "comment",
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
  };
});

//update the user profile----------------------------------------------------------
write.put("/updateUser", FBAuth, (req, res) => {
  let userDetails = reduceUserDetails(req.body);
  const p = new Promise((resolve, reject) => {
    const user = User.findByIdAndUpdate(req.user.id, {
      $set: userDetails,
    });
    resolve(user);
    reject(new Error("message"));
  });
  p.then(() =>
    res.status(200).json({ message: "profile updated successfully" })
  ).catch((err) => res.status(400).json({ error: err.message }));
});

write.post("/uploadImg", FBAuth, (req, res) => {
  const BusBoy = require("busboy");
  const path = require("path");
  const fs = require("fs");
  const os = require("os");

  let imageFileName;
  let imageToBeUploaded = {};
  const busboy = new BusBoy({ headers: req.headers });

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    if (mimetype !== "image/jpg" && mimetype !== "image/png") {
      return res.status(400).json({ error: "wronge file type" });
    }
    let fileIndex = filename.split(".").length - 1;
    const imageExtension = filename.split(".")[fileIndex];
    imageFileName = `${Math.round(
      Math.random() * 10000000000
    )}.${imageExtension}`;
    const filepath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = { filepath, mimetype };
    file.pipe(fs.createWriteStream(filepath));
  });
  busboy.on("finish", () => {
    admin
      .storage()
      .bucket()
      .upload(imageToBeUploaded.filepath, {
        resumable: false,
        metadata: {
          contentType: imageToBeUploaded.mimetype,
        },
      })
      .then(() => {
        const _imageUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageFileName}?alt=media`;
        updateUser(req.user.id, { imageUrl: _imageUrl })
          .then(() =>
            res.status(200).json({ message: "image uploaded successfully" })
          )
          .catch((err) => res.status(400).json({ error: err.message }));
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: err.code });
      });
  });
  busboy.end(req.rawBody);
});

// write.post("/like", (req, res) => {
//   let user = {
//     userHandle: req.body.userHandle,
//     streamId: req.body.streamId,
//   };
//   const p = new Promise((resolve, reject) => {
//     const like = new Likes(user);
//     resolve(like.save());
//     reject(new Error("message"));
//   });
//   p.then(res.send("successfull")).catch((err) => res.send(err.message));

//   // updateUser(req.body.id, { email: req.body.email })
//   //   .then((response) => res.status(200).json({ message: response }))
//   //   .catch((err) => res.status(400).json({ error: err.message }));
// });

const updateUser = (id, update) => {
  return new Promise((resovle, reject) => {
    const newUpdate = User.findByIdAndUpdate(id, {
      $set: update,
    });
    resovle(newUpdate);
    reject(new Error("message"));
  });
};

module.exports = { write, updateUser, FBAuth };
