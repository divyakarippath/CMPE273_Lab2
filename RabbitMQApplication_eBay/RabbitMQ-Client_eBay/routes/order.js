/**
 * New node file
 */
var mq_client = require('../rpc/client');
var credit = require('./creditCard');
var SimpleNodeLogger = require('simple-node-logger'),
opts = {
	logFilePath:'mylogfile.log',
	timestampFormat:'YYYY-MM-DD HH:mm:ss.SSS'
},
log = SimpleNodeLogger.createSimpleLogger( opts );
var log = SimpleNodeLogger.createSimpleFileLogger('project.log');
exports.placeOrder = function(req, res) {

	

		credit
				.valiadteCard(
						function(data) {
							if (data.statusCode == 200) {
								var updatedQty;
								var cart_ad_id;
								var userid = req.user.userid;
								var total = req.session.total;
								var currentCart = req.session.cartItems;
								
								var msg_payload = {
										"userid" : userid,
										"total" : total,
										"currentCart" : currentCart
									};
								
								
								
								mq_client.make_request('place_order_queue', msg_payload, function(err, results) {

									console.log(results);
									if (err) {
										throw err;
									} else {
										if (results.code == 200) {
											log.info("The user "+req.user.username+" placed an order");
											req.session.cartItems = [];
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
								
		
							} else {
								res.send(data);
							}

						}, req);

	

};

exports.confirmation = function(req, res) {
	// Checks before redirecting whether the session is valid
	
		
		res.render("orderconfirmation", {
			lastlogin : req.user.lastlogin.substring(0, 25),
			name : req.user.firstname
		});
	
};
