//loading the 'login' angularJS module

var shoppingCart = angular.module('shoppingCart', []);
// defining the login controller
shoppingCart.controller('cart', function($scope, $http) {

	if (typeof $scope.cartItems === 'undefined') {
		$scope.cartItems = [];
	}

	$http.get('items.json').success(function(data) {
		$scope.items = data;
	})
	$http.get('/loadCart').success(function(data) {
		$scope.cartItems = data;
	})
	$scope.submit = function() {
		$http({
			method : "POST",
			url : '/addToCart',
			data : {
				"items" : $scope.selected.items
			}
		}).success(function(data) {
			$scope.cartItems = data;
			$scope.message = 'Successfully Added';
			$scope.selected.items = '';

		}).error(function(error) {
			alert("error");
		});
	};
})
