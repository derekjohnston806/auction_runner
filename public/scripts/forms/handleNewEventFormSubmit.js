/*
  handleNewEventFormSubmit.js
  Written By: Derek Johnston
  Copyright 2017 J&P Innovations Inc.

  @desc:
    - Take in the data from the 'new-event' form and upload it to the database.
*/
function handleNewEventFormSubmit(event) {
  event.preventDefault();
  var newEventData = {
    tEmail  : localStorage.getItem("auctioneer-email"),
    tHash   : localStorage.getItem("auctioneer-hash"),
    name    : $("#new-event-name").val(),
    location: $("#new-event-location").val(),
    date    : $("#new-event-date").val(),
    goal    : $("#new-event-goal").val(),
    firstReachGoal  : $("#new-event-first-reach-goal").val(),
    secondReachGoal : $("#new-event-second-reach-goal").val()
  };

  $.ajax({
    type: "POST",
    url: "/newEvent",
    data: newEventData,
    success: function (data, textStatus, xhr) {
      window.location.href = "/dashboard";
    },
    error: function (xhr, textStatus, errorThrown) {
      console.log("New event creation failed with status:", xhr.status);
      switch (xhr.status) {
        default:
          $("#new-event-error-message").html("We're sorry! An unknown error occured, please try again.");
          $("#new-event-error").show();
          setTimeout(function () { $("#new-event-error").hide() }, 5000);
      }
    },
    dataType: "json"
  });
}
