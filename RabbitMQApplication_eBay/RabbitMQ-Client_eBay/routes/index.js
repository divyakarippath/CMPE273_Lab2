/*
 * GET home page.
 */

exports.index = function(req, res){
	
	res.render('login', { message: req.flash('loginMessage'),title: 'Login' });
	
};