
var btnLogin = document.getElementById('btnLogin');
btnLogin.onclick = function() {
	verifyAdminLogin();
}

var adminUserId = document.getElementById('adminUserId');
adminUserId.addEventListener('keyup', function(event) {
	if (event.keyCode === 13) {
		document.getElementById('btnLogin').click();
	}
});
var adminPassword = document.getElementById('adminPassword');
adminPassword.addEventListener('keyup', function(event) {
	if (event.keyCode === 13) {
		document.getElementById('btnLogin').click();
	}
});

function verifyAdminLogin() {
	var formData = new FormData();
	formData.append('user_id', adminUserId.value);
	formData.append('password', adminPassword.value);
	fetch('/verify-admin-login', { method: 'POST', body: formData })
		.then(function(res) {
			if(res.ok) {
				return res.json();
			}
			notify_req_failed();
	    })
	    .then(function(result) {
	    	var statusCode = result.status_code;
	    	if (statusCode == '100') {
	    		var adminInfo = result.data.admin_info;
	    		document.cookie = 'username=' + adminInfo.adminUsername + ';expires=' + getCookieExpiresTime() + ';path=/';
	    		document.cookie = 'profile_img=' + adminInfo.adminProfileImg + ';expires=' + getCookieExpiresTime() + ';path=/';
	    		window.location.href = '/adminer/healthy-tip';
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

function getCookieExpiresTime() {
	var d = new Date();
	d.setTime(d.getTime() + (7 * 24 * 60 * 60 * 1000)); // 1 week
	return d.toUTCString();
}

function getString(value) {
	return value && value.toString().trim().length > 0 ? value : '';
}

function getStringWithDash(value) {
	return value && value.toString().trim().length > 0 ? value : '-';
}

function isEmpty(value) {
	return !value || value.toString().trim().length <= 0;
}
