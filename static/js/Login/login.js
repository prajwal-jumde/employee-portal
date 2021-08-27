function validate_login() {
    var username = $('#username').val();
    var password = $('#password').val();
    console.log('username',username)
    var userList = document.getElementsByName("user");
    for (i = 0; i < userList.length; i++) {
        if (userList[i].checked) {
            var user = userList[i].value;
        }
    }
    var reqBody = JSON.stringify({
        "username": username,
        "password": password,
        "user": user
    });

    $.ajax({
        type: "post",
        url: "check-cred/",
        data: reqBody,
        success: function (data) {
            if (data.RoleOfUser == "admin") {
                window.location.replace(ROOT_URL + "users/");
            }
            else{
                window.location.replace(ROOT_URL + "users/dashboard/");
            }
        },
        error: function (err) {
            console.log(err)
            $("#hide-error").removeClass("hide");
        }
    })
}

$(document).ready(function () {
    $('input').keypress(function (event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') {
            validate_login();
        }
    });
});  