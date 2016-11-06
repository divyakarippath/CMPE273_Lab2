/**
 * New node file
 */

var mq_client = require('../rpc/client');
var SimpleNodeLogger = require('simple-node-logger'), opts = {
	logFilePath : 'mylogfile.log',
	timestampFormat : 'YYYY-MM-DD HH:mm:ss.SSS'
}, log = SimpleNodeLogger.createSimpleLogger(opts);
var log = SimpleNodeLogger.createSimpleFileLogger('project.log');


// Redirects to the homepage
exports.redirectToHomepage = function(req, res) {
	
	
		// Set these headers to notify the browser not to maintain any cache for
		// the page being loaded
		log.info("The user " + req.user.username + " accessing /homepage");
		console.log("The user " + req.user.username + " accessing /homepage");
		res
				.header(
						'Cache-Control',
						'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("homepage", {
			lastlogin : req.user.lastlogin.substring(0, 25),
			name : req.user.firstname
		});
	
};

exports.userprofile = function(req, res) {
	
		log.info("The user " + req.user.username + " accessing /userprofile");
		res.render("profilepage", {
			email : req.user.username,
			birthday : req.user.birthday,
			mob : req.user.mobile,
			location : req.user.city + ", " + req.user.state,
			name : req.user.firstname,
			lastname : req.user.lastname,
			lastlogin : req.user.lastlogin.substring(0, 25)
		});
	
};

exports.logout = function(req, res) {
	
	log.info("The user " + req.user.username + " logging out");
	console.log("The user " + req.user.username + " logging out");
	//var userid = req.session.userid;
	
	var msg_payload = {
			"userid" : req.user.userid
		};
	
	
	mq_client.make_request('logout_queue', msg_payload, function(err, results) {

		
		if (err) {
			throw err;
		} else {
			if (results.code == 200) {
				req.logout();
				req.session.destroy();
				res.redirect('/');
			} else {
				console.log("logout error");
			}
		}
	});
	
};
