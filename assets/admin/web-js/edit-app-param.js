
adminGetAppParamInfo();
function adminGetAppParamInfo() {
	var formData = new FormData();
	formData.append('key', $("#key").val());
	fetch('/admin-get-app-param-info', { method: 'POST', body: formData })
	.then(function(res) {
		if(res.ok) {
			return res.json();
		}
		notify_req_failed();
	})
	.then(function(result) {
    	var statusCode = result.status_code;
    	if (statusCode == '100') {
    		var app_param_info = result.data.app_param_info;

    		if (app_param_info) {
    			$("#value").val(app_param_info.value);
    			$("#remarks").val(app_param_info.remarks);
    		
    		}
    	} else {
    		var errors = result.error;
    		if (errors && errors.length > 0) {
    			notify_err(errors[0].message);
    		}
    	}
	})
	.catch(function(err) {
		notify_server_err();
	});
}

$("#removeBtn").on('click', function(e) {
    e.preventDefault();
    $("#modalRemove").modal('show');
});

$("#confirmRemove").on('click', function() {
    var formData = new FormData();
    formData.append('key', $("#key").val());

    fetch('/admin-remove-app-param', { method: 'POST', body: formData })
    .then(function(res) {
        if(res.ok) {
            return res.json();
        }
        notify_req_failed();
    })
    .then(function(result) {
        var statusCode = result.status_code;
        if (statusCode == '100') {
            window.location.href = '/adminer/app-param?remove_success=1';
        } else {
            var errors = result.error;
            if (errors && errors.length > 0) {
                notify_err(errors[0].message);
            }
        }
    })
    .catch(function(err) {
        notify_server_err();
    });
});

$("#appParamForm").validate({
	rules: {
		key: {
			required: true,
			minlength: 5
		},
		value: {
			required: true
		}
	},
	messages: {
		key: {
			required: "Please enter App Param ID.",
			minlength: "App Param ID must consist of at least 5 characters."
		},
		value: {
			required: "Please enter Value."
		}
	},
	submitHandler: function(form) {
		var formData = new FormData();
		formData.append('key', $("#key").val());
		formData.append('value', $("#value").val());
		formData.append('remarks', $("#remarks").val());

		fetch('/admin-update-app-param', { method: 'POST', body: formData })
		.then(function(res) {
			if(res.ok) {
				return res.json();
			}
			notify_req_failed();
		})
		.then(function(result) {
	    	var statusCode = result.status_code;
	    	if (statusCode == '100') {
	    		notify_success('Update App Param successfully.');
	    	} else {
	    		var errors = result.error;
	    		if (errors && errors.length > 0) {
					notify_err(errors[0].message);
	    		}
	    	}
		})
		.catch(function(err) {
			notify_server_err();
		});
	}
});
