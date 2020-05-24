console.log('hello!!');

$(document).ready(() => {
    $("#submit").click(() => {
        $.ajax({
            url: 'login',
            type: 'POST',
            data: 'json',
            success: (data) => {
                console.log('ajax', data);
                $('.msg').html(data);
            }
        })
    })
})