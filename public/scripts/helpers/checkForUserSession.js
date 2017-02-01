/*
  checkForUserSession.js
  Written By: Derek Johnston
  Copyright 2017 J&P Innovations Inc.

  @desc:
    - Check for an existing user session by getting the session tokens from local storage
      and verify them against the session database.
*/
function checkForUserSession() {
  var credentials = {
    email     : localStorage.getItem("auctioneer-email"),
    hash      : localStorage.getItem("auctioneer-hash"),
    timestamp : localStorage.getItem("auctioneer-timestamp")
  };
  $.ajax({
    type: "POST",
    url: "/checkForUserSession",
    data: credentials,
    success: function (data, textStatus, xhr) {
      localStorage.setItem("auctioneer-hash", data.hash);
      localStorage.setItem("auctioneer-timestamp", data.timestamp);
      localStorage.setItem("auctioneer-email", data.email);
      window.location.href = "dashboard";
    },
    dataType: "json"
  });
}
