/*
  server.js
  Written By: Derek Johnston
  Copyright 2017 J&P Innovations Inc.

  @desc:
    - The primary endpoint for the express.js application.
*/
require("./helpers/firebase/initializeFirebase")();

var express = require("express"),
    bodyParser = require("body-parser"),
    port = process.env.PORT || 5000,
    app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public", {
  extensions: ['html']
}));

// API ROUTES
app.post("/newUserAccount", require("./routes/newUserAccount.route"));
app.post("/authenticateUserCredentials", require("./routes/authenticateUserCredentials.route"));

app.listen(port, function () {
  console.log("Auction runner application listening on port:", port);
});
