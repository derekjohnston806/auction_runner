/*
  authenticateUserCredentials.js
  Written By: Derek Johnston
  Copyright 2017 J&P Innovations Inc.

  @desc:
    - Given an email address and password from the client, authenticate the credentials with
      the database.
*/
var admin = require("firebase-admin"),
    passwordHash = require("password-hash");

module.exports = function (request, response) {
  console.log("GET /authenticateUserCredentials");
  var newSession;
  var credentials = request.body;
  admin.database().ref("sessions").child(credentials.email.replace(/\./g, "_")).once("value")
  .then(function (snapshot) {
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      throw { code: "fetch/null_hashed_email" }
    }
  })
  .then(function (session) {
    if (passwordHash.verify(credentials.password, session.hash)) {
      newSession = {
        uid       : session.uid,
        hash      : session.hash,
        timestamp : Date.now()
      };
      return admin.database().ref("sessions").child(credentials.email.replace(/\./g, "_")).set(newSession);
    } else {
      throw { code: "auth/invalid_password" };
    }
  })
  .then(function () {
    response.status(200);
    response.json({
      hash      : newSession.hash,
      timestamp : newSession.timestamp,
      email     : credentials.email
    });
  })
  .catch(function (error) {
    console.log(error);
    switch (error.code) {
      case "fetch/null_hashed_email":
        response.status(504);
        response.end();
        break;
      default:
        response.status(500);
        response.end();
        break;
    }
  })
};
