/*
  handleSignUpFormSubmit.js
  Written By: Derek Johnston
  Copyright 2017 J&P Innovations Inc.

  @desc:
    - Handle the submission of 'Sign Up' form by validating the input and submitting a
      newUser POST request to the server.
*/
function handleSignUpFormSubmit(event) {
  event.preventDefault();
  console.log("Submitting new user data...");

  var newUserData = {
    name    : $("#signup-name").val(),
    orgName : $("#signup-org-name").val(),
    email   : $("#signup-email").val(),
    password: $("#signup-password").val()
  };

  console.log("Validating new user data...");
  if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(newUserData.email) === false) {
    console.log("New user data (email) is invalid.");
    $("#signup-error-message").html("Please enter a valid email address.");
    $("#signup-error").show();
    setTimeout(function () { $("#signup-error").hide(); }, 5000);
  } else if (newUserData.name.length < 2) {
    console.log("New user data (name) is invalid.");
    $("#signup-error-message").html("Your name must be at least 2 characters.");
    $("#signup-error").show();
    setTimeout(function () { $("#signup-error").hide(); }, 5000);
  } else if (newUserData.orgName.length < 2) {
    $("#signup-error-message").html("Your organization name must be at least 2 characters.");
    console.log("New user data (orgName) is invalid.");
    $("#signup-error").show();
    setTimeout(function () { $("#signup-error").hide(); }, 5000);
  } else if (newUserData.password.length < 8) {
    console.log("New user data (password) is invalid.");
    $("#signup-error-message").html("Your password must be at least 8 characters.");
    $("#signup-error").show();
    setTimeout(function () { $("#signup-error").hide(); }, 5000);
  } else {
    console.log("New user data validated successfully...");
    console.log("Attempting to create new user account...")
    $.ajax({
      type: "POST",
      url : "/newUserAccount",
      data: newUserData,
      success: function (data, textStatus, xhr) {
        console.log("New user account creation succeeded with data:", data);
        localStorage.setItem("auctioneer-hash", data.hash);
        localStorage.setItem("auctioneer-timestamp", data.timestamp);
        localStorage.setItem("auctioneer-email", data.email);
        window.location.href = "dashboard";
      },
      error: function (xhr, textStatus, errorThrown) {
        console.log("New user account creation failed with error code:", xhr.status);
        switch(xhr.status) {
          case 501:
            $("#signup-error-message").html("An account for email address <strong>" + newUserData.email + "</strong> already exists.");
            $("#signup-error").show();
            setTimeout(function () { $("#signup-error").hide(); }, 5000);
            break;
          default:
            $("#signup-error-message").html("We're sorry! An unknown error occured, please try again.");
            $("#signup-error").show();
            setTimeout(function () { $("#signup-error").hide(); }, 5000);
            break;
        }
      },
      dataType: "json"
    });
  }
}
