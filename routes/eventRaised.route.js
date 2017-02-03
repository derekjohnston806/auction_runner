/*
  eventRaised.route.js
  Written By: Derek Johnston
  Copyright 2017 J&P Innovations Inc.

  @desc:
    - Return the financial information for an event.
*/
var admin = require("firebase-admin");

module.exports = function (request, response) {
  var data = request.body;
  var eventRaisedData = {};
  admin.database().ref("sessions").child(data.tEmail.replace(/\./g, "_")).once("value")
  .then(function (snapshot) {
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      throw { code: "fetch/null_session_snapshot" };
    }
  })
  .then(function (session) {
    if (session.hash === data.tHash) {
      return admin.database().ref("events").child(data.eid).once("value");
    } else {
      throw { code: "auth/session_access_denied" };
    }
  })
  .then(function (snapshot) {
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      throw { code: "fetch/null_event_snapshot" };
    }
  })
  .then(function (eventData) {
    response.status(200);
    response.json({
      raised          : eventData.raised,
      goal            : eventData.goal,
      firstReachGoal  : eventData.firstReachGoal,
      secondReachGoal : eventData.secondReachGoal
    });
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
