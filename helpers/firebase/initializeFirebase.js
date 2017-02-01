/*
  initializeFirebase.js
  Written By: Derek Johnston
  Copyright 2017 J&P Innovations Inc.

  @desc:
    - Configure and spin-up the firebase admin session.
*/
var admin = require("firebase-admin"),
    credential = require("./credentials/auctioneer-a4040-firebase-adminsdk-1oy61-3563c1a16f.json");

module.exports = function () {
  admin.initializeApp({
    credential  : admin.credential.cert(credential),
    databaseURL : "https://auctioneer-a4040.firebaseio.com"
  });
};
