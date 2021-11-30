const functions = require("firebase-functions");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const { write } = require("./Cruid/write");
const read = require("./Cruid/read");
const authPost = require("./authentication/authPost");
// const update = require("./Cruid/update");
const remove = require("./Cruid/remove");

const mongoUrl = functions.config().service.socialappdb;

app.use("/", write);
app.use("/", read);
app.use("/auth", authPost);
// app.use("/updateNews", update);
app.use("/", remove);
app.use(express.json());
app.use(cors({ origin: true }));

//"mongodb://localhost/streams"

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("connected to mongoDB"))
  .catch((err) => console.error(err, "connecting failed to db"));

// app.listen(3001, () => console.log("listening on port 3001"));
exports.api = functions.https.onRequest(app);
