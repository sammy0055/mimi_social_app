const mongoose = require("mongoose");

const streamsSchema = new mongoose.Schema({
  userHandle: { type: String, required: true },
  body: { type: String, required: true },
  imageUrl: { type: String, required: false },
  likeCount: { type: Number, required: false },
  commentCount: { type: Number, required: false },
  createdAt: { type: Date, default: Date.now },
});

const commentSchema = new mongoose.Schema({
  userHandle: { type: String, required: true },
  body: { type: String, required: true },
  streamId: { type: String, required: true },
  imageUrl: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
});

const likeSchema = new mongoose.Schema({
  streamId: { type: String, require: true },
  userHandle: { type: String, require: true },
});

const userSchema = new mongoose.Schema({
  userHandle: { type: String, required: true },
  email: { type: String, required: true },
  imageUrl: { type: String, required: false },
  bio: { type: String, required: false },
  website: { type: String, required: false },
  location: { type: String, required: false },
  uid: { type: String, required: true },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const notificationSchema = mongoose.Schema({
  recipiant: { type: String, required: true },
  sender: { type: String, required: true },
  type: { type: String, required: true },
  read: { type: Boolean, required: true },
  streamId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Streams = mongoose.model("Streams", streamsSchema);
const Comments = mongoose.model("Comments", commentSchema);
const Likes = mongoose.model("Likes", likeSchema);
const User = mongoose.model("User", userSchema);
const Notification = mongoose.model("notification", notificationSchema);

module.exports = { Streams, User, Comments, Likes, Notification };
