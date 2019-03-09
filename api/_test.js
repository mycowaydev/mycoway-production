
const config = require('./../config');

module.exports = function(req, res) {
	// console.log(config.hashSHA256('abcd1234' + config.GLOBAL['ADMIN_TMP_SECRET']));
	res.end();
};
