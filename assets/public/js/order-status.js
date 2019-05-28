function getOrderByID(id) {
    var formData = new FormData();
    formData.set('order_id', id);

    fetch('/user-order-get-status', { method: 'POST', body: formData })
        .then(function (res) {
            if (res.ok) {
                return res.json();
            }
            notify_req_failed();
            alert(getStringById('alert_request_fail'));
        })
        .then(function (result) {
            if (result.status_code == '100') {
                notify_success('request successfully.');
                getValueByCode(result.data);
            } else {
                notify_err(errors[0].message);
                alert( getStringById('alert_request_fail') + errors[0].message );
            }
        })
        .catch(function (err) {
            notify_server_err();
            alert( getStringById('alert_request_fail'));
        })
        .finally(function () {
             $("#pageloader").fadeOut();
        })
}

function getValueByCode(code) {
    console.log('debug - code: ' + code);
    var formData = new FormData();
    formData.set('group', 'ORDER_STATUS');
    formData.set('code', code);

    fetch('/user-get-mt-param-value', { method: 'POST', body: formData })
        .then(function (res) {
            if (res.ok) {
                return res.json();
            }
            notify_req_failed();
            alert( getStringById('alert_request_fail'));
        })
        .then(function (result) {
            if (result.status_code == '100') {
                notify_success('request successfully.');
                $('#order_status').html(result.data)
            } else {
                notify_err(errors[0].message);
                alert( getStringById('alert_request_fail') + errors[0].message );
            }
        })
        .catch(function (err) {
            notify_server_err();
            alert( getStringById('alert_request_fail'));
        })
        .finally(function () {
        })
}

$("#pageloader").fadeIn()
console.log('order_id: ' + order_id)

$('#order_no').html(order_id)
getOrderByID(order_id)

