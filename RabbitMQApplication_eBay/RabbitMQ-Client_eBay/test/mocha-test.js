var request = require('request')
, express = require('express')
,assert = require("assert")
,http = require("http");

describe('http tests', function(){

	it('Login', function(done){
		http.get('http://localhost:3000/', function(res) {
			assert.equal(200, res.statusCode);
			done();
		})
	});
	it('Homepage', function(done){
		http.get('http://localhost:3000/homepage', function(res) {
			assert.equal(302, res.statusCode);
			done();
		})
	});
	it('MarketPlace', function(done){
		http.get('http://localhost:3000/marketPlace', function(res) {
			assert.equal(302, res.statusCode);
			done();
		})
	});
	it('ListAdvertisements', function(done){
		http.get('http://localhost:3000/advertisements', function(res) {
			assert.equal(302, res.statusCode);
			done();
		})
	});
	it('LoadCart', function(done){
		http.get('http://localhost:3000/loadCart', function(res) {
			assert.equal(302, res.statusCode);
			done();
		})
	});
});