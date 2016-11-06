var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebay";
var async = require('async');
var bcrypt = require('bcrypt-nodejs');
function handle_request(msg, callback) {

	var res = {};
	console.log("In handle request:" + msg.username);

	var username = msg.username;
	var password = msg.password;

	mongo.connect(mongoURL, function() {
	//mongo.connectToEbay(function() {
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('users');
		console.log("********" + username);
		process.nextTick(function() {
			coll.findOne({
				username : username
			}, function(err, user) {
				if (err) {
					res.code = "401";
				}

				else if (!user) {
					res.code = "400";
				}
				
				else if (!bcrypt.compareSync(password, user.password)){
					 res.code = "402";
				 }
				else{
					res.code = "200";
					res.user = user;
				}
				
				callback(null, res);

				
			});
		});

	});
	
	
}

function handle_register_request(msg, callback) {

	var res = {};
	console.log("In handle register request:" + msg.username);

	var username = msg.username;
	var password = msg.password;
	var firstname = msg.firstname;
	var lastname = msg.lastname;
	var mobile = msg.mobile;
	var birthday = msg.birthday;
	var city = msg.city;
	var state = msg.state;
	var country = msg.country;
	var street = msg.street;
	var zip = msg.zip;
	//var dt = msg.dt;
	var dt = new Date();
	

	mongo.connect(mongoURL, function() {
	//mongo.connectToEbay(function() {
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('users');
		var coll1 = mongo.collection('counters');

		coll1.findAndModify({
			_id : "userid"
		}, [], {

			$inc : {
				sequence_value : 1
			}
		}

		, {
			"new" : true
		}, function(err, ret) {

			console.log(ret); // Use this to debug
			coll.insert({
				userid : ret.value.sequence_value,
				username : username,
				password : createHash(password),
				firstname : firstname,
				lastname : lastname,
				mobile : mobile,
				lastlogin : dt.toString(),
				birthday : birthday,
				street : street,
				city : city,
				state : state,
				country : country,
				zip : zip
			}, function(err, user) {
				if (user) {
					res.code = "200";
					res.user = user.ops[0];

				} else {
					res.code = "401";
				}
				callback(null, res);
			});

		});

	});

}

function handle_logout(msg, callback) {

	var res = {};
	var userid = msg.userid;
	var dt = new Date();
	
	mongo.connect(mongoURL, function() {
	//mongo.connectToEbay(function() {
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('users');

		coll.update({
			userid : userid
		}, {
			$set : {
				lastlogin : dt.toString()
			}
		}, function(err, user) {
			if (user) {
				res.code = "200";
				res.value = "Succes Logout";
			} else {
				res.code = "401";
				res.value = "Failed Logout";
			}
			callback(null, res);
		});
	});

}

function handle_getads(msg, callback) {

	var res = {};
	var pricetype = msg.pricetype;
	
	mongo.connect(mongoURL, function() {
	//mongo.connectToEbay(function() {
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('users');

		coll.aggregate({
			$match : {
				advertisements : {
					$elemMatch : {
						pricetype : pricetype
					}
				}
			}
		}, {
			$unwind : "$advertisements"
		}, {
			$match : {
				"advertisements.pricetype" : pricetype
			}
		}, function(err, ads) {
			if (ads) {
				res.code = "200";
				res.ads = ads;
			} else {
				res.code = "401";
			}
			callback(null, res);
		});
	});

}

function handle_add_bids(msg, callback) {

	var res = {};
	var userid = msg.userid;
	var ad_id = msg.ad_id;
	var quantity = msg.quantity;
	var price = msg.price;
	
	mongo.connect(mongoURL, function() {
	//mongo.connectToEbay(function() {
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('users');
		var coll1 = mongo.collection('counters');

		coll1.findAndModify({
			_id : "bid_id"
		}, [], {

			$inc : {
				sequence_value : 1
			}
		}

		, {
			"new" : true
		}, function(err, ret) {

			console.log(ret); // Use this to debug
			coll.update({
				advertisements : {
					$elemMatch : {
						ad_id : ad_id
					}
				}
			}, {

				$push : {

					"advertisements.$.bids" : {
						bid_id : ret.value.sequence_value,
						user_id : userid,
						quantity : quantity,
						price : price
					}

				}

			}, function(err, user) {
				if (user) {
					res.code = "200";
				} else {
					res.code = "401";
				}
				callback(null, res);

			});

		});

	});

}

function handle_add_ads(msg, callback) {

	var res = {};
	var itemname = msg.itemname;
	var itemdesc = msg.itemdesc;
	var itemprice = msg.itemprice;
	var itemquantity = msg.itemquantity;
	var pricetype = msg.pricetype;
	var userid = msg.userid;
	
	mongo.connect(mongoURL, function() {
	//mongo.connectToEbay(function() {
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('users');
		var coll1 = mongo.collection('counters');

		coll1.findAndModify({
			_id : "ad_id"
		}, [], {

			$inc : {
				sequence_value : 1
			}
		}

		, {
			"new" : true
		}, function(err, ret) {

			console.log(ret); // Use this to debug
			coll.update({
				userid : userid
			}, {
				$push : {
					advertisements : {
						ad_id : ret.value.sequence_value,
						itemname : itemname,
						itemdesc : itemdesc,
						itemprice : itemprice,
						itemquantity : itemquantity,
						pricetype : pricetype
					}
				}
			}, function(err, user) {
				if (user) {
					res.code = "200";
				} else {
					res.code = "401";
				}

				callback(null, res);

			});

		});

	});

}

function handle_place_order(msg, callback) {

	var res = {};
	var userid = msg.userid;
	var total = msg.total;
	var currentCart = msg.currentCart;
	var updatedQty;
	var cart_ad_id;
	
	mongo.connect(mongoURL, function() {
	//mongo.connectToEbay(function() {
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('users');
		var coll1 = mongo.collection('counters');
		
		coll1.findAndModify({
			_id : "order_id"
		}, [], {

			$inc : {
				sequence_value : 1
			}
		}

		, {
			"new" : true
		}, function(err, ret) {

			console.log(ret); // Use this to debug
			
				coll.update({
					userid : userid
				}, {
					$push : {
						orders : {
							order_id:ret.value.sequence_value,
							totalprice : total
						}
					}
				}, function(err, user) {
					if (user) {
						
						for (var index = 0; index < currentCart.length; index++) {
							updatedQty = currentCart[index].itemquantity
							- currentCart[index].quantity;
							cart_ad_id = currentCart[index].ad_id;
							coll.update({
								orders : {
									$elemMatch : {
										order_id : ret.value.sequence_value
									}
								}
							}, {

								$push : {

									"orders.$.items" : {
										seller_id : currentCart[index].sellerId,
										ad_id : currentCart[index].ad_id,
										quantity : currentCart[index].quantity
									}

								}

							}, function(err, user) {
								if (user) {
									
									coll.update({

										advertisements : {
											$elemMatch : {
												ad_id : cart_ad_id
											}
										}
									
									}, {
										$set : {
											"advertisements.$.itemquantity" : updatedQty
										}
									}, function(err, user) {
										if (err) {
											throw err;
										}
									});
								} 
								else if(err)
									throw err;

							});
							
						}
						res.code = "200";
					} else {
						res.code = "401";
					}
					callback(null, res);

				});
		
			

		});
		
		
		
	});

}

function handle_get_orders(msg, callback) {

	var res = {};
	var userid = msg.userid;
	
	mongo.connect(mongoURL, function() {
	//mongo.connectToEbay(function() {
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('users');

		coll.findOne({
			userid : userid
		}, {
			_id : 0,
			orders : 1
		}, function(err, user) {
			if (user) {
				
				
				var orders = user.orders;
				var myorders = [];
				
				async.eachSeries(orders, function(order, outCallback) 
					{

					var items = order.items;
				
					async.eachSeries(items, function(item, callback) {
						
						coll.aggregate({
							$match : {
								advertisements : {
									$elemMatch : {
										ad_id : item.ad_id
									}
								}
							}
						}, {
							$unwind : "$advertisements"
						}, {
							$match : {
								"advertisements.ad_id" : item.ad_id
							}
						}, function(err, results) {
							if (err) {
								throw err;
							} else {
								
								myorders.push({
									"firstname" : results[0].firstname,
									"itemname" : results[0].advertisements.itemname,
									"itemdesc" : results[0].advertisements.itemdesc,
									"itemprice" : results[0].advertisements.itemprice,
									"itemquantity" : results[0].advertisements.itemquantity,
									"quantity" : item.quantity
								});
								callback(err);
							}
						});

					},function(err) {
				        if (err) throw err;
				        console.log("done");
				        outCallback(null);
				        
				    });
					
					
					},function(err) 
					{
						console.log('all done!!!');
						res.code = "200";
						res.orders = myorders;
						callback(null, res);
					});
				

			} else {
				
				res.code = "401";
				res.orders = myorders;
				callback(null, res);
			}
			
		});
	});

}

function handle_get_soldItems(msg, callback) {

	var res = {};
	var userid = msg.userid;

	mongo.connect(mongoURL, function() {
	//mongo.connectToEbay(function() {
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('users');

		coll.aggregate({
			$match : {
				"orders.items" : {
					$elemMatch : {
						seller_id : userid
					}
				}
			}
		},{ $project : {_id:0, orders : 1 } }, function(err, user) {
			if (user) {
				// This way subsequent requests will know the user is logged
				// in.
				var myorders = [];
				async.eachSeries(user, function(elem, userCallback) {
					var orders = elem.orders;
					console.log(orders);
					
					async.eachSeries(orders, function(order, outCallback) 
							{

							var items = order.items;
						
							async.eachSeries(items, function(item, callback) {
								
								coll.aggregate({
									$match : {
										advertisements : {
											$elemMatch : {
												ad_id : item.ad_id
											}
										}
									}
								}, {
									$unwind : "$advertisements"
								}, {
									$match : {
										"advertisements.ad_id" : item.ad_id
									}
								}, function(err, results) {
									if (err) {
										throw err;
									} else {
										
										myorders.push({
											"firstname" : results[0].firstname,
											"itemname" : results[0].advertisements.itemname,
											"itemdesc" : results[0].advertisements.itemdesc,
											"itemprice" : results[0].advertisements.itemprice,
											"itemquantity" : results[0].advertisements.itemquantity,
											"quantity" : item.quantity
										});
										callback(err);
									}
								});

							},function(err) {
						        if (err) throw err;
						        console.log("done");
						        outCallback(null);
						        
						    });
							
							
							},function(err) 
							{
								if (err) throw err;
								userCallback(null);
							});
					
					
				},function(err) 
				{
					console.log('all done!!!');
					res.code = "200";
					res.orders = myorders;
					callback(null, res);
				});
				

			} else {
				res.code = "401";
				res.orders = myorders;
				callback(null, res);
			}
			
		});
	});

}

var createHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

exports.handle_request = handle_request;
exports.handle_register_request = handle_register_request;
exports.handle_logout = handle_logout;
exports.handle_getads = handle_getads;
exports.handle_add_bids = handle_add_bids;
exports.handle_add_ads = handle_add_ads;
exports.handle_place_order = handle_place_order;
exports.handle_get_orders = handle_get_orders;
exports.handle_get_soldItems = handle_get_soldItems;