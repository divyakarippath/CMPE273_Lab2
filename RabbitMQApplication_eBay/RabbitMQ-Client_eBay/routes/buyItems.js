/**
 * New node file
 */
var mq_client = require('../rpc/client');
var SimpleNodeLogger = require('simple-node-logger'), opts = {
	logFilePath : 'mylogfile.log',
	timestampFormat : 'YYYY-MM-DD HH:mm:ss.SSS'
}, log = SimpleNodeLogger.createSimpleLogger(opts);
var log = SimpleNodeLogger.createSimpleFileLogger('project.log');

exports.loadPage = function(req, res) {
	
		log.info("The user " + req.user.username
				+ " accessing the advertisements page");
		res.render("advertisements", {
			lastlogin : req.user.lastlogin.substring(0, 25),
			name : req.user.firstname
		});
	

};
exports.getAuctionAdvertisements = function(req, res) {
	
	

		var msg_payload = {
			"pricetype" : "Auction"
		};

		mq_client.make_request('get_advertisements_queue', msg_payload,
				function(err, results) {

					if (err) {
						throw err;
					} else {
						if (results.code == 200) {
							res.send(results.ads);
						} else {
							console.log("error");
						}
					}
				});

	
};
exports.getFixedpriceAdvertisements = function(req, res) {
	
	

		var msg_payload = {
			"pricetype" : "FixedPrice"
		};

		mq_client.make_request('get_advertisements_queue', msg_payload,
				function(err, results) {

					if (err) {
						throw err;
					} else {
						if (results.code == 200) {
							res.send(results.ads);
						} else {
							console.log("error");
						}
					}
				});
		

	
};
exports.getCartItems = function(req, res) {

	
		res.send(req.session.cartItems);
	
};

exports.addBid = function(req, res) {
	
		var selectedItem = req.param("items");
		var quantity = req.param("quantity");
		var bidprice = req.param("bidprice");
		log.info("The user " + req.user.username
				+ " adding a new bid on advertisement with id "
				+ selectedItem.ad_id);
		for ( var key in quantity) {
			var quant = quantity[key];
			console.log("Value: " + quantity[key]);
		}
		for ( var key in bidprice) {
			var bprice = bidprice[key];
			console.log("Value: " + bidprice[key]);
		}
		console.log(selectedItem.itemquantity);
		// var selJson = JSON.parse(selectedItem);
		var json_responses;
		if (quant <= selectedItem.itemquantity) {
			
			
			console.log("less quantity");
			console.log("success");
			var userid = req.user.userid;
			var msg_payload = {
					"userid" : userid,
					"ad_id" : selectedItem.ad_id,
					"quantity" : quant,
					"price" : bprice
				};
			
			mq_client.make_request('addbid_queue', msg_payload,
					function(err, results) {

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
			
			

		} else {
			json_responses = {
				"statusCode" : 401
			};
			res.send(json_responses);
		}

	

};
