/*
  eventDetails.route.js
  Written By: Derek Johnston
  Copyright 2017 J&P Innovations Inc.

  @desc:
    - Handle a request for an event object given a specific event id.
*/
var admin = require("firebase-admin");

module.exports = function (request, response) {
  var fetchData = request.body;

  admin.database().ref("sessions").child(fetchData.tEmail.replace(/\./g, "_")).once("value")
  .then(function (snapshot) {
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      throw { code: "fetch/null_session_snapshot" };
    }
  })
  .then(function (session) {
    if (fetchData.tHash === session.hash) {
      fetchData.uid = session.uid;
      return admin.database().ref("events").child(fetchData.eid).once("value");
    } else {
      throw { code: "auth/invalid_session_credentials" };
    }
  })
  .then(function (snapshot) {
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      throw { code: "fetch/null_event_snapshot" }
    }
  })
  .then(function (eventDetails) {
    if (eventDetails.owner === fetchData.uid) {
      return eventDetails;
    } else {
      throw { code: "auth/data_access_denied" };
    }
  })
  .then(function (eventDetails) {
    response.json(eventDetails);
    response.status(200);
    response.end();
  })
  .catch(function (error) {
    console.log(error)
    switch (error.code) {
      default:
        response.status(500);
    }
    response.end();
  })
};
