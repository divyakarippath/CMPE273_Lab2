/**
 * New node file
 */

// loading the 'login' angularJS module
var profile = angular.module('profile', []);
// defining the login controller
profile.controller('profile', function($scope, $http) {

	$scope.loadProfile = function() {

		$http.get('/getOrders').success(function(data) {
			$scope.orders = data;
		})
		$http.get('/getSoldItems').success(function(data) {
			$scope.soldItems = data;
		})

	};

})
