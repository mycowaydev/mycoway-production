
// Constant variables declaration
const config = require('./config');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const formData = require('express-form-data');
const os = require('os');
const passport = require('passport');
const mongoose = require('mongoose');
const port = process.env['PORT'] || 3000;

const Log = require('./api/' + config.GLOBAL['API_VERSION'] + '/model/log');
const MongoStore = require('connect-mongodb-session')(session);

// Connect to MongoDB
mongoose.connect(config.DB['URI'], { autoIndex: false, useNewUrlParser: true }, function (err) {
	if (err) {
		console.log('Failed to connect to database.');
		return;
	}
	console.log('Successfully connected to database.');
});

/**
 * Options are the same as multiparty takes.
 * But there is a new option "autoClean" to clean all files in "uploadDir" folder after the response.
 * By default, it is "false".
 */
const options = {
  uploadDir: os.tmpdir(),
  autoClean: false
};

// Initialization
var app = express();
app.use(bodyParser.text({
    verify: function(req, res, buf, encoding) {
    	req.signBody = config.hashSHA256(buf);
    	req.rawBody = buf.toString();
    }
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// Parse data with connect-multiparty. 
app.use(formData.parse(options));
// Clear from the request and delete all empty files (size == 0)
app.use(formData.format());
// Change file objects to stream.Readable 
app.use(formData.stream());
// Union body and files
app.use(formData.union());
// Access to public assets
app.use(express.static('assets/public'));
app.use(express.static('assets/admin'));
// Create session middleware
app.use(
	session({
		store: new MongoStore({
			uri: config.DB['URI'],
			collection: config.DB['TBL_SESSION']
		}),
		cookie: { maxAge: config.GLOBAL['WEB_SESSION_EXPIRES'] },
		secret: config.GLOBAL['WEB_SESSION_SECRET'],
		resave: true,
		saveUninitialized: false
	})
);

// Set default engine extension
app.set('view engine', 'html');
// Map the PUG template engine to “.html” files
app.engine('html', require('pug').__express);

// API routes
app.use('/', require('./routes')('v1.0'));
app.use('/', require('./routes-web')('v1.0'));

// Port listening
var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Listening at http://%s:%s', host, port);
});
