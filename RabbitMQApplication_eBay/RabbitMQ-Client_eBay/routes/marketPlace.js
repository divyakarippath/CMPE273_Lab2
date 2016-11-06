/**
 * New node file
 */

var mq_client = require('../rpc/client');
var SimpleNodeLogger = require('simple-node-logger'), opts = {
	logFilePath : 'mylogfile.log',
	timestampFormat : 'YYYY-MM-DD HH:mm:ss.SSS'
}, log = SimpleNodeLogger.createSimpleLogger(opts);
var log = SimpleNodeLogger.createSimpleFileLogger('project.log');
exports.redirectToMarketPlace = function(req, res) {
	
	
		
		log.info("The user " + req.user.username + " accessing /marketPlace");
		res.render("marketPlace", {
			lastlogin : req.user.lastlogin.substring(0, 25),
			name : req.user.firstname
		});
	
};

exports.sellit = function(req, res) {
	

		res.render("itemdescription", {
			itemname : req.param.sell
		});
	
};
exports.additem = function(req, res) {
	

		var itemname = req.param("itemname");
		var itemdesc = req.param("itemdesc");
		var itemprice = req.param("itemprice");
		var itemquantity = req.param("itemquantity");
		var pricetype = req.param("pricetype");
		var json_responses;
		var userid = req.user.userid;
		log.info("The user " + req.user.username
				+ " adding a new advertisement");
		
		
		var msg_payload = {
				"itemname" : itemname,
				"itemdesc" : itemdesc,
				"itemprice" : itemprice,
				"itemquantity" : itemquantity,
				"pricetype" : pricetype,
				"userid" : userid
			};
		mq_client.make_request('add_advertisements_queue', msg_payload, function(err, results) {

			
			if (err) {
				throw err;
			} else {
				if (results.code == 200) {
					json_responses = {
							"statusCode" : 200
						};
						res.send(json_responses);

				} else {
					console.log("returned false");
					json_responses = {
						"statusCode" : 401
					};
					res.send(json_responses);

				}
			}
		});
		

	
};
