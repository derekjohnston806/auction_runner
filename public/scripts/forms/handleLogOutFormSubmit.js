/*
  handleLogOutFormSubmit.js
  Written By: Derek Johnston
  Copyright 2017 J&P Innovations Inc.

  @desc:
    - Log the user out of their current session and return to the landing scene.
*/
function handleLogOutFormSubmit(event) {
  event.preventDefault();
  localStorage.clear();
  window.location.href = "/";
}
