/*
  handleLogInFormSubmit.js
  Written By: Derek Johnston
  Copyright 2017 J&P Innovations Inc.

  @desc:
    - Handle the submission of the 'log in' form by validating the input and
      authenticating the user's credentials with the server.
*/
function handleLogInFormSubmit(event) {
  event.preventDefault();
  console.log("Authenticating user with credentials...");

  var credentials = {
    email   : $("#login-email").val(),
    password: $("#login-password").val()
  };

  console.log("Validating user credentials...");
  if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(credentials.email) === false) {
    $("#login-error-message").html("Please enter a valid email address.");
    $("#login-error").show();
    setTimeout(function () { $("#login-error").hide(); }, 5000);
  } else if (credentials.password.length < 8) {
    $("#login-error-message").html("Passwords must be at least 8 characters.");
    $("#login-error").show();
    setTimeout(function () { $("#login-error").hide(); }, 5000);
  } else {
    console.log("User credentials validated successfully.");
    console.log("Attempting to authenticate user credentials...");
    $.ajax({
      type: "POST",
      url: "/authenticateUserCredentials",
      data: credentials,
      success: function (data, textStatus, xhr) {
        console.log("User credentials authenticated successfully...");
        localStorage.setItem("auctioneer-hash", data.hash);
        localStorage.setItem("auctioneer-timestamp", data.timestamp);
        localStorage.setItem("auctioneer-email", data.email);
        window.location.href = "dashboard";
      },
      error: function (xhr, textStatus, errorThrown) {
        console.log("User authetication failed with status:", xhr.status);
        switch (xhr.status) {
          default:
          $("#login-error-message").html("We're sorry! An unknown error occured, please try again.");
          $("#login-error").show();
          setTimeout(function () { $("#login-error").hide(); }, 5000);
        }
      },
      dataType: "json"
    });
  }
}
