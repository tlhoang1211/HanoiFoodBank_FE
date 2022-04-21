"use strict";
$("#show_hide_password a").on('click', function (event) {
    event.preventDefault();
    if ($('#show_hide_password input').attr("type") == "text") {
        $('#show_hide_password input').attr('type', 'password');
        $('#show_hide_password i').addClass("bx-hide");
        $('#show_hide_password i').removeClass("bx-show");
    } else if ($('#show_hide_password input').attr("type") == "password") {
        $('#show_hide_password input').attr('type', 'text');
        $('#show_hide_password i').removeClass("bx-hide");
        $('#show_hide_password i').addClass("bx-show");
    }
});
$("#login").on('click', function (event) {
    event.preventDefault();
    var username = document.querySelector('#inputEmailAddress').value;
    var password = document.querySelector('#inputChoosePassword').value;
    var dataPost = {
        username: username,
        password: password,
        };
    fetch('https://hfb-t1098e.herokuapp.com/api/v1/hfb/login', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(dataPost),
    })
    .then((response) => response.json())
    .then(function (data) {
        if (data.status == 200) {
            document.cookie = `token=${data.data.access_token}`;
            document.cookie = `username=${username}`;
            document.querySelector('.wrapper').remove();
            startLoad(document.cookie);
        } else {
        // createNotification('Incorrect account or password', 'error');
        }
    })
    .catch(function (error) {
        console.log(error);
    });
})