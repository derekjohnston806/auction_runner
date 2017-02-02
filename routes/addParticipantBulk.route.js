/*
  addParticipantBulk.route.js
  Written By: Derek Johnston
  Copyright 2017 J&P Innovations Inc.

  @desc:
    - Given a json object for a new event participant, add that participant to the event's participant database.
*/
var admin = require("firebase-admin");

module.exports = function (request, response) {
  var participantData = request.body;
  console.log("participant:", participantData);

  admin.database().ref("sessions").child(participantData.tEmail.replace(/\./g, "_")).once("value")
  .then(function (snapshot) {
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      throw { code: "fetch/null_session_snapshot" };
    }
  })
  .then(function (session) {
    if (participantData.tHash === session.hash) {

      if (Date.now() - participantData.timestamp > 5000) {
        return admin.database().ref("events").child(participantData.eid).child("participants").set(null);
      } else {
        return participantData;
      }
    } else {
      throw { code: "auth/invalid_session_credentials" };
    }
  })
  .then(function (participantData) {
    var eid = participantData.eid;
    participantData.tHash = null;
    participantData.tEmail = null;
    participantData.eid = null;
    return admin.database().ref("events").child(eid).child("participants").child(participantData.id).set(participantData);
  })
  .then(function () {
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
  });
};
