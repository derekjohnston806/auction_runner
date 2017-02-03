/*
  newEvent.route.js
  Written By: Derek Johnston
  Copyright 2017 J&P Innovations Inc.

  @desc:
    - Create a new event with data from the client user.
*/
var admin = require("firebase-admin");

module.exports = function (request, response) {
  var newEventData = request.body;
  var userEventData;
  admin.database().ref("sessions").child(newEventData.tEmail.replace(/\./g, "_")).once("value")
  .then(function (snapshot) {
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      throw { code: "fetch/null_session_snapshot" };
    }
  })
  .then(function (session) {
    if (newEventData.tHash === session.hash) {
      newEventData.tEmail = null;
      newEventData.tHash = null;
      newEventData.owner = session.uid;
      newEventData.eid = admin.database().ref("events").push().key;
      newEventData.raised = 0;
      newEventData.createdOn = Date.now();
      return admin.database().ref("events").child(newEventData.eid).set(newEventData);
    } else {
      throw { code: "auth/invalid_session_credentials" };
    }
  })
  .then(function () {
    userEventData = {
      eid       : newEventData.eid,
      createdOn : newEventData.createdOn
    };
    return admin.database().ref("users").child(newEventData.owner).child("events").push(userEventData);
  })
  .then(function () {
    response.status(200);
    response.json(userEventData);
    response.end();
  })
  .catch(function (error) {
    console.log(error);
    switch (error.code) {
      default:
        response.status(500);
        response.end();
    }
  });
}
