//loading the 'login' angularJS module

var sellitem = angular.module('sellitem', []);
// defining the login controller
sellitem.controller('sellitem', function($scope, $http) {
	$scope.unexpected_error = true;
	$scope.success_message = true;
	$scope.sellit = function() {
		
		$http({
			method : "POST",
			url : '/additem',
			data : {
				"itemname" : $scope.itemname,
				"itemdesc" : $scope.itemdesc,
				"itemprice" : $scope.itemprice,
				"itemquantity" : $scope.itemquantity,
				"pricetype" : $scope.pricetype
			}
		}).success(function(data) {
			if (data.statusCode == 200) {
				//window.location.assign("/homepage");
				$scope.success_message = false;
				$scope.unexpected_error = true;
			}

		}).error(function(error) {
			$scope.unexpected_error = false;
			$scope.success_message = true;
		});
	};

})
