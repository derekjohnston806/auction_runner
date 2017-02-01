/*
  checkForUserSession.route.js
  Written By: Derek Johnston
  Copyright 2017 J&P Innovations Inc.

  @desc:
    - Given the credentials from a client's localStorage, verify that a session exists.
*/
var admin = require("firebase-admin"),
    pHash = require("password-hash");

module.exports = function (request, response) {
  var credentials = request.body;
  console.log(credentials);
  var newSession;
  admin.database().ref("sessions").child(credentials.email.replace(/\./g, "_")).once("value")
  .then(function (snapshot) {
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      throw { code: "fetch/null_session_email_snapshot" };
    }
  })
  .then(function (session) {
    console.log(session.hash === credentials.hash);
    console.log(session.timestamp === Number(credentials.timestamp));
    if (session.hash === credentials.hash && session.timestamp === Number(credentials.timestamp)) {
      newSession = {
        hash      : session.hash,
        timestamp : Date.now()
      }
      return admin.database().ref("sessions").child(credentials.email.replace(/\./g, "_")).set(newSession);
    } else {
      throw { code: "auth/invalid_session_credentials" };
    }
  })
  .then(function () {
    response.json({
      email     : credentials.email,
      hash      : credentials.hash,
      timestamp : newSession.timestamp
    });
    response.status(200);
    response.end();
  })
  .catch(function (error) {
    console.log(error);
    response.status(500);
    response.end();
  });
}
