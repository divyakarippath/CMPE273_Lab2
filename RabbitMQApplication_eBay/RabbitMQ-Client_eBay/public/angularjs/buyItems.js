//loading the 'login' angularJS module

var advertisements = angular.module('advertisements', []);
// defining the login controller
advertisements.controller('advertisements', function($scope, $http) {
	$scope.test = {};
	$scope.unexpected_error = true;
	$scope.quantity_error = true;
	$scope.add_bid = true;
	$scope.card_error = true;
	$scope.card_success = true;
	if (typeof $scope.cartItems === 'undefined') {
		$scope.cartItems = [];
	}

	// $scope.cart_title = true;
	/*
	 * $http.get('/loadCart').success(function(data) { $scope.cartItems = data; })
	 */
	$scope.listAds = function() {

		$http.get('/getAuctionAds').success(function(data) {
			$scope.auctionAdvertisements = data;
		})
		$http.get('/getFixedpriceAds').success(function(data) {
			$scope.fixedPriceAdvertisements = data;
		})

	};

	$scope.resetErrors = function() {
		$scope.unexpected_error = true;
		$scope.quantity_error = true;
	};

	$scope.loadCart = function() {

		$http.get('/getCartItems').success(function(data) {
			$scope.cartitems = data;
		})

	};

	$scope.addtocart = function() {

		$http({
			method : "POST",
			url : '/addToCart',
			data : {
				"items" : $scope.selected,
				"quantity" : $scope.test.quantity,
				"addflag" : true
			}
		}).success(function(data) {
			if (data.length > 0) {
				$scope.selected = '';
				// $scope.cart_title = false;
				//req.session.add_cart = "false";
				window.location.assign("/loadCart");

			} else {
				$scope.quantity_error = false;
				$scope.unexpected_error = true;
			}

		}).error(function(error) {
			$scope.unexpected_error = false;
			$scope.quantity_error = true;
		});
	};

	$scope.updateCart = function() {

		$http({
			method : "POST",
			url : '/updateCart',
			data : {
				"items" : $scope.updated,
				"updateflag" : true
			}
		}).success(function(data) {
			if (data.length > 0) {
				$scope.updated = '';
				// $scope.cart_title = false;
				window.location.assign("/loadCart");
			} else {
				$scope.quantity_error = false;
			}

		}).error(function(error) {
			$scope.unexpected_error = false;
		});
	};

	$scope.removeFromCart = function(item) {

		$http({
			method : "POST",
			url : '/removeFromCart',
			data : {
				"items" : item,
				"removeflag" : true
			}
		}).success(function(data) {

			// $scope.deleted = '';
			$scope.cart_rem = false;
			// $scope.cart_title = false;
			window.location.assign("/loadCart");

		}).error(function(error) {
			$scope.unexpected_error = false;
		});
	};

	$scope.placeOrder = function() {

		$http({
			method : "POST",
			url : '/placeOrder',
			data : {
				"cardNumber" : $scope.cardNumber,
				"date" : $scope.date,
				"cvv" : $scope.cvv
			}
		}).success(function(data) {

			if (data.statusCode == 200) {
				window.location.assign("/orderConfirmation");
			} else {
				$scope.message = data.message;
				$scope.card_error = false;
				$scope.card_success = true;
				$scope.unexpected_error = true;
			}

		}).error(function(error) {
			$scope.card_error = true;
			$scope.card_success = true;
			$scope.unexpected_error = false;
		});
	};

	$scope.goHomePage = function() {
		window.location.assign("/homepage");
	};
	$scope.checkout = function() {
		window.location.assign("/checkout");
	};
	$scope.addbid = function() {

		$http({
			method : "POST",
			url : '/addBid',
			data : {
				"items" : $scope.bidselected.advertisements,
				"quantity" : $scope.test.bidquantity,
				"bidprice" : $scope.test.bid
			}
		}).success(function(data) {
			if (data.statusCode == 200) {
				$scope.selected = '';
				$scope.quantity_error = true;
				$scope.unexpected_error = true;
				$scope.add_bid = false;

			} else {
				$scope.quantity_error = false;
				$scope.unexpected_error = true;
				$scope.add_bid = true;
			}

		}).error(function(error) {
			$scope.unexpected_error = false;
			$scope.quantity_error = true;
			$scope.add_bid = true;
		});
	};

})
