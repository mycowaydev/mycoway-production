
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

		fetch('/admin-add-app-param', { method: 'POST', body: formData })
			.then(function(res) {
				if(res.ok) {
					return res.json();
				}
				notify_req_failed();
			})
			.then(function(result) {
				var statusCode = result.status_code;
				if (statusCode == '100') {
					window.location.href = '/adminer/app-param?success=1';
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
