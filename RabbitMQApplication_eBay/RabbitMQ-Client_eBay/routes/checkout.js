/**
 * New node file
 */

exports.loadCheckout = function(req, res) {
	
		res.render("checkout", {
			total : req.session.total
		});
	

};
