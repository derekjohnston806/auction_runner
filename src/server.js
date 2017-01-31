/*
  server.js
  Written By: Derek Johnston
  Copyright 2017 J&P Innovations Inc.

  @desc:
    - The main entry-point for the node.js web application.
*/
import express from "express";

const APPLICATION = express();
const PORT = process.env.PORT || 8888;

APPLICATION.listen(PORT, () => {
  console.log("Auction Runner application listening on port:", PORT);
});
