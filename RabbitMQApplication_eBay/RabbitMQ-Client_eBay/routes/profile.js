/**
 * New node file
 */
var mq_client = require('../rpc/client');
var SimpleNodeLogger = require('simple-node-logger'), opts = {
	logFilePath : 'mylogfile.log',
	timestampFormat : 'YYYY-MM-DD HH:mm:ss.SSS'
}, log = SimpleNodeLogger.createSimpleLogger(opts);
var log = SimpleNodeLogger.createSimpleFileLogger('project.log');


exports.loadProfile = function(req, res) {
	
		log.info("The user "+req.user.username+" accessing the user profile");
		res.render("viewprofile", {
			lastlogin : req.user.lastlogin.substring(0, 25),
			name : req.user.firstname
		});

	
};

exports.getOrders = function(req, res) {
	// Checks before redirecting whether the session is valid
	
		var userid = req.user.userid;
		
		var msg_payload = {
				"userid" : userid
			};
		
		
		mq_client.make_request('get_orders_queue', msg_payload, function(err, results) {

			console.log(results);
			if (err) {
				throw err;
			} else {
				if (results.code == 200) {
					res.send(results.orders);
				} else {
					console.log("Error");
					res.send(results.orders);
				}
			}
		});
		

	 
};

exports.getSoldItems = function(req, res) {
	
		
		var userid = req.user.userid;
		
		var msg_payload = {
				"userid" : userid
			};
		
		mq_client.make_request('get_soldItems_queue', msg_payload, function(err, results) {

			console.log(results);
			if (err) {
				throw err;
			} else {
				if (results.code == 200) {
					res.send(results.orders);
				} else {
					console.log("Error");
					res.send(results.orders);
				}
			}
		});

		

		

	
};
