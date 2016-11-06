/**
 * New node file
 */
var SimpleNodeLogger = require('simple-node-logger'),
opts = {
	logFilePath:'mylogfile.log',
	timestampFormat:'YYYY-MM-DD HH:mm:ss.SSS'
},
log = SimpleNodeLogger.createSimpleLogger( opts );
var log = SimpleNodeLogger.createSimpleFileLogger('project.log');
exports.loadCart = function(req, res) {
	var add_cart = true;
	var rem_cart = true;
	var empty_cart = false;

	

		if(req.session.cartItems){
			var currentCart = req.session.cartItems;
			if(currentCart.length == 0){
				empty_cart = true;
			}
			var total = 0;
			for (var index = 0; index < currentCart.length; index++) {
				total += currentCart[index].totPrice;
			}
			req.session.total = total;
			if (req.session.addflag) {
				add_cart = false;
				rem_cart = true;
			}
			if (req.session.removeflag) {
				rem_cart = false;
				add_cart = true;
			}
			if (req.session.updateflag) {
				rem_cart = true;
				add_cart = true;
			}
			req.session.addflag = false;
			req.session.removeflag = false;
			req.session.updateflag = false;
			// Set these headers to notify the browser not to maintain any cache for
			// the page being loaded
			// res.header('Cache-Control', 'no-cache, private, no-store,
			// must-revalidate, max-stale=0, post-check=0, pre-check=0');
			res.render("viewcart", {
				lastlogin : req.user.lastlogin.substring(0, 25),
				name : req.user.firstname,
				recentItem : req.session.recentItem,
				remItem : req.session.remItem,
				total : req.session.total,
				add_cart : add_cart,
				rem_cart : rem_cart,
				empty_cart : empty_cart
			});
		}
		else{
			empty_cart = true;
			res.render("viewcart", {
				lastlogin : req.user.lastlogin.substring(0, 25),
				name : req.user.firstname,
				recentItem : req.session.recentItem,
				remItem : req.session.remItem,
				total : req.session.total,
				add_cart : add_cart,
				rem_cart : rem_cart,
				empty_cart : empty_cart
			});
		}
		
	

	
};
exports.addToCart = function(req, res) {
	
		// These two variables come from the form on
		// the views/login.hbs page
		if (!req.session.cartItems) {
			req.session.cartItems = [];
		}
		var currentCart = req.session.cartItems;
		var selectedItem = req.param("items");
		var quantity = req.param("quantity");
		req.session.addflag = req.param("addflag");
		for ( var key in quantity) {
			var quant = quantity[key];
			console.log("Value: " + quantity[key]);
		}
		// var selJson = JSON.parse(selectedItem);
		var json_responses = [];
		var hasMatch = false;
		var checkQuant = false;
		console.log(currentCart.length);
		for (var index = 0; index < currentCart.length; index++) {
			if (selectedItem.advertisements.ad_id == currentCart[index].ad_id) {

				hasMatch = true;
				var oldQty = currentCart[index].quantity;
				var newQty = oldQty + quant;
				if (newQty <= currentCart[index].itemquantity) {
					checkQuant = true;
					currentCart[index].quantity = newQty;
					currentCart[index].totPrice = selectedItem.advertisements.itemprice
							* newQty;

				}

				break;
			}
		}

		if (!hasMatch) {
			if (quant <= selectedItem.advertisements.itemquantity) {
				console.log("less quantity");
				checkQuant = true;
				// req.session.cartItems.push(JSON.parse(selectedItem));
				currentCart.push({
					"ad_id" : selectedItem.advertisements.ad_id,
					"itemname" : selectedItem.advertisements.itemname,
					"itemdesc" : selectedItem.advertisements.itemdesc,
					"itemprice" : selectedItem.advertisements.itemprice,
					"itemquantity" : selectedItem.advertisements.itemquantity,
					"sellerId" : selectedItem.userid,
					"sellerName" : selectedItem.firstname,
					"quantity" : quant,
					"totPrice" : quant * selectedItem.advertisements.itemprice
				});
			}

		}
		if (checkQuant) {
			console.log("success");
			req.session.cartItems = currentCart;
			req.session.recentItem = selectedItem.advertisements.itemname;
			// req.session.cartItems.push(JSON.parse(selectedItem));
			log.info("The user "+req.user.username+" added "+req.session.recentItem+ " to cart");
			res.send(req.session.cartItems);
		} else {
			res.send(json_responses);
		}

	

};

exports.updateCart = function(req, res) {
	
		var currentCart = req.session.cartItems;
		var updatedItem = req.param("items");
		req.session.updateflag = req.param("updateflag");
		var json_responses = [];
		if (updatedItem.quantity <= updatedItem.itemquantity) {
			for (var index = 0; index < currentCart.length; index++) {
				if (updatedItem.ad_id == currentCart[index].ad_id) {
					currentCart[index].quantity = updatedItem.quantity;
					currentCart[index].totPrice = updatedItem.itemprice
							* updatedItem.quantity;
					break;
				}
			}
			log.info("The user "+req.user.username+" updated the cart");
			req.session.cartItems = currentCart;
			req.session.recentItem = updatedItem.itemname;
			// req.session.cartItems.push(JSON.parse(selectedItem));
			res.send(req.session.cartItems);
		} else {
			res.send(json_responses);
		}

	

};

exports.removeFromCart = function(req, res) {
	
		var currentCart = req.session.cartItems;
		var updatedItem = req.param("items");
		req.session.removeflag = req.param("removeflag");
		var json_responses;

		for (var index = 0; index < currentCart.length; index++) {
			if (updatedItem.ad_id == currentCart[index].ad_id) {
				currentCart.splice(index, 1);
				break;
			}
		}
		req.session.cartItems = currentCart;
		req.session.remItem = updatedItem.itemname;
		log.info("The user "+req.user.username+" removed "+req.session.remItem+ " from cart");
		json_responses = {
			"statusCode" : 200
		};
		res.send(json_responses);

	

};
