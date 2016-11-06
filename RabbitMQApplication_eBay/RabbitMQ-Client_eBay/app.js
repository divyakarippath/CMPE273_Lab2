var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , flash    = require('connect-flash');

var passport = require('passport');
require('./routes/passport')(passport);

//URL for the sessions collections in mongoDB
var mongoSessionConnectURL = "mongodb://localhost:27017/ebay";
var expressSession = require("express-session");
var mongoStore = require("connect-mongo")(expressSession);

var app = express();
var mongo = require("./routes/mongo");
var login = require("./routes/login");
var marketPlace = require("./routes/marketPlace");
var buyItems = require("./routes/buyItems");
var cart = require("./routes/cart");
var profile = require("./routes/profile");
var checkout = require("./routes/checkout");
var creditCard = require('./routes/creditCard');
var order = require('./routes/order');

app.use(expressSession({
	secret: 'ebay_key',
	resave: false,  //don't save session if unmodified
	saveUninitialized: false,	// don't create session until something stored
	duration: 30 * 60 * 1000,    
	activeDuration: 5 * 60 * 1000,
	store: new mongoStore({
		url: mongoSessionConnectURL
	})
}));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()){
		return next();
	}
	res.redirect('/');
		
}

app.post('/checklogin', passport.authenticate('login',{
	successRedirect : '/homepage',
	failureRedirect : '/',
	failureFlash : true}),
	function(req,res){
	req.session.cookie.maxAge = 1000 * 60 * 30;
	res.redirect('/');
});

app.post('/signup', passport.authenticate('signup', {
	
	successRedirect : '/homepage',
	failureRedirect : '/',
	failureFlash : true})
	
);

app.get('/homepage', isLoggedIn, login.redirectToHomepage);
app.get('/', routes.index);
app.get('/logout',login.logout);
app.get('/userprofile',isLoggedIn,login.userprofile);
app.get('/marketPlace',isLoggedIn,marketPlace.redirectToMarketPlace);
app.get('/advertisements',isLoggedIn,buyItems.loadPage);
app.get('/getAuctionAds',isLoggedIn,buyItems.getAuctionAdvertisements);
app.get('/getFixedpriceAds',isLoggedIn,buyItems.getFixedpriceAdvertisements);
app.get('/getOrders',isLoggedIn,profile.getOrders);
app.get('/getSoldItems',isLoggedIn,profile.getSoldItems);
app.post('/sellit',isLoggedIn,marketPlace.sellit);
app.post('/additem',isLoggedIn,marketPlace.additem);
app.post('/addToCart',isLoggedIn,cart.addToCart);
app.post('/addBid',isLoggedIn,buyItems.addBid);
app.post('/updateCart',isLoggedIn,cart.updateCart);
app.get('/loadCart',isLoggedIn,cart.loadCart);
app.get('/loadProfile', isLoggedIn,profile.loadProfile);
app.post('/removeFromCart',isLoggedIn,cart.removeFromCart);
app.get('/getCartItems',isLoggedIn,buyItems.getCartItems);
app.get('/checkout',isLoggedIn,checkout.loadCheckout);
app.post('/placeOrder',isLoggedIn,order.placeOrder);
app.get('/orderConfirmation',isLoggedIn,order.confirmation)

//connect to the mongo collection session and then createServer
mongo.connect(mongoSessionConnectURL, function(){
	console.log('Connected to mongo at: ' + mongoSessionConnectURL);
	http.createServer(app).listen(app.get('port'), function(){
		console.log('Express server listening on port ' + app.get('port'));
	});  
});
