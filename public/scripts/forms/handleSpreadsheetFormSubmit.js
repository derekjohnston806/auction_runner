/*
  handleSpreadsheetFormSubmit.js
  Written By: Derek Johnston
  Copyright 2017 J&P Innovations Inc.

  @desc:
    - When the user uploads a participant spreadsheet, parse the data and upload it to the database. then
      invoke an asynchronous callback method with the participant data. This is to update the participant table.
*/

function handleSpreadsheetFormSubmit(event) {
  event.preventDefault();
  if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
      console.log('The File APIs are not fully supported in this browser.');
      return;
    }

  var fileInput = document.getElementById("spreadsheet-upload");

  if (!fileInput) {
    console.log("Could not find the file input element.");
  } else if (!fileInput.files) {
    console.log("This browser doesn't seem to support the `files` property of file inputs.");
  } else if (!fileInput.files[0]) {
    console.log("Please select a spreadsheet file to upload.")
  } else {
    var file = fileInput.files[0];
    var reader = new FileReader();
    reader.onload = function (event) {
      $("#participant-table-body").html("");
      var data = event.target.result;
      var workbook = XLSX.read(data, { type: "binary" });
      var participantData = {};
      workbook.SheetNames.forEach(function (sheetName) {
        var participants = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
        for (var i = 0 ; i < participants.length; i++) {
          var eid = getParameterByName("eid");
          participantData[eid + "_participant_" + i] = {};
          participantData[eid + "_participant_" + i].id = eid + "_participant_" + i;
          participantData[eid + "_participant_" + i].bidNumber = participants[i]["Bid Number"];
          participantData[eid + "_participant_" + i].business = participants[i]["Business"];
          participantData[eid + "_participant_" + i].cell = participants[i]["Cell Number"];
          participantData[eid + "_participant_" + i].email = participants[i]["Email"];
          participantData[eid + "_participant_" + i].mailingAddress = participants[i]["Mailing Address"];
          participantData[eid + "_participant_" + i].mailingCity = participants[i]["Mailing City"];
          participantData[eid + "_participant_" + i].mailingState = participants[i]["Mailing St"];
          participantData[eid + "_participant_" + i].mailingZip = participants[i]["Mailing Zip"];
          participantData[eid + "_participant_" + i].name = participants[i]["Name"];
          participantData[eid + "_participant_" + i].work = participants[i]["Work Number"];
          participantData[eid + "_participant_" + i].tHash = localStorage.getItem("auctioneer-hash");
          participantData[eid + "_participant_" + i].tEmail = localStorage.getItem("auctioneer-email");
          participantData[eid + "_participant_" + i].contribution = 0;
          participantData[eid + "_participant_" + i].timestamp = Date.now();
          participantData[eid + "_participant_" + i].eid = eid;

          var participant = participants[i];
          var participantHTML = "<tr>" +
          "<td>" + participantData[eid + "_participant_" + i].bidNumber + "</td>" +
          "<td>" + participantData[eid + "_participant_" + i].name + "</td>" +
          "<td>" + participantData[eid + "_participant_" + i].email + "</td>" +
          "<td>" + participantData[eid + "_participant_" + i].cell + "</td>" +
          "<td>" + participantData[eid + "_participant_" + i].contribution + "</td>" +
          "<td><a href=\"participant-details?id=" + participantData[eid + "_participant_" + i].id + "\">View Details</a></td>" +
          "</tr>";
          $("#participant-table-body").prepend(participantHTML);

          $.ajax({ type: "POST", url: "/addParticipantBulk", data: participantData[eid + "_participant_" + i] });
        }
      });
      $("#spreadsheet-modal").modal("hide");
    };
    reader.readAsBinaryString(file);
  }
}
