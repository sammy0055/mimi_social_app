const firebase = require("firebase");
const admin = require("firebase-admin");

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAUzhisohIQD9z5_xcFl6Sl97EqrqYJkdU",
  authDomain: "social-app-3ed3c.firebaseapp.com",
  projectId: "social-app-3ed3c",
  storageBucket: "social-app-3ed3c.appspot.com",
  messagingSenderId: "215167246073",
  appId: "1:215167246073:web:fdecee899c57a313718c28",
  measurementId: "G-JRN0NRPJGZ",
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

module.exports.auth = auth;
module.exports.admin = admin;
module.exports.firebaseConfig = firebaseConfig;
