/*
  handleBidSelectFormSubmit.js
  Written By: Derek Johnston
  Copyright 2017 J&P Innovations Inc.

  @desc:
    - Handle the submission of a bid select form in 'run-event.html' by saving the bid to both local storage and to
      the database.
*/
function handleBidSelectFormSubmit(event) {
  event.preventDefault();
  var bidData = {
    eid: getParameterByName("eid"),
    tEmail: localStorage.getItem("auctioneer-email"),
    tHash: localStorage.getItem("auctioneer-hash"),
    bidderID: $("#bid-select-number").val(),
    amount: $("#bid-select-amount").val()
  };
  $.ajax({
    type: "POST",
    url: "/newBid",
    data: bidData,
    success: function (data, textStatus, xhr) {
      $("#bid-table-empty").remove();
      var bidHTML = "<tr>" +
      "<td>" + data.bidNumber + "</td>" +
      "<td>" + data.bidName + "</td>" +
      "<td>" + data.bidAmount + "</td>" +
      "<td><a href=\"edit-bid?eid=" + getParameterByName("eid") + "&bidID=" + data.bidID + "\">Edit Details</a></td>" +
      "</tr>";
      $("#bid-table").append(bidHTML);
    },
    error: function (xhr, textStatus, errorThrown) {

    },
    dataType: "json"
  });
}
