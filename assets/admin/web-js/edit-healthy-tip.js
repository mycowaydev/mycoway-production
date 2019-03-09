
adminGetHealthyTipInfo();
function adminGetHealthyTipInfo() {
	var formData = new FormData();
	formData.append('healthy_tips_id', $("#healthy_tips_id").val());
	fetch('/admin-get-healthy-tip-info', { method: 'POST', body: formData })
	.then(function(res) {
		if(res.ok) {
			return res.json();
		}
		notify_req_failed();
	})
	.then(function(result) {
    	var statusCode = result.status_code;
    	if (statusCode == '100') {
    		var healthy_tip_info = result.data.healthy_tip_info;

    		if (healthy_tip_info) {
    			$("#title").val(healthy_tip_info.title);
    			$("#description").val(healthy_tip_info.description);
    			$("#image").val(healthy_tip_info.image);
    			$("#modalImgPreview").attr('src', healthy_tip_info.image);

    			$("#modalTitle").val(healthy_tip_info.title);

    			$("#image").attr("placeholder", "");
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
    formData.append('healthy_tips_id', $("#healthy_tips_id").val());

    fetch('/admin-remove-healthy-tip', { method: 'POST', body: formData })
    .then(function(res) {
        if(res.ok) {
            return res.json();
        }
        notify_req_failed();
    })
    .then(function(result) {
        var statusCode = result.status_code;
        if (statusCode == '100') {
            window.location.href = '/adminer/healthy-tip?remove_success=1';
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
		formData.append('healthy_tips_id', $("#healthy_tips_id").val());
		formData.append('title', $("#title").val());
		formData.append('description', $("#description").val());

		// Get the selected files from the input.
		var files = document.getElementById('newImage').files;

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

		fetch('/admin-update-healthy-tip', { method: 'POST', body: formData })
		.then(function(res) {
			if(res.ok) {
				return res.json();
			}
			notify_req_failed();
		})
		.then(function(result) {
	    	var statusCode = result.status_code;
	    	if (statusCode == '100') {
	    		var newHealthyTipInfo = result.data.healthy_tip_info;
	    		$("#image").val(newHealthyTipInfo.image);
	    		$("#modalImgPreview").attr('src', newHealthyTipInfo.image);
	    		$("#newImage").val('');

	    		notify_success('Update healthy tip successfully.');
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
