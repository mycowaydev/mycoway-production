module.exports = function(req, res) {
	if (req.session) {
		req.session.destroy(function(err) {
			if (err) {
				console.log(err);
			}
			res.end();
		});
	} else {
		res.end();
	}
};