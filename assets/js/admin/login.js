"use strict";
$("#show_hide_password a").on("click", function (event) {
  event.preventDefault();
  if ($("#show_hide_password input").attr("type") == "text") {
    $("#show_hide_password input").attr("type", "password");
    $("#show_hide_password i").addClass("bx-hide");
    $("#show_hide_password i").removeClass("bx-show");
  } else if ($("#show_hide_password input").attr("type") == "password") {
    $("#show_hide_password input").attr("type", "text");
    $("#show_hide_password i").removeClass("bx-hide");
    $("#show_hide_password i").addClass("bx-show");
  }
});
$("#login").on("click", function (event) {
  event.preventDefault();
  var username = document.querySelector("#inputEmailAddress").value;
  var password = document.querySelector("#inputChoosePassword").value;
  var dataPost = {
    username: username,
    password: password,
  };
  fetch("https://hanoifoodbank.herokuapp.com/api/v1/hfb/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataPost),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status != "403") {
        fetch(
          `https://hanoifoodbank.herokuapp.com/api/v1/hfb/users/roles?username=${username}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${data.data.access_token}`,
            },
          }
        )
          .then((response) => response.json())
          .then((res) => {
            if (res.data[0].name == "ROLE_ADMIN") {
              if (data.status == 200) {
                document.cookie = `token=${data.data.access_token}`;
                document.cookie = `username=${username}`;
                document.querySelector(".wrapper").remove();
                startLoad(document.cookie);
              }
            } else {
              swal("Error!", "You are not allowed to access", "error");
            }
          });
      } else {
        swal("Error!", "Incorrect account or password", "error");
      }
    })
    .catch(function (error) {
      console.log(error);
    });
});
