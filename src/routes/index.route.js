/*
  index.route.js
  Written By: Derek Johnston
  Copyright 2017 J&P Innovations Inc.

  @desc:
    - Handle a GET request for the '/' route.
*/
import React from "react";
import ReactDOMServer from "react-dom/server";
import HelloWorld from "../components/HelloWorld.react";

export default function (request, response) {
  console.log("REQUEST: PATH = '/' TYPE = ',GET', TIMESTAMP = ", new Date().toLocaleString());
  const HTML = ReactDOMServer.renderToString(<HelloWorld />);
  response.send(HTML);
}
