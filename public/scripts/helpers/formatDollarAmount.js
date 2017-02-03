/*
  formatDollarAmount.js
  Written By: Derek Johnston
  Copyright 2017 J&P Innovations Inc.

  @desc:
    - Take in a number representing a dollar amount. Return a formatted string.

  @params:
    - Number amount: The dollar amount being formatted.

  @returns:
    - String: A formatted string for displaying an amount of money.
*/
function formatDollarAmount(amount) {
  console.log("amount", amount);
  if (amount) {
    return "$" + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else if (amount === "null" || amount === "") {
    return "";
  } else {
    return "$0.00";
  }
}
