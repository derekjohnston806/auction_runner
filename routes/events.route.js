/*
  events.route.js
  Written By: Derek Johnston
  Copyright 2017 J&P Innovations Inc.

  @desc:
    - given a request for events, verify the client's credentials and return a json object containing all
      that client's events.
*/
var admin = require("firebase-admin");

module.exports = function (request, response) {
  var fetchData = request.body;
  var eventIDs = [];
  var events = {};

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
      return admin.database().ref("users").child(fetchData.uid).child("events").once("value");
    } else {
      throw { code: "auth/invalid_session_credentials" };
    }
  })
  .then(function (snapshot) {
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      throw { code: "fetch/null_client_events_snapshot" };
    }
  })
  .then(function (clientEvents) {
    for (var key in clientEvents) {
      eventIDs.push(clientEvents[key].eid);
    }
    return;
  })
  .then(function () {
    return admin.database().ref("events").once("value");
  })
  .then(function (snapshot) {
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      throw { code: "fetch/null_events_snapshot" };
    }
  })
  .then(function (systemEvents) {
    for (var key in systemEvents) {
      if (eventIDs.indexOf(key) !== -1) {
        events[key] = systemEvents[key];
      }
    }
    return;
  })
  .then(function () {
    response.status(200);
    response.json(events);
    response.end();
  })
  .catch(function (error) {
    console.log(error);
    switch (error.code) {
      default:
        response.status(500);
    }
    response.end();
  })
};
