
function notify_success(msg, title) {
	new PNotify({
		title: title ? title : 'Success',
		text: msg,
		type: 'success',
		buttons: {
			sticker: false
		},
		styling: 'bootstrap3'
	});
}

function notify_req_failed() {
	new PNotify({
		title: 'Error',
		text: 'Request failed.',
		type: 'error',
		buttons: {
			sticker: false
		},
		styling: 'bootstrap3'
	});
}

function notify_err(errMsg) {
	new PNotify({
		title: 'Error',
		text: errMsg,
		type: 'error',
		buttons: {
			sticker: false
		},
		styling: 'bootstrap3'
	});
}

function notify_server_err() {
	new PNotify({
		title: 'Error',
		text: 'Unable to connect server.',
		type: 'error',
		buttons: {
			sticker: false
		},
		styling: 'bootstrap3'
	});
}
