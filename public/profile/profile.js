//console.log('test');

$(document).ready(function () {
    $.get("/profile/", function (data) {
        //console.log(data);
        $('#username').html(data.username),
        $('#password').html(data.password),
        $('#email').html(data.email)
    }).fail(function (error) {
        console.log(error)
    })
}) 

