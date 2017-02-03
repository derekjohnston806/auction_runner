/*
  formatOptionalString.js
  Written By: Derek Johnston
  Copyright 2017 J&P Innovations Inc.

  @desc:
    - Check to see if a string exists and dislay a formatted output.
*/
function formatOptionalString(name) {
  console.log("Optional String", name);
  if (name !== "null") {
    return name;
  } else {
    return ""
  }
}
