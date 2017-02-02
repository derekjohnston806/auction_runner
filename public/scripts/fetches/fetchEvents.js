/*
  fetchEvents.js
  Written By: Derek Johnston
  Copyright 2017 J&P Innovations Inc.

  @desc:
    - Fetch a listing of all the events and display them in the table.
*/
function fetchEvents() {
  $.ajax({
    type: "POST",
    url: "events",
    data: {
      tEmail: localStorage.getItem("auctioneer-email"),
      tHash : localStorage.getItem("auctioneer-hash"),
    },
    success: function (data, textStatus, xhr) {
      for (var key in data) {
        var eventData = data[key];
        var eventHTML = "<tr id=\"" + eventData.eid + "\" class=\"event-table-row\">" +
        "<td>" + eventData.name + "</td>" +
        "<td>" + eventData.date + "</td>" +
        "<td>" + eventData.location + "</td>" +
        "<td>{Add Participant Count}</td>" +
        "<td>" + eventData.goal + "</td>" +
        "<td>" + eventData.raised + "</td>" +
        "</tr>";

        $("#event-table-empty").remove();
        $("#event-table-body").append(eventHTML);
      }
    },
    error: function (xhr, textStatus, errorThrown) {
      console.error("Events fetch failed with status:", xhr.status);
    }
  });
}
