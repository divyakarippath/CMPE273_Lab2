/**
 * 
 */
var passport = require("passport");
var mq_client = require('../rpc/client');
var LocalStrategy = require("passport-local").Strategy;
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebay";
var SimpleNodeLogger = require('simple-node-logger'), opts = {
	logFilePath : 'mylogfile.log',
	timestampFormat : 'YYYY-MM-DD HH:mm:ss.SSS'
}, log = SimpleNodeLogger.createSimpleLogger(opts);
var log = SimpleNodeLogger.createSimpleFileLogger('project.log');

module.exports = function(passport) {

	// used to serialize the user for the session, checking the session is live
	passport.serializeUser(function(user, done) {
		console.log(user.userid);
		done(null, user.userid);
	});

	// used to deserialize the user and destory the session
	passport.deserializeUser(function(id, done) {

		mongo.connect(mongoURL, function() {
			console.log('Connected to mongo at: ' + mongoURL);
			var coll = mongo.collection('users');
			process.nextTick(function() {
				coll.findOne({
					userid : id
				}, function(err, user) {
					done(err, user);
				});
			});

		});
		
		/*mongo.connectToEbay(function() {
			console.log('Connected to mongo at: ' + mongoURL);
			var coll = mongo.collection('users');
			process.nextTick(function() {
				coll.findOne({
					userid : id
				}, function(err, user) {
					done(err, user);
				});
			});

		});*/
		

	});

	passport.use('login', new LocalStrategy({
		passReqToCallback : true
	}, function(req, username, password, done) {

		var msg_payload = {
			"username" : username,
			"password" : password
		};

		mq_client.make_request('login_queue', msg_payload, function(err,
				results) {

			if (err) {
				return done(err);
			}

			if (results.code == 400) {
				return done(null, false, req.flash('loginMessage',
						'No user found.'));
			}

			if (results.code == 402) {
				return done(null, false, req.flash('loginMessage',
						'Oops! Wrong password.'));
			}

			if (results.code == 200) {
				return done(null, results.user);
			}

		});

	}));

	passport.use('signup', new LocalStrategy({
		passReqToCallback : true
	}, function(req, username, password, done) {

		var firstname = req.param("firstname");
		var lastname = req.param("lastname");
		var mobile = req.param("mob");
		var birthday = req.param("birthday");
		var city = req.param("city");
		var state = req.param("state");
		var country = req.param("country");
		var street = req.param("street");
		var zip = req.param("zip");
		var json_responses;
		var userid;
		var dt = new Date();

		var msg_payload = {
			"username" : username,
			"password" : password,
			"firstname" : firstname,
			"lastname" : lastname,
			"mobile" : mobile,
			"birthday" : birthday,
			"city" : city,
			"state" : state,
			"country" : country,
			"street" : street,
			"zip" : zip,
			"dt" : dt

		};

		mq_client.make_request('register_queue', msg_payload, function(err,
				results) {

			if (err) {
				return done(err);
			}

			if (results.code == 200) {
				console.log('User Registration succesful');
				done(null, results.user);
			}
			else{
				return done(err);
			}
			

		});



	}));

	
}
