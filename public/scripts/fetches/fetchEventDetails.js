/*
  fetchEventDetails.js
  Written By: Derek Johnston
  Copyright 2017 J&P Innovations Inc.

  @desc:
    - Request an event object from the server and store the json object in local storage.
*/
function fetchEventDetails(callback) {
  $.ajax({
    type: "POST",
    url: "/eventDetails",
    data: {
      eid   : getParameterByName("eid"),
      tEmail: localStorage.getItem("auctioneer-email"),
      tHash : localStorage.getItem("auctioneer-hash")
    },
    success: function (data, textStatus, xhr) {
      localStorage.setItem("auctioneer-event-details", JSON.stringify(data));
      callback(data);
    },
    error: function (xhr, textStatus, errorThrown) {
      console.log("Event details fetch failed with status:", xhr.status);
    },
    dataType: "json"
  });

}
