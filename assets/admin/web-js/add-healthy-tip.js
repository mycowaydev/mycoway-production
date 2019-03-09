
$("#healthyTipForm").validate({
	rules: {
		title: {
			required: true,
			minlength: 5
		},
		description: {
			required: true
		}
	},
	messages: {
		title: {
			required: "Please enter title.",
			minlength: "Title must consist of at least 5 characters."
		},
		description: {
			required: "Please enter description."
		}
	},
	submitHandler: function(form) {
		var formData = new FormData();
		formData.append('title', $("#title").val());
		formData.append('description', $("#description").val());
		// Get the selected files from the input.
		var files = document.getElementById('image').files;
		// Loop through each of the selected files.
		for (var i = 0; i < files.length; i++) {
			var file = files[i];
			// Check the file type.
			if (!file.type.match('image/*') || file.type == 'image/gif') {
				continue;
			}
			// Add the file to the request.
			formData.append('image', file, file.name);
		}
		fetch('/admin-add-healthy-tip', { method: 'POST', body: formData })
			.then(function(res) {
				if(res.ok) {
					return res.json();
				}
				notify_req_failed();
			})
			.then(function(result) {
				var statusCode = result.status_code;
				if (statusCode == '100') {
					window.location.href = '/adminer/healthy-tip?success=1';
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
