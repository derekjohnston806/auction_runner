/*
  setEventDetails.js
  Written By: Derek Johnston
  Copyright 2017 J&P Innovations Inc.

  @desc:
    - Given the details of an event, set the DOM elements for 'event-details.html'
*/
function setEventDetails(eventDetails) {
  $("#event-name").html(eventDetails.name);
  $("#new-participant-link").attr("href", "/new-participant?eid=" + getParameterByName("eid"));
  $("#start-event-link").attr("href", "/run-event?eid=" + getParameterByName("eid"));
  for (var key in eventDetails.participants) {
    var participant = eventDetails.participants[key];
    var participantHTML = "<tr>" +
    "<td>" + participant.bidNumber + "</td>" +
    "<td>" + participant.name + "</td>" +
    "<td>" + participant.email + "</td>" +
    "<td>" + participant.cell + "</td>" +
    "<td>" + participant.contribution + "</td>" +
    "<td><a href=\"participant-details?eid=" + getParameterByName("eid") +"&id=" + participant.id + "\">View Details</a></td>" +
    "</tr>";
    $("#participant-table-empty").remove();
    $("#participant-table-body").append(participantHTML);
  }
}
