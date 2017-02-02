/*
  newUserAccount.route.js
  Written By: Derek Johnston
  Copyright 2017 J&P Innovations Inc.

  @desc:
    - Handle a request form the client to create a new user account.
*/
var admin = require("firebase-admin"),
    passwordHash = require("password-hash");

module.exports = function (request, response) {
  var newUserData = request.body;
  console.log("New User Data:", newUserData);
  console.log("GET: /newUserAccount - DATA:", newUserData);
  admin.auth().createUser({
    email         : newUserData.email,
    emailVerified : false,
    password      : newUserData.password,
    displayName   : newUserData.name,
    disabled      : false
  })
  .then(function (userRecord) {
    console.log("New user account created with uid:", userRecord.uid);
    newUserData.uid = userRecord.uid;
    return admin.database().ref("users").child(userRecord.uid).set({
      uid     : userRecord.uid,
      orgName : newUserData.orgName
    });
  })
  .then(function () {
    var hash = passwordHash.generate(newUserData.password);
    var hashedEmail = passwordHash.generate(newUserData.email);
    newUserData.session = {
      hash      : hash,
      timestamp : Date.now(),
      uid       : newUserData.uid
    };
    return admin.database().ref("sessions").child(newUserData.email.replace(/\./g, "_")).set(newUserData.session);
  })
  .then(function () {
    response.status(200);
    response.json({
      hash      : newUserData.session.hash,
      timestamp : newUserData.session.timestamp,
      email     : newUserData.email
    });
    response.end();
  })
  .catch(function (error) {
    console.log("New user account failed with error:", error);
    switch(error.code) {
      case "auth/email-already-exists":
        response.status(501);
        break;
      default:
        response.status(500);
        break;
    }
    response.json(error);
    response.end();
  });
};
