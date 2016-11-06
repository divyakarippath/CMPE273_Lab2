/**
 * New node file
 */

exports.valiadteCard = function(callback, req) {
	
		console.log("In Credit card Application");
		var cardNumber = req.param("cardNumber");
		var expDate = req.param("date");
		var cvvNum = req.param("cvv");

		var numPattern = /\d{16}/;
		var cvvPattern = /\d{3}/;
		var datePattern = /^\d{1,2}\/\d{4}$/;
		var flag = 0;
		var result = "Invalid";
		if (!cardNumber.match(numPattern)) {
			flag = 1;
			result = result + " Card Number";
		}
		if (!cvvNum.match(cvvPattern)) {
			if (flag == 1) {
				result = result + ",CVV";
			} else {
				flag = 1;
				result = result + " CVV";
			}
		}

		if (!expDate.match(datePattern)) {

			if (flag == 1) {
				result = result + " ,Expiry Date";
			} else {
				flag = 1;
				result = result + " Expiry Date";
			}
		} else {

			var arr = expDate.split("/");
			console.log(new Date().getFullYear());
			console.log(new Date().getMonth());
			console.log(Number(arr[1]));

			if (Number(arr[1]) < new Date().getFullYear()) {
				if (flag == 1) {
					result = result + " ,Expiry Date";
				} else {
					flag = 1;
					result = result + " Expiry Date";
				}
			} else if (Number(arr[1]) == new Date().getFullYear()) {
				if (Number(arr[0]) <= new Date().getMonth() + 1) {
					if (flag == 1) {
						result = result + " ,Expiry Date";
					} else {
						flag = 1;
						result = result + " Expiry Date";
					}
				}

			}
		}

		if (flag == 0) {

			json_responses = {
				"statusCode" : 200,
				"message" : "Credit card Information is valid"
			};
			//res.send(json_responses);
		} else {
			json_responses = {
				"statusCode" : 404,
				"message" : result
			};
			//res.send(json_responses);

		}
		callback(json_responses);

	

};
