/*
  newBid.route.js
  Written By: Derek Johnston
  Copyright 2017 J&P Innovations Inc.

  @desc:
    - Update a new bid from a client event.
*/
var admin = require("firebase-admin");

module.exports = function (request, response) {
  var bidData = request.body;
  var participant;
  admin.database().ref("sessions").child(bidData.tEmail.replace(/\./g, "_")).once("value")
  .then(function (snapshot) {
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      throw { code: "fetch/null_session_snapshot" };
    }
  })
  .then(function (session) {
    if (bidData.tHash === session.hash) {
      var eid = bidData.eid;
      bidData.tEmail = null;
      bidData.tHash = null;
      bidData.id = admin.database().ref("events").child(eid).child("bids").push().key;
      bidData.createdOn = Date.now();
      return admin.database().ref("events").child(eid).child("bids").child(bidData.id).set(bidData);
    } else {
      throw { code: "auth/invalid_session_credentials" };
    }
  })
  .then(function () {
    return admin.database().ref("events").child(bidData.eid).child("participants").child(bidData.bidderID).once("value");
  })
  .then(function (snapshot) {
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      throw { code: "fetch/null_participant_snapshot" };
    }
  })
  .then(function (participantData) {
    participant = participantData;
    participant.contribution = Number(participant.contribution) + Number(bidData.amount);
    return admin.database().ref("events").child(bidData.eid).child("participants").child(bidData.bidderID).set(participant);
  })
  .then(function () {
    var bidParticipantData = {
      name: participant.name,
      number: participant.bidNumber
    };
    return admin.database().ref("events").child(bidData.eid).child("bids").child(bidData.id).update(bidParticipantData);
  })
  .then(function () {
    return admin.database().ref("events").child(bidData.eid).once("value");
  })
  .then(function (snapshot) {
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      throw { code: "fetch/null_event_snapshot" };
    }
  })
  .then(function (eventData) {
    eventData.raised = Number(eventData.raised) + Number(bidData.amount);
    return admin.database().ref("events").child(bidData.eid).set(eventData);
  })
  .then(function () {
    response.json({
      bidID     : bidData.id,
      bidNumber : participant.bidNumber,
      bidName   : participant.name,
      bidAmount : bidData.amount,
    });
    response.status(200);
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
};
