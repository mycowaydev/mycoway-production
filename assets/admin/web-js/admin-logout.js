
var btnLogout = document.getElementById('btnLogout');
btnLogout.onclick = function() {
	logoutAdmin();
}

function logoutAdmin() {
	fetch('/logout-admin', { method: 'POST' })
		.then(function(res) {
			if(res.ok) {
				window.location.href = '/admin/login';
			}
			else{
				notify_req_failed();
			}
	    })
	    .catch(function(err) {
	    	notify_server_err();
	    });
}
