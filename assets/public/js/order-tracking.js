function getOrderByID(id) {
    var formData = new FormData();
    formData.append('order_id', id);

    fetch('/user-order-get', { method: 'POST', body: formData })
        .then(function (res) {
            if (res.ok) {
                return res.json();
            }
            notify_req_failed();
            alert( "Request Failed.");
        })
        .then(function (result) {
            if (result.status_code == '100') {
                notify_success('request successfully.');
                // todo show success text
            } else {
                notify_err(errors[0].message);
                alert( "Request Failed. " + errors[0].message );
            }
        })
        .catch(function (err) {
            notify_server_err();
            alert( "Request Failed.");
        })
        .finally(function () {
             $("#pageloader").fadeOut();
        })
}

$( "#order_detail_form" ).submit(function( event ) {
    event.preventDefault();
    $("#pageloader").fadeIn();
    console.log($("#order").val());
    getOrderByID($("#order").val());
});